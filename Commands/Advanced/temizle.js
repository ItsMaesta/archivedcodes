const Command = require("../../base/Command.js");
const moment = require("moment")
require("moment-duration-format")
const cezalar = require("../../models/cezalar.js")
const Discord = require("discord.js")
const data = require("../../models/cezalar.js")
const sunucu = require("../../models/sunucu-bilgi.js")
class Temizle extends Command {
    constructor(client) {
        super(client, {
            name: "temizle",
            aliases: ["sil","clear"]
        });
    }

    async run(message, args, perm) {
        if (!message.member.hasPermission("ADMINISTRATOR")) return
        let amount = args[0];
        if (!amount || isNaN(amount) || parseInt(amount) < 1) {
            return this.client.yolla("Kaç tane mesaj silmem için sayı belirtin.", message.author, message.channel)
        }

        await message.delete();
        const user = message.mentions.users.first();
        
        let banNum = this.client.silLimit.get(message.author.id) || 0
        this.client.silLimit.set(message.author.id, banNum + 1)
        if (banNum == 9) return this.client.yolla("Bu komutu çok kullandın sınıra ulaştın.", message.author, message.channel)
       
        let messages = await message.channel.messages.fetch({ limit: 100 });
        messages = messages.array();
        if (user) {
            messages = messages.filter((m) => m.author.id === user.id);
        }
        if (messages.length > amount) {
            messages.length = parseInt(amount, 10);
        }
        messages = messages.filter((m) => !m.pinned);
        amount++;
        message.channel.bulkDelete(messages, true);
        if (user) {
            this.client.yolla(`${user}-(\`${user.id}\`) adlı kullanıcının **${messages.length}** mesajı silindi.`, message.author, message.channel)
        } else {
            this.client.yolla(`**${messages.length}** mesaj silindi.`, message.author, message.channel)
        }

    }
}

module.exports = Temizle;
