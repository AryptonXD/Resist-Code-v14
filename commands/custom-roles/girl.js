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

async function handleGirlCommand(client, message, args) {
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
      .setDescription(`Usage: ${prefix}girl <user>`);

    return message.channel.send({ embeds: [embed] });
  }

  const mentionedMember = message.mentions.members.first() || message.guild.members.cache.get(args[0])
  if (!mentionedMember) {
    return message.channel.send({
      content: `${emoji.util.cross} | Please provide a valid user.`,
    });
  }

  const girlRole = await getRole(client, `girl_${message.guild.id}`);
  if (!girlRole) {
    await client.db3.set(`girl_${message.guild.id}`, null);

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`${emoji.util.cross} | **Girl Role** not found.`);

    return message.channel.send({ embeds: [embed] });
  }

  if (!message.guild.roles.cache.has(girlRole)) {
    await client.db3.set(`girl_${message.guild.id}`, null);

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setDescription(`${emoji.util.cross}> | Role not found in this Guild. Probably deleted!`);

    return message.channel.send({ embeds: [embed] });
  }

  const embed = new EmbedBuilder().setColor(client.color);

  const hasGirlRole = mentionedMember.roles.cache.has(girlRole);
  if (hasGirlRole) {
    mentionedMember.roles.remove(girlRole);
    embed.setDescription(`${emoji.util.tick} | Successfully removed <@&${girlRole}> from ${mentionedMember}`);
  } else {
    mentionedMember.roles.add(girlRole);
    embed.setDescription(`${emoji.util.tick} | Successfully added <@&${girlRole}> to ${mentionedMember}`);
  }

  message.channel.send({ embeds: [embed] });
}

module.exports = {
  name: "girl",
  category: "customroles",
  run: async (client, message, args) => {
    handleGirlCommand(client, message, args);
  },
};
