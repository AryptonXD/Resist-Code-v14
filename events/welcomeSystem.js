const client = require('../index.js');
const { EmbedBuilder } = require('discord.js');

client.on('guildMemberAdd', async (member) => {
  try {
    const messageWelcome = await client.db9.get(`${member.guild.id}_welcome_message1`);
    const embedWelcome = await client.db9.get(`${member.guild.id}_welcome_embed1`);
    if (messageWelcome) {
      const channelID = await client.db9.get(`${member.guild.id}_welcome_message1.channelID`);
      const channel = member.guild.channels.cache.get(channelID);
      if (!channel) {
        return;
      } else {
        let messageText = await client.db9.get(`${member.guild.id}_welcome_message1.message`);
        if (messageText !== undefined) {
          messageText = messageText.toString();
        }
        const placeholders = {
          '<<server.member_count>>': member.guild.memberCount,
          '<<server.name>>': member.guild.name,
          '<<user.name>>': member.user.username,
          '<<user.mention>>': member.user.toString(),
          '<<user.created_at>>': member.user.createdAt.toDateString(),
          '<<user.joined_at>>': member.joinedAt.toDateString(),
        };

        const replacePlaceholders = (text) => {
          for (const [placeholder, replacement] of Object.entries(placeholders)) {
            const regex = new RegExp(placeholder, 'g');
            text = text.replace(regex, replacement);
          }
          return text;
        };

        const messageReplaced = replacePlaceholders(messageText);

        await channel.send({ content: messageReplaced });
      }
    } else if (embedWelcome) {
      const channelID = await client.db9.get(`${member.guild.id}_welcome_embed1.channelID`);
      const channel = member.guild.channels.cache.get(channelID);
      if (!channel) {
        return;
      }

      let messageText = await client.db9.get(`${member.guild.id}_welcome_embed1.messageText`);
      if (messageText !== undefined) {
        messageText = messageText.toString();
      } else {
        messageText = null;
      }

      let authorText = await client.db9.get(`${member.guild.id}_welcome_embed1.authorText`);
      if (authorText !== undefined) {
        authorText = authorText.toString();
      } else {
        authorText = '';
      }

      let authorIcon = await client.db9.get(`${member.guild.id}_welcome_embed1.authorIcon`);
      if (authorIcon !== undefined) {
        authorIcon = member.user.displayAvatarURL({ dynamic: true });
      } else {
        authorIcon = null;
      }

      let title = await client.db9.get(`${member.guild.id}_welcome_embed1.title`);
      if (title !== undefined) {
        title = title.toString();
      } else {
        title = '';
      }

      let description = await client.db9.get(`${member.guild.id}_welcome_embed1.description`);
      if (description !== undefined) {
        description = description.toString();
      } else {
        description = 'Default Embed Description';
      }

      let color = await client.db9.get(`${member.guild.id}_welcome_embed1.color`);
      if (color === undefined) {
        color = client.color;
      }

      let image = await client.db9.get(`${member.guild.id}_welcome_embed1.image`);
      if (image !== undefined) {
        image = image;
      } else {
        image = null;
      }

      let thumbnail = await client.db9.get(`${member.guild.id}_welcome_embed1.thumbnail`);
      if (thumbnail !== undefined) {
        thumbnail = member.user.displayAvatarURL({ dynamic: true });
      } else {
        thumbnail = null;
      }

      let footerText = await client.db9.get(`${member.guild.id}_welcome_embed1.footerText`);
      if (footerText !== undefined) {
        footerText = footerText.toString();
      } else {
        footerText = '';
      }

      let footerIcon = await client.db9.get(`${member.guild.id}_welcome_embed1.footerIcon`);
      if (footerIcon !== undefined) {
        footerIcon = footerIcon;
      } else {
        footerIcon = null;
      }

      const placeholders = {
        '<<server.member_count>>': member.guild.memberCount,
        '<<server.name>>': member.guild.name,
        '<<user.name>>': member.user.username,
        '<<user.mention>>': member.user.toString(),
        '<<user.created_at>>': member.user.createdAt.toDateString(),
        '<<user.joined_at>>': member.joinedAt.toDateString(),
      };

      const replacePlaceholders = (text) => {
        for (const [placeholder, replacement] of Object.entries(placeholders)) {
          const regex = new RegExp(placeholder, 'g');
          text = text.replace(regex, replacement);
        }
        return text;
      };

      const messageReplaced = replacePlaceholders(messageText, placeholders);
      const authorReplaced = replacePlaceholders(authorText, placeholders);
      const titleReplaced = replacePlaceholders(title, placeholders);
      const descriptionReplaced = replacePlaceholders(description, placeholders);
      const footerReplaced = replacePlaceholders(footerText, placeholders);

      const guideEmbed = new EmbedBuilder()
        .setColor(color)
        .setAuthor({ name: authorReplaced, iconURL: authorIcon, url: null })
        .setTitle(titleReplaced)
        .setDescription(descriptionReplaced)
        .setThumbnail(thumbnail)
        .setImage(image)
        .setFooter({ text: footerReplaced, iconURL: footerIcon });

      await channel.send({ content: messageReplaced, embeds: [guideEmbed] });
    }
  } catch (error) {
    console.error(error);
  }
});

client.on('guildMemberAdd', async (member) => {
  try {
    const messageWelcome = await client.db9.get(`${member.guild.id}_welcome_message2`);
    const embedWelcome = await client.db9.get(`${member.guild.id}_welcome_embed2`);
    if (messageWelcome) {
      const channelID = await client.db9.get(`${member.guild.id}_welcome_message2.channelID`);
      const channel = member.guild.channels.cache.get(channelID);
      if (!channel) {
        return;
      } else {
        let messageText = await client.db9.get(`${member.guild.id}_welcome_message2.message`);
        if (messageText !== undefined) {
          messageText = messageText.toString();
        }
        const placeholders = {
          '<<server.member_count>>': member.guild.memberCount,
          '<<server.name>>': member.guild.name,
          '<<user.name>>': member.user.username,
          '<<user.mention>>': member.user.toString(),
          '<<user.created_at>>': member.user.createdAt.toDateString(),
          '<<user.joined_at>>': member.joinedAt.toDateString(),
        };

        const replacePlaceholders = (text) => {
          for (const [placeholder, replacement] of Object.entries(placeholders)) {
            const regex = new RegExp(placeholder, 'g');
            text = text.replace(regex, replacement);
          }
          return text;
        };

        const messageReplaced = replacePlaceholders(messageText);

        await channel.send({ content: messageReplaced });
      }
    } else if (embedWelcome) {
      const channelID = await client.db9.get(`${member.guild.id}_welcome_embed2.channelID`);
      const channel = member.guild.channels.cache.get(channelID);
      if (!channel) {
        return;
      }

      let messageText = await client.db9.get(`${member.guild.id}_welcome_embed2.messageText`);
      if (messageText !== undefined) {
        messageText = messageText.toString();
      } else {
        messageText = null;
      }

      let authorText = await client.db9.get(`${member.guild.id}_welcome_embed2.authorText`);
      if (authorText !== undefined) {
        authorText = authorText.toString();
      } else {
        authorText = '';
      }

      let authorIcon = await client.db9.get(`${member.guild.id}_welcome_embed2.authorIcon`);
      if (authorIcon !== undefined) {
        authorIcon = member.user.displayAvatarURL({ dynamic: true });
      } else {
        authorIcon = null;
      }

      let title = await client.db9.get(`${member.guild.id}_welcome_embed2.title`);
      if (title !== undefined) {
        title = title.toString();
      } else {
        title = '';
      }

      let description = await client.db9.get(`${member.guild.id}_welcome_embed2.description`);
      if (description !== undefined) {
        description = description.toString();
      } else {
        description = 'Default Embed Description';
      }

      let color = await client.db9.get(`${member.guild.id}_welcome_embed2.color`);
      if (color === undefined) {
        color = client.color;
      }

      let image = await client.db9.get(`${member.guild.id}_welcome_embed2.image`);
      if (image !== undefined) {
        image = image;
      } else {
        image = null;
      }

      let thumbnail = await client.db9.get(`${member.guild.id}_welcome_embed2.thumbnail`);
      if (thumbnail !== undefined) {
        thumbnail = member.user.displayAvatarURL({ dynamic: true });
      } else {
        thumbnail = null;
      }

      let footerText = await client.db9.get(`${member.guild.id}_welcome_embed2.footerText`);
      if (footerText !== undefined) {
        footerText = footerText.toString();
      } else {
        footerText = '';
      }

      let footerIcon = await client.db9.get(`${member.guild.id}_welcome_embed2.footerIcon`);
      if (footerIcon !== undefined) {
        footerIcon = footerIcon;
      } else {
        footerIcon = null;
      }

      const placeholders = {
        '<<server.member_count>>': member.guild.memberCount,
        '<<server.name>>': member.guild.name,
        '<<user.name>>': member.user.username,
        '<<user.mention>>': member.user.toString(),
        '<<user.created_at>>': member.user.createdAt.toDateString(),
        '<<user.joined_at>>': member.joinedAt.toDateString(),
      };

      const replacePlaceholders = (text) => {
        for (const [placeholder, replacement] of Object.entries(placeholders)) {
          const regex = new RegExp(placeholder, 'g');
          text = text.replace(regex, replacement);
        }
        return text;
      };

      const messageReplaced = replacePlaceholders(messageText, placeholders);
      const authorReplaced = replacePlaceholders(authorText, placeholders);
      const titleReplaced = replacePlaceholders(title, placeholders);
      const descriptionReplaced = replacePlaceholders(description, placeholders);
      const footerReplaced = replacePlaceholders(footerText, placeholders);

      const guideEmbed = new EmbedBuilder()
        .setColor(color)
        .setAuthor({ name: authorReplaced, iconURL: authorIcon, url: null })
        .setTitle(titleReplaced)
        .setDescription(descriptionReplaced)
        .setThumbnail(thumbnail)
        .setImage(image)
        .setFooter({ text: footerReplaced, iconURL: footerIcon });

      await channel.send({ content: messageReplaced, embeds: [guideEmbed] });
    }
  } catch (error) {
    console.error(error);
  }
});

client.on('guildMemberAdd', async (member) => {
  try {
    const messageWelcome = await client.db9.get(`${member.guild.id}_welcome_message3`);
    const embedWelcome = await client.db9.get(`${member.guild.id}_welcome_embed3`);
    if (messageWelcome) {
      const channelID = await client.db9.get(`${member.guild.id}_welcome_message3.channelID`);
      const channel = member.guild.channels.cache.get(channelID);
      if (!channel) {
        return;
      } else {
        let messageText = await client.db9.get(`${member.guild.id}_welcome_message3.message`);
        if (messageText !== undefined) {
          messageText = messageText.toString();
        }
        const placeholders = {
          '<<server.member_count>>': member.guild.memberCount,
          '<<server.name>>': member.guild.name,
          '<<user.name>>': member.user.username,
          '<<user.mention>>': member.user.toString(),
          '<<user.created_at>>': member.user.createdAt.toDateString(),
          '<<user.joined_at>>': member.joinedAt.toDateString(),
        };

        const replacePlaceholders = (text) => {
          for (const [placeholder, replacement] of Object.entries(placeholders)) {
            const regex = new RegExp(placeholder, 'g');
            text = text.replace(regex, replacement);
          }
          return text;
        };

        const messageReplaced = replacePlaceholders(messageText);

        await channel.send({ content: messageReplaced });
      }
    } else if (embedWelcome) {
      const channelID = await client.db9.get(`${member.guild.id}_welcome_embed3.channelID`);
      const channel = member.guild.channels.cache.get(channelID);
      if (!channel) {
        return;
      }

      let messageText = await client.db9.get(`${member.guild.id}_welcome_embed3.messageText`);
      if (messageText !== undefined) {
        messageText = messageText.toString();
      } else {
        messageText = null;
      }

      let authorText = await client.db9.get(`${member.guild.id}_welcome_embed3.authorText`);
      if (authorText !== undefined) {
        authorText = authorText.toString();
      } else {
        authorText = '';
      }

      let authorIcon = await client.db9.get(`${member.guild.id}_welcome_embed3.authorIcon`);
      if (authorIcon !== undefined) {
        authorIcon = member.user.displayAvatarURL({ dynamic: true });
      } else {
        authorIcon = null;
      }

      let title = await client.db9.get(`${member.guild.id}_welcome_embed3.title`);
      if (title !== undefined) {
        title = title.toString();
      } else {
        title = '';
      }

      let description = await client.db9.get(`${member.guild.id}_welcome_embed3.description`);
      if (description !== undefined) {
        description = description.toString();
      } else {
        description = 'Default Embed Description';
      }

      let color = await client.db9.get(`${member.guild.id}_welcome_embed3.color`);
      if (color === undefined) {
        color = client.color;
      }

      let image = await client.db9.get(`${member.guild.id}_welcome_embed3.image`);
      if (image !== undefined) {
        image = image;
      } else {
        image = null;
      }

      let thumbnail = await client.db9.get(`${member.guild.id}_welcome_embed3.thumbnail`);
      if (thumbnail !== undefined) {
        thumbnail = member.user.displayAvatarURL({ dynamic: true });
      } else {
        thumbnail = null;
      }

      let footerText = await client.db9.get(`${member.guild.id}_welcome_embed3.footerText`);
      if (footerText !== undefined) {
        footerText = footerText.toString();
      } else {
        footerText = '';
      }

      let footerIcon = await client.db9.get(`${member.guild.id}_welcome_embed3.footerIcon`);
      if (footerIcon !== undefined) {
        footerIcon = footerIcon;
      } else {
        footerIcon = null;
      }

      const placeholders = {
        '<<server.member_count>>': member.guild.memberCount,
        '<<server.name>>': member.guild.name,
        '<<user.name>>': member.user.username,
        '<<user.mention>>': member.user.toString(),
        '<<user.created_at>>': member.user.createdAt.toDateString(),
        '<<user.joined_at>>': member.joinedAt.toDateString(),
      };

      const replacePlaceholders = (text) => {
        for (const [placeholder, replacement] of Object.entries(placeholders)) {
          const regex = new RegExp(placeholder, 'g');
          text = text.replace(regex, replacement);
        }
        return text;
      };

      const messageReplaced = replacePlaceholders(messageText, placeholders);
      const authorReplaced = replacePlaceholders(authorText, placeholders);
      const titleReplaced = replacePlaceholders(title, placeholders);
      const descriptionReplaced = replacePlaceholders(description, placeholders);
      const footerReplaced = replacePlaceholders(footerText, placeholders);

      const guideEmbed = new EmbedBuilder()
        .setColor(color)
        .setAuthor({ name: authorReplaced, iconURL: authorIcon, url: null })
        .setTitle(titleReplaced)
        .setDescription(descriptionReplaced)
        .setThumbnail(thumbnail)
        .setImage(image)
        .setFooter({ text: footerReplaced, iconURL: footerIcon });

      await channel.send({ content: messageReplaced, embeds: [guideEmbed] });
    }
  } catch (error) {
    console.error(error);
  }
});
