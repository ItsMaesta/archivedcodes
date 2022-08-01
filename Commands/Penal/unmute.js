const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Role = require("../../Settings/Role.json");
const Others = require("../../Settings/Others.json");
const data = require("../../models/cezalar.js")
const ms = require("ms")
const moment = require("moment")
require("moment-duration-format")
const Discord = require("discord.js")
moment.locale("tr")
const harun = require("pretty-ms");
const mutes = require("../../models/voicemute.js")
const sunucu = require("../../models/sunucu-bilgi.js")
const wmute = require("../../models/waitMute.js")
class Unmute extends Command {
    constructor(client) {
        super(client, {
            name: "unmute",
            aliases: ["unmute","unchatmute","cunmute","chatunmute","unvoicemute","vunmute","voiceunmute","unvmute","uncmute"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.roles.cache.some(r=>["936017599454642226","936326025737035786","936326028719181824","936326058318397480"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if (!user) return this.client.yolla("Mutesini açmak istediğin kullanıcıyı belirt.", message.author, message.channel)
                   message.react('✅')
      if (user.voice.serverMute == true) {
            user.voice.setMute(false)
          this.client.yolla(`<@${user.id}>-(\`${user.id}\`) Adlı Kullanıcının mutesi kalkmıştır.`, message.author, message.channel)
           message.react('✅')
        } else {
            message.react('✅')
        }
        if (user.roles.cache.has("936335831055077506")) {
            user.roles.remove("936335831055077506")
            this.client.yolla(`<@${user.id}>-(\`${user.id}\`) Adlı kullanıcının mutesi kalkmıştır.`, message.author, message.channel)
            message.react('✅')
        } else {
        }

    }
}

module.exports = Unmute;
