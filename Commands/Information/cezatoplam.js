const Command = require("../../base/Command.js");
const {MessageEmbed} = require("discord.js");
const Permissions = require("../../Settings/Permissions.json");
const data = require("../../models/cezalar.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
const Discord = require("discord.js")
const { table } = require('table');
class Cezatoplam extends Command {
    constructor(client) {
        super(client, {
            name: "cezatoplam",
            aliases: ["ct","Cezatoplam"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.roles.cache.some(r=>["936017599454642226","936326025737035786","936326028719181824","936326059274670120"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Bir kullanıcı etiketleyiniz.", message.author, message.channel)
        await data.find({ user: user.id }).sort({ ihlal: "descending" }).exec(async (err, res) => {
            if(!res) return this.client.yolla(`${user} Adlı kullanıcının ceza işlemi yok.`, message.author, message.channel)
        let puan = await this.client.punishPoint(user.id)
        let filterArr = res.map(x => (x.ceza))
        let chatMute = filterArr.filter(x => x == "Chat Mute").length || 0
        let voiceMute = filterArr.filter(x => x == "Voice Mute").length || 0
        let jail = filterArr.filter(x => x == "Cezalı").length || 0
        let ban = filterArr.filter(x => x == "Yasaklı").length || 0
        let warn = filterArr.filter(x => x == "Uyarı").length || 0
        const embed = new MessageEmbed().setColor("RANDOM").setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
        .setDescription(`${user}-(\`${user.id}\`) adlı kullanıcının **`+puan+`** ceza puanı mevcut ve aldığı cezalar toplamı :\`\`\` 
• Ban Sayısı : `+ban+`
• Jail(cezalı) Sayısı : `+jail+`
• Uyarı Sayısı : `+warn+`
• Chat Mute Sayısı : `+ chatMute+`
• Voice Mute Sayısı : `+voiceMute+` 
                \`\`\``)
          .setTimestamp()
          message.channel.send(embed);
        }
        )
    }
}

module.exports = Cezatoplam;
