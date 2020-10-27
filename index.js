const Discord = require('discord.js')
const colors = require('./colors.json')
const token = 'NzU5NTk5MjYxNzkxOTQ0NzI2.X2_18A.mJkZxMq4Y8cJmIscGdHqS5Qs8OQ'
const PREFIX = '^'
const client = new Discord.Client()

client.on('ready', () => {
    console.log(client.user.tag + " is ready to verify!")
    client.user.setActivity("verification system", {
        type: "PLAYING"
    });
})

client.on('message', async message => {

    if(!message.content.startsWith(PREFIX)) return

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "verify") {
        if (message.channel.name.endsWith("verification")) {
            let firstVerifyEmbed = new Discord.MessageEmbed()
                .setThumbnail(message.guild.iconURL({
                    dynamic: true
                }))
                .setTitle(`Welcome to ${message.guild.name}!`)
                .setColor(colors.green)
                .setDescription(`Hello ${message.author}! This server is protected by ${message.client.user.username}. Inorder to verify yourself to the server, please type in the CAPTCHA sent to you below. You have 5 minutes to do so, if not you will be kicked. `)
                .addField("Your Captcha:", `\`Galaxy\``)
            message.channel.send(firstVerifyEmbed).then(() => {
                const filter = m => message.author.id === m.author.id;

                message.channel.awaitMessages(filter, {
                        time: 5 * 60000,
                        max: 1,
                        errors: ['time']
                    })
                    .then(async messages => {
                        if (messages.first().content.toLowerCase() === 'galaxy') {
                            message.channel.bulkDelete(3)
                            let verificationEmbed = new Discord.MessageEmbed()
                                .setAuthor(message.author.username, message.author.avatarURL({
                                    dynamic: true
                                }))
                                .setColor(colors.green)
                                .setDescription(`<a:GiveawayTime:753044729696092290> **You have been verified to: \`${message.guild.name}\`!**`)
                                .setFooter(message.client.user.username, message.client.user.avatarURL())
                            const role = message.guild.roles.cache.find(role => role.id === '746895359791333376');
                            message.member.roles.add(role);
                            await message.channel.send(verificationEmbed).then(m => m.delete({
                                timeout: 3000
                            }))
                            console.log(`${message.author.tag} has been verified!`)
                        }

                    })
                    .catch(async () => {
                        message.member.kick().catch(error => {
                            console.log(`There was an error in kicking ${message.author.tag}! \n ${error}`)
                            return
                        })
                        let retryEmbed = new Discord.MessageEmbed()
                            .setAuthor(message.author.username, message.author.avatarURL())
                            .setThumbnail(message.guild.iconURL({
                                dynamic: true
                            }))
                            .setTitle("YOU HAVE FAILED THE VERIFICATION")
                            .setColor(colors.red)
                            .setDescription(`You have failed the verification in \`${message.guild.name}\`! If you want to try again, please click [here](https://discord.gg/TfWWGrx) to rejoin!`)
                            .setFooter(message.client.user.username, message.client.user.avatarURL())
                        await message.author.send(retryEmbed)
                    });
            });
        }
    }

    if (message.channel.id === "746897244019490868") {
        if (message.author.id === message.client.user.id) return
        if (message.content.startsWith("^verify")) return
        if (message.content.toLowerCase() === "galaxy") return
        
        message.delete()
    }
})

client.login(token)