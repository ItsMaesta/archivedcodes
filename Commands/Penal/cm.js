const Command = require("../../base/Command.js");
const Discord = require("discord.js")
class Uncmd extends Command {
    constructor(client) {
        super(client, {
            name: "sınırkaldır",
            aliases: ["Sınırkaldır"]
        });
    }

    async run(message, args, data, perm) {
            if(!message.member.roles.cache.some(r=>["936017599454642226"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
let victim = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
if(!victim) return this.client.yolla("Komut sınırını kaldırmak istediğin kullanıcıyı belirt.", message.author, message.channel)
if(!this.client.blockedFromCommand.includes(victim.id)) return message.channel.send(`<@${victim.id}>-(\`${victim.id}\`) Bu kullanıcı komut sınırında değil.`)
let cleanArray = this.client.blockedFromCommand.find(x => x === victim.id)
this.client.blockedFromCommand.splice(this.client.blockedFromCommand.indexOf(cleanArray), 1)
message.channel.send(`<@${victim.id}>-(\`${victim.id}\`) Kullanıcısının komut sınırını kaldırdım.`)
    }
}

module.exports = Uncmd;