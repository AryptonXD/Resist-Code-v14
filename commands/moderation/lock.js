const emoji = require('../../emoji.js');
const { ChannelType } = require('discord.js');

module.exports = {
  name: "lock",
  UserPerms: ['ManageChannels'],
  BotPerms: ['EmbedLinks', 'ManageChannels'],
  voteOnly: false,
  run: async function (client, message, args) {
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

    if (channel.type === ChannelType.GuildVoice) {
      channel.permissionOverwrites.edit(message.guild.id, {
        Connect: false,
        reason: `${message.author.tag} (${message.author.id})`,
      });

      let msg = await message.channel.send({ content: `${emoji.util.tick} | ${channel} has been securely locked for all users.` });
      setTimeout(() => {
        message.delete()
        msg.delete().catch(() => { });
      }, 5000);
    } else {
      channel.permissionOverwrites.edit(message.guild.id, {
        SendMessages: false,
        reason: `${message.author.tag} (${message.author.id})`,
      });

      const msg = await message.channel.send({ content: `${emoji.util.tick} | ${channel} has been securely locked for all users.` });
      setTimeout(() => {
        message.delete()
        msg.delete().catch(() => { });
      }, 5000);
    }
  },
};
