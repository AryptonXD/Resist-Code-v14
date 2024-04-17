const { EmbedBuilder } = require('discord.js');
const Settings = require('../../settings.js');
const emoji = require('../../emoji.js');
const owner = Settings.bot.credits.developerId;

module.exports = {
  name: "setup",
  aliases: ['set', 'setuprole'],
  UserPerms: ['Administrator'],
  BotPerms: ['EmbedLinks'],
  voteOnly: true,
  aboveRole: true,
  run: async (client, message, args) => {
    const prefix = await getPrefix(client, message);
    const list = getList(args);
    const arypton = await client.users.fetch(owner);

    const guide = createGuideEmbed(client, prefix, arypton);

    if (!list) {
      const msg = await message.channel.send({ embeds: [guide] });
      return;
    }

    switch (list) {
      case 'reqrole':
        await handleRoleCommand(client, message, args, 'reqrole');
        break;
      case 'admin':
        await handleRoleCommand(client, message, args, 'admin');
        break;
      case 'official':
        await handleRoleCommand(client, message, args, 'official');
        break;
      case 'guest':
        await handleRoleCommand(client, message, args, 'guest');
        break;
      case 'girl':
        await handleRoleCommand(client, message, args, 'girl');
        break;
      case 'friend':
        await handleRoleCommand(client, message, args, 'friend');
        break;
      case 'vip':
        await handleRoleCommand(client, message, args, 'vip');
        break;
      case 'reset':
        await handleResetCommand(client, message);
        break;
      case 'config':
        await handleConfigCommand(client, message);
        break;
      case 'tag':
        await handleTagCommand(client, message, args);
        break;
      case 'stag':
        await handleStagCommand(client, message, args);
        break;
      default:
        const msg = await message.channel.send({ embeds: [guide] });
        break;
    }
  }
};

async function getPrefix(client, message) {
  let prefix = await client.db8.get(`${message.guild.id}_prefix`) || Settings.bot.info.prefix;
  return prefix;
}

async function getUser(client, userId) {
  const user = await client.users.fetch(userId);
  return user;
}

function getList(args) {
  const list = args[0];
  return list;
}

async function handleTagCommand(client, message, args) {
  const tagText = args.slice(1).join(' ');
  if (!tagText) {
    return message.channel.send('Provide a tag for the server.');
  }

  await client.db3.set(`tag_${message.guild.id}.Tag`, tagText);

  const embed = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(`${tagText} will now be considered as a tag for this server.`);

  message.channel.send({ embeds: [embed] });
}

async function handleStagCommand(client, message, args) {
  const stagText = args.slice(1).join(' ');
  if (!stagText) {
    return message.channel.send('Provide a stag for the server.');
  }

  await client.db3.set(`stag_${message.guild.id}.Stag`, stagText);

  const embed = new EmbedBuilder()
    .setColor(client.color)
    .setDescription(`${stagText} will now be considered as a stag for this server.`);

  message.channel.send({ embeds: [embed] });
}

function createGuideEmbed(client, prefix, arypton) {
  const guide = new EmbedBuilder()
    .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
    .setThumbnail(client.user.displayAvatarURL())
    .setColor(client.color)
    .addFields([
      {
        name: `${emoji.util.arrow} \`${prefix}setup config\``,
        value: 'Displays custom role settings for the server.',
        inline: false,
      },
      {
        name: `${emoji.util.arrow} \`${prefix}setup reset\``,
        value: 'Resets custom role settings for the server.',
        inline: false,
      },
      {
        name: `${emoji.util.arrow} \`${prefix}setup reqrole <role mention/id>\``,
        value: 'Sets up a required role for the server.',
        inline: false,
      },
      {
        name: `${emoji.util.arrow} \`${prefix}setup admin <role mention/id>\``,
        value: 'Sets up an admin role for the server.',
        inline: false,
      },
      {
        name: `${emoji.util.arrow} \`${prefix}setup official <role mention/id>\``,
        value: 'Sets up an official role for the server.',
        inline: false,
      },
      {
        name: `${emoji.util.arrow} \`${prefix}setup guest <role mention/id>\``,
        value: 'Sets up a guest role for the server.',
        inline: false,
      },
      {
        name: `${emoji.util.arrow} \`${prefix}setup girl <role mention/id>\``,
        value: 'Sets up a girl role for the server.',
        inline: false,
      },
      {
        name: `${emoji.util.arrow} \`${prefix}setup friend <role mention/id>\``,
        value: 'Sets up a friend role for the server.',
        inline: false,
      },
      {
        name: `${emoji.util.arrow} \`${prefix}setup vip <role mention/id>\``,
        value: 'Sets up a VIP role for the server.',
        inline: false,
      },
      {
        name: `${emoji.util.arrow} \`${prefix}setup tag <tag text>\``,
        value: 'Sets up a tag for the server.',
        inline: false,
      },
      {
        name: `${emoji.util.arrow} \`${prefix}setup stag <stag text>\``,
        value: 'Sets up a stag for the server.',
        inline: false,
      }
    ])
    .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

  return guide;
}

async function handleRoleCommand(client, message, args, roleType) {
  const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
  const customRole = message.guild.roles.cache.get(role.id);
  const botHighestRole = message.guild.members.me.roles.highest;
  const rolePosition = customRole.comparePositionTo(botHighestRole);
  if (!role) {
    return message.channel.send({ content: `${emoji.util.cross} | Role is missing in your argument.` });
  }
  if (rolePosition >= 0) {
    return message.channel.send({ content: `${emoji.util.cross} | The role has a higher position than the bot's role.` });;
  }

  const permissions = ['Administrator', 'ManageGuild', 'ManageRoles', 'ManageChannels', 'BanMembers', 'KickMembers'];
  if (permissions.some(p => role.permissions.has(p))) {
    const embed = new EmbedBuilder()
      .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: null })
      .setDescription(`${emoji.util.cross} | The mentioned role cannot be selected because it has dangerous permissions.`)
      .setColor(client.color);
    return message.channel.send({ embeds: [embed] });
  }

  await client.db3.set(`${roleType}_${message.guild.id}`, role.id);

  const embed = new EmbedBuilder()
    .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: null })
    .setDescription(`${emoji.util.tick} | Successfully added ${role} as the ${roleType} role.`)
    .setColor(client.color);

  message.channel.send({ embeds: [embed] });
}

async function handleResetCommand(client, message) {
  const roleKeys = ['reqrole', 'admin', 'official', 'guest', 'girl', 'friend', 'vip'];
  const guildId = message.guild.id;

  try {
    for (const key of roleKeys) {
      await client.db3.delete(`${key}_${guildId}`);
    }

    await client.db3.delete(`tag_${guildId}.Tag`);
    await client.db3.delete(`stag_${guildId}.Stag`);

    const embed = new EmbedBuilder()
      .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: null })
      .setDescription(`${emoji.util.tick} | Custom role, tag, and stag settings have been reset.`)
      .setColor(client.color);

    message.channel.send({ embeds: [embed] });
  } catch (error) {
    console.error("Error while resetting custom role, tag, and stag settings:", error);
    const embed = new EmbedBuilder()
      .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: null })
      .setDescription(`${emoji.util.cross} | An error occurred while resetting custom role, tag, and stag settings.`)
      .setColor(client.color);

    message.channel.send({ embeds: [embed] });
  }
}

async function handleConfigCommand(client, message) {
  const roleKeys = ['reqrole', 'admin', 'official', 'guest', 'girl', 'friend', 'vip'];
  const roles = await Promise.all(roleKeys.map(async (key) => {
    const roleId = await client.db3.get(`${key}_${message.guild.id}`) || "na";
    return roleId === "na" ? "`Nothing To Show`" : `<@&${roleId}>`;
  }));

  const tag = await client.db3.get(`tag_${message.guild.id}.Tag`) || 'Nothing to show';
  const stag = await client.db3.get(`stag_${message.guild.id}.Stag`) || 'Nothing to show';

  const embed = new EmbedBuilder()
    .setColor(client.color)
    .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: null })
    .setTitle("Custom Role and Tag Settings for this Server")
    .setThumbnail(client.user.displayAvatarURL())
    .addFields(
      { name: `${emoji.util.arrow} | Required Role`, value: roles[0], inline: false },
      { name: `${emoji.util.arrow} | Admin Role`, value: roles[1], inline: false },
      { name: `${emoji.util.arrow} | Official Role`, value: roles[2], inline: false },
      { name: `${emoji.util.arrow} | Guest Role`, value: roles[3], inline: false },
      { name: `${emoji.util.arrow} | Girl Role`, value: roles[4], inline: false },
      { name: `${emoji.util.arrow} | Friend Role`, value: roles[5], inline: false },
      { name: `${emoji.util.arrow} | VIP Role`, value: roles[6], inline: false },
      { name: `${emoji.util.arrow} | Tag`, value: tag, inline: false },
      { name: `${emoji.util.arrow} | Stag`, value: stag, inline: false }
    );

  message.channel.send({ embeds: [embed] });
}
