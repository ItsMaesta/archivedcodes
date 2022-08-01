const Discord = require("discord.js")
const { MessageEmbed } = require("discord.js")
const Command = require("../../base/Command.js");
const etkinlik = require("../../Settings/Role.json");

class Rolfaelynn extends Command {
    constructor(client) {
        super(client, {
            name: "rol",
            aliases: ["Rol"]
        });
    }

    async run(message, args, embed) {
    if(!message.guild) return;
  
        if(!message.member.roles.cache.some(r=>["936017599454642226","936326025737035786","936326028719181824"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
  
  
  
    const Array = []
    let sayım = 0;
    let Durdur = 0
    const Role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0])
    if (!Role) return this.client.yolla("Rol veya id belirtin.", message.author, message.channel)
    const filter = message.guild.members.cache.filter(User => User.roles.cache.has(Role.id))
    filter.forEach(M => {
    if (sayım === 50){
    if (Durdur > 0) return
    Durdur++;
     return Array.push("Kullanıcı sınırı 50")
    }
    sayım++
    Array.push(`<@${M.id}>`)
    })
  
  
    message.channel.send(`Rolde toplam \`${message.guild.roles.cache.get(Role.id).members.size}\` kullanıcı bulunmaktadır.\n\`\`\`` + Array.map(c => c).join(" ,")+ `\`\`\``)
  
  }
  }
  
  module.exports = Rolfaelynn;
  