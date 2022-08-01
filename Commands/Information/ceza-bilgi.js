const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const data = require("../../models/cezalar.js")
const ms = require("ms")
const mutes = require("../../models/chatmute.js")
const vmutes = require("../../models/voicemute.js")
const cezalar = require("../../models/cezalı.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")
const Discord = require("discord.js")
class İnfo extends Command {
    constructor(client) {
        super(client, {
            name: "cezabilgi",
            aliases: ["cezainfo", "ceza-bilgi", "ceza-info", "bilgi-ceza","info"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.roles.cache.some(r=>["936017599454642226","936326025737035786","936326028719181824","936326059274670120"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        let user = message.mentions.members.first() || await this.client.üye(args.join(" "), message.guild) || await this.client.client_üye(args.join(" "))
        if (!user) return this.client.yolla("Bir kullanıcı etiketleyiniz.", message.author, message.channel)
        if(!message.guild.members.cache.has(user.id)) return this.client.yolla("Kullanıcıyı sunucuda bulamıyorum.", message.author, message.channel)
        let mute = ""
        let vmute = ""
        let cezalı = ""
         await cezalar.findOne({ user: user.id }, async (err, doc) => {
            if (!doc) {
                cezalı = "```"+""+ this.client.users.cache.get(user.id).tag + " Adlı kullanıcının ceza bilgisi yok."+"```"
            } else {
                if (doc.ceza == false) {
                    cezalı = "```"+"Jail Bilgisi bulunmamakta."+"```"
                } else if (doc.ceza == true) {
                    cezalı = "```"+"Ceza Türü: Jail \nCeza Sebebi: " + doc.sebep + "\nCeza Başlangıç Tarihi: " + doc.tarih + "\nCeza Bitiş Tarihi: Süresiz Jail\nJail atan yetkili: "+ this.client.users.cache.get(doc.yetkili).tag +""+"```"
                }
            }
        })
        await mutes.findOne({ user: user.id }, async (err, doc) => {
            if (!doc) {
                mute = "```"+""+ this.client.users.cache.get(user.id).tag + " Adlı kullanıcının chat mute bilgisi yok."+"```"
            } else {
                if (doc.muted == false) {
                    mute = "```"+"Mute Bilgisi bulunmamakta."+"```"
                } else if (doc.muted == true) {
                    mute = "```"+"Ceza Türü: Chat Mute \nCeza Sebebi: " + doc.sebep + "\nCeza Başlangıç Tarihi: " + moment(doc.start).add(3, 'hour').format("LLL") + "\nCeza Bitiş Tarihi: " + moment(doc.endDate).add(3, 'hour').format("LLL") +"\nChat Mute Atan Yetkili: "+ this.client.users.cache.get(doc.yetkili).tag +"```"
                }
            }
        })
        await vmutes.findOne({ user: user.id }, async (err, doc) => {
            if (!doc) {
                vmute = "```"+""+ this.client.users.cache.get(user.id).tag + " Adlı kullanıcının ses mute bilgisi yok."+"```"
            } else {
                if (doc.muted == false) {
                    vmute = "```"+"Ses Mute Bilgisi bulunmamakta."+"```"
                } else if (doc.muted == true) {
                    vmute = "```"+"Ceza Türü: Ses Mute \nCeza Sebebi: " + doc.sebep + "\nCeza Başlangıç Tarihi: " + moment(doc.start).add(3, 'hour').format("LLL") + "\nCeza Bitiş Tarihi: " + moment(doc.endDate).add(3, 'hour').format("LLL") +"\nSes Mute Atan Yetkili: "+ this.client.users.cache.get(doc.yetkili).tag +"```"
                }
            }
        })
        let puan = await this.client.punishPoint(user.id)
        let uu = this.client.users.cache.get(user.id)
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor("RANDOM")
            .setDescription(`${user}-(\`${user.id}\`) Adlı kullanıcının ceza bilgileri:`)
            .addFields(
                { name: 'Jail Bilgileri:', value: cezalı || "```"+"Jail Bilgisi bulunmamakta."+"```"},
                { name: 'Chat Mute Bilgileri:', value: mute || "```"+"Mute Bilgisi Bulunmamakta."+"```"},
                { name: 'Ses Mute Bilgileri:', value: vmute || "```"+"Ses Mutesi Bulunmamakta."+"```"},)
                .setFooter(""+ this.client.users.cache.get(user.id).tag + " Adlı kullanının "+ puan + " Adet ceza puanı bulunmakta.")
                await message.channel.send(embed)
    }
}

module.exports = İnfo;
