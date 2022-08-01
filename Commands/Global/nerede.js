const Command = require("../../base/Command.js");
const Discord = require("discord.js")

class Sesbilgi extends Command {
    constructor(client) {
        super(client, {
            name: "ses",
            aliases: ["nerede","n","nerde"]
        });
    }

    async run(message, args, data) {
        if(!message.member.roles.cache.some(r=>["936326025737035786","936326027750293525","936326028719181824"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        if (!user) return this.client.yolla("Bir kullanıcı etiketleyiniz.", message.author, message.channel)
        if (!user.voice.channel) return this.client.yolla("<@" + user.id + "> Adlı kullanıcı bir ses kanalında yok.", message.author, message.channel)
        let mic = user.voice.selfMute == true ? "kapalı" : "açık"
        let hop = user.voice.selfDeaf == true ? "kapalı" : "açık"
        let süresi = this.client.channelTime.get(user.id) || {channel: user.voice.channel.name, time: "Yok"}
        await this.client.yolla("<@" + user.id + "> kullanıcısı **" + user.voice.channel.name + "** kanalında. Mikrofonu " + mic + ", kulaklığı " + hop + "\n───────────────\nKullanıcı <#"+ süresi.channel +"> kanalına **"+await this.client.turkishDate(Date.now() - süresi.time)+"** önce giriş yapmış.", message.author, message.channel)

    };
}
module.exports = Sesbilgi;
