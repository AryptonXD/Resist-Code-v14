const { EmbedBuilder } = require("discord.js");
const emoji = require('../emoji.js');

const createEmbed = (client, ID, added, allGuilds) => {
  const description = added
    ? `${emoji.util.tick} | ${added} no prefix to <@${ID}> for ${allGuilds ? 'all guilds' : 'this guild'}`
    : `${emoji.util.cross} | Already ${added ? 'added' : 'removed'} no prefix to <@${ID}> for ${allGuilds ? 'all guilds' : 'this guild'}`;

  return new EmbedBuilder()
    .setColor("#2f3136")
    .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
    .setDescription(description);

};

module.exports = { createEmbed };
