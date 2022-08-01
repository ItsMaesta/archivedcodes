const Command = require("../../base/Command.js");
const Discord = require("discord.js");
const moment = require("moment")
require("moment-duration-format")
moment.locale("tr")

class yetkial extends Command {
    constructor(client) {
        super(client, {
            name: "yetkial",
            aliases: ["Yetkial"]
        });
    }
    // d!r args[0](al-ver) args[1](Kullanıcı) args[2](Rol)
    async run  (message, args, embed) {
        if(!message.member.roles.cache.some(r=>["935121826626027555","935121826626027551","935121826626027558"].includes(r.id)) && !message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(new Discord.MessageEmbed().setAuthor(message.author.tag, message.author.avatarURL()).setColor("RANDOM").setDescription(`Bu komutu kullanmak için yetkin yok.`)).then(m => m.delete({timeout: 7000}));
        let embed1 = new Discord.MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setColor("RANDOM").setFooter(`` + moment(Date.now()).add(3, 'hour').format("LLL")+ ``);
let logKanal = "935665552138059776" //log kanal ID
let log = message.guild.channels.cache.get(logKanal)
if(!log) return message.channel.send("Geçerli bir log kanal id belirtmelisiniz.")
let array = [
{rol: ["812741151643664414","812741151630295090"], no: "1"},
{rol: ["812741151643664415","812741151630295090"], no: "2"},
{rol: ["812741151643664416","812741151630295090"], no: "3"},
{rol: ["812741151643664417","812741151630295090"], no: "4"},
{rol: ["812741151643664419","812741151630295090"], no: "5"},
{rol: ["812741151655591980","812741151630295090"], no: "6"},
{rol: ["812741151643664420","812741151630295090"], no: "7"},
{rol: ["812741151643664422","812741151630295090"], no: "8"},
{rol: ["812741151647465523","812741151630295090"], no: "9"},
{rol: ["812741151647465524","812741151630295090"], no: "10"},
{rol: ["812741151647465524","812741151630295090"], no: "11"}
]
let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
// if(!member.user.username.includes("✩")) return message.channel.send(embed1.setDescription(`Rol vermek istediğiniz kullanıcı sunucumuz tagına sahip değil.`))
if(!member) return this.client.yolla("Rolünü almak istediğin kullanıcıyı belirt.", message.author, message.channel)
let maple = array.map(a => `\`${a["no"]}\` ${message.guild.roles.cache.get(a["rol"][0])}`).join("\n")

return message.channel.send(embed1.setDescription(`\`\`\`(${member.user.username.replace(/\`/g, "")} - ${member.user.id}) kullanıcısından alıncak rolü belirtin.\`\`\`

${maple}`)).then(async mesaj => {

const filter = m => m !== null && m.author.id == message.author.id;
message.channel.awaitMessages(filter, {max: 1, time: 10000, errors: ['time']})
.then(collected => {
    array.forEach(a => {
            if(a.no == collected.first().content) {
                if(Array.isArray(a.rol)) {
                    a.rol.forEach(slm=>{
                        member.roles.remove(slm)
                    })
                } 
                  this.client.yolla(`${member} adlı kullanıcıya <@&${a.rol[0]}> rolü başarıyla alındı.`, message.author, message.channel)

log.send(embed1.setDescription(`${member}-\`(${member.id})\` adlı kullanıcıya ${message.member} tarafından yetkisi alındı. 
───────────────
\`•\` Kullanıcıdan alınan yetki : <@&${a.rol[0]}>
`))

            }
        })
     }) 
.catch(c => message.channel.send(`İşlem iptal edildi.`) && mesaj.delete({timeout: 1000}))
})
    }
  }
module.exports = yetkial;
