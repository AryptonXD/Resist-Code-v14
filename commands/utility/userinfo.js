const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, UserFlags } = require("discord.js");
const emoji = require('../../emoji.js');

module.exports = {
  name: "userinfo",
  aliases: ["whois", "user", "ui"],
  voteOnly: false,
  BotPerms: ['EmbedLinks'],
  run: async (client, message, args) => {
    const permissions = {
      AddReactions: "Add Reactions",
      Administrator: "Administrator",
      AttachFiles: "Attach files",
      BanMembers: "Ban members",
      ChangeNickname: "Change nickname",
      Connect: "Connect",
      CreateInstantInvite: "Create instant invite",
      CreatePrivateThreads: "Create private threads",
      CreatePublicThreads: "Create public threads",
      DeafenMembers: "Deafen members",
      EmbedLinks: "Embed links",
      KickMembers: "Kick members",
      ManageChannels: "Manage channels",
      ManageEmojisAndStickers: "Manage emojis and stickers",
      ManageEvents: "Manage Events",
      ManageGuild: "Manage server",
      ManageMessages: "Manage messages",
      ManageNicknames: "Manage nicknames",
      ManageRoles: "Manage roles",
      ManageThreads: "Manage Threads",
      ManageWebhooks: "Manage webhooks",
      MentionEveryone: "Mention everyone",
      ModerateMembers: "Moderate Members",
      MoveMembers: "Move members",
      MuteMembers: "Mute members",
      PrioritySpeaker: "Priority speaker",
      ReadMessageHistory: "Read message history",
      RequestToSpeak: "Request to Speak",
      SendMessages: "Send messages",
      SendMessagesInThreads: "Send Messages In Threads",
      SendTTSMessages: "Send TTS messages",
      Speak: "Speak",
      Stream: "Video",
      UseApplicationCommands: "Use Application Commands",
      UseEmbeddedActivities: "Use Embedded Activities",
      UseExternalEmojis: "Use External Emojis",
      UseExternalStickers: "Use External Stickers",
      UseVAD: "Use voice activity",
      ViewAuditLog: "View audit log",
      ViewChannel: "View channel",
      ViewGuildInsights: "View server insights",
    };

    const badgeNames = { "ActiveDeveloper": `${emoji.flag.activedev}`, "Staff": `${emoji.flag.staff}`, "PartneredServerOwner": `${emoji.flag.partner}`, "BugHunterLevel1": `${emoji.flag.bug1}`, "BugHunterLevel2": `${emoji.flag.bug2}`, "HypeSquadEvents": `${emoji.flag.hypesquad}`, "HypeSquadOnlineHouse1": `${emoji.flag.hype1}`, "HypeSquadOnlineHouse2": `${emoji.flag.hype2}`, "HypeSquadOnlineHouse3": `${emoji.flag.hype3}`, "PremiumEarlySupporter": `${emoji.badges.supporter}`, "VerifiedBot": `${emoji.flag.verifiedbot}`, "VerifiedDeveloper": `${emoji.flag.verifieddev}` };
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    const registrationDate = `<t:${Math.floor(member.user.createdAt / 1000)}:F> [<t:${Math.floor(member.user.createdAt / 1000)}:R>]`;
    const avatarURL = member.user.displayAvatarURL({ dynamic: true });
    const isAnimated = avatarURL.endsWith(".gif");
    const nick = member.user.nickname || "None";
    const roles = member.roles.cache;
    const roleCount = roles.size;
    const rolesText = roleCount > 20 ? "Too many roles to show" : (roles.map(role => role.name).join(', ') || "No Roles");
    const serverName = message.guild.name;
    const joinedDate = `<t:${Math.floor(member.joinedAt / 1000)}:F> [<t:${Math.floor(member.joinedAt / 1000)}:R>]`;
    const mentionPermissions = member.permissions.toArray() || [];
    const isServerOwner = message.guild.ownerId === member.id;
    const isAdmin = member.permissions.has("Administrator");
    const isBot = member.user.bot;
    let acknowledgementsText = "Server Member";
    if (isServerOwner) acknowledgementsText = "Server Owner";
    else if (isAdmin && !isBot) acknowledgementsText = "Server Admin";
    else if (isBot) acknowledgementsText = "Server Bot";
    const boosterStatus = member.premiumSince ? `${emoji.util.tick}` : `${emoji.util.cross}`;
    const boostingSince = member.premiumSince
      ? `<t:${Math.floor(member.premiumSince / 1000)}:F> [<t:${Math.floor(member.premiumSince / 1000)}:R>]`
      : "Not Boosting";
    let badges = member.user.flags.toArray().map((flag) => badgeNames[flag]).filter((name) => name !== 'undefined').join(` `) || 'None';
    const finalPermissions = Object.keys(permissions).filter(permission => mentionPermissions.includes(permission)).map(permission => permissions[permission]);

    const button1 = new ButtonBuilder()
      .setStyle('Success')
      .setCustomId('first')
      .setLabel('Account')
      .setDisabled(true);

    const button2 = new ButtonBuilder()
      .setStyle('Secondary')
      .setCustomId('second')
      .setLabel('Guild')
      .setDisabled(false);

    const button3 = new ButtonBuilder()
      .setStyle('Secondary')
      .setCustomId('third')
      .setLabel('Roles')
      .setDisabled(false);

    const button4 = new ButtonBuilder()
      .setStyle('Secondary')
      .setCustomId('fourth')
      .setLabel('Permissions')
      .setDisabled(false);

    const createRow = new ActionRowBuilder().addComponents(button1, button2, button3, button4);

    const createEmbed = (fields) => {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: member.user.tag, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

      fields.forEach((field) => {
        if (field.value) {
          embed.addFields({ name: field.name, value: field.value, inline: false });
        }
      });

      return embed;
    };


    const embed1 = createEmbed([
      { name: "General Information", value: `**Username:** ${member.user.username}\n**Display Name:** ${member.displayName}\n**ID:** ${member.id}\n**Registered:** ${registrationDate}\n**Is Bot?**: ${member.user.bot ? `${emoji.util.tick}` : `${emoji.util.cross}`}\n**Badges**: ${badges}` },
      { name: "__Profile Picture__", value: `**Animated**: ${isAnimated ? `${emoji.util.tick}` : `${emoji.util.cross}`}\n**Download**: [Click Me](${avatarURL})` }
    ]);

    const embed2 = createEmbed([
      { name: `Information in ${serverName}`, value: `**Joined**: ${joinedDate}\n**Nickname**: ${nick}\n**Booster**: ${boosterStatus}\n**Boosting Since**: ${boostingSince}\n**Acknowledgements**: ${acknowledgementsText}` }
    ]);

    const embed3 = createEmbed([
      { name: "__Role Info__", value: `**Highest Role**: ${member.roles.highest}\n**Roles**: ${rolesText}\n**Color**: ${member.displayHexColor}` }
    ]);

    const embed4 = createEmbed([
      { name: "__Permissions__", value: `${finalPermissions.join(', ')}` }
    ]);

    const messageComponent = await message.channel.send({ embeds: [embed1], components: [createRow] });

    const collector = messageComponent.createMessageComponentCollector({
      filter: (interaction) => {
        if (message.author.id === interaction.user.id) return true;
        else {
          interaction.reply({ content: `${emoji.util.cross} | This Pagination is not for you.`, ephemeral: true });
          return false;
        }
      },
      time: 600000,
      idle: 800000 / 2,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.isButton()) {
        switch (interaction.customId) {
          case "first":
            await button1.setDisabled(true).setStyle('Success');
            await button2.setDisabled(false).setStyle('Secondary');
            await button3.setDisabled(false).setStyle('Secondary');
            await button4.setDisabled(false).setStyle('Secondary');
            await interaction.update({ embeds: [embed1], components: [createRow] });
            break;
          case "second":
            await button1.setDisabled(false).setStyle('Secondary');
            await button2.setDisabled(true).setStyle('Success');
            await button3.setDisabled(false).setStyle('Secondary');
            await button4.setDisabled(false).setStyle('Secondary');
            await interaction.update({ embeds: [embed2], components: [createRow] });
            break;
          case "third":
            await button1.setDisabled(false).setStyle('Secondary');
            await button2.setDisabled(false).setStyle('Secondary');
            await button3.setDisabled(true).setStyle('Success');
            await button4.setDisabled(false).setStyle('Secondary');
            await interaction.update({ embeds: [embed3], components: [createRow] });
            break;
          case "fourth":
            await button1.setDisabled(false).setStyle('Secondary');
            await button2.setDisabled(false).setStyle('Secondary');
            await button3.setDisabled(false).setStyle('Secondary');
            await button4.setDisabled(true).setStyle('Success');
            await interaction.update({ embeds: [embed4], components: [createRow] });
            break;
        }
      }
    });

    collector.on("end", () => {
      button1.setDisabled(true);
      button2.setDisabled(true);
      button3.setDisabled(true);
      button4.setDisabled(true);
      messageComponent.edit({ components: [createRow] });
    });
  }
};
