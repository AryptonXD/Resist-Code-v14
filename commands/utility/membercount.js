const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "membercount",
    aliases: ['mc'],
    voteOnly: false,
    BotPerms: ['EmbedLinks'],
    run: async (client, message, args) => {

        function createEmbed(guild, memberCount, author) {
            return new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
                .setDescription(`**${memberCount}** members`)
                .setFooter({ text: `Requested by: ${author.username}`, iconURL: author.displayAvatarURL({ dynamic: true }) });
        }
        const memberCount = message.guild.memberCount;
        const stts = createEmbed(message.guild, memberCount, message.author);
        message.channel.send({ embeds: [stts] });
    }
};
