const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "rolecount",
    aliases: ['rc'],
    voteOnly: false,
    BotPerms: ['EmbedLinks'],
    run: async (client, message, args) => {

        function createEmbed(guild, rolesCount, author) {
            return new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
                .setDescription(`**${rolesCount}** roles`)
                .setFooter({ text: `Requested by: ${author.username}`, iconURL: author.displayAvatarURL({ dynamic: true }) });
        }
        const rolesCount = message.guild.roles.cache.size;
        const stts = createEmbed(message.guild, rolesCount, message.author);
        message.channel.send({ embeds: [stts] });
    }
};
