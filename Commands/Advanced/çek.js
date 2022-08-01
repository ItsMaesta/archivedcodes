const Command = require("../../base/Command.js");
const Log = require("../../Settings/Log.json");
const Others = require("../../Settings/Others.json")
const moment = require("moment")
const Discord = require("discord.js")
class Çek extends Command {
  constructor(client) {
      super(client, {
          name: "çek",
          aliases: ["çek"]
      });
  }

    async run(message, args, embed, perm) {
        if(!message.member.roles.cache.some(r=>["936326025737035786","936326027750293525","936326028719181824"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
    if (!message.member.voice.channel) return this.client.yolla("Bir ses kanalında bulunmalısın.", message.author, message.channel);
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return this.client.yolla("Çekmek istediğin kullanıcıyı belirtin.", message.author, message.channel);
    if (!member.voice.channel) return this.client.yolla("Çekmek istediğin kullanıcı bir sese kanalında yok.", message.author, message.channel);
   if (message.member.voice.channelID === member.voice.channelID) return this.client.yolla("Zaten çekmek istediğin kullanıcıyla aynı kanaldasın.", message.author, message.channel);
    member.voice.setChannel(message.member.voice.channelID);

    message.channel.send(`${member} Adlı kullanıcı başarıyla  \`${message.member.voice.channel.name}\` Adlı kanala çekildi.`).then((x) => x.delete({ timeout: 10000 }));
    message.react('✅'); 
  }
};
module.exports = Çek;


