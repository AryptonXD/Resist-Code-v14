const emoji = require('../../emoji.js');

module.exports = {
    name: 'afk',
    voteOnly: false,
    run: async (client, message, args) => {
        const data = await client.db13.get(`${message.author.id}_afk`);
        let afkReason = args.join(" ") || "I'm AFK ;-;";
        afkReason = sanitizeText(afkReason);
        const afkTime = Date.now();

        if (data) {
            return;
        } else {
            await client.db13.set(`${message.author.id}_afk`, {
                reason: afkReason,
                time: afkTime
            });
            return message.channel.send({ content: `${emoji.util.tick} | **${message.author.tag}**, Your AFK is now set to: ${afkReason}` });
        }
    }
}

function sanitizeText(text) {
    const sanitizedText = text.replace(/@(everyone|here|&[0-9]+)|https?:\/\/[^\s]+|discord\.gg\/[^\s]+/g, '');
    return sanitizedText;
}
