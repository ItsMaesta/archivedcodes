const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const data = require("../../models/cezalar.js")
const ms = require("ms")
const Discord = require("discord.js")
const mutes = require("../../models/voicemute.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
class Kes extends Command {
    constructor(client) {
        super(client, {
            name: "kes",
            aliases: ["kes"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.roles.cache.some(r=>["936326025737035786","936326027750293525","936326028719181824"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        let member = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!member) return this.client.yolla("Bir kullanıcı belirtmelisin.", message.author, message.channel)
        if (!member.voice.channel) return this.client.yolla("Belirtiğin kullanıcı bir ses kanalına bağlı değil.", message.author, message.channel)
        if (message.member.roles.highest.rawPosition < member.roles.highest.rawPosition) return this.client.yolla("Senden yüksek rolleri olan bir kullanıcıda bu işlemi kullanamazsın.", message.author, message.channel)
        await this.client.yolla("<@" + member.id + ">-(\`" + member.id + "\`) Adlı kullanıcının bağlantısı kesildi.", message.author, message.channel)
        member.voice.kick()
    }
}

module.exports = Kes;
