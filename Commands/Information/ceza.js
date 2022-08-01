const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");

const data = require("../../models/cezalar.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
const {table} = require('table');
const Discord = require("discord.js");
class Ceza extends Command {
    constructor(client) {
        super(client, {
            name: "ceza",
            aliases: ["Ceza","cezanumara"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.roles.cache.some(r=>["936017599454642226","936326025737035786","936326028719181824","936326059274670120"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        if(!args[0]) return this.client.yolla("Bir ceza numarası belirtin.", message.author, message.channel)
        await data.findOne({ihlal: args[0]}, async (err, res) => {
            if(!res) return this.client.yolla("Böyle bir numaralı ceza bilgisi yok.", message.author, message.channel)
            let user = message.guild.members.cache.get(res.user)
            let puan = await this.client.punishPoint(res.user)
            const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true}))
            //.setThumbnail(user.user.displayAvatarURL({dynamic:true}))
            .setDescription("<@"+res.user+"> Adlı kullanıcının **"+res.ihlal+"** numaralı ceza bilgileri:" + "\n\n" + "**Ceza Bilgileri**"  + "```"+

"Ceza Türü: "+ res.ceza + "\n" +
"Ceza Sebebi: "+ res.sebep + "\n" +
"Ceza Numarası:"+ res.ihlal + "\n" +
"Ceza Başlangıç Tarihi: "+ res.tarih+ "\n" +
"Ceza Bitiş Tarihi: "  + res.bitiş + "```"
                
            )
            .setColor("RANDOM")
            .setTimestamp()
            .setFooter("Kullanıcının "+ puan + " Adet ceza puanı bulunmakta.")
            message.channel.send(embed)
           
    })
    }
}

module.exports = Ceza;