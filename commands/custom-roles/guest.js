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

async function handleGuestCommand(client, message, args) {
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
      .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: null })
      .setDescription(
        `${emoji.util.cross} | You need to be either the Server Owner, Admin, or have the Required Role to execute this command.`
      )
      .setFooter({ text: client.user.tag, iconURL: client.user.displayAvatarURL() });

    return message.channel.send({ embeds: [embed] });
  }

  if (!args[0]) {
    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`Usage: ${prefix}guest <user>`);

    return message.channel.send({ embeds: [embed] });
  }

  const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
  if (!mentionedMember) {
    return message.channel.send({
      content: `${emoji.util.cross} | Please provide a valid user.`,
    });
  }

  const guestRole = await getRole(client, `guest_${message.guild.id}`);
  if (!guestRole) {
    await client.db3.set(`guest_${message.guild.id}`, null);

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`${emoji.util.cross} | **Guest Role** not found.`);

    return message.channel.send({ embeds: [embed] });
  }

  if (!message.guild.roles.cache.has(guestRole)) {
    await client.db3.set(`guest_${message.guild.id}`, null);

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`${emoji.util.cross} | Role not found in this Guild. Probably deleted!`);

    return message.channel.send({ embeds: [embed] });
  }

  const embed = new EmbedBuilder().setColor(client.color);

  const hasGuestRole = mentionedMember.roles.cache.has(guestRole);
  if (hasGuestRole) {
    mentionedMember.roles.remove(guestRole);
    embed.setDescription(`${emoji.util.tick} | Successfully removed <@&${guestRole}> from ${mentionedMember}`);
  } else {
    mentionedMember.roles.add(guestRole);
    embed.setDescription(`${emoji.util.tick} | Successfully added <@&${guestRole}> to ${mentionedMember}`);
  }

  message.channel.send({ embeds: [embed] });
}

module.exports = {
  name: "guest",
  category: "customroles",
  run: async (client, message, args) => {
    handleGuestCommand(client, message, args);
  },
};
