const Command = require("../../base/Command.js");
const etkinlik = require("../../Settings/Role.json");
const Discord = require("discord.js");

class İzinli extends Command {
    constructor(client) {
        super(client, {
            name: "tasma",
            aliases: ["Tasma","lovers"]
        });
    }

    async run(message, args, perm) {
        if(!message.member.roles.cache.some(r=>["936326025737035786","936326027750293525","936326028719181824","936326061501870130"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        let user = message.mentions.members.first() || await this.client.üye(args[0], message.guild)
        if(!user) return this.client.yolla("Bir kullanıcı etiketleyiniz.", message.author, message.channel)
        if(!user.roles.cache.has(etkinlik.izinli)) {
            await this.client.yolla(`${user}-(\`${user.id}\`) adlı kullanıcıya <@&${etkinlik.izinli}> rolü verildi.`, message.author, message.channel)
            user.roles.add(etkinlik.izinli)
        } else{
            await this.client.yolla(`${user}-(\`${user.id}\`) adlı kullanıcıdan <@&${etkinlik.izinli}> rolü alındı.`, message.author, message.channel)
            user.roles.remove(etkinlik.izinli)
        }
    }
}

module.exports = İzinli;