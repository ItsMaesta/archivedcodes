const Command = require("../../base/Command.js");
const Permissions = require("../../Settings/Permissions.json");
const Discord = require("discord.js")
const moment = require("moment");
const data = require("../../models/cezalar.js")
const Log = require("../../Settings/Log.json")
const ceza = require("../../models/cezalar.js")
require("moment-duration-format")
moment.locale("tr")
const db = require("../../models/cantUnBan.js")
class Unban extends Command {
    constructor(client) {
        super(client, {
            name: "unban",
            aliases: ["unban"]
        });
    }

    async run(message, args, client) {
        if(!message.member.roles.cache.some(r=>["936017599454642226","936326025737035786","936326028719181824","936326059274670120"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
      let embed = new Discord.MessageEmbed()
      let count = await ceza.countDocuments().exec();
      let harun = count
      embed.setColor("RANDOM")
      embed.setAuthor(message.author.tag, message.author.avatarURL({dynamic: true}))
      
      let user = message.mentions.users.first() || await this.client.users.fetch(args[0]).then(res => {
          if(!res){
              embed.setDescription("Banını kaldırmak istediğin kullanıcıyı belirt.")
              return message.channel.send(embed)
          }else{
              message.guild.fetchBans(true).then(async(bans) => {
                  let ban = await bans.find(a => a.user.id === res.id)
                  if(!ban){
                      embed.setDescription(`\`${res.tag}\` isimli kullanıcı sunucuda yasaklı değil.`)
                      return message.channel.send(embed)
                  } else {
                    await db.findOne({userid: res.id}, async(err,dbres) => {
                        if(!dbres) {
                            await message.guild.members.unban(res.id)
                            embed.setDescription(`\`${res.tag}\` isimli kullanıcının yasağı kaldırıldı. \`(Ceza Numarası: #${harun + 1})\``)
                            message.channel.send(embed)
                            this.client.channels.cache.get("936326272903176262").send(new Discord.MessageEmbed()
                            .setColor("RANDOM")
                            .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                            .setDescription(`\`${res.tag}\` İsimli kullanıcının yasağı ${message.author} tarafından ${moment(Date.now()).format("LLL")} tarihinde kaldırıldı.`)
                            )
                            await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                                const newData = new data({
                                    user: user,
                                    yetkili: message.author.id,
                                    ihlal: harun + 1,
                                    ceza: "Unban",
                                    sebep: "-",
                                    tarih: moment(Date.now()).format("LLL"),
                                    bitiş: "-"
                                })
                                newData.save().catch(e => console.error(e))
                                this.client.savePunishment()
                            })
                        } else {
                            embed.setDescription(`\`${res.tag}\` kullanıcısının yasağı <@${dbres.mod}> tarafından kaldırabilir.`)
                            if(message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed)
                            await message.guild.members.unban(res.id)
                            embed.setDescription(`\`${res.tag}\` kullanıcısının yasağı kaldırıldı. \`(Ceza Numarası: #${harun + 1})\``)
                            this.client.channels.cache.get("935121830539313212").send(new Discord.MessageEmbed()
                            .setColor("RANDOM")
                            .setAuthor(message.author.tag, message.author.avatarURL({ dynamic: true }))
                            .setDescription(`\`${res.tag}\` İsimli kullanıcının yasağı ${message.author} tarafından ${moment(Date.now()).format("LLL")} tarihinde kaldırıldı.`)
                            )
                            message.channel.send(embed)
                            await data.find({}).sort({ ihlal: "descending" }).exec(async (err, res) => {
                                const newData = new data({
                                    user: user,
                                    yetkili: message.author.id,
                                    ihlal: harun + 1,
                                    ceza: "Unban",
                                    sebep: "-",
                                    tarih: moment(Date.now()).format("LLL"),
                                    bitiş: "-"
                                })
                                newData.save().catch(e => console.error(e))
                                this.client.savePunishment()
                            })
                            res.delete().catch(e => console.log(e))
                      
                      
                        }
                    })
                  }
              })
          }
      }).catch(err => {
          embed.setDescription("İD Belirtmelisiniz.")
              return message.channel.send(embed)
      })
    }
}



module.exports = Unban;
