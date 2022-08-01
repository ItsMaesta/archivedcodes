const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const Permissions = require("../../Settings/Permissions.json");
const data = require("../../models/cezalar.js")
const uyarılar = require("../../models/uyar.js")
const ms = require("ms")
const moment = require("moment")
const sunucu = require("../../models/sunucu-bilgi")
require("moment-duration-format")
moment.locale("tr")
const { table } = require('table');
const uyar = require("../../models/uyar.js");
const { MessageEmbed } = require("discord.js");
class Uyarılar extends Command {
    constructor(client) {
        super(client, {
            name: "uyarılar",
            aliases: ["uyarılar"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.roles.cache.some(r=>["936017599454642226","936326025737035786","936326028719181824","936326059274670120"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Bir kullanıcı etiketleyiniz.", message.author, message.channel)
        uyarılar.findOne({user: user.id}, async(err,res) => {
            if(!res) return message.channel.send("Bu kullanıcı daha önce uyarılmamış")
            let num = 1
            let uyarılarMap = res.uyarılar.map(x => `${num++} • ${user} İsimli kullanıcı ${this.client.users.cache.get(x.mod)}-\`(${this.client.users.cache.get(x.mod).tag})\` İsimli yetkili tarafından \`${x.tarih}\` tarihinde \`${x.sebep}\` sebebiyle uyarılmış.\n`).join("\n")
            const embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
            .setColor("RANDOM")
            .setDescription(`${user}-\`(${user.id})\` Adlı kullannıcının uyarı bilgileri :\n\n${uyarılarMap}`)
            message.channel.send(embed)

        })
      
    }
}

module.exports = Uyarılar;
