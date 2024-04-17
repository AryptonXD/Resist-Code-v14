const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "emojicount",
    aliases: ['ec'],
    voteOnly: false,
    BotPerms: ['EmbedLinks'],
    run: async (client, message, args) => {
        function createEmbed(guild, emojiCount, author) {
            return new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
                .setDescription(`**${emojiCount}** emojis`)
                .setFooter({ text: `Requested by: ${author.username}`, iconURL: author.displayAvatarURL({ dynamic: true }) });
        }
        const emojis = message.guild.emojis.cache.size;
        const stts = createEmbed(message.guild, emojis, message.author);
        message.channel.send({ embeds: [stts] });
    }
};
