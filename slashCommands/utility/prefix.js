const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const Settings = require('../../settings.js');
const emoji = require('../../emoji.js');
const owner = Settings.bot.credits.developerId;

const PREFIX_LIMIT = 3;

async function fetchAryptonUser(client) {
    try {
        return await client.users.fetch(owner);
    } catch (error) {
        console.error("Error fetching arypton user:", error);
        return null;
    }
}

function createPrefixEmbed(client) {
    return new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: null })
        .addFields({ name: "Server Settings", value: `${emoji.util.cross} | Provide me a prefix to set for this server.` });
}

function createNonLatestEmbed(client) {
    return new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: null })
        .addFields({ name: "Server Settings", value: `${emoji.util.cross} | Please choose a smaller prefix. (Length can be max 2 characters).` });
}

function createLatestEmbed(client, newPrefix, arypton) {
    return new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: null })
        .addFields({ name: "Server Settings", value: `${emoji.util.tick} | The new prefix is now set to **${newPrefix}** Ping me if you ever forget it.` })
        .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
}

async function setPrefix(client, guildId, newPrefix) {
    try {
        await client.db8.set(`${guildId}_prefix`, newPrefix);
    } catch (error) {
        console.error("Error setting prefix in the database:", error);
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prefix')
        .setDescription('Set a custom prefix for the server')
        .addStringOption((option) =>
            option
                .setName('new_prefix')
                .setDescription('The new prefix')
        ),
    voteOnly: false,
    UserPerms: ['ManageGuild'],
    BotPerms: ['EmbedLinks'],
    async execute(client, interaction) {
        try {
            const member = await interaction.member.fetch();
            const newPrefix = interaction.options.getString('new_prefix');

            if (!newPrefix) {
                const prefix = createPrefixEmbed(client);
                await interaction.reply({ embeds: [prefix] });
                return;
            }

            if (newPrefix.length >= PREFIX_LIMIT) {
                const nonlatest = createNonLatestEmbed(client);
                await interaction.reply({ embeds: [nonlatest] });
                return;
            }

            await setPrefix(client, interaction.guildId, newPrefix);

            const arypton = await fetchAryptonUser(client);
            const latest = createLatestEmbed(client, newPrefix, arypton);
            await interaction.reply({ embeds: [latest] });
        } catch (error) {
            console.error("An error occurred:", error);
        }
    },
};
