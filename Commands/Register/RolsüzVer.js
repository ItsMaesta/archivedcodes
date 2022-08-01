const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Role = require("../../Settings/Role.json");
const Discord = require("discord.js")
const kayıtlar = require("../../models/kayıt.js")

class RolsüzVer extends Command {
    constructor(client) {
        super(client, {
            name: "rolsuz",
            description: "rolsüzver",
            usage: "rolsüz",
            aliases: ["rolsuz","rolsüz"]
        });
    }

    async run(message, args, level) {
        if(!message.member.roles.cache.some(r=>["935121826626027555","935121826626027551","935121826626027558"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        let faelynn = message.guild.members.cache.filter(m => m.roles.cache.filter(r => r.id !== message.guild.id).size == 0)
    
        if(args[0] == "ver") {
            faelynn.forEach(r => {
        r.roles.add(Role.Register.Unregistered)
        })
        const faelyn = new Discord.MessageEmbed()
        .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
        .setColor("RANDOM")
        .setDescription("Sunucuda rolü olmayan \`"+ faelynn.size +"\` kullanıcıya kayıtsız permini verdim.")
        message.channel.send(faelyn)
        } else if(!args[0]) {
        const faelynbaba = new Discord.MessageEmbed()
        .setAuthor(""+message.author.username +" ", message.author.avatarURL())
        .setColor("RANDOM")
        .setDescription(`Sunucuda rolü olmayan \``+ faelynn.size +`\` kullanıcı var.`)
        message.channel.send(faelynbaba)
        }
    }
}

module.exports = RolsüzVer;

