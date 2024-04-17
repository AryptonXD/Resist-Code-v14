const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const client = require('../index.js');

const roleData = {
  'Notifications': [
    { name: 'Announcement', id: '1139937079841792100' },
    { name: 'Updates', id: '1139937080328323287' },
  ],
  'Languages': [
    { name: 'Python', id: '1139937081695686677' },
    { name: 'Javascript', id: '1139937082538721421' },
    { name: 'Java', id: '1139937083922862180' },
    { name: 'C++', id: '1139937084371644548' },
    { name: 'HTML', id: '1139937085416022118' },
  ],
  'Age': [
    { name: 'Above 18', id: '1139937086808522862' },
    { name: 'Below 18', id: '1139937088087793675' },
  ],
  'Gender': [
    { name: 'Male', id: '1139937089685815306' },
    { name: 'Female', id: '1139937090981859389' },
    { name: 'Others', id: '1139937092063997992' },
  ],
};

client.on('messageCreate', async (message) => {
  if (message.guild.id !== `1052124710080630824`) return;
  if (message.content === '.selfroles') {
    const guild = message.guild;
    const embeds = [];

    for (const category in roleData) {
      const categoryRoles = roleData[category];

      for (const role of categoryRoles) {
        const memberCount = await guild.members.fetch().then((members) => {
          return members.filter((member) => member.roles.cache.has(role.id)).size;
        });
        role.memberCount = memberCount;
      }

      const roleButtons = categoryRoles.map((role) => {
        return new ButtonBuilder()
          .setCustomId(role.id)
          .setLabel(`${role.name} - ${role.memberCount}`)
          .setStyle('Secondary');
      });

      const buttonActionRows = [];
      while (roleButtons.length > 0) {
        const rowButtons = roleButtons.splice(0, 5);
        const buttonActionRow = new ActionRowBuilder().addComponents(rowButtons);
        buttonActionRows.push(buttonActionRow);
      }

      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setTitle(`__**Resist's ${category}**__`)
        .setDescription(`${categoryRoles.map(role => `<:onelove_stolen_emoji:1188807069042749450> React on **${role.name}** for <@&${role.id}>`).join('\n')}`)
        .setThumbnail(message.guild.iconURL())
        .setFooter({ text: `Select your ${category} Role`, iconURL: `${guild.iconURL({ dynamic: true })}` });

      embeds.push({ embeds: [embed], components: buttonActionRows });
    }

    for (const embed of embeds) {
      const sentMessage = await message.channel.send(embed);
      for (const component of embed.components[0].components) {
        component.interactionID = sentMessage.id;
      }
    }
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  const selectedRoleID = interaction.customId;
  const selectedRole = findRoleByID(selectedRoleID);

  if (selectedRole) {
    const member = interaction.member;
    if (member) {
      const guild = interaction.guild;
      const roleToAdd = guild.roles.cache.get(selectedRoleID);
      if (roleToAdd) {
        try {
          const hasRole = member.roles.cache.has(selectedRoleID);
          if (hasRole) {
            await member.roles.remove(roleToAdd);
            await interaction.reply({ ephemeral: true, content: `Removed <@&${selectedRoleID}> from <@${member.user.id}>` });
          } else {
            await member.roles.add(roleToAdd);
            await interaction.reply({ ephemeral: true, content: `Added <@&${selectedRoleID}> to <@${member.user.id}>` });
          }

          const memberCount = await guild.members.fetch().then((members) => {
            return members.filter((member) => member.roles.cache.has(selectedRoleID)).size;
          });
          selectedRole.memberCount = memberCount;

          const buttonLabel = `${selectedRole.name} - ${selectedRole.memberCount}`;

          interaction.message.components = interaction.message.components.map((actionRow) => {
            const newComponents = actionRow.components.map((btn) => {
              if (btn.customId === selectedRoleID) {
                const newBtn = new ButtonBuilder()
                  .setCustomId(btn.customId)
                  .setLabel(buttonLabel)
                  .setStyle(btn.style);
                return newBtn;
              }
              return btn;
            });

            return new ActionRowBuilder().addComponents(newComponents);
          });

          await interaction.message.edit({ content: null, components: interaction.message.components });

        } catch (error) {
          console.error(`Failed to modify roles for ${member.user.tag}:`, error);
          await interaction.reply({ ephemeral: true, content: 'An error occurred while modifying roles.' });
        }
      } else {
        await interaction.reply({ ephemeral: true, content: 'The role could not be found.' });
      }
    }
  }
});

function findRoleByID(roleID) {
  for (const category in roleData) {
    const categoryRoles = roleData[category];
    const foundRole = categoryRoles.find((role) => role.id === roleID);
    if (foundRole) {
      return foundRole;
    }
  }
  return null;
}
