const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const { ownerIDS } = require('../../owner.json');
const emoji = require('../../emoji.js');

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

async function getUserBadges(client, ID) {
  const userBadges = [];
  for (const badge of badges) {
    if (await client.db2.get(`${ID}_${badge.name}`)) {
      userBadges.push(badge);
    }
  }
  return userBadges;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('View badges of a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to view badges of')
        .setRequired(true)),
  voteOnly: false,
  async execute(client, interaction) {
    const userOption = interaction.options.getUser('user');

    if (!userOption) {
      await interaction.reply("Please specify a valid user.");
      return;
    }

    const user = userOption.user;
    const ID = userOption.id;

    const userBadges = await getUserBadges(client, ID);

    const badgeFields = userBadges.length > 0
      ? userBadges.map(badge => `${badge.emoji} ${badge.displayName}`)
      : ["No Badges :("];

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(userOption.displayAvatarURL({ dynamic: true }))
      .setAuthor({ name: userOption.tag, iconURL: userOption.displayAvatarURL({ dynamic: true }), url: null })
      .addFields({ name: '__*Badges*__', value: badgeFields.join('\n'), inline: true });

    await interaction.reply({ embeds: [embed] });
  },
};