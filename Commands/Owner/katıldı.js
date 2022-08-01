const Command = require("../../base/Command.js");
const { MessageEmbed } = require("discord.js")
const Role = require("../../Settings/Role.json")
const Log = require("../../Settings/Log.json")
const Discord = require("discord.js");
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
class Toplantı extends Command {
    constructor(client) {
        super(client, {
            name: "katıldı",
            aliases: ["Katıldı"]
        });
    }

    async run(message, args, level) {
        if (!message.member.hasPermission("ADMINISTRATOR")) return
        let embed = new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM");
        if(!message.member.voice || message.member.voice.channelID != Log.Meeting.Log) return;
        const Channel = message.member.voice.channel;
        const LogChannel = message.guild.channels.cache.get("936334106642501652");
        let sestekiler = message.guild.channels.cache.get(Channel.id).members.map(r => `<@${r.user.id}>`)
        let members = message.guild.members.cache.filter(member => member.roles.cache.has("936334253942259722") && member.voice.channelID != Log.Meeting.Log);
        members.array().forEach((member, index) => {
          setTimeout(() => {
            member.roles.remove("936334253942259722").catch();
          }, index * 1250)
        });
        let verildi = message.member.voice.channel.members.filter(member => !member.roles.cache.has("936334253942259722") && !member.user.bot)
        verildi.array().forEach((member, index) => {
          setTimeout(() => {
            member.roles.add("936334253942259722").catch();
          }, index * 1250)
        });
        message.channel.send(embed.setDescription(`\`${Channel.name}\` Kanalında bulunan **${verildi.size}** kişiye katıldı permini verdim. **${members.size}** Kişidende katıldı permini alıyorum.`)).catch()
        LogChannel.send(embed.setDescription(`\`[` + moment(Date.now()).add(3, 'hour').format("LLL")+`]\` Tarihinde ${message.author} Tarafından \`${Channel.name}\` İsimli odadaki \`${verildi.size}\` Kullanıcıya katıldı permini verdim.\n \`\`\`${sestekiler}\`\`\``))
        return message.channel.send("Toplantıda bulunan herkese katıldı permi verilmiştir.")
    }
}
module.exports = Toplantı