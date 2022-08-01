const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Others = require("../../Settings/Others.json")
const Log = require("../../Settings/Log")
const Discord = require("discord.js")
const mutes = require("../../models/voicemute.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
class Git extends Command {
    constructor(client) {
        super(client, {
            name: "git",
            aliases: ["git"]
        });
    }

    async run(message, args, perm) {
 
if (!message.member.voice.channelID) return this.client.yolla("Sesli kanalda bulunmalısınız.", message.author, message.channel);
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
if (!member) return this.client.yolla("Bir kullanıcı etiketleyiniz.", message.author, message.channel);
if (!member.voice.channelID) return this.client.yolla("Etiketlediğin kullanıcı ses kanalında mevcut değil.", message.author, message.channel);
if (message.member.voice.channelID === member.voice.channelID) return this.client.yolla("Etiketlediğin kullanıcıyla aynı kanaldasın.", message.author, message.channel);
let embed = new Discord.MessageEmbed().setColor("RANDOM").setFooter(moment(Date.now()).add(3, 'hour').format("LLL")).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))

if (message.member.permissions.has("ADMINISTRATOR")) {
    message.member.voice.setChannel(member.voice.channel)
    message.react("✅")
    message.channel.send(`\`[` + moment(Date.now()).add(3, 'hour').format("LLL")+`]\` ${message.author}-(\`${message.author.id}\`) Adlı kullanıcı ${member} Adlı kullanıcının bulunduğu \`${member.voice.channel.name}\` isimli odaya gitti.`, message.author, message.channel)
    this.client.channels.cache.get("936331681521098802").send(embed.setDescription(`${message.author}-(\`${message.author.id}\`) Adlı kullanıcı ${member} Adlı kullanıcının bulunduğu \`${member.voice.channel.name}\` isimli odaya gitti.`))
} else {
const question = await message.channel.send(member.toString(), { embed: embed.setDescription(`${message.author}-(\`${message.author.id}\`) Adlı kullanıcı \`${member.voice.channel.name}\` Adlı odaya gelmek istiyor kabul ediyormusun?`) });
await question.react("✅");
await question.react("❌");
const answer = await question.awaitReactions((reaction, user) => ["✅", "❌"].includes(reaction.emoji.toString()) && user.id === member.user.id, { max: 1, time: 60000, errors: ["time"] }).catch(() => { question.edit(embed.setDescription("İşlem iptal edildi!")) });
if (answer.first().emoji.toString() === "✅") {
  embed.setColor("RANDOM");
  question.delete();
  message.channel.send(`${message.author}, ${member}-(\`${member.id}\`) Adlı kullanıcının yanına başarıyla gittiniz.`)
  message.member.voice.setChannel(member.voice.channel);
} else {
  embed.setColor("RANDOM");
  question.delete();
}
}
    }
}
module.exports = Git;

