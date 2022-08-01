const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Discord = require("discord.js")
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")
const db = require("../../models/cantUnBan.js")
class infaz extends Command {
    constructor(client) {
        super(client, {
            name: "infaz",
            aliases: ["İnfaz"]
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
                        embed.setDescription(`\`${res.tag}\` İsimli kullanıcı sunucumuzda yasaklı değil.`)
                        return message.channel.send(embed)
                    } else {
                        await db.findOne({ user: res.id }, async (err, doc) => {
                            if (doc) {
                                embed.setDescription(`**${res.tag}** İsimli kullanıcı <@${doc.mod}> tarafından açılmazban komutunu kullanmış`)
                                return message.channel.send(embed)
                            } else {
                                message.guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD', limit: 100}).then(audit => {
                                    let user = audit.entries.find(a => a.target.id === res.id)
                                    if(user && user.executor.id !== message.author.id) return this.client.yolla(`Bu kullanıcının banını sadece <@${doc.mod}>  adlı kullanıcı açabilir.`, message.author, message.channel)
                                    if(!user) return this.client.yolla(`Yasaklama listesinde yok.`, message.author, message.channel)
                                })
                                const newBanData = new db({
                                    user: res.id,
                                    mod: message.author.id,
                                    sebep: ban.reason || "Sebep Belirtilmemiş"
                                })
                                newBanData.save().catch(e => console.log(e))
                            }
                            embed.setDescription(`\`${res.tag}\` İsimili kullanıcı banlandı ve banı açan kişi açabilir.`)
                            message.channel.send(embed)
                        })
                    }
                })
            }
        }).catch(err => {
            embed.setDescription("ID BELİRTİN.")
            return message.channel.send(embed)
        })
    }
}



module.exports = infaz;
