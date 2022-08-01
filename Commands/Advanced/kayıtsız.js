const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json")
const { MessageEmbed } = require("discord.js")
const Role = require("../../Settings/Role.json")
const Discord = require("discord.js")
class Unregister extends Command {
    constructor(client) {
        super(client, {
            name: "kayıtsız",
            aliases: ["unregistered", "teyitsiz","teyitat","teyit-at","unreg","unregister"]
        });
    }

    async run(message, args, client) {
        if(!message.member.roles.cache.some(r=>["936326025737035786","936326027750293525","936326028719181824"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
  
        let victim = message.mentions.members.first() || message.guild.member(args[0]);
        if (!victim) return this.client.yolla("Bir kullanıcı etiketlemelisin.", message.author, message.channel);
              
        if(victim.roles.highest.position >= message.member.roles.highest.position) return this.client.yolla("Senden yüksek rolleri olan bir kullanıcıda bu işlemi kullanamazsın.", message.author, message.channel);
        if(victim.roles.cache.has("936326079881293844") && !message.member.roles.cache.some(r =>["936326079881293844", "936326079881293844", "936326079881293844", "936326079881293844"].includes(r.id))) return this.client.yolla("İD Girilen Rolleri Kayıtsıza Atamazsın.", message.author, message.channel);
       
        let roles = victim.roles.cache.clone().filter(e => e.managed).map(e => e.id).concat(Role.Register.Unregistered);
        victim.roles.set(roles).catch();
        
        return this.client.yolla(`${victim}-(\`${victim.id}\`) Adlı kullanıcısı kayıtsıza gönderildi.`, message.author, message.channel); 
    }
}

module.exports = Unregister;
