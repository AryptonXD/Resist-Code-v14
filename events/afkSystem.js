const client = require('../index.js');

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const mentionedUsers = message.mentions.users;
    if (mentionedUsers.size > 0) {
        mentionedUsers.forEach(async (user) => {
            const mentionedUserAfkData = await client.db13.get(`${user.id}_afk`);
            if (mentionedUserAfkData) {
                const afkDurationInSeconds = Math.floor((Date.now() - mentionedUserAfkData.time) / 1000);
                const afkDuration = formatDuration(afkDurationInSeconds);

                const sanitizedReason = sanitizeText(mentionedUserAfkData.reason);
                message.channel.send({ content: `**${user.tag}**, went afk for ${afkDuration}: ${sanitizedReason}` });
            }
        });
    }

    const authorAfkData = await client.db13.get(`${message.author.id}_afk`);
    if (authorAfkData) {
        const afkDurationInSeconds = Math.floor((Date.now() - authorAfkData.time) / 1000);
        const afkDuration = formatDuration(afkDurationInSeconds);

        await client.db13.delete(`${message.author.id}_afk`);
        message.channel.send({ content: `Welcome back <@${message.author.id}>! You were AFK for ${afkDuration}` });
    }
});

function formatDuration(seconds) {
    const days = Math.floor(seconds / 86400);
    seconds -= days * 86400;
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    let duration = '';
    if (days > 0) {
        duration += `${days} day${days > 1 ? 's' : ''} `;
    }
    if (hours > 0) {
        duration += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
    if (minutes > 0) {
        duration += `${minutes} minute${minutes > 1 ? 's' : ''} `;
    }
    if (seconds > 0 || duration === '') {
        duration += `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }

    return duration;
}

function sanitizeText(text) {
    const sanitizedText = text.replace(/@(everyone|here|&[0-9]+)|https?:\/\/[^\s]+|discord\.gg\/[^\s]+/g, '');
    return sanitizedText;
}
