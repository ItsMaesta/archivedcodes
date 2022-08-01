const Command = require("../../base/Command.js");
const { Client, Message} = require("discord.js");
const ayarlar = require("../../Settings/Role.json");
const Discord = require("discord.js");
const ms = require('ms')
class Şüpheli extends Command {
    constructor(client) {
        super(client, {
            name: "şüpheliaf",
           aliases: ["Şüpheliaf"]
        });
    }

    async run (message, args) {
        if(!message.member.roles.cache.some(r=>["936326025737035786","936326027750293525","936326028719181824","936326062349090856"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!uye) return this.client.yolla("Şüpheliden çıkarmak istediğin kullanıcıyı etiketle", message.author, message.channel)
    if(message.author.id === uye.id) return this.client.yolla("Kendi üzerinde bu işlemi kullanamazsın.", message.author, message.channel)
    if(!uye.manageable) return this.client.yolla("Şüpheliden çıkarmak istediğin kullanıcının yetkisi benden yüksek.", message.author, message.channel)
    if(message.member.roles.highest.position <= uye.roles.highest.position) return this.client.yolla("Kendi rolün üzerindeki kişilerden şüpheli rolünü alamazsın.", message.author, message.channel)
    uye.setNickname(`${uye.user.username.includes(ayarlar.tag.tag) ? ayarlar.tag.tag : (ayarlar.tag.tag2 ? ayarlar.tag.tag2 : (ayarlar.tag.tag || ""))} İsim | Yaş`)   
    let roles = uye.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(ayarlar.Register.Unregistered);
    uye.roles.set(roles).catch(); 
    message.channel.send(`${uye}-(\`${uye.id}\`) Kullanıcısı başarıyla şüpheli rolü alınıp kayıtsıza atılmıştır.`).then(x => x.delete({timeout: 5000}))
    message.react("✅")
    }
}
module.exports = Şüpheli;