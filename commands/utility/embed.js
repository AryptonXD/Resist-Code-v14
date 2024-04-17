const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const Discord = require('discord.js');
const Settings = require('../../settings.js');

module.exports = {
  name: 'embed',
  UserPerms: ['ManageMessages'],
  BotPerms: ['EmbedLinks'],
  VoteOnly: true,
  run: async (client, message, args) => {
    let prefix = await client.db8.get(`${message.guild.id}_prefix`) || Settings.bot.info.prefix;

    const bodyEmbed = new ButtonBuilder()
      .setStyle(2)
      .setLabel('Body')
      .setCustomId('body_embed');

    const titleEmbed = new ButtonBuilder()
      .setStyle(2)
      .setLabel('Title')
      .setCustomId('title_embed');

    const descriptionEmbed = new ButtonBuilder()
      .setStyle(2)
      .setLabel('Description')
      .setCustomId('description_embed');

    const thumbnailEmbed = new ButtonBuilder()
      .setStyle(2)
      .setLabel('Thumbnail')
      .setCustomId('thumbnail_embed');

    const imageEmbed = new ButtonBuilder()
      .setStyle(2)
      .setLabel('Image')
      .setCustomId('image_embed');

    const footerTextEmbed = new ButtonBuilder()
      .setStyle(2)
      .setLabel('Footer Text')
      .setCustomId('footer_text_embed');

    const footerIconEmbed = new ButtonBuilder()
      .setStyle(2)
      .setLabel('Footer Icon')
      .setCustomId('footer_icon_embed');

    const colorEmbed = new ButtonBuilder()
      .setStyle(2)
      .setLabel('Color')
      .setCustomId('color_embed');

    const authorTextEmbed = new ButtonBuilder()
      .setStyle(2)
      .setLabel('Author Text')
      .setCustomId('author_text_embed');

    const authorIconEmbed = new ButtonBuilder()
      .setStyle(2)
      .setLabel('Author Icon')
      .setCustomId('author_icon_embed');

    const defaultEmbed = new ButtonBuilder()
      .setStyle(1)
      .setLabel('Default')
      .setCustomId('default_embed');

    const previewButton = new ButtonBuilder()
      .setStyle(2)
      .setLabel('Preview')
      .setCustomId('preview_embed');

    const sendButton = new ButtonBuilder()
      .setStyle(3)
      .setLabel('Send')
      .setCustomId('send_embed');

    const abortButton = new ButtonBuilder()
      .setStyle(4)
      .setLabel('Abort')
      .setCustomId('abort_embed');

    const backEmbed = new ButtonBuilder()
      .setStyle(3)
      .setLabel('Back')
      .setCustomId('back_embed');

    const channelSend = new ButtonBuilder()
      .setStyle(2)
      .setLabel('Channel')
      .setCustomId('channel_send');

    const webhookSend = new ButtonBuilder()
      .setStyle(2)
      .setLabel('Webhook')
      .setCustomId('webhook_send');

    const button1 = new ActionRowBuilder().addComponents(bodyEmbed, previewButton, sendButton, abortButton);
    const button2 = new ActionRowBuilder().addComponents(authorTextEmbed, authorIconEmbed, titleEmbed, descriptionEmbed, thumbnailEmbed);
    const button3 = new ActionRowBuilder().addComponents(imageEmbed, footerTextEmbed, footerIconEmbed, colorEmbed, defaultEmbed);
    const button4 = new ActionRowBuilder().addComponents(backEmbed);
    const button5 = new ActionRowBuilder().addComponents(channelSend, webhookSend);

    switch (args[0]) {
      case 'create':

        const guideEmbed = new EmbedBuilder()
          .setColor(client.color)
          .setDescription('Default Embed Description');

        const messageComponent = await message.channel.send({ embeds: [guideEmbed], components: [button1] });

        const collector = messageComponent.createMessageComponentCollector({
          filter: (interaction) => interaction.user.id === message.author.id,
          time: 1000 * 60 * 30,
          idle: 1000 * 60 * 15,
        });

        collector.on('collect', async (interaction) => {
          if (interaction.isButton()) {
            if (interaction.customId === 'body_embed') {
              await interaction.update({ components: [button2, button3, button4] });
            } else if (interaction.customId === 'title_embed') {
              await interaction.reply({ content: `Please provide a Title for Embed below maximum character limit is 250`, ephemeral: true })
              const messageCollectorFilter = msg => msg.author.id === message.author.id;
              const messageCollector = message.channel.createMessageCollector({
                filter: messageCollectorFilter,
                max: 1,
                time: 1000 * 60 * 30
              });

              messageCollector.on('collect', async collectedMessage => {
                const titleTicket = collectedMessage.content.slice(0, 250);
                collectedMessage.delete();
                guideEmbed.setTitle(titleTicket);
                messageComponent.edit({ embeds: [guideEmbed] });
              });
            } else if (interaction.customId === 'description_embed') {
              await interaction.reply({ content: `Please provide a description for Embed below maximum character limit is 2048`, ephemeral: true })
              const messageCollectorFilter = msg => msg.author.id === message.author.id;
              const messageCollector = message.channel.createMessageCollector({
                filter: messageCollectorFilter,
                max: 1,
                time: 1000 * 60 * 30
              });

              messageCollector.on('collect', async collectedMessage => {
                const titleDescription = collectedMessage.content.slice(0, 2048);
                collectedMessage.delete();
                guideEmbed.setDescription(titleDescription);
                messageComponent.edit({ embeds: [guideEmbed] });
              });
            } else if (interaction.customId === 'color_embed') {
              await interaction.reply({ content: `Please provide a Color for Embed below and it should be hex code (#000000)`, ephemeral: true })
              const messageCollectorFilter = msg => msg.author.id === message.author.id;
              const messageCollector = message.channel.createMessageCollector({
                filter: messageCollectorFilter,
                max: 1,
                time: 1000 * 60 * 30
              });

              messageCollector.on('collect', async collectedMessage => {
                const colorInput = collectedMessage.content;
                collectedMessage.delete();

                const colorRegex = /^#([0-9A-Fa-f]{6})$/;
                if (!colorRegex.test(colorInput)) {
                  return message.channel.send("Invalid hex color code. Please use a format like '#000000'.");
                }

                const hexColor = colorInput.toUpperCase();
                guideEmbed.setColor(hexColor);
                messageComponent.edit({ embeds: [guideEmbed] });
              });
            } else if (interaction.customId === 'author_text_embed') {
              await interaction.reply({ content: `Please provide an Author for the Embed below. The maximum character limit is 250.`, ephemeral: true });

              const messageCollectorFilter = (msg) => msg.author.id === interaction.user.id;
              const messageCollector = interaction.channel.createMessageCollector({
                filter: messageCollectorFilter,
                max: 1,
                time: 1000 * 60 * 30
              });

              let authorName = '';
              const authorIcon = guideEmbed.author ? guideEmbed.author.iconURL : null;

              messageCollector.on('collect', async (collectedMessage) => {
                authorName = collectedMessage.content.slice(0, 250);
                collectedMessage.delete();

                if (!guideEmbed.author) {
                  guideEmbed.setAuthor({ name: authorName, value: authorIcon, url: null });
                } else {
                  guideEmbed.setAuthor({ name: authorName, iconURL: guideEmbed.author.iconURL, url: guideEmbed.author.url });
                }

                messageComponent.edit({ embeds: [guideEmbed] });
              });
            } else if (interaction.customId === 'author_icon_embed') {
              await interaction.reply({
                content: `Please provide a valid image URL (ending with .jpg, .jpeg, .png, or .gif) for the author icon, or type 'none' to remove the image.`,
                ephemeral: true,
              });

              const messageCollectorFilter = (msg) => msg.author.id === interaction.user.id;
              const messageCollector = interaction.channel.createMessageCollector({
                filter: messageCollectorFilter,
                max: 1,
                time: 1000 * 60 * 30
              });

              messageCollector.on('collect', async (collectedMessage) => {
                const imageInput = collectedMessage.content;

                if (imageInput.toLowerCase() === 'none') {
                  if (guideEmbed.author && guideEmbed.author.iconURL !== null) {
                    guideEmbed.setAuthor({ name: guideEmbed.author.name, iconURL: null, url: null });
                    await interaction.followUp({ content: 'Author icon removed successfully.', ephemeral: true });
                    messageComponent.edit({ embeds: [guideEmbed] });
                  } else {
                    await interaction.followUp({ content: 'There is no author icon to remove.', ephemeral: true });
                  }
                } else {
                  const imageRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/;
                  if (!imageRegex.test(imageInput)) {
                    return interaction.followUp({
                      content: "Invalid image URL. Please provide a valid image URL (ending with .jpg, .jpeg, .png, or .gif), or type 'none' to remove the author icon.",
                      ephemeral: true,
                    });
                  }

                  collectedMessage.delete();

                  if (!guideEmbed.author) {
                    guideEmbed.setAuthor({ name: '', iconURL: imageInput, url: null });
                  } else {
                    guideEmbed.setAuthor({ name: guideEmbed.author.name, iconURL: imageInput, url: guideEmbed.author.url });
                  }

                  await interaction.followUp({ content: 'Author icon added successfully.', ephemeral: true });
                  messageComponent.edit({ embeds: [guideEmbed] });
                }
              });
            } else if (interaction.customId === 'footer_text_embed') {
              await interaction.reply({ content: `Please provide a footer for the Embed below. The maximum character limit is 250`, ephemeral: true });

              const messageCollectorFilter = (msg) => msg.author.id === interaction.user.id;
              const messageCollector = interaction.channel.createMessageCollector({
                filter: messageCollectorFilter,
                max: 1,
                time: 1000 * 60 * 30
              });

              messageCollector.on('collect', async (collectedMessage) => {
                const footerText = collectedMessage.content.slice(0, 250);
                collectedMessage.delete();

                if (!guideEmbed.footer) {
                  guideEmbed.setFooter({ text: footerText, iconURL: null });
                } else {
                  guideEmbed.setFooter({ text: footerText, iconURL: guideEmbed.footer.iconURL });
                }

                messageComponent.edit({ embeds: [guideEmbed] });
              });
            } else if (interaction.customId === 'footer_icon_embed') {
              await interaction.reply({
                content: `Please provide a valid image URL (ending with .jpg, .jpeg, .png, or .gif) for the footer icon, or type 'none' to remove the image.`,
                ephemeral: true,
              });

              const messageCollectorFilter = (msg) => msg.author.id === interaction.user.id;
              const messageCollector = interaction.channel.createMessageCollector({
                filter: messageCollectorFilter,
                max: 1,
                time: 1000 * 60 * 30
              });

              messageCollector.on('collect', async (collectedMessage) => {
                const imageInput = collectedMessage.content;

                if (imageInput.toLowerCase() === 'none') {
                  if (guideEmbed.footer && guideEmbed.footer.iconURL !== null) {
                    guideEmbed.setFooter({ text: guideEmbed.footer.text, iconURL: null });
                    await interaction.followUp({ content: 'Footer icon removed successfully.', ephemeral: true });
                    messageComponent.edit({ embeds: [guideEmbed] });
                  } else {
                    await interaction.followUp({ content: 'There is no footer icon to remove.', ephemeral: true });
                  }
                } else {
                  const imageRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/;
                  if (!imageRegex.test(imageInput)) {
                    return interaction.followUp({
                      content: "Invalid image URL. Please provide a valid image URL (ending with .jpg, .jpeg, .png, or .gif), or type 'none' to remove the footer icon.",
                      ephemeral: true,
                    });
                  }

                  collectedMessage.delete();

                  if (!guideEmbed.footer) {
                    guideEmbed.setFooter({ text: '', iconURL: imageInput });
                  } else {
                    guideEmbed.setFooter({ text: guideEmbed.footer.text, iconURL: imageInput });
                  }

                  await interaction.followUp({ content: 'Footer icon added successfully.', ephemeral: true });
                  messageComponent.edit({ embeds: [guideEmbed] });
                }
              });
            } else if (interaction.customId === 'image_embed') {
              await interaction.reply({ content: `Please provide a valid image URL (ending with .jpg, .jpeg, .png, or .gif), or type 'none' to remove the image.`, ephemeral: true });

              const messageCollectorFilter = msg => msg.author.id === interaction.user.id;
              const messageCollector = interaction.channel.createMessageCollector({
                filter: messageCollectorFilter,
                max: 1,
                time: 1000 * 60 * 30
              });

              messageCollector.on('collect', async collectedMessage => {
                const imageInput = collectedMessage.content;

                if (imageInput.toLowerCase() === 'none') {
                  if (guideEmbed.image !== null) {
                    guideEmbed.setImage(null);
                    await interaction.followUp({ content: "Image removed successfully.", ephemeral: true });
                    messageComponent.edit({ embeds: [guideEmbed] });
                  } else {
                    await interaction.followUp({ content: "There is no image to remove.", ephemeral: true });
                  }
                } else {
                  const imageRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/;
                  if (!imageRegex.test(imageInput)) {
                    return interaction.followUp({ content: "Invalid image URL. Please provide a valid image URL (ending with .jpg, .jpeg, .png, or .gif), or type 'none' to remove the image.", ephemeral: true });
                  }

                  collectedMessage.delete();
                  guideEmbed.setImage(imageInput);
                  isImageSet = true;
                  await interaction.followUp({ content: "Thumbnail added successfully.", ephemeral: true });
                  messageComponent.edit({ embeds: [guideEmbed] });
                }
              });
            } else if (interaction.customId === 'thumbnail_embed') {
              await interaction.reply({ content: `Please provide a valid thumbnail image URL (ending with .jpg, .jpeg, .png, or .gif), or type 'none' to remove the thumbnail.`, ephemeral: true });

              const messageCollectorFilter = msg => msg.author.id === interaction.user.id;
              const messageCollector = interaction.channel.createMessageCollector({
                filter: messageCollectorFilter,
                max: 1,
                time: 1000 * 60 * 30
              });

              messageCollector.on('collect', async collectedMessage => {
                const thumbnailInput = collectedMessage.content;

                if (thumbnailInput.toLowerCase() === 'none') {
                  if (guideEmbed.thumbnail) {
                    guideEmbed.setThumbnail(null);
                    await interaction.followUp({ content: "Thumbnail removed successfully.", ephemeral: true });
                    messageComponent.edit({ embeds: [guideEmbed] });
                  } else {
                    await interaction.followUp({ content: "There is no thumbnail to remove.", ephemeral: true });
                  }
                } else {
                  const imageRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/;
                  if (!imageRegex.test(thumbnailInput)) {
                    return interaction.followUp({ content: "Invalid image URL. Please provide a valid thumbnail image URL (ending with .jpg, .jpeg, .png, or .gif), or type 'none' to remove the thumbnail.", ephemeral: true });
                  }

                  collectedMessage.delete();
                  guideEmbed.setThumbnail(thumbnailInput);
                  await interaction.followUp({ content: "Thumbnail added successfully.", ephemeral: true });
                  messageComponent.edit({ embeds: [guideEmbed] });
                }
              });
            } else if (interaction.customId === 'default_embed') {
              guideEmbed.setColor(client.color);
              guideEmbed.setTitle('');
              guideEmbed.setDescription('Default Embed Description');
              guideEmbed.setAuthor({ name: '', iconURL: null, url: null });
              guideEmbed.setFooter({ text: '', iconURL: null });
              guideEmbed.setThumbnail(null);
              guideEmbed.setImage(null);
              messageComponent.edit({ embeds: [guideEmbed], components: [button1] });
              await interaction.reply({ content: 'Embed has been reset to the default state.', ephemeral: true });
            } else if (interaction.customId === 'preview_embed') {
              await interaction.reply({ embeds: [guideEmbed], ephemeral: true });
            } else if (interaction.customId === 'back_embed') {
              await interaction.update({ components: [button1] })
            } else if (interaction.customId === 'send_embed') {
              await interaction.reply({
                content: 'Please choose how you want to send the embed:', ephemeral: true, components: [button5]
              });

              const filter = (buttonInteraction) => buttonInteraction.user.id === interaction.user.id;
              const collector = interaction.channel.createMessageComponentCollector({
                filter,
                time: 1000 * 60 * 30
              });

              collector.on('collect', async (buttonInteraction) => {
                if (buttonInteraction.customId === 'channel_send') {
                  await buttonInteraction.deferUpdate();
                  await buttonInteraction.followUp({ content: 'Please provide the ID or mention of a channel through which this embed is to be submitted:', ephemeral: true });

                  const channelFilter = (msg) => msg.author.id === interaction.user.id && (msg.mentions.channels.size > 0 || /^[0-9]+$/.test(msg.content));
                  const channelCollector = interaction.channel.createMessageCollector({
                    filter: channelFilter,
                    max: 1,
                    time: 1000 * 60 * 30
                  });

                  channelCollector.on('collect', async (collectedMessage) => {
                    let channelId;
                    const channelMention = collectedMessage.mentions.channels.first();

                    if (channelMention) {
                      channelId = channelMention.id;
                    } else {
                      const channelIdMatch = collectedMessage.content.trim().match(/[0-9]+/);
                      if (channelIdMatch) {
                        channelId = channelIdMatch[0];
                      }
                    }

                    if (!channelId || !interaction.guild.channels.cache.has(channelId)) {
                      await interaction.editReply({ content: 'Invalid channel ID or mention. Please provide a valid channel ID or mention a channel.', ephemeral: true });
                    } else {
                      await collectedMessage.delete();
                      await interaction.editReply({ content: `Embed Sent to <#${channelId}>`, components: [], ephemeral: true });

                      const channelToSend = await interaction.guild.channels.fetch(channelId);
                      const panelMessage = await channelToSend.send({ embeds: [guideEmbed] });
                      await messageComponent.edit({ content: `Embed Sent to <#${channelToSend.id}>`, embeds: [], components: [] });
                    }
                  });
                } else if (buttonInteraction.customId === 'webhook_send') {
                  await buttonInteraction.deferUpdate();
                  await buttonInteraction.followUp({ content: 'Please provide a valid webhook URL:', ephemeral: true });

                  const webhookFilter = (msg) => msg.author.id === interaction.user.id && /^https:\/\/discord\.com\/api\/webhooks\//.test(msg.content);
                  const webhookCollector = interaction.channel.createMessageCollector({
                    filter: webhookFilter,
                    max: 1,
                    time: 1000 * 60 * 30
                  });

                  webhookCollector.on('collect', async (collectedMessage) => {
                    const webhookURL = collectedMessage.content;

                    if (!webhookURL) {
                      await interaction.editReply({ content: 'Invalid webhook URL. Please provide a valid webhook URL.', ephemeral: true });
                    } else {
                      try {
                        const webhook = new Discord.WebhookClient({ url: webhookURL });
                        await webhook.send({ embeds: [guideEmbed] });
                        await collectedMessage.delete();
                        await interaction.editReply({ content: 'Embed sent via webhook successfully.', components: [], ephemeral: true });
                        await messageComponent.edit({ content: 'Embed sent via webhook successfully.', components: [] });
                      } catch (error) {
                        console.error('Webhook Error:', error);
                        await interaction.editReply({ content: 'An error occurred while sending the embed via webhook.', ephemeral: true });
                      }
                    }
                  });
                }
              });
            } else if (interaction.customId === 'abort_embed') {
              const abortEmbed = new EmbedBuilder()
                .setTitle('Embed Creation Aborted')
                .setColor('#ff0000')
                .setDescription('The embed creation process has been aborted.');

              await interaction.update({ embeds: [abortEmbed], components: [] });
            }
          }
        });
        break;

      default:
        break;
    }
  }
};
