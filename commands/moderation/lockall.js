const emoji = require('../../emoji.js');
const { ChannelType } = require('discord.js');

const cooldowns = new Map();
const LOCKALL_COOLDOWN = 60000;

module.exports = {
  name: "lockall",
  UserPerms: ['ManageChannels'],
  BotPerms: ['EmbedLinks', 'ManageChannels'],
  voteOnly: true,
  run: async function (client, message, args) {

    let msg = await message.channel.send({ content: `${emoji.util.loading} | Your request is currently being processed. Please kindly await.` });

    const cooldownKey = `${message.author.id}_${this.name}`;
    const currentTime = Date.now();

    if (cooldowns.has(cooldownKey)) {
      const expirationTime = cooldowns.get(cooldownKey) + LOCKALL_COOLDOWN;
      if (currentTime < expirationTime) {
        const timeLeft = (expirationTime - currentTime) / 1000;
        return message.channel.send(`${emoji.util.cross} | Please wait ${timeLeft.toFixed(1)} seconds before using the command again.`);
      }
    }

    cooldowns.set(cooldownKey, currentTime);
    setTimeout(() => cooldowns.delete(cooldownKey), LOCKALL_COOLDOWN);

    const channels = message.guild.channels.cache;

    const lockedChannels = [];

    for (const [, channel] of channels) {
      if (channel.manageable) {
        await channel.permissionOverwrites.edit(message.guild.id, {
          SendMessages: false,
          Connect: false,
          reason: `${message.author.tag} (${message.author.id})`,
        });

        lockedChannels.push(channel.name);
      }
    }
    setTimeout(() => {
      msg.edit(`${emoji.util.tick} | Successfully locked all channels (${lockedChannels.length}).`);
    }, 5000);
  },
};
