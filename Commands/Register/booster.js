const Command = require("../../base/Command.js");
const data = require("../../models/names.js");
const Discord = require("discord.js");
const Guild = require("../../Settings/Guild.json");

class Booster extends Command {
    constructor(client) {
        super(client, {
            name: "booster",
           aliases: ["bisim","b","rich"]
        });
    }

    async run (message, args, embed) {
              let embed1 = new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true })).setColor("RANDOM");
    if (!message.member.premiumSince) return this.client.yolla("Bu komutu kullanmak için boost basmanız gerekiyor.", message.author, message.channel);
    if (!message.member.manageable) return this.client.yolla("Bu kullanıcının adını değiştiremiyorum.", message.author, message.channel);

    const username = args.join(" ");
     if (!username) return this.client.yolla("Kullanıcı adını belirtin.", message.author, message.channel);
        if (username.length >= 32) return this.client.yolla("32 karakteri geçmicek bir şekilde isim belirtin.", message.author, message.channel);
     if (message.member.user.username.includes(Guild.Tag)) {
      await message.member.setNickname(`${Guild.Tag} ${username}`);
      message.channel.send(embed1.setDescription(`Kullanıcı adınız başarıyla  \`${username}\` olarak değiştirildi!`)).then((x) => x.delete({ timeout: 10000 }));
          message.react('✅'); 
    } else {
      await message.member.setNickname(`${Guild.Secondary_Tag} ${username}`);
      message.channel.send(embed1.setDescription(`Kullanıcı adınız başarıyla \`${username}\` olarak değiştirildi!`)).then((x) => x.delete({ timeout: 10000 }));
          message.react('✅'); 

    }
  }
};
module.exports = Booster;
