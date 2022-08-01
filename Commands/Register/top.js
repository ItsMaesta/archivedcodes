const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const kayıtlar = require("../../models/kayıt.js")

class topteyit extends Command {
    constructor(client) {
        super(client, {
            name: "topteyit",
            description: "Latency and API response times.",
            usage: "erkek",
            aliases: ["topkayıt"]
        });
    }

    async run(message, args, level) {
        if(!message.member.roles.cache.some(r=>["936326025737035786","936326027750293525","936326028719181824","936326062349090856"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        let arr = []
        await kayıtlar.find({}, async (err, res) => {
            res.filter(x => message.guild.members.cache.has(x.user)).map(async (x) => {
                await arr.push({ user: x.user, kayıt: x.kayıtlar.length, erkek: x.erkek, kadın: x.kadın })
            })
        })
        let toplam = arr.map(x => x.kayıt).reduce((a, b) => a + b, 0)
        let kayıt = arr.sort((a, b) => b.kayıt - a.kayıt, 0).slice(0, 15)
        let num = 1
        let find = arr.find(x => x.user === message.author.id)
        let bişi = kayıt.map(x => `\`${num++}.\` <@${x.user}>: \`${x.kayıt} Kayıt.\`${x.user === message.author.id ? "" : ""}`).join("\n")
        let embed1 = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .setDescription(`Top 15 Kayıt sıralaması. Sunucuda **${toplam}** kayıt işlemi yapıldı.\n\n${bişi}\n\n${find ? `Sunucuda (**${find.kadın}** kadın, **${find.erkek}** erkek, **0** şüpheli hesap) kaydın bulunmakta.` : "Henüz kimseyi kayıtetmemişsiniz."}`)
            .setColor("RANDOM")
        await message.channel.send(embed1)
    }
}

module.exports = topteyit;