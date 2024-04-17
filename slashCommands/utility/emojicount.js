const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emojicount')
        .setDescription('Returns the number of emojis in the server.'),
    voteOnly: false,
    BotPerms: ['EmbedLinks'],
    async execute(client, interaction) {

        function createEmbed(guild, emojiCount, user) {
            return new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
                .setDescription(`**${emojiCount}** emojis`)
                .setFooter({ text: `Requested by: ${user.username}`, iconURL: user.displayAvatarURL({ dynamic: true }) });
        }
        const emojis = interaction.guild.emojis.cache.size;
        const stts = createEmbed(interaction.guild, emojis, interaction.user);
        interaction.reply({ embeds: [stts] });
    }
};
