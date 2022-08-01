const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Log = require("../../Settings/Log.json")
const Limit = require("../../Settings/Limit.json");
const moment = require("moment")
require("moment-duration-format")
const cezalar = require("../../models/cezalar.js")
const Discord = require("discord.js")
const data = require("../../models/cezalar.js")
const sunucu = require("../../models/sunucu-bilgi.js")
class Ban extends Command {
    constructor(client) {
        super(client, {
            name: "ban",
            aliases: ["ban"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.roles.cache.some(r=>["936017599454642226","936326025737035786","936326028719181824","936326059274670120"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        if (args.length < 1) return this.client.yolla("Banlamak istediğin kullanıcıyı belirt.", message.author, message.channel)
        let user = message.mentions.users.first() || await this.client.users.fetch(args[0]).catch(e => console.log(e))
        if (!user) return this.client.yolla("Banlamak istediğiniz kullanıcı geçersiz.", message.author, message.channel)
        if(user.id === message.author.id) return this.client.yolla("Kendini banlayamazsınız.", message.author, message.channel)
        if (message.guild.members.cache.has(user.id) && message.guild.members.cache.get(user.id).hasPermission("ADMINISTRATOR")) return this.client.yolla("Yetkisi yüksek kişileri banlayamazsın.", message.author, message.channel)
        if (message.guild.members.cache.has(user.id) && message.member.roles.highest.position <= message.guild.members.cache.get(user.id).roles.highest.position) return this.client.yolla("Bulunduğun rolden yüksek kişileri banlayamazsın.", message.author, message.channel)
        let reason = args.slice(1).join(" ") || "Sebep Belirtilmedi."
        let count = await data.countDocuments().exec();
        //let harun = count ? count++ : 1;
        let harun = count
        const embed = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setColor("RANDOM")
            .setImage("https://media1.tenor.com/images/52aa471885e0fe15b8b95c3a9146dd85/tenor.gif?itemid=8329468")
            .setDescription(`**${user.tag}** Adlı kullanıcı **${message.author.tag}** tarafından başarıyla sunucudan yasaklandı. (Ceza Numarası: \`#${harun + 1}\`)`)
            await message.channel.send(embed)
            await this.client.channels.cache.get("936326272903176262").send(`**${user.tag}** adlı kullanıcı __${reason}__ sebebiyle **${message.author.tag}** tarafından yasaklandı.`).catch(e => { })
            message.guild.fetchBans(true).then(async (bans) => {
            let ban = await bans.find(a => a.user.id === user.id)
            if (ban) return this.client.yolla(`**${user.tag}** Adlı kullanıcı sunucuda yasaklı.`, message.author, message.channel)
            if (!ban) {
                let banNum = this.client.banLimit.get(message.author.id) || 0
                this.client.banLimit.set(message.author.id, banNum + 1)
                if (banNum == 9) return this.client.yolla("Bu komutu kullanma sınırına ulaştın.", message.author, message.channel)
                await message.guild.members.ban(user.id, { reason: `${reason} | Yetkili: ${message.author.tag}` })
                await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                    const newData = new data({
                        user: user.id,
                        yetkili: message.author.id,
                        ihlal: harun + 1,
                        ceza: "Yasaklı",
                        sebep: reason,
                        tarih: moment(Date.now()).format("LLL"),
                        bitiş: "-"
                    })
                    newData.save().catch(e => console.error(e))
                    this.client.savePunishment()
                })
            }
        })
    }
}

module.exports = Ban;
