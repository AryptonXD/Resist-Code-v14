const { EmbedBuilder } = require('discord.js');
const snipedMessages = new Map();

module.exports = {
    name: 'snipe',
    UserPerms: ['ManageMessages'],
    BotPerms: ['EmbedLinks'],
    voteOnly: false,
    run: async (client, message, args) => {
        const snipeData = snipedMessages.get(message.channel.id);

        client.on('messageDelete', (message) => {
            snipedMessages.set(message.channel.id, {
                content: message.content,
                author: message.author,
                deletedAt: new Date(),
            });
        });

        if (snipeData) {
            const { content, author, deletedAt } = snipeData;
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: author.tag, iconURL: author.displayAvatarURL({ dynamic: true }) })
                .setDescription(content)
                .setTimestamp(deletedAt);

            message.channel.send({ embeds: [embed] });
        } else {
            message.channel.send('No deleted messages to snipe.');
        }
    },
};