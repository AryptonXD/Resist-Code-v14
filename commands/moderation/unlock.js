const emoji = require('../../emoji.js');
const { ChannelType } = require('discord.js');

module.exports = {
  name: "unlock",
  UserPerms: ['ManageChannels'],
  BotPerms: ['EmbedLinks', 'ManageChannels'],
  voteOnly: false,
  run: async function (client, message, args) {

    function getChannel(message, args) {
      return (
        message.mentions.channels.first() ||
        message.guild.channels.cache.get(args[0]) ||
        message.channel
      );
    }

    const channel = getChannel(message, args);

    if (channel.type === ChannelType.GuildVoice) {
      channel.permissionOverwrites.edit(message.guild.id, {
        Connect: true,
        reason: `${message.author.tag} (${message.author.id})`,
      });

      let msg = await message.channel.send({ content: `${emoji.util.tick} | ${channel} has been successfully unlocked for all users.` });
      setTimeout(() => {
        message.delete()
        msg.delete().catch(() => { });
      }, 5000);
    } else {
      channel.permissionOverwrites.edit(message.guild.id, {
        SendMessages: true,
        reason: `${message.author.tag} (${message.author.id})`,
      });

      let msg = await message.channel.send({ content: `${emoji.util.tick} | ${channel} has been successfully unlocked for all users.` });
      setTimeout(() => {
        message.delete()
        msg.delete().catch(() => { });
      }, 5000);
    }
  },
};
