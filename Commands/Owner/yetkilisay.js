const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Discord = require("discord.js")
const cezalar = require("../../models/cezalı.js")

class Yetkilisayy extends Command {
    constructor(client) {
        super(client, {
            name: "yetkilisay",
            aliases: ["ysay", "yetkili-say"]
        });
    }


    async run(message, args, level) {
        if(!message.member.roles.cache.some(r=>["936017599454642226","936326025737035786","936326028719181824"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
 let roles = args.length > 0 ? message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) : message.guild.roles.cache.find(x => x.id == "812741151630295090")
            let üyeler = message.guild.members.cache.filter(x => {
                return x.roles.cache.has("936567696861040690") && !x.voice.channel && x.user.presence.status !== "offline"
            })
            ///
   message.channel.send("```Aktif olup seste olmayan kullanıcı:" + üyeler.size + "```")
            if(üyeler.size == 0) return
            message.channel.send("" + üyeler.map(x => "<@" + x.id + ">").join(",") + "")
  }
};

module.exports = Yetkilisayy
