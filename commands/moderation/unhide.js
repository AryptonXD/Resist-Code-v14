const emoji = require('../../emoji.js');

module.exports = {
  name: "unhide",
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

    await channel.permissionOverwrites.edit(message.guild.id, {
      ViewChannel: true,
      reason: `${message.author.tag} (${message.author.id})`,
    });

    let msg = await message.channel.send({ content: `${emoji.util.tick} | ${channel} has been successfully revealed to all users.` });
    setTimeout(() => {
      message.delete()
      msg.delete().catch(() => { });
    }, 5000);
  }
}
