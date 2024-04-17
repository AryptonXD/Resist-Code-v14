const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('channelcount')
        .setDescription('Returns the number of text and voice channels in the server.'),
    voteOnly: false,
    BotPerms: ['EmbedLinks'],
    async execute(client, interaction) {

        function countChannels(channels) {
            const textChannelCount = channels.filter(channel => channel.type === ChannelType.GuildText).size;
            const voiceChannelCount = channels.filter(channel => channel.type === ChannelType.GuildVoice).size;

            return { textChannelCount, voiceChannelCount };
        }

        function createEmbed(guild, channelCount, user) {
            return new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
                .setDescription(`**${channelCount}** channels`)
                .setFooter({ text: `Requested by: ${user.username}`, iconURL: user.displayAvatarURL({ dynamic: true }) });
        }
        const channels = interaction.guild.channels.cache;
        const { textChannelCount, voiceChannelCount } = countChannels(channels);
        const stts = createEmbed(interaction.guild, textChannelCount + voiceChannelCount, interaction.user);
        interaction.reply({ embeds: [stts] });
    }
};
