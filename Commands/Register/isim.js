const Command = require("../../base/Command.js");
const nameData = require("../../models/names.js");
const Discord = require("discord.js");
const moment = require("moment");
const Log = require("../../Settings/Log.json");
const { MessageEmbed } = require("discord.js");
const Guild = require("../../Settings/Guild.json");

class İsim extends Command {
    constructor(client) {
        super(client, {
            name: "isim",
           aliases: ["İsim", "i", "İ"]
        });
    }

    async run (message, args, embed) {
        if(!message.member.roles.cache.some(r=>["936326025737035786","936326027750293525","936326028719181824","936326062349090856"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member)  return this.client.yolla("İsmini değiştirmek istediğin kullanıcı belirt.", message.author, message.channel);
    const name = args.slice(1).filter((x) => isNaN(x)).map((x) => x.charAt(0).replace(/i/g, "İ").toUpperCase() + x.slice(1)).join(" ");
    const age =  args.filter((x) => !isNaN(x) && member.id !== x)[0] || undefined;
    if (!name) return this.client.yolla("Bir isim belirtmelisin.", message.author, message.channel);
    if (!age) return this.client.yolla("Bir yaş belirtmelisin.", message.author, message.channel);
    if (age < 15) return this.client.yolla("İsmini belirttiğin kişi 15 yaşın altında olamaz.", message.author, message.channel);
    if (name.length + age.length >= 30) return this.client.yolla("İsmini 30 Karakteri geçmicek bir şekilde yazınız.", message.author, message.channel);
    if (!member.manageable) return this.client.yolla("Benden yüksek yetkideki kişilerin ismini değiştiremem.", message.author, message.channel);
    
    nameData.findOne({ user: member.id }, async (err, res) => {
    
    if (member.user.username.includes("◈")) {
    await member.setNickname(`◈ ${name} | ${age}`);
    this.client.channels.cache.get("936337793980977202").send(`:hammer: \`[` + moment(Date.now()).add(3, 'hour').format("LLL")+`]\` ${member.toString()}-(\`${member.id}\`) Adlı kullanıcının ismi (\`${message.author.tag}-${message.author.id}\`) tarafından (\`${name}-${age}\`) olarak değiştirildi.`);
    message.react('✅');
    const embed = new Discord.MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
    .setColor("RANDOM")
    .setDescription(`${member.toString()} adlı kullanıcının ismi \`${member.displayName}\` olarak değiştirildi!`);
    message.channel.send(embed).then((x) => x.delete({ timeout: 10000 }));
    } else {
      await member.setNickname(`◇ ${name} | ${age}`);
    this.client.channels.cache.get("936337793980977202").send(`:hammer: \`[` + moment(Date.now()).add(3, 'hour').format("LLL")+`]\` ${member.toString()}-(\`${member.id}\`) Adlı kullanıcının ismi (\`${message.author.tag}-${message.author.id}\`) tarafından (\`${name}-${age}\`) olarak değiştirildi.`);
    message.react('✅');
    const embed = new Discord.MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
    .setColor("RANDOM")
    .setDescription(`${member.toString()} adlı kullanıcının ismi \`${member.displayName}\` olarak değiştirildi!`);
    message.channel.send(embed).then((x) => x.delete({ timeout: 10000 }));
    }
  })
 }
};
module.exports = İsim;
