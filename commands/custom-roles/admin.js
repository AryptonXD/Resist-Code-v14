const { EmbedBuilder } = require('discord.js');
const st = require('../../settings').bot;
const { ownerIDS } = require('../../owner.json');
const emoji = require('../../emoji.js');

async function getPrefix(client, message) {
  let prefix = await client.db8.get(`prefix_${message.guild.id}`);
  if (!prefix) prefix = st.info.prefix;
  return prefix;
}

async function getRole(client, key) {
  const role = await client.db3.get(key);
  return role;
}

const dangerousPermissions = [
  'Administrator',
  'ManageGuild',
  'ManageRoles',
  'ManageChannels',
  'BanMembers',
  'KickMembers'
];

async function handleAdminCommand(client, message, args) {
  const prefix = await getPrefix(client, message);
  const requiredRole = await client.db3.get(`reqrole_${message.guild.id}`);
  const data = await client.db11.get(`${message.guild.id}_eo`);
  const data1 = await client.db11.get(`${message.guild.id}_ea`);
  const extraOwner = data.extraownerlist || [];
  const extraAdmin = data1.extraadminlist || [];

  const Reqrole = message.guild.roles.cache.get(requiredRole);

  if (!Reqrole || !requiredRole) {
    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(
        `${emoji.util.cross} | Required Role is missing. Please set up the **Required Role** first.`
      )
      .setFooter({ text: `${prefix}setup reqrole <role mention/id>` });

    return message.channel.send({ embeds: [embed] });
  }

  if (!extraOwner.includes(message.author.id) && !extraAdmin.includes(message.author.id) && !message.guild.ownerId.includes(message.author.id) && !message.member.permissions.has('ADMINISTRATOR') && !ownerIDS.includes(message.author.id) && !message.member.roles.cache.has(requiredRole)) {
    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
      .setDescription(`${emoji.util.cross} | You need to be either the Server Owner, Admin or have the Required Role to execute this command.`)
      .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() });

    return message.channel.send({ embeds: [embed] });
  }

  if (!args[0]) {
    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`Usage: ${prefix}admin <user>`);

    return message.channel.send({ embeds: [embed] });
  }

  const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
  if (!mentionedMember) {
    return message.channel.send({ content: `${emoji.util.cross} | Please provide a valid user.` });
  }

  const adminRole = await getRole(client, `admin_${message.guild.id}`);
  if (!adminRole) {
    await client.db3.set(`admin_${message.guild.id}`, null);

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`${emoji.util.cross} | **Admin Role** not found.`);

    return message.channel.send({ embeds: [embed] });
  }

  if (!message.guild.roles.cache.has(adminRole)) {
    await client.db3.set(`admin_${message.guild.id}`, null);

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`${emoji.util.cross} | Role not found in this Guild. Probably deleted!`);

    return message.channel.send({ embeds: [embed] });
  }

  const role = message.guild.roles.cache.get(adminRole);
  if (!role) {
    await client.db3.set(`admin_${message.guild.id}`, null);

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`${emoji.util.cross} | Role not found in this Guild. Probably deleted!`);

    return message.channel.send({ embeds: [embed] });
  }

  const rolePermissions = role.permissions?.toArray() || [];
  if (rolePermissions.some(permission => dangerousPermissions.includes(permission))) {
    const dangerousPermissionsList = rolePermissions.filter(permission => dangerousPermissions.includes(permission));
    const permissionsString = dangerousPermissionsList.join(", ");

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
      .setDescription(`${emoji.util.cross} | The mentioned role cannot be added because it contains the following dangerous permissions: ${permissionsString}.`)
      .setFooter(client.user.tag, client.user.displayAvatarURL());

    return message.channel.send({ embeds: [embed] });
  }

  const embed = new EmbedBuilder().setColor(client.color);

  const hasAdminRole = mentionedMember.roles.cache.has(adminRole);
  if (hasAdminRole) {
    mentionedMember.roles.remove(adminRole);
    embed.setDescription(`${emoji.util.tick} | Successfully removed <@&${adminRole}> from ${mentionedMember}`);
  } else {
    mentionedMember.roles.add(adminRole);
    embed.setDescription(`${emoji.util.tick} | Successfully added <@&${adminRole}> to ${mentionedMember}`);
  }

  message.channel.send({ embeds: [embed] });
}

module.exports = {
  name: "admin",
  category: 'customroles',
  run: async (client, message, args) => {
    handleAdminCommand(client, message, args);
  }
}
