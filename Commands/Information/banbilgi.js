const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Discord = require("discord.js")
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")
const db = require("../../models/cantUnBan.js")
class BanBilgi extends Command {
    constructor(client) {
        super(client, {
            name: "ban-bilgi",
            aliases: ["banbilgi"]
        });
    }

    async run(message, args, client) {
        if(!message.member.roles.cache.some(r=>["936017599454642226","936326025737035786","936326028719181824","936326059274670120"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
      let embed = new Discord.MessageEmbed()
      embed.setColor("RANDOM")
      embed.setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
      
      await this.client.users.fetch(args[0]).then(res => {
          if(!res){
              embed.setDescription("Geçerli bir ID Belirtin.")
              return message.channel.send(embed)
          }else{
              message.guild.fetchBans(true).then(async(bans) => {
                  let ban = await bans.find(a => a.user.id === res.id)
                  if(!ban){
                      embed.setDescription(`\`${res.tag}\`-(\`${res.id}\`) Bu kullanıcı sunucuda yasaklı değil.`)
                      return message.channel.send(embed)
                  }else{
                      let text = `\`${res.tag}\`-(\`${res.id}\`) Adlı kullanıcı sunucudan şu sebeble banlanmıştır:`
                      message.guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD', limit: 100}).then(audit => {
                          let user = audit.entries.find(a => a.target.id === res.id)
                          if(user){
                              embed.setDescription(text + `\n\n\`${ban.reason || "Sebep Belirtilmemiş."}\` Tarafından \`${moment(user.createdAt).add(3, 'hour').format("lll")}\` tarihinde sunucudan uzaklaştırılmış.`)
                              return message.channel.send(embed)
                          }else{
                              embed.setDescription(text + "\n\nKullanıcının kimin banlandığını göremiyorum.")
                              return message.channel.send(embed)
                          }
                      })
                  }
              })
          }
      }).catch(err => {
          embed.setDescription("Geçerli bir ID Belirtin.")
              return message.channel.send(embed)
      })
    }
}



module.exports = BanBilgi;
