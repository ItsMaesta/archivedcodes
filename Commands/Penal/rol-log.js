const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Discord = require("discord.js")
const roller = require("../../models/rollog.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")

class Rollog extends Command {
    constructor(client) {
        super(client, {
            name: "rollog",
            usage: "erkek",
            aliases: ["rollog"]
        });
    }

    async run(message, args, level) { 
        if(!message.member.roles.cache.some(r=>["936017599454642226","936326025737035786","936326028719181824"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Rol bilgisine bakmak istediğin kullanıcıyı belirt.", message.author, message.channel)

        roller.findOne({ user: user.id }, async (err, res) => {
            if (!res) return this.client.yolla("<@" + user.id + "> adlı kullanıcının rol bilgisini bulamadım.", message.author, message.channel)
            let rol = res.roller.sort((a, b) => b.tarih - a.tarih)
            rol.length > 10 ? rol.length = 10 : rol.length = rol.length
            let filterRole = rol.map(x => ` <@${user.id}> Adlı kullanıcıya \`(${x.tarih})\` Tarihinde <@${x.mod}> tarafından <@&${x.rol}> ${x.state}`)
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setColor("RANDOM")
                .setDescription(`${filterRole.join("\n")}`)
            message.channel.send(embed)
        })
    }
}

module.exports = Rollog;
