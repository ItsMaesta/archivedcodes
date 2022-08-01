const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Guild = require("../../Settings/Guild.json");
const Role = require("../../Settings/Role.json");
const Log = require("../../Settings/Log.json")
const data = require("../../models/cezalar.js")
const uyarılar = require("../../models/uyar.js")
const ms = require("ms")
const moment = require("moment")
const Discord = require("discord.js")
const sunucu = require("../../models/sunucu-bilgi")
require("moment-duration-format")
moment.locale("tr")
const { table } = require('table');
const uyar = require("../../models/uyar.js");
class Uyar extends Command {
    constructor(client) {
        super(client, {
            name: "uyar",
            aliases: ["uyarı"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.roles.cache.some(r=>["936017599454642226","936326025737035786","936326028719181824","936326059274670120"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Bir kullanıcı belirtin.", message.author, message.channel)
        let sebep = args.slice(1).join(" ")
        if(!sebep) return this.client.yolla("Uyarı sebebini belirtin.", message.author, message.channel)
        if (sebep && (await this.client.chatKoruma(sebep))) return message.reply('Düzgün bir sebep belirtin.')
        let count = await data.countDocuments().exec();
        let harun = count
        uyarılar.findOne({user: user.id}, async(err,res) => {
            if(!res) {
                let arr = []
                arr.push({mod: message.author.id, sebep: sebep, tarih: moment(Date.now()).add(3, 'hour').format("LLL")})
                const newWarn = new uyarılar({
                    user: user.id,
                    uyarılar: arr
                })
                newWarn.save().catch(e => console.log(e))
                user.roles.add("936336171116670996") /// uyarı 1 rol
                await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new data({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: harun + 1,
                        ceza: "Uyarı",
                        sebep: sebep,
                        tarih: moment(Date.now()).add(3, 'hour').format("LLL"),
                        bitiş: "-"
                    })
                    newData.save().catch(e => console.error(e))
                    this.client.savePunishment()
                })
                message.channel.send(`<@${user.id}>-(\`${user.id}\`) Adlı kullanıcı \`${sebep}\` sebebiyle ilk uyarısını aldı.`)
               // await this.client.channels.cache.get(Log.Cezapuan_Log).send(`${user}; adlı üye aldığınız **#${harun + 1}** ID'li ceza ile **${await this.client.punishPoint(user.id) + 3}** ulaştınız.`).catch(e => { })

            } else {
                res.uyarılar.push({mod: message.author.id, sebep: sebep, tarih: moment(Date.now()).add(3, 'hour').format("LLL")})
                res.save().catch(e => console.log(e))
                await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new data({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: harun + 1,
                        ceza: "Uyarı",
                        sebep: sebep,
                        tarih: moment(Date.now()).add(3, 'hour').format("LLL"),
                        bitiş: "-"
                    })
                    newData.save().catch(e => console.error(e))
                    this.client.savePunishment()
                })
                if(res.uyarılar.length == 2) {
                    message.channel.send(`<@${user.id}>-(\`${user.id}\`) Adlı kullanıcı \`${sebep}\` sebebiyle ikinci uyarısını aldı.`)
                    user.roles.remove("936336171116670996") /// uyarı 1 rol
                    user.roles.add("936336185033363556") /// uyarı 2 rol
                }
                if(res.uyarılar.length == 3) {
                    message.channel.send(`<@${user.id}>-(\`${user.id}\`) Adlı kullanıcı \`${sebep}\` sebebiyle üçüncü uyarısını aldı ve bu kullanıcıya cezalıya yollandı.`)
                    user.roles.remove("936336185033363556") /// uyarı 2 rol
                    let roles = user.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat("936326078929186886"); /// Cezalı rol
                    user.roles.set(roles).catch();
                }

            }

        })
      
    }
}

module.exports = Uyar;
