const emoji = require('../../emoji.js');
const Settings = require('../../settings.js');

const cooldowns = new Map();
const UNHIDEALL_COOLDOWN = 60000;

module.exports = {
  name: "unhideall",
  UserPerms: ['ManageChannels'],
  BotPerms: ['EmbedLinks', 'ManageChannels'],
  voteOnly: true,
  run: async function (client, message, args) {

    let msg = await message.channel.send({ content: `${emoji.util.loading} | Your request is currently being processed. Please kindly await.` });

    const cooldownKey = `${message.author.id}_${this.name}`;
    const currentTime = Date.now();

    if (cooldowns.has(cooldownKey)) {
      const expirationTime = cooldowns.get(cooldownKey) + UNHIDEALL_COOLDOWN;
      if (currentTime < expirationTime) {
        const timeLeft = (expirationTime - currentTime) / 1000;
        return message.channel.send({ content: `${emoji.util.cross} | Please wait ${timeLeft.toFixed(1)} seconds before using the command again.` });
      }
    }

    cooldowns.set(cooldownKey, currentTime);
    setTimeout(() => cooldowns.delete(cooldownKey), UNHIDEALL_COOLDOWN);

    const channels = message.guild.channels.cache.filter(channel => channel.type === "GUILD_TEXT" || channel.type === "GUILD_VOICE");

    const unhiddenChannels = [];

    for (const [, channel] of channels) {
      if (channel.manageable) {
        await channel.permissionOverwrites.edit(message.guild.id, {
          ViewChannel: true,
          reason: `${message.author.tag} (${message.author.id})`,
        });
        unhiddenChannels.push(channel.name);
      }
    }
    setTimeout(() => {
      msg.edit({ content: `${emoji.util.tick} | Successfully unhidden all channels (${unhiddenChannels.length}).` });
    }, 5000);
  },
};
