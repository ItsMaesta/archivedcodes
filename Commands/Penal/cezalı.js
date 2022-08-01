const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Limit = require("../../Settings/Limit.json");
const Role = require("../../Settings/Role.json");
const Log = require("../../Settings/Log.json")
const Discord = require("discord.js")
const cezalar = require("../../models/cezalı.js")
const ceza = require("../../models/cezalar.js")
const moment = require("moment")
require("moment-duration-format")
const sunucu = require("../../models/sunucu-bilgi")
class Cezalı extends Command {
    constructor(client) {
        super(client, {
            name: "cezalı",
            aliases: ["jail"]
        });
    }

    async run(message, args, level) {
        if(!message.member.roles.cache.some(r=>["936017599454642226","936326025737035786","936326028719181824","936326059274670120"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        if (args.length < 1) return this.client.yolla("Cezalıya atmak istediğin kullanıcıyı belirt.", message.author, message.channel)
        let user = message.mentions.users.first() || await this.client.users.fetch(args[0]).catch(e => console.log(e))
        if (!user) return this.client.yolla("Kullanıcıyı bulamıyorum.", message.author, message.channel)

        if (!args.slice(1).join(" ")) return this.client.yolla("Cezalı sebebi belirtin.", message.author, message.channel)
        if(message.guild.members.cache.has(user.id)) {
            let member = message.guild.members.cache.get(user.id)
        if (member.roles.cache.has("936326059274670120") && !message.member.roles.some(r => ["936326059274670120", "935121826537930777", "935121826537930776", "935121826537930781"])) return this.client.yolla("Yetkili birini cezalıya atamazsın.", message.author, message.channel)
        if (message.guild.members.cache.get(user.id).hasPermission("ADMINISTRATOR")) return this.client.yolla("Yetkisi yüksek kişileri cezalıya atamazsın.", message.author, message.channel)
        if (message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return this.client.yolla("Kendi rolünden yüksek kullanıcıları cezalıya atamazsın.", message.author, message.channel)
        }
        if (user.id == message.author.id) return this.client.yolla("Kendini cezalıya atamazsın.", message.author, message.channel)
        let count = await ceza.countDocuments().exec();
        let harun = count
        let banNum = this.client.jailLimit.get(message.author.id) || 0
        this.client.jailLimit.set(message.author.id, banNum + 1)
        if (banNum == 9) return this.client.yolla("Bu komutu çok kullandın sınıra ulaştın.", message.author, message.channel)
        if (!message.guild.members.cache.has(user.id)) {
            const embedx = new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                .setColor("RANDOM")
                .setDescription(`${user.tag} Adlı kullanıcıyı sunucuda bulamadım ama sunucuya giriş yapınca cezalı rolünü vericeğim. \`(Ceza Numarası: #${harun + 1})\``)
            message.channel.send(embedx)
            await cezalar.findOne({ user: user.id }, async (err, doc) => {
                if (doc) return this.client.yolla(`${user.tag} kullanıcısı veritabanında cezalı olarak bulunuyor.`, message.author, message.channel)
                if (!doc) {
                    const newPun = new cezalar({
                        user: user.id,
                        ceza: true,
                        yetkili: message.author.id,
                        tarih: moment(Date.now()).format("LLL"),
                        sebep: args.slice(1).join(" ")
                    })
                    newPun.save().catch(e => console.log(e))
                }
                await ceza.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new ceza({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: harun + 1,
                        ceza: "Cezalı",
                        sebep: args.slice(1).join(" "),
                        tarih: moment(Date.now()).format("LLL"),
                        bitiş: "-"
                    })
                    newData.save().catch(e => console.error(e))
                    this.client.savePunishment()
                })
            })
        } else {
            await cezalar.findOne({ user: user.id }, async (err, doc) => {
                if (doc) return this.client.yolla(`${user.tag} kullanıcısı cezalıda bulunuyor.`, message.author, message.channel)
                let member = message.guild.members.cache.get(user.id)
                let memberRoles = member.roles.cache.map(x => x.id)
                let roles = member.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat("936326078929186886"); /// jail role
                member.roles.set(roles).catch(); 
                await message.channel.send(`${member}-(\`${member.id}\`) Adlı kullanıcı \`${args.slice(1).join(" ")}\` nedeniyle cezalıya atıldı: \`(Ceza Numarası: #${harun + 1})\``)
                       //  .setFooter(`${moment(Date.now()).format("LLL")}`)
                           // let puan = await this.client.punishPoint(user.id)
                            // await this.client.channels.cache.get(Log.Cezapuan_Log).send(`${member}; adlı üye aldığınız **#${harun + 1}** ID'li ceza ile **${await this.client.punishPoint(member.id) + 15}** ulaştınız.`).catch(e => { })
                            const başe = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
                    .setColor("RANDOM")
                    .setDescription(`${member}-(\`${member.id}\`) Adlı kullanıcı ${message.author} tarafından \`${moment(Date.now()).format("LLL")}\` tarihinde cezalandırılmış.
            
                     \`>\` Ceza Sebebi : \`${args.slice(1).join(" ")}\`
                     \`>\` Ceza Numarası : \`#${harun + 1}\``)
                await this.client.channels.cache.get("936326275239399484").send(başe)
                if (!doc) {
                    const newPun = new cezalar({
                        user: user.id,
                        ceza: true,
                        roller: memberRoles,
                        yetkili: message.author.id,
                        tarih: moment(Date.now()).format("LLL"),
                        sebep: args.slice(1).join(" ")
                    })
                    newPun.save().catch(e => console.log(e))
                }
                await ceza.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new ceza({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: harun + 1,
                        ceza: "Cezalı",
                        sebep: args.slice(1).join(" "),
                        tarih: moment(Date.now()).format("LLL"),
                        bitiş: "-"
                    })
                    newData.save().catch(e => console.error(e))
                    this.client.savePunishment()
                })
            })
        }


    }
}

module.exports = Cezalı;
