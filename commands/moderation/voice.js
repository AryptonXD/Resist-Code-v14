const { EmbedBuilder } = require("discord.js");
const emoji = require('../../emoji.js');
const Settings = require('../../settings.js');
const owner = Settings.bot.credits.developerId;

module.exports = {
  name: 'voice',
  voteOnly: false,
  UserPerms: ['MuteMembers', 'DeafenMembers'],
  BotPerms: ['DeafenMembers', 'MuteMembers', 'EmbedLinks'],
  aliases: ["vc"],
  run: async (client, message, args) => {
    let prefix = await client.db8.get(`${message.guild.id}_prefix`) || Settings.bot.info.prefix;
    const arypton = await client.users.fetch(owner);
    const option = args[0];
    const channel = message.guild.channels.cache.get(args[0]) || message.member.voice.channel;
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    const mentionchannel = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: null })
      .setDescription(`Mention the channel first`);

    const mentionsomeone = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: null })
      .setDescription(`Mention someone first`);

    const guide = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: null })
      .addFields(
        { name: `${emoji.util.arrow} \`${prefix}voice muteall\``, value: "Mute all members in a voice channel", inline: false },
        { name: `${emoji.util.arrow} \`${prefix}voice unmuteall\``, value: "Unmute all members in a voice channel", inline: false },
        { name: `${emoji.util.arrow} \`${prefix}voice deafenall\``, value: "Deafen all members in a voice channel", inline: false },
        { name: `${emoji.util.arrow} \`${prefix}voice undeafenall\``, value: "Undeafen all members in a voice channel", inline: false },
        { name: `${emoji.util.arrow} \`${prefix}voice mute <user>\``, value: "Mute a member in a voice channel", inline: false },
        { name: `${emoji.util.arrow} \`${prefix}voice unmute <user>\``, value: "Unmute a member in a voice channel", inline: false },
        { name: `${emoji.util.arrow} \`${prefix}voice deafen <user>\``, value: "Deafen a member in a voice channel", inline: false },
        { name: `${emoji.util.arrow} \`${prefix}voice undeafen <user>\``, value: "Undeafen a member in a voice channel", inline: false }
      )
      .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    if (!option) {
      return message.channel.send({ embeds: [guide] });
    }

    async function muteAllMembers(channel) {
      const mentionedUsers = [];
      channel.members.forEach((member) => {
        member.voice.setMute(true);
        mentionedUsers.push(member);
      });
      const muteallWithMentions = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: null })
        .setDescription(`\`${channel.name}\` ${emoji.util.tick} All members in your channel have been muted`)
        .addFields({ name: "Muted Members:", value: mentionedUsers.map(user => user.toString()).join(", "), inline: true });
      message.channel.send({ embeds: [muteallWithMentions] });
    }

    async function unmuteAllMembers(channel) {
      const mentionedUsers = [];
      channel.members.forEach((member) => {
        member.voice.setMute(false);
        mentionedUsers.push(member);
      });
      const unmuteallWithMentions = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: null })
        .setDescription(`\`${channel.name}\` ${emoji.util.tick} All members in your channel have been unmuted`)
        .addFields({ name: "Unmuted Members:", value: mentionedUsers.map(user => user.toString()).join(", "), inline: true });
      message.channel.send({ embeds: [unmuteallWithMentions] });
    }

    async function deafenAllMembers(channel) {
      const mentionedUsers = [];
      channel.members.forEach((member) => {
        member.voice.setDeaf(true);
        mentionedUsers.push(member);
      });
      const deafallWithMentions = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: null })
        .setDescription(`\`${channel.name}\` ${emoji.util.tick} All members in your channel have been deafened`)
        .addFields({ name: "Deafened Members:", value: mentionedUsers.map(user => user.toString()).join(", "), inline: true });
      message.channel.send({ embeds: [deafallWithMentions] });
    }

    async function undeafenAllMembers(channel) {
      const mentionedUsers = [];
      channel.members.forEach((member) => {
        member.voice.setDeaf(false);
        mentionedUsers.push(member);
      });
      const undeafallWithMentions = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: null })
        .setDescription(`\`${channel.name}\` ${emoji.util.tick} All members in your channel have been undeafened`)
        .addFields({ name: "Undeafened Members:", value: mentionedUsers.map(user => user.toString()).join(", "), inline: true });
      message.channel.send({ embeds: [undeafallWithMentions] });
    }

    async function muteMember(member) {
      member.voice.setMute(true);
      const muteeWithMention = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: null })
        .setDescription(`${emoji.util.tick} | Member Muted: ${member}`);
      message.channel.send({ embeds: [muteeWithMention] });
    }

    async function unmuteMember(member) {
      member.voice.setMute(false);
      const unmuteeWithMention = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: null })
        .setDescription(`${emoji.util.tick} | Member Unmuted: ${member}`);
      message.channel.send({ embeds: [unmuteeWithMention] });
    }

    async function deafenMember(member) {
      member.voice.setDeaf(true);
      const deaffWithMention = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: null })
        .setDescription(`${emoji.util.tick} | Member Deafened: ${member}`);
      message.channel.send({ embeds: [deaffWithMention] });
    }

    async function undeafenMember(member) {
      member.voice.setDeaf(false);
      const undeaffWithMention = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL(), url: null })
        .setDescription(`${emoji.util.tick} | Member Undeafened: ${member}`);
      message.channel.send({ embeds: [undeaffWithMention] });
    }

    switch (option) {
      case 'muteall':
        if (!channel) {
          return message.channel.send({ embeds: [mentionchannel] });
        }
        await muteAllMembers(channel);
        break;

      case 'unmuteall':
        if (!channel) {
          return message.channel.send({ embeds: [mentionchannel] });
        }
        await unmuteAllMembers(channel);
        break;

      case 'deafenall':
        if (!channel) {
          return message.channel.send({ embeds: [mentionchannel] });
        }
        await deafenAllMembers(channel);
        break;

      case 'undeafenall':
        if (!channel) {
          return message.channel.send({ embeds: [mentionchannel] });
        }
        await undeafenAllMembers(channel);
        break;

      case 'mute':
        if (!member) {
          return message.channel.send({ embeds: [mentionsomeone] });
        }
        await muteMember(member);
        break;

      case 'unmute':
        if (!member) {
          return message.channel.send({ embeds: [mentionsomeone] });
        }
        await unmuteMember(member);
        break;

      case 'deafen':
        if (!member) {
          return message.channel.send({ embeds: [mentionsomeone] });
        }
        await deafenMember(member);
        break;

      case 'undeafen':
        if (!member) {
          return message.channel.send({ embeds: [mentionsomeone] });
        }
        await undeafenMember(member);
        break;

      default:
        return message.channel.send({ embeds: [guide] });
    }
  }
}
