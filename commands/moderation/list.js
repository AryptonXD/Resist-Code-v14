const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

module.exports = {
  name: "list",
  run: async (client, message, args) => {

    const firstButton = new ButtonBuilder()
      .setStyle("Primary")
      .setCustomId("first")
      .setLabel("≪")
      .setDisabled(true)
    const backButton = new ButtonBuilder()
      .setStyle("Success")
      .setCustomId("previous")
      .setLabel("Previous")
      .setDisabled(true)
    const cancelButton = new ButtonBuilder()
      .setStyle("Danger")
      .setCustomId("close")
      .setLabel("Close")
      .setDisabled(false)
    const nextButton = new ButtonBuilder()
      .setStyle("Success")
      .setCustomId("next")
      .setLabel("Next")
      .setDisabled(false)
    const lastButton = new ButtonBuilder()
      .setStyle("Primary")
      .setCustomId("last")
      .setLabel("≫")
      .setDisabled(false)

    const pag = new ActionRowBuilder().addComponents(firstButton, backButton, cancelButton, nextButton, lastButton);

    let currentPage = 0;
    let pageSize = 10;

    const listType = args[0]?.toLowerCase();

    const getListData = async () => {
      switch (listType) {
        case "admin":
        case "admins":
        case "administration":
          try {
            await message.guild.members.fetch();
            const administrators = message.guild.members.cache.filter((member) =>
              member.permissions.has("Administrator")
            );

            const response = {
              title: `Admins in ${message.guild.name}`,
              members: Array.from(administrators.values()),
              format: (member, index) =>
                `\`[${index + 1}]\` | [${member.user.tag}](https://discord.com/users/${member.user.id}) | [ID: [${member.user.id}](https://discord.com/users/${member.user.id})]`,
            };

            return {
              title: response.title,
              members: response.members.map((member, index) => response.format(member, index)),
            };
          } catch (error) {
            console.error("Error fetching members:", error);
            return {
              error: "Error fetching members. Please try again later.",
            };
          }

        case "bot":
        case "bots":
          await message.guild.members.fetch();
          const bots = message.guild.members.cache.filter((member) =>
            member.user.bot
          );

          return {
            title: `Bots in ${message.guild.name}`,
            members: Array.from(bots.values()),
            format: (member, index) => `\`[${index + 1}]\` | [${member.user.tag}](https://discord.com/users/${member.user.id}) | [ID: [${member.user.id}](https://discord.com/users/${member.user.id})]`,
          };
        case "ban":
        case "bans":
          const bannedMembers = await message.guild.bans.fetch();

          const validBannedMembers = bannedMembers
            .filter((ban) => ban.user !== null)
            .map((ban) => ban.user);

          return {
            title: `Banned Members in ${message.guild.name}`,
            members: validBannedMembers,
            format: (member, index) => `\`[${index + 1}]\` | [${member.tag}](https://discord.com/users/${member.id}) | [ID: [${member.id}](https://discord.com/users/${member.id})]`,
          };
        case "inrole":
        case "inroles":
          let roleId = args[1]?.replace(/[^0-9]/g, "");
          let role;

          if (roleId) {
            role = message.guild.roles.cache.get(roleId);
          } else {
            const roleMention = message.mentions.roles.first();

            if (roleMention) {
              role = roleMention;
            } else {
              return null;
            }
          }

          const membersWithRole = Array.from(role.members.values());

          return {
            title: `Members with ${role.name} Role in ${message.guild.name}`,
            members: membersWithRole,
            format: (member, index) => `\`[${index + 1}]\` | [${member.user.tag}](https://discord.com/users/${member.user.id}) | [ID: [${member.user.id}](https://discord.com/users/${member.user.id})]`,
          };
        case "boosters":
          await message.guild.members.fetch();
          const boosters = message.guild.premiumSubscriptionCount > 0
            ? message.guild.members.cache.filter((member) => member.premiumSinceTimestamp !== null)
            : new Map();

          const currentDate = new Date();

          return {
            title: `Boosters in ${message.guild.name}`,
            members: Array.from(boosters.values()),
            format: (member, index) => {
              const daysAgo = Math.floor((currentDate - member.premiumSinceTimestamp) / (1000 * 60 * 60 * 24));
              return `\`[${index + 1}]\` | [${member.user.tag}](https://discord.com/users/${member.user.id}) | [ID: [${member.user.id}](https://discord.com/users/${member.user.id})] | Boosted - \`${daysAgo} day(s) ago\``;
            },
          };
        case "emojis":
        case "emoji":
          const emojis = message.guild.emojis.cache;

          return {
            title: `Emojis in ${message.guild.name}`,
            members: Array.from(emojis.values()),
            format: (emoji, index) => `\`[${index + 1}]\` | ${emoji} | [ID: \`${emoji.toString()}\`]`,
          };

        case "roles":
        case "role":
          await message.guild.members.fetch();
          const roles = message.guild.roles.cache.filter((role) => role.name !== "@everyone")
            .sort((a, b) => b.position - a.position);

          return {
            title: `Roles in ${message.guild.name}`,
            members: Array.from(roles.values()),
            format: (role, index) => `\`[${index + 1}]\` | <@&${role.id}> | [${role.id}] - ${role.members.size} members`,
          };

        default:
          return null;
      }
    };

    const listData = await getListData();

    if (!listData) {
      return message.reply(
        "Invalid list type. Please provide 'admin', 'bot', 'ban', 'inrole <role name/ID/mention>', 'boosters', 'emojis', or 'roles'."
      );
    }

    const totalPages = Math.ceil(listData.members.length / pageSize);

    const generateEmbed = () => {
      const startIndex = currentPage * pageSize;
      const endIndex = Math.min(startIndex + pageSize, listData.members.length);
      const currentMembers = listData.members.slice(startIndex, endIndex);

      if (currentMembers.length === 0) {
        const embed = new EmbedBuilder()
          .setTitle(`${listData.title} - Page ${totalPages}`)
          .setDescription("No one is in the list.")
          .setColor(client.color);

        pag.components.forEach((button) => {
          button.setDisabled(true);
        });

        return embed;
      }

      const memberList = currentMembers
        .map((member, index) => listData.format(member, startIndex + index))
        .join("\n");

      const embed = new EmbedBuilder()
        .setTitle(`${listData.title} - Page ${currentPage + 1}/${totalPages}`)
        .setDescription(memberList)
        .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
        .setColor(client.color);

      return embed;
    };

    if (totalPages === 1) {
      pag.components.forEach((button) => {
        button.setDisabled(true);
      });
    }

    const sendMessage = async () => {
      const embed = generateEmbed();
      const messageComponent = await message.channel.send({
        embeds: [embed],
        components: [pag],
      });

      return messageComponent;
    };

    const messageComponent = await sendMessage();

    const collector = messageComponent.createMessageComponentCollector({
      filter: (interaction) => {
        if (message.author.id === interaction.user.id) return true;
        else {
          return interaction.reply({ content: `${emoji.util.cross} | This Pagination is not for you.`, ephemeral: true });
        }
      },
      time: 200000,
      idle: 300000 / 2,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.isButton()) {
        if (interaction.customId === "next") {
          if (currentPage < totalPages - 1) {
            currentPage++;
          }
        } else if (interaction.customId === "previous") {
          if (currentPage > 0) {
            currentPage--;
          }
        } else if (interaction.customId === "first") {
          currentPage = 0;
        } else if (interaction.customId === "last") {
          currentPage = totalPages - 1;
        } else if (interaction.customId === "close") {
          messageComponent.delete().catch((error) => {
            console.error("Failed to delete message:", error);
          });
          return;
        }

        const updatedEmbed = generateEmbed();

        if (currentPage === 0) {
          firstButton.setDisabled(true);
          backButton.setDisabled(true);
          nextButton.setDisabled(false);
          lastButton.setDisabled(false);
        } else if (currentPage === totalPages - 1) {
          firstButton.setDisabled(false);
          backButton.setDisabled(false);
          nextButton.setDisabled(true);
          lastButton.setDisabled(true);
        } else {
          firstButton.setDisabled(false);
          backButton.setDisabled(false);
          nextButton.setDisabled(false);
          lastButton.setDisabled(false);
        }

        interaction.update({ embeds: [updatedEmbed], components: [pag] });
      }
    });

    collector.on("end", async () => {
      const disabledPag = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle("Primary")
          .setCustomId("first")
          .setLabel("≪")
          .setDisabled(true),
        new ButtonBuilder()
          .setStyle("Success")
          .setCustomId("previous")
          .setLabel("Previous")
          .setDisabled(true),
        new ButtonBuilder()
          .setStyle("Danger")
          .setCustomId("close")
          .setLabel("Close")
          .setDisabled(true),
        new ButtonBuilder()
          .setStyle("Success")
          .setCustomId("next")
          .setLabel("Next")
          .setDisabled(true),
        new ButtonBuilder()
          .setStyle("Primary")
          .setCustomId("last")
          .setLabel("≫")
          .setDisabled(true)
      );

      messageComponent.edit({ components: [disabledPag] });
    });
  },
};
