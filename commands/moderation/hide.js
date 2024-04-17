const emoji = require('../../emoji.js');

module.exports = {
  name: "hide",
  UserPerms: ['ManageChannels'],
  BotPerms: ['EmbedLinks', 'ManageChannels'],
  voteOnly: false,
  run: async function (client, message, args) {
    const channel = getChannel(message, args);

    if (channel.manageable) {
      await channel.permissionOverwrites.edit(message.guild.id, {
        ViewChannel: false,
        reason: `${message.author.tag} (${message.author.id})`,
      });

      let msg = await message.channel.send({ content: `${emoji.util.tick} | ${channel} has been concealed successfully for all users..` });
      setTimeout(() => {
        message.delete()
        msg.delete().catch(() => { });
      }, 5000);
    }
  },
};

function getChannel(message, args) {
  return (
    message.mentions.channels.first() ||
    message.guild.channels.cache.get(args[0]) ||
    message.channel
  );
}