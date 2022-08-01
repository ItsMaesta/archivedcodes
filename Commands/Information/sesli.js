const Command = require("../../base/Command.js");
const Discord = require("discord.js")
const Permissions = require("../../Settings/Permissions.json");
const Guild = require("../../Settings/Guild.json");
const Role = require("../../Settings/Role.json");
const Log = require("../../Settings/Log.json")


class Sesli extends Command {
    constructor(client) {
        super(client, {
            name: "sesli",
            aliases: ["Sesli"]
        });
    }

    async run(message, args, embed) {
        if(!message.member.roles.cache.some(r=>["936017599454642226","936326025737035786","936326028719181824"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
               let embed1 = new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM").setTimestamp();
      if (!message.member.hasPermission(8)) return;
    let pub = message.guild.channels.cache.filter(x => x.parentID == "936326157161361418" && x.type == "voice").map(u => u.members.size).reduce((a, b) => a + b)
        let priv = message.guild.channels.cache.filter(x => x.parentID == "936326158117634108" && x.type == "voice").map(u => u.members.size).reduce((a, b) => a + b)
        let alone = message.guild.channels.cache.filter(x => x.parentID == "936326146268741632" && x.type == "voice").map(u => u.members.size).reduce((a, b) => a + b)
        let reg = message.guild.channels.cache.filter(x => x.parentID == "936326158117634108" && x.type == "voice").map(u => u.members.size).reduce((a, b) => a + b)
        let ses = message.guild.members.cache.filter(x => x.voice.channel).size
        let tagges = message.guild.members.cache.filter(x => {
            return x.user.username.includes("◈") && x.voice.channel && !x.roles.cache.has("936567696861040690") ///yetkili rolü
        }).size
        let notag = message.guild.members.cache.filter(x => {
            return !x.user.username.includes("◈") && x.voice.channel
        }).size
        let yetkili = message.guild.members.cache.filter(x => {
            return x.user.username.includes("◈") && x.voice.channel && x.roles.cache.has("936567696861040690")
        }).size
    embed1.setDescription(`
\`•\`Tüm ses kanallarında toplam **${ses}** kullanıcı var bunlar:
\`•\` **${pub}** public,  **${priv}** priv, **${alone}** alone, **${reg}** register
\`•\` Sesli odalarda **${yetkili}** sunucumuzda yetkili kullanıcı var.
\`•\` Sesli odalarda **${notag}** kullanıcı tagımızı almamış.
\`•\` Sesli odalarda **${tagges}** taglı kullanıcı var.
    `);

    message.channel.send(embed1).then((x) => x.delete({ timeout: 50000 }));
          message.react('✅'); 
  }
};

module.exports = Sesli;
