const { MessageEmbed } = require("discord.js");
const emoji = require('../../emoji.js');
const Settings = require('../../settings.js');

const cooldowns = new Map();
const UNLOCKALL_COOLDOWN = 60000;

module.exports = {
  name: "unlockall",
  UserPerms: ['ManageChannels'],
  BotPerms: ['EmbedLinks', 'ManageChannels'],
  voteOnly: true,
  run: async function (client, message, args) {

    let msg = await message.channel.send({ content: `${emoji.util.loading} | Your request is currently being processed. Please kindly await.` });

    const cooldownKey = `${message.author.id}_${this.name}`;
    const currentTime = Date.now();

    if (cooldowns.has(cooldownKey)) {
      const expirationTime = cooldowns.get(cooldownKey) + UNLOCKALL_COOLDOWN;
      if (currentTime < expirationTime) {
        const timeLeft = (expirationTime - currentTime) / 1000;
        return message.channel.send({ content: `${emoji.util.cross} | Please wait ${timeLeft.toFixed(1)} seconds before using the command again.` });
      }
    }

    cooldowns.set(cooldownKey, currentTime);
    setTimeout(() => cooldowns.delete(cooldownKey), UNLOCKALL_COOLDOWN);

    const channels = message.guild.channels.cache;

    const unlockedChannels = [];

    for (const [, channel] of channels) {
      if (channel.manageable) {
        await channel.permissionOverwrites.edit(message.guild.id, {
          SendMessages: null,
          Connect: null,
          reason: `${message.author.tag} (${message.author.id})`,
        });

        unlockedChannels.push(channel.name);
      }
    }
    setTimeout(() => {
      msg.edit({ content: `${emoji.util.tick} | Successfully unlocked all channels (${unlockedChannels.length}).` });
    }, 5000);
  },
};
