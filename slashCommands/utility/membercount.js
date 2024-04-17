const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('membercount')
        .setDescription('Returns the number of members in the server.'),
    voteOnly: false,
    BotPerms: ['EmbedLinks'],
    async execute(client, interaction) {

        function createEmbed(guild, memberCount, user) {
            return new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
                .setDescription(`**${memberCount}** members`)
                .setFooter({ text: `Requested by: ${user.username}`, iconURL: user.displayAvatarURL({ dynamic: true }) });
        }
        const memberCount = interaction.guild.memberCount;
        const stts = createEmbed(interaction.guild, memberCount, interaction.user);
        interaction.reply({ embeds: [stts] });
    }
};
