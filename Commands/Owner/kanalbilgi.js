const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")

class kanaldakiler extends Command {
    constructor(client) {
        super(client, {
            name: "kanalbilgi",
            aliases: ["kanalbilgi","Kanalbilgi","sestekiler"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.roles.cache.some(r=>["936017599454642226","936326025737035786","936326028719181824"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        let kanal = message.guild.channels.cache.find(x => x.id == args[0])
        if(!kanal) return this.client.yolla("Kanaldaki üyeleri görmek için kanal id belirtin.", message.author, message.channel);
       const LogChannel = message.guild.channels.cache.get("936333986786058301");
        let sestekiler = message.guild.channels.cache.get(kanal.id).members.map(r => `• ${r.user}-\`(${r.user.id})\``).join("\n")
        let deneme = message.guild.channels.cache.get(kanal.id).members.map(r => `${r.user}`)
        let embed = new Discord.MessageEmbed()
        .setColor("RANDOM") 
        .setFooter(``+ moment(Date.now()).add(3, 'hour').format("LLL")+``) 
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
        .setDescription(`\`\`\`${kanal.name} İsimli kanalda bulunan kullanıcılar.\`\`\`\n${sestekiler}`) 
        message.channel.send(embed) 
        LogChannel.send(embed.setDescription(`\`` + moment(Date.now()).add(3, 'hour').format("LLL")+`\` Tarihinde \`${kanal.name}\` Kanalında bulunan kullanıcılar\n${deneme}`))
    }
}

module.exports = kanaldakiler;