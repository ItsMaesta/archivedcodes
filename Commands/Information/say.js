const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Guild = require("../../Settings/Guild.json");
const Log = require("../../Settings/Log.json")
const Discord = require("discord.js")
class Say extends Command {
    constructor(client) {
        super(client, {
            name: "say",
            aliases: ["Say"]
        });
    }

    async run(message, args, data) {
        if(!message.member.roles.cache.some(r=>["936017599454642226","936326025737035786","936326028719181824"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        let embed1 = new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM").setTimestamp();
        if (!message.member.hasPermission(8)) return;
    embed1.setDescription(`
\`•\` Tüm ses kanallarında toplam **${message.guild.members.cache.filter((x) => x.voice.channel).size}** kişi bulunmaktadır!
\`•\` Sunucumuzda toplam  **${message.guild.memberCount}** üye bulunmaktadır!
\`•\` Sunucumuzda şu an **${message.guild.members.cache.filter((x) => x.user.presence.status !== "offline").size}** aktif üye bulunmaktadır!
\`•\` Toplamda **${message.guild.members.cache.filter((x) => x.user.username.includes("◈")).size}**  kişi tagımızı alarak bizi desteklemiş!
`);

    message.channel.send(embed1).then((x) => x.delete({ timeout: 80000 }));
          message.react('✅'); 
  }
};

module.exports = Say;
