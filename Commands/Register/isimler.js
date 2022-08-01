const Command = require("../../base/Command.js");
const isimler = require("../../models/names.js");
const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

class İsimler extends Command {
    constructor(client) {
        super(client, {
            name: "isimler",
           aliases: ["İsimler", "i", "İ"]
        });
    }

    async run (message, args, embed) {
        if(!message.member.roles.cache.some(r=>["936326025737035786","936326027750293525","936326028719181824","936326062349090856"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("İsim geçmişine bakmak istediğin kullanıcıyı belirt.", message.author, message.channel)

    isimler.findOne({user: user.id}, async(err, res) => {
            if (!res) return this.client.yolla("<@" + user.id + "> Kullanıcının isim geçmişini bulamadım.", message.author, message.channel)
            const embed = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setColor("RANDOM")
                .setDescription(`${user} Adlı kullanıcı daha önce  ${res.isimler.length} kez kayıt oldu.\n\n${res.isimler.map(x => `\`• ${x.isim}\` (${x.state})`).join("\n")}`)
            message.channel.send(embed)
        })
    }
}
module.exports = İsimler;

