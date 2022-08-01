const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Guild = require("../../Settings/Guild.json");
const Role = require("../../Settings/Role.json");
const Others = require("../../Settings/Others.json");
const Log = require("../../Settings/Log.json")
const data = require("../../models/cezalar.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
const Discord = require("discord.js")
moment.locale("tr")
const harun = require("pretty-ms");
const mutes = require("../../models/chatmute.js")
const sunucu = require("../../models/sunucu-bilgi.js")
const bitmiyor = require("parse-ms")
class Mute extends Command {
    constructor(client) {
        super(client, {
            name: "mute",
            aliases: ["mute","cm","chatmute","cmute"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.roles.cache.some(r=>["936017599454642226","936326025737035786","936326028719181824","936326058318397480"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Mutelemek istediğin kullanıcıyı belirt.", message.author, message.channel)
        if (!args[1] || isNaN(ms(args[1]))) return this.client.yolla("Yanlış kullanım: .mute @Faelynn 1m-1d-1g", message.author, message.channel)
        if (ms(args[1]) < ms("1m")) return this.client.yolla("Yanlış süre belirtiyorsunuz.", message.author, message.channel)
        if (!args[2]) return this.client.yolla("Mute sebebi belirtin.", message.author, message.channel)
        if (user.id == message.author.id) return this.client.yolla("Kendini muteleyemezsin.", message.author, message.channel)
        if (user.hasPermission("ADMINISTRATOR")) return this.client.yolla("Sunucu yöneticilerini muteleyemezsin.", message.author, message.channel)
        if (message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return this.client.yolla("Kendi rolünden yüksek kullanıcıları muteleyemezsin.", message.author, message.channel)
        if (user.roles.cache.has(Role.mute)) return this.client.yolla("Kullanıcı zaten muteli.", message.author, message.channel)
        let time = ms(args[1]);
        let muteTime = time
        let dataTime = await this.client.extraMute(user.id, "chatMute", time)
        muteTime = muteTime + (muteTime * dataTime)
        let cıkaralım = time + Date.parse(new Date());
        let şuanki = moment(Date.now()).add(3, 'hour').format("LLL");
        let sonraki = moment(cıkaralım).add(3, 'hour').format("LLL");
        let count = await data.countDocuments().exec();
        let harun = count
        let banNum = this.client.muteLimit.get(message.author.id) || 0
        this.client.muteLimit.set(message.author.id, banNum + 1)
        if (banNum == 9) return this.client.yolla("Bu komutu çok kullandın sınıra ulaştın.", message.author, message.channel)
        user.roles.add(Role.mute) /// mute rol
        await message.channel.send(`<@${user.id}>-(\`${user.id}\`) adlı kullanıcı metin kanallarından  \`${args.slice(2).join(" ")}\` nedeniyle mutelendi : \`(Ceza Numarası: #${harun + 1})\``)
      //  let puan = await this.client.punishPoint(user.id)
      //  await this.client.channels.cache.get(Log.Cezapuan_Log).send(`${user}; adlı üye aldığınız **#${harun + 1}** ID'li ceza ile **${await this.client.punishPoint(user.id) + 8}** ulaştınız.`).catch(e => { })
        const mutelendı = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setColor("RANDOM")
            .setDescription(`${user}-(\`${user.id}\`) Adlı kullanıcı ${message.author} tarafından \`${şuanki}\` tarihinde metin kanallarından susturuldu.
            
            \`>\` Mute Süresi : \`${await this.client.turkishDate(muteTime)}\`
            \`>\` Mute Bitiş Tarihi : \`${sonraki}\`
            \`>\` Mute Sebebi : \`${args.slice(2).join(" ")}\`
            \`>\` Ceza Numarası : \`#${harun + 1}\``)
            await this.client.channels.cache.get("936326292155007080").send(mutelendı)
        await mutes.findOne({ user: user.id }, async (err, doc) => {
            const newMute = new mutes({
                user: user.id,
                muted: true,
                yetkili: message.author.id,
                endDate: Date.now() + muteTime,
                start: Date.now(),
                sebep: args.slice(2).join(" ")
            })
            newMute.save().catch(e => console.log(e))
        })
        await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
            const newData = new data({
                user: user.id,
                yetkili: message.author.id,
                ihlal: harun + 1,
                ceza: "Chat Mute",
                sebep: args.slice(2).join(" "),
                tarih: moment(Date.now()).format("LLL"),
                bitiş: moment(Date.now() + time).format("LLL")
            })
            newData.save().catch(e => console.error(e))
            this.client.savePunishment()
        })
    }
}

module.exports = Mute;
