const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Role = require("../../Settings/Role.json");
const Guild = require("../../Settings/Guild.json");
const moment = require("moment");
const isimler = require("../../models/names.js");
const Register = require('../../models/kayıt.js');
const Limit = require('../../Settings/Limit.json');
const data = require("../../models/cezalar.js")
const Log = require("../../Settings/Log.json")
const { MessageEmbed } = require("discord.js")
const Discord = require("discord.js");

class Kadın extends Command {
    constructor(client) {
        super(client, {
            name: "kadın",
           aliases: ["kız","k","woman"]
        });
    }

    async run (message, args, embed) {
    if(!message.member.roles.cache.some(r=>["812741151630295090","762694056210989097","762694064369434654","936326062349090856"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return this.client.yolla("Kayıt etmek istediğin kullanıcıyı belirt.", message.author, message.channel);
    if (member.roles.cache.has("936326074676150333"))  return this.client.yolla("Bu kullanıcı zaten sunucuda kayıtlı.", message.author, message.channel);
    const name = args.slice(1).filter((x) => isNaN(x)).map((x) => x.charAt(0).replace(/i/g, "İ").toUpperCase() + x.slice(1)).join(" ");
    const age = args.filter((x) => !isNaN(x) && member.id !== x)[0] || undefined;
    if (name && (await this.client.chatKoruma(name))) return this.client.yolla("Belirttiğin kullanıcı isminde küfür içerdiği için kayıt işlemini yapamıyorum.", message.author, message.channel)
    if (!name) return this.client.yolla("Bir isim belirtmelisin.", message.author, message.channel);
    if (age < 15) return this.client.yolla("Kayıt etmek istediğin kullanıcı **15** yaşından küçük olamaz.", message.author, message.channel);
    if (!age) return this.client.yolla("Bir yaş belirtmelisin.", message.author, message.channel);
    if (name.length + age.length >= 30) return this.client.yolla("30 Karakteri geçmicek bir şekilde isim yaş yazınız.", message.author, message.channel);
    if (!member.manageable) return this.client.yolla("Kayıt etmek istediğin kullanıcının yetkisi benden yüksek.", message.author, message.channel);
     ///
       await Register.findOne({ user: message.author.id }, async (err, res) => {
        if (res) {
          if (res.kayıtlar.includes(member.id)) {
            res.kadın = res.kadın
            res.save().catch(e => console.log(e))
          } else {
            res.kayıtlar.push(member.id)
            res.kadın = res.kadın + 1
            res.toplam = res.toplam + 1
            res.save().catch(e => console.log(e))
          }
        } else if (!res) {
          let arr = []
          arr.push(member.id)
          const data = new Register({
            user: message.author.id,
            erkek: 0,
            kadın: 1,
            toplam: 1,
            kayıtlar: arr
          })
          data.save().catch(e => console.log(e))
        }
      })
      ///
     let puan = await this.client.punishPoint(member.id)
    await data.find({ user: member.id }).sort({ ihlal: "descending" }).exec(async (err, res) => {
    if(!res) return this.client.yolla(`${member} Adlı kullanıcının ceza işlemi yok.`, message.author, message.channel)
       let filterArr = res.map(x => (x.ceza))
        let chatMute = filterArr.filter(x => x == "Chat Mute").length || 0
        let voiceMute = filterArr.filter(x => x == "Voice Mute").length || 0
        let jail = filterArr.filter(x => x == "Cezalı").length || 0
        let ban = filterArr.filter(x => x == "Yasaklı").length || 0
        let warn = filterArr.filter(x => x == "Uyarı").length || 0
        
    if (puan >= 50 && !message.member.roles.cache.some(role => message.guild.roles.cache.get(Permissions.Ust_Yetkili).rawPosition <= role.rawPosition)) {
    const embed = new MessageEmbed()
.setAuthor(member.user.tag, member.user.avatarURL({ dynamic: true }))
.setColor("RANDOM")
.setDescription(`${member.toString()}-(\`${member.id}\`) Adlı kullanıcının ** `+puan+`** adet ceza puanı bulunmakta.

Kayıt işlemini yapabilmek için <@&${Permissions.Ust_Yetkili}> Rolündeki yetkililere yazabilirsin.
\`\`\`• Ban Sayısı : `+ban+`
• Jail(cezalı) Sayısı : `+jail+`
• Uyarı Sayısı : `+warn+`
• Chat Mute Sayısı : `+ chatMute+`
• Voice Mute Sayısı : `+voiceMute+`\`\`\``)
    return message.channel.send(embed)
  }
      
     if (member.user.username.includes("◈")) {
      await member.setNickname(`◈ ${name} | ${age}`);
      if (!member.roles.cache.has("936326071807270933")) await member.roles.add("936326071807270933");
    } else {
      await member.setNickname(`◇ ${name} | ${age}`);
      if (member.roles.cache.has("936326071807270933")) await member.roles.remove("936326071807270933");
    }
    
    await member.roles.add("936326074676150333"); /// kadın rol
    await member.roles.remove("936326075632459807");///erkek rol 
    await member.roles.remove("936326079881293844"); /// kayıtsız rol

    const data = await isimler.findOne({ guildID: message.guild.id, userID: member.user.id });

   const embed1 = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
         .setFooter(``+ this.client.users.cache.get(member.id).tag + ` Adlı kullanıcının ceza puanı : `+puan+``)
      .setColor("RANDOM")
    .setDescription(`
${member.toString()}-(\`${member.id}\`) Kullanıcısı <@&936326074676150333> rolü ile kaydedildi.
`);
    message.channel.send(embed1).then((x) => x.delete({ timeout: 10000 }));
          message.react('✅');
      this.client.channels.cache.get("936337653782151188").send(new MessageEmbed()
    .setColor("RANDOM")
    .setFooter(`` + moment(Date.now()).add(3, 'hour').format("LLL")+``)
    .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
    .setDescription(`${member.toString()}-(\`${member.id}\`) Adlı kullanıcı <@&936326074676150333> rolü ile kaydedildi.
    ───────────────
    Kaydeden yetkili: ${message.author}-(\`${message.author.id}\`)
    İsim: (\`${name}\`) -  Yaş: (\`${age}\`)
     `))
    message.guild.channels.cache.get("936326238824431646").send(`${member.toString()} Sunucumuzda kayıt oldu ona hoşgeldin diyelim.`).then((x) => x.delete({ timeout: 10000 }));
    isimler.findOne({ user: member.id }, async (err, res) => {
                let isim = args[1].charAt(0).toUpperCase() + args[1].slice(1).toLowerCase()
                let yaş = args[2];
                if (!res) {
                    let arr = []
                    arr.push({ isim: `${isim} | ${yaş}`, state: "<@&936326074676150333>", yetkili: message.author.id })
                    let newData = new isimler({
                        user: member.id,
                        isimler: arr
                    })
                    newData.save().catch(e => console.log(e))
                } else {
                    res.isimler.push({ isim: `${isim} | ${yaş}`, state: "<@&936326074676150333>", yetkili: message.author.id })
                    res.save().catch(e => console.log(e))
               }
            })
            })
    }
}
module.exports = Kadın;