const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rolecount')
        .setDescription('Returns the number of roles in the server.'),
    voteOnly: false,
    BotPerms: ['EmbedLinks'],
    async execute(client, interaction) {

        function createEmbed(guild, rolesCount, user) {
            return new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
                .setDescription(`**${rolesCount}** roles`)
                .setFooter({ text: `Requested by: ${user.username}`, iconURL: user.displayAvatarURL({ dynamic: true }) });
        }
        const rolesCount = interaction.guild.roles.cache.size;
        const stts = createEmbed(interaction.guild, rolesCount, interaction.user);
        interaction.reply({ embeds: [stts] });
    }
};
