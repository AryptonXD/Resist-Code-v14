const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: {
        name: "boostcount",
        description: "Returns the number of boosts in the server.",
    },
    voteOnly: false,
    BotPerms: ['EmbedLinks'],
    async execute(client, interaction) {

        function createStatusEmbed(guild, user) {
            return new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
                .setDescription(`**${guild.premiumSubscriptionCount}** boosts`)
                .setFooter({ text: `Requested by: ${user.username}`, iconURL: user.displayAvatarURL({ dynamic: true }) });
        }
        const stts = createStatusEmbed(interaction.guild, interaction.user);
        interaction.reply({ embeds: [stts] });
    }
};
