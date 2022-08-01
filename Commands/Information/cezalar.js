const Command = require("../../base/Command.js");
const {MessageEmbed} = require("discord.js");
const Permissions = require("../../Settings/Permissions.json");
const data = require("../../models/cezalar.js")
const ms = require("ms")
const moment = require("moment")
const Discord = require("discord.js");
require("moment-duration-format")
moment.locale("tr")
const { table } = require('table');
class Cezalar extends Command {
    constructor(client) {
        super(client, {
            name: "cezalar",
            aliases: ["cezalar", "sicil"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.roles.cache.some(r=>["936017599454642226","936326025737035786","936326028719181824","936326059274670120"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Bir kullanıcı etiketleyiniz.", message.author, message.channel)
        await data.find({ user: user.id }).sort({ ihlal: "descending" }).exec(async (err, res) => {
            if(!res) return this.client.yolla(`${user}-\`(${user.id})\` Adlı kullanıcı cezalı bilgisini bulamadım.`, message.author, message.channel)
            let datax = [
                ["Ceza Numarası", "Ceza Tarihi", "Ceza Türü", "Ceza Sebebi"]
            ];

            let dataxe = [
                ["Ceza Numarası", "Ceza Türü", "Ceza Tarihi", "Ceza Bitişi", "Ceza Atan Yetkili", "Ceza Sebebi"]
            ];

            let config = {
                border: {
                    topBody: ``,
                    topJoin: ``,
                    topLeft: ``,
                    topRight: ``,

                    bottomBody: ``,
                    bottomJoin: ``,
                    bottomLeft: ``,
                    bottomRight: ``,

                    bodyLeft: `│`,
                    bodyRight: `│`,
                    bodyJoin: `│`,

                    joinBody: ``,
                    joinLeft: ``,
                    joinRight: ``,
                    joinJoin: ``
                }
            };
            res.map(x => {
                datax.push([x.ihlal, x.tarih, x.ceza, x.sebep])
            })

            res.map(x => {
                dataxe.push([x.ihlal, x.ceza, x.tarih, x.bitiş, this.client.users.cache.get(x.yetkili).tag, x.sebep])
            })

            let out = table(dataxe, config)
            let outi = table(datax.slice(0, 15), config)
            message.channel.send(`${user}-(\`${user.id}\`) Adlı kullanıcının toplam **${datax.length-1}** cezası var.Ceza numarasına bakmak için **.ceza 1** komutunu kullanabilirsiniz. \`\`\`${outi}\`\`\` `).then(msg => {
                msg.react("❗").then(async(r) => {
                    await msg.react('❔');
                });
                msg.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '❗' || reaction.emoji.name == '❔'),
                    { max: 1, time: 30000 }).then(async collected => {
                        if (collected.first().emoji.name == '❗') {
                            message.channel.send(`${user}-(\`${user.id}\`) Kullanıcının **${datax.length -1}** ceza işlem bilgileri yazmakta.`, { files: [{ attachment: Buffer.from(out), name: `${user.user.username}_cezalar.txt` }] }).then(msg => {
                                msg.delete({ timeout: 10000 })
                            })
                        } else {
                            let filterArr = res.map(x => (x.ceza))
                            let chatMute = filterArr.filter(x => x == "Chat Mute").length || 0
                            let voiceMute = filterArr.filter(x => x == "Voice Mute").length || 0
                            let jail = filterArr.filter(x => x == "Cezalı").length || 0
                            let ban = filterArr.filter(x => x == "Yasaklı").length || 0
                            let warn = filterArr.filter(x => x == "Uyarı").length || 0
                            let puan = await this.client.punishPoint(user.id)
                            const embed = new MessageEmbed().setColor("RANDOM").setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
        .setDescription(`${user}-(\`${user.id}\`) Kullanıcı **${datax.length - 1}** kez ceza işlemi uygulanmış ceza puanı : **${puan}**\`\`\`\n\n• Chat Mute Sayısı : ${chatMute}\n• Ses Mute Sayısı : ${voiceMute}\n• Jail(cezalı) Sayısı : ${jail}\n• Ban Sayısı : ${ban}\n• Uyarı Sayısı : ${warn}\`\`\``)
          .setTimestamp()
          message.channel.send(embed);

                        }
                    })
            })
        })
    }
}

module.exports = Cezalar;
