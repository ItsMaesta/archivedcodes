const Discord = require("discord.js")
const { MessageEmbed } = require("discord.js")
const Command = require("../../base/Command.js");
const etkinlik = require("../../Settings/Role.json");
class Rolsay extends Command {
    constructor(client) {
        super(client, {
            name: "rolsay",
            aliases: ["Rolsay"]
        });
    }

    async run(message, args, embed) {
        if(!message.member.roles.cache.some(r=>["936017599454642226","936326025737035786","936326028719181824"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
       let embed1 = new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM").setTimestamp();
       let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(s => s.name.toLowerCase().includes(args.slice(0).join(' ')))
       if (!args[0]) return this.client.yolla("Geçerli bir rol belirtin.", message.author, message.channel)

    let uyeler = role.members;
    let sestekiler = role.members.filter(s => s.voice.channel);
    let online = role.members.filter(s => s.presence.status != "offline")
    let taglilar = role.members.filter(s => etkinlik.Register.tags.some(a => s.user.tag.toLowerCase().includes(a)));
    let rolrenk = role.hexColor;
      
      
         embed1.setDescription(` 
> ${role}-\`(${role.id})\` Adlı Rolün Bilgileri:
> Toplam **${uyeler.size}** kullanıcı rolde bulunmakta.
> Toplam **${sestekiler.size}** kullanıcı seste bulunmakta.
> Toplam **${taglilar.size}** taglı kullanıcı bulunmakta.
> Toplam **${online.size}** kullanıcı aktif bulunmakta.
`);
          message.channel.send(embed1);
          message.react('✅');  
}
  }
module.exports = Rolsay