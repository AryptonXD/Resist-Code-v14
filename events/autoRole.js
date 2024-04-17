const client = require('../index.js');
const { Events } = require('discord.js');

client.on(Events.GuildMemberAdd, async (member) => {
  const dbKey = `${member.guild.id}_autorole`;
  const data = await client.db1.get(dbKey);

  if (!data) {
    return;
  }

  const { role: { humans, bots } } = data;

  if (member.user.bot && bots.length > 0) {
    for (const botRoleID of bots) {
      const botRole = member.guild.roles.cache.get(botRoleID);
      if (!botRole) return;
      const botHighestRole = member.guild.members.me.roles.highest;
      const rolePosition = botRole.comparePositionTo(botHighestRole);
      if (botRole) {
        if (rolePosition >= 0) return;
        member.roles.add(botRole);
      }
    }
  } else if (!member.user.bot && humans.length > 0) {
    for (const humanRoleID of humans) {
      const humanRole = member.guild.roles.cache.get(humanRoleID);
      if (!humanRole) return;
      const botHighestRole = member.guild.members.me.roles.highest;
      const rolePosition = humanRole.comparePositionTo(botHighestRole);
      if (humanRole) {
        if (rolePosition >= 0) return;
        member.roles.add(humanRole);
      }
    }
  }
});
