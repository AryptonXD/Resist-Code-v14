const { EmbedBuilder } = require("discord.js");
const emoji = require("../../emoji.js");

module.exports = {
  name: "unbanall",
  aliases: ["unball"],
  UserPerms: ['BanMembers'],
  BotPerms: ['BanMembers'],
  voteOnly: false,
  run: async (client, message, args) => {
    try {
      const bans = await message.guild.bans.fetch();

      if (bans.size === 0) {
        return message.channel.send({ content: `${emoji.util.cross} | An absence of individuals from restrictions in this server.` });
      }

      const unbannedUsers = [];

      for (const ban of bans.values()) {
        await message.guild.members.unban(ban.user.id);
        unbannedUsers.push(ban.user.tag);
      }

      await message.channel.send({ content: `${emoji.util.tick} | Revoked the restrictions for ${unbannedUsers.length} individuals` });
    } catch (e) {
      await message.channel.send(new EmbedBuilder().setDescription(e).setColor('ff0000'));
    }
  },
};
