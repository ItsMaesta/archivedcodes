const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Discord = require("discord.js")
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")
const db = require("../../models/cantUnBan.js")
class infazunban extends Command {
    constructor(client) {
        super(client, {
            name: "infaz-kaldır",
            aliases: ["infazkaldır"]
        });
    }

    async run(message, args, client) {
      if (!message.member.hasPermission("ADMINISTRATOR")) return
        let embed = new Discord.MessageEmbed()
        embed.setColor("RANDOM")
        embed.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))

        await this.client.users.fetch(args[0]).then(res => {
            if (!res) {
                embed.setDescription("ID BELİRTİN.")
                return message.channel.send(embed)
            } else {
                message.guild.fetchBans(true).then(async (bans) => {
                    let ban = await bans.find(a => a.user.id === res.id)
                    if (!ban) {
                        embed.setDescription(`\`${res.tag}\` Adlı kullanıcı yasaklı değil.`)
                        return message.channel.send(embed)
                    } else {
                        await db.findOne({ user: res.id }, async (err, doc) => {
                            if (!doc) {
                                embed.setDescription(`\`${res.tag}\` Adlı kullanıcının banını unban komutuyla kaldırabilirsiniz.`)
                                return message.channel.send(embed)
                            } else {
                                embed.setDescription(`Açılmaz banı kaldırmak için gerekli yetkiye sahip değilsiniz.`)
                                if (!message.member.roles.cache.has(Permissions.Sahip)) return message.channel.send(embed)
                                doc.delete().catch(e => console.log(e))
                                embed.setDescription(`\`${res.tag}\` Adlı kullanıcının açılmaz banı kaldırıldı.`)
                            }
                        })
                    }
                })
            }
        }).catch(err => {
            embed.setDescription("ID BELİRTİN..")
            return message.channel.send(embed)
        })
    }
}



module.exports = infazunban;
