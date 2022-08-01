const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Discord = require("discord.js")
const cezalar = require("../../models/cezalı.js")
const ceza = require("../../models/cezalar.js")
const moment = require("moment")
require("moment-duration-format")
class Af extends Command {
    constructor(client) {
        super(client, {
            name: "af",
            usage: "erkek",
            aliases: ["unjail", "cezalı-af","af"]
        });
    }

    async run(message, args, level) {
        if(!message.member.roles.cache.some(r=>["936017599454642226","936326025737035786","936326028719181824","936326059274670120"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Cezalısını kaldırmak istediğin kullanıcıyı belirt.", message.author, message.channel)
        await cezalar.findOne({ user: user.id }, async (err, doc) => {
            if (!doc) return this.client.yolla("<@" + user + "> adlı kullanıcıda cezalı rolünü bulamadım.", message.author, message.channel)
            if (doc.ceza == false) return this.client.yolla("<@" + user + "> adlı kullanıcıda cezalı rolünü bulamadım.", message.author, message.channel)
            if (message.author.id !== doc.yetkili && !message.member.hasPermission("ADMINISTRATOR")) return this.client.yolla("Bu kullanıcının cezalısını <@" + doc.yetkili + "> adlı yetkili veya yönetici permindeki kişiler kaldırabilir.", message.author, message.channel)
            user.roles.set(doc.roller)
            doc.delete().catch(e => console.log(e))
            this.client.yolla("<@" + user + "> Adlı kullanıcının cezalısı kaldırıldı eski yetkileri veriliyor.", message.author, message.channel)
        })
    }
}

module.exports = Af;
