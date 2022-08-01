const Command = require("../../base/Command.js");
const data = require("../../models/cezalar.js")
const ms = require("ms")
const Discord = require("discord.js")
const mutes = require("../../models/voicemute.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
class TopluTaşı extends Command {
    constructor(client) {
        super(client, {
            name: "tp",
            aliases: ["toplutaşı"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.roles.cache.some(r=>["936326025737035786","936326027750293525","936326028719181824"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        if(!message.member.voice.channel) return this.client.yolla("Ses kanalında olmalısın.", message.author, message.channel)
        let channelone = message.guild.channels.cache.find(a => a.type === "voice" && a.id === args[0])
        let channeltwo = message.guild.channels.cache.find(a => a.type === "voice" && a.id === args[1])
        if(!channelone) return this.client.yolla("Yanlış kullanım.", message.author, message.channel)
        if(!channeltwo) return this.client.yolla("Yanlış kullanım.", message.author, message.channel)
        if(channelone.length < 1) return this.client.yolla("Bu ses kanalında kullanıcı yok.", message.author, message.channel)
        channelone.members.map(a => { 
            a.voice.setChannel(channeltwo.id)
        })
        await this.client.yolla(`\`${message.member.voice.channel.name}\` Kanalındaki kullanıcılar  \`${channeltwo.name}\` kanalına gönderildi.`, message.author, message.channel)
    message.react("✅")
    }
}

module.exports = TopluTaşı;