const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Discord = require("discord.js")
class Gönder extends Command {
    constructor(client) {
        super(client, {
            name: "gönder",
            aliases: ["gönder"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.roles.cache.some(r=>["936326025737035786","936326027750293525","936326028719181824"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        let member = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!member) return this.client.yolla("Göndermek istediğin kullanıcıyı etiketle.", message.author, message.channel)
        if (!member.voice.channel) return this.client.yolla("Göndermek istediğin kullanıcı ses kanalında yok.", message.author, message.channel)
        if (message.member.roles.highest.rawPosition < member.roles.highest.rawPosition) return this.client.yolla("Senden yüksek rolleri olan bir kullanıcıda bu işlemi kullanamazsın.", message.author, message.channel)
        if (!args[1]) return this.client.yolla("Kanal belirtin.", message.author, message.channel)
        let kanal = message.guild.channels.cache.find(x => x.id == args[1])
        if(!kanal) return this.client.yolla("Göndermek istediğin kanalı bulamadım.", message.author, message.channel)
        if(!kanal.permissionsFor(member).has("CONNECT")) return this.client.yolla("Kullanıcının yetkisi yetersiz bu kanala giriş için.", message.author, message.channel)
        member.voice.setChannel(kanal.id);
        await this.client.yolla("<@" + member.id + ">-(\`" + member.id + "\`) Adlı kullanıcı başarıyla " + kanal.name + " adlı kanala gönderildi.", message.author, message.channel)
 
    }
}

module.exports = Gönder;
