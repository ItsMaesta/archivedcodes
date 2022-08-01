const Command = require("../../base/Command.js")
const Permissions = require("../../Settings/Permissions.json");
const Others = require("../../Settings/Others.json")
const Discord = require("discord.js")
class Kanal extends Command {
    constructor(client) {
        super(client, {
            name: "kanal",
            aliases: ["kanal","kilit"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.roles.cache.some(r=>["936326025737035786","936326027750293525","936326028719181824"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        if (args[0] == "kilit" || args[0] == "kapat" || args[0] == "kilitle") {
            message.channel.updateOverwrite(message.guild.id, {
                SEND_MESSAGES: false
            }).then(async() => {
                message.channel.send("Kanal kilitlendi.", message.author, message.channel)
            })
        }

        if (args[0] == "aç") {
            message.channel.updateOverwrite(message.guild.id, {
                SEND_MESSAGES: true
            }).then(async() => {
                message.channel.send("Kanalın kilidi açıldı.", message.author, message.channel)
            })
        }
    }
}

module.exports = Kanal;
