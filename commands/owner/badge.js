const { EmbedBuilder } = require("discord.js");
const { BadgeAccess } = require('../../owner.json');
const emoji = require('../../emoji.js');
const Settings = require('../../settings.js');

const badges = [
  { name: "owner", emoji: `${emoji.badges.owner}`, displayName: "Owner" },
  { name: "dev", emoji: `${emoji.badges.dev}`, displayName: "Developer" },
  { name: "admin", emoji: `${emoji.badges.admin}`, displayName: "Admin" },
  { name: "staff", emoji: `${emoji.badges.staff}`, displayName: "Staff" },
  { name: "partner", emoji: `${emoji.badges.partner}`, displayName: "Partner" },
  { name: "supporter", emoji: `${emoji.badges.supporter}`, displayName: "Supporter" },
  { name: "sponsor", emoji: `${emoji.badges.sponsor}`, displayName: "Sponsor" },
  { name: "os", emoji: `${emoji.badges.os}`, displayName: "Owner Special" },
  { name: "vip", emoji: `${emoji.badges.vip}`, displayName: "VIP" },
  { name: "friend", emoji: `${emoji.badges.friend}`, displayName: "Friend" },
  { name: "bug", emoji: `${emoji.badges.bug}`, displayName: "Bug Hunter" }
];

function getBadge(badgeName) {
  return badges.find(badge => badge.name === badgeName);
}

async function addBadge(client, ID, badgeName) {
  const badge = getBadge(badgeName);
  if (badge) {
    const value = await client.db2.get(`${ID}_${badge.name}`);
    if (value) {
      return { success: false, message: `Already have ${badge.emoji} ${badge.displayName} badge`, badge };
    } else {
      await client.db2.set(`${ID}_${badge.name}`, true);
      return { success: true, message: badge.name, badge };
    }
  }
  return { success: false, message: "Invalid badge name", badge: null };
}

async function removeBadge(client, ID, badgeName) {
  const badge = getBadge(badgeName);
  if (badge) {
    const value = await client.db2.get(`${ID}_${badge.name}`);
    if (value) {
      await client.db2.delete(`${ID}_${badge.name}`);
      return { success: true, message: badge.name, badge };
    } else {
      return { success: false, message: `Not having ${badge.emoji} ${badge.displayName} badge`, badge };
    }
  }
  return { success: false, message: "Invalid badge name", badge: null };
}

async function addBadges(client, ID, badgeNames) {
  const addedBadges = [];
  for (const badgeName of badgeNames) {
    const result = await addBadge(client, ID, badgeName);
    if (result.success) {
      addedBadges.push(result.badge);
    }
  }
  return addedBadges;
}

async function removeBadges(client, ID, badgeNames) {
  const removedBadges = [];
  for (const badgeName of badgeNames) {
    const result = await removeBadge(client, ID, badgeName);
    if (result.success) {
      removedBadges.push(result.badge);
    }
  }
  return removedBadges;
}

module.exports = {
  name: "badge",
  aliases: ["badges", "bg", "b", "pr", "profile"],
  voteOnly: false,
  BotPerms: ['EmbedLinks'],
  run: async (client, message, args) => {
    if (args[0] === "add" || args[0] === "remove") {
      if (!BadgeAccess.includes(message.author.id)) {
        return;
      }

      const user = client.users.cache.get(args[1]) || message.mentions.members.first() || message.author;
      const ID = user.id;

      if (!args[0] || !args[2]) {
        const embed = new EmbedBuilder()
          .setColor("#ff0000")
          .setDescription("Invalid command usage. Please use the command in the following format:\n\n`badge add/remove <user> owner/admin/staff/etc.`");
        return message.channel.send({ embeds: [embed] });
      }

      if (!user) {
        const embed = new EmbedBuilder()
          .setColor("#ff0000")
          .setDescription("Prioritize mentioning the user or provide a valid user ID.");
        return message.channel.send({ embeds: [embed] });
      }

      const badgeNames = args.slice(2).map(arg => arg.toLowerCase());

      switch (args[0]) {
        case "add":
          if (badgeNames.includes("all")) {
            const successBadges = await addBadges(client, ID, badges.map(badge => badge.name));
            if (successBadges.length > 0) {
              const badgeDescriptions = successBadges.map(badge => `${badge.emoji} ${badge.displayName}`);
              const embed = new EmbedBuilder()
                .setTitle(`Added all badges to <@${ID}>`)
                .setColor(client.color)
                .setDescription(badgeDescriptions.join('\n'));
              await message.channel.send({ embeds: [embed] });
              const badgeuser = await client.users.fetch(ID);
              await client.channels.cache.get('1200059991349022730').send({ content: `Added all badges to \`${badgeuser.username}\`` })
            } else {
              await message.channel.send("No badges were added.");
            }
          } else {
            const successBadges = await addBadges(client, ID, badgeNames);
            if (successBadges.length > 0) {
              const badgeDescriptions = successBadges.map(badge => `${badge.emoji} ${badge.displayName}`);
              const embed = new EmbedBuilder()
                .setTitle(`Badges added to <@${ID}>`)
                .setColor(client.color)
                .setDescription(badgeDescriptions.join('\n'));
              await message.channel.send({ embeds: [embed] });
              const badgeuser = await client.users.fetch(ID);
              await client.channels.cache.get('1200059991349022730').send({ content: `Badges added to \`${badgeuser.username}\`\n${badgeDescriptions.join('\n')}` })
            } else {
              await message.channel.send("No badges were added.");
            }
          }
          break;

        case "remove":
          if (badgeNames.includes("all")) {
            const successBadges = await removeBadges(client, ID, badges.map(badge => badge.name));
            if (successBadges.length > 0) {
              const badgeDescriptions = successBadges.map(badge => `${badge.emoji} ${badge.displayName}`);
              const embed = new EmbedBuilder()
                .setTitle(`Removed all badges from <@${ID}>`)
                .setColor(client.color)
                .setDescription(badgeDescriptions.join('\n'));
              await message.channel.send({ embeds: [embed] });
              const badgeuser = await client.users.fetch(ID);
              await client.channels.cache.get('1200059991349022730').send({ content: `Removed all badges from \`${badgeuser.username}\`` })
            } else {
              await message.channel.send("No badges were removed.");
            }
          } else {
            const successBadges = await removeBadges(client, ID, badgeNames);
            if (successBadges.length > 0) {
              const badgeDescriptions = successBadges.map(badge => `${badge.emoji} ${badge.displayName}`);
              const embed = new EmbedBuilder()
                .setTitle(`Badges removed from <@${ID}>`)
                .setColor(client.color)
                .setDescription(badgeDescriptions.join('\n'));
              await message.channel.send({ embeds: [embed] });
              const badgeuser = await client.users.fetch(ID);
              await client.channels.cache.get('1200059991349022730').send({ content: `Badges removed from \`${badgeuser.username}\`\n${badgeDescriptions.join('\n')}` });
            } else {
              await message.channel.send("No badges were removed.");
            }
          }
          break;

        default:
          const embed = new EmbedBuilder()
            .setColor("#ff0000")
            .setDescription("Invalid command usage. Please use the command in the following format:\n\n`badge add/remove <user> owner/admin/staff/etc.`");
          return message.channel.send({ embeds: [embed] });
      }
    } else {
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[2]) || message.member;

      if (member) {
        const ID = member.user.id;
        const badgeFields = [];
        let hasBadges = false;

        for (const badge of badges) {
          if (await client.db2.get(`${ID}_${badge.name}`)) {
            badgeFields.push(`${badge.emoji}ㆍ${badge.displayName}`);
            hasBadges = true;
          }
        }

        if (!hasBadges) {
          badgeFields.push("No Badges :(");
          badgeFields.push(`Don't worry [Click Here](${Settings.bot.credits.supportServer}) to buy Bot's Premium and get some Badges :)`);
        }

        const embed = new EmbedBuilder()
          .setColor(client.color)
          .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
          .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
          .addFields(
            { name: '__*Badges*__', value: badgeFields.join('\n'), inline: true }
          );

        await message.channel.send({ embeds: [embed] });
      }
    }
  },
};
