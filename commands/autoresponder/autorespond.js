/*const config = require('../../../config.js')
const { EmbedBuilder, AttachmentBuilder } = require('discord.js')
const Arschema = require('../../../Schema/AutoResponder.js')
const db = require('../../../Schema/Prefix.js');

module.exports = {
    name: 'autoresponder',
    aliases: ['ar'],
    UserPerms: ['ManageGuild'],
    BotPerms: ['EmbedLinks', 'ManageMessages'],
    run: async (client, message, args) => {
        let prefix = await client.db8.get(`${message.guild.id}_prefix`) || Settings.bot.info.prefix; switch (args[0]) {

            case "create":
                handleRole(args, "humans", data.role.humans, role, message, client);
                break;

            case "delete":
                handleRole(args, "bots", data.role.bots, role, message, client);
                break;

            case "config":
                displayConfig(message, data, client, arypton);
                break;

            default:
                const guideEmbed = createAutoresponderGuideEmbed(client, prefix);
                message.channel.send({ embeds: [guideEmbed] });
                break;
        }
    }
}

async function createAutoresponderGuideEmbed(client, prefix) {
    const guide = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
            { name: `${emoji.util.arrow} \`${prefix}nightmode\``, value: `Displays the night mode module guide.`, inline: false },
            { name: `${emoji.util.arrow} \`${prefix}nightmode role add <role mention/id>\``, value: `Adds a role to night mode roles.`, inline: false },
            { name: `${emoji.util.arrow} \`${prefix}nightmode role remove <role mention/id>\``, value: `Removes a role from night mode roles.`, inline: false },
            { name: `${emoji.util.arrow} \`${prefix}nightmode role show\``, value: `Shows server night mode role module settings.`, inline: false },
            { name: `${emoji.util.arrow} \`${prefix}nightmode role reset\``, value: `Resets night mode role settings for the server.`, inline: false },
            { name: `${emoji.util.arrow} \`${prefix}nightmode bypass add <user mention/id>\``, value: `Adds a user to night mode bypass.`, inline: false },
            { name: `${emoji.util.arrow} \`${prefix}nightmode bypass remove <user mention/id>\``, value: `Removes a user from night mode bypass.`, inline: false },
            { name: `${emoji.util.arrow} \`${prefix}nightmode bypass show\``, value: `Shows server night mode bypass module settings.`, inline: false },
            { name: `${emoji.util.arrow} \`${prefix}nightmode bypass reset\``, value: `Resets night mode bypass settings for the server.`, inline: false }
        )
        .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

    return guide;
}

async function createAutoResponderCreate(client, message) {

}*/