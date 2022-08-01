const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Limit = require("../../Settings/Limit.json");
const Discord = require("discord.js");
const roller = require("../../models/rollog.js")
const Log = require("../../Settings/Log.json")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")

class Rolyonet extends Command {
    constructor(client) {
        super(client, {
            name: "r",
            aliases: ["r"]
        });
    }
    // d!r args[0](al-ver) args[1](Kullanıcı) args[2](Rol)
    async run(message, args, level) {
        if(!message.member.roles.cache.some(r=>["936017599454642226","936326025737035786","936326028719181824"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        let yetkiRolu = [Permissions.Yetkili]
        if (!args[0]) return this.client.yolla("Yanlış kullanım .r ver veya al Kullanıcı ve Rol İD", message.author, message.channel)
        if (args[0] != "al") {
            if (args[0] != "ver") {
                return this.client.yolla("Yanlış kullanım .r ver veya al Kullanıcı ve Rol İD", message.author, message.channel)
            }
        }
        if (!args[1]) return this.client.yolla("Bir kullanıcıyı etiketlemelisin.", message.author, message.channel)
        let user = message.mentions.members.first() || await this.client.üye(args[1], message.guild)
        if (!user) return this.client.yolla("Bir kullanıcıyı etiketlemelisin.", message.author, message.channel)

        if (!args[2]) return this.client.yolla("İşlemi yapabilmek için rol belirtmelisin.", message.author, message.channel)
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2])
        if (!role) return this.client.yolla("ID Belirtip tekrar deneyiniz.", message.author, message.channel)
        if (message.member.roles.highest.rawPosition <= role.rawPosition) return this.client.yolla("Kendi rolünde veya yüksek yetkideki bir kişide bu komutu kullanamazsın.", message.author, message.channel)
        if (!role.editable) return
       if (this.client.config.roles.authyRoles.includes(role.id)) return this.client.yolla("Yasaklı rolleri veremezsin.", message.author, message.channel)
        let banNum = this.client.roleLimit.get(message.author.id) || 0
        this.client.roleLimit.set(message.author.id, banNum + 1)
        if (banNum == 9) return this.client.yolla("Bu komutu çok kullandın sınıra ulaştın.", message.author, message.channel)
        if (args[0] == "al") {
            const embedu = new Discord.MessageEmbed()
            embedu.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
            embedu.setColor("RANDOM")
            if (user.roles.cache.has(role.id)) {
                user.roles.remove(role.id)
                embedu.setDescription(`<@${user.id}>-(\`${user.id}\`) Adlı kullanıcıdan ${role} rolünü aldım.`)
                const emeed = new Discord.MessageEmbed()
                     .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                    .setColor("RANDOM")
                    .setDescription(`${user}-(\`${user.id}\`) İsimli kullanıcıya <@${message.author.id}> tarafından bir rol verildi!
                    ──────────────────────────────
                    ${user} İsimli kullanıcıya verilen rol: ${role}-(\`${role.id}\`)
                    `)
                    .setFooter(message.author.tag, message.author.displayAvatarURL({
                        dynamic: true
                    }))
                    .setTimestamp()
                this.client.channels.cache.get("936335414543925288").send(emeed)
                roller.findOne({
                    user: user.id
                }, async (err, res) => {
                    if (!res) {
                        let arr = []
                        arr.push({
                            rol: role.id,
                            mod: message.author.id,
                            tarih: moment(Date.now()).format("LLL"),
                            state: "Kaldırma"
                        })
                        let newData = new roller({
                            user: user.id,
                            roller: arr
                        })
                        newData.save().catch(e => console.log(e))
                    } else {
                        res.roller.push({
                            rol: role.id,
                            mod: message.author.id,
                            tarih: moment(Date.now()).format("LLL"),
                            state: "Kaldırma"
                        })
                        res.save().catch(e => console.log(e))
                    }
                })
            } else {
                embedu.setDescription(`<@${user.id}>-(\`${user.id}\`) adlı kullanıcıda ${role} rolü mevcut değil.`)
            }
            message.channel.send(embedu)
        }
        if (args[0] == "ver") {
            const embedu = new Discord.MessageEmbed()
            embedu.setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
            embedu.setColor("RANDOM")
            if (!user.roles.cache.has(role.id)) {
                user.roles.add(role.id)
                embedu.setDescription(`<@${user.id}>-(\`${user.id}\`) adlı kullanıcıya ${role} rolünü verdim.`)

                roller.findOne({
                    user: user.id
                }, async (err, res) => {
                    if (!res) {
                        let arr = []
                        arr.push({
                            rol: role.id,
                            mod: message.author.id,
                            tarih: moment(Date.now()).format("LLL"),
                            state: "Ekleme"
                        })
                        let newData = new roller({
                            user: user.id,
                            roller: arr
                        })
                        newData.save().catch(e => console.log(e))
                    } else {
                        res.roller.push({
                            rol: role.id,
                            mod: message.author.id,
                            tarih: moment(Date.now()).format("LLL"),
                            state: "Ekleme"
                        })
                        res.save().catch(e => console.log(e))
                    }
                })
            } else {
                embedu.setDescription(`<@${user.id}>-(\`${user.id}\`) adlı kullanıcıda ${role} rolü zaten var.`)
            }
            message.channel.send(embedu)
        }
    }
}
module.exports = Rolyonet
