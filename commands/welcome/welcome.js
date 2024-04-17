const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');
const Settings = require('../../settings.js');
const emoji = require('../../emoji.js');
const owner = Settings.bot.credits.developerId;

module.exports = {
  name: 'welcome',
  aliases: ['greet'],
  UserPerms: ['ManageGuild'],
  BotPerms: ['EmbedLinks'],
  voteOnly: true,
  run: async (client, message, args) => {
    let prefix = await client.db8.get(`${message.guild.id}_prefix`) || Settings.bot.info.prefix;
    const arypton = await client.users.fetch(owner);
    const premium = await client.db12.get(`${message.guild.id}_premium`);

    const presets = [
      { message: await client.db9.get(`${message.guild.id}_welcome_message1`), embed: await client.db9.get(`${message.guild.id}_welcome_embed1`) },
      { message: await client.db9.get(`${message.guild.id}_welcome_message2`), embed: await client.db9.get(`${message.guild.id}_welcome_embed2`) },
      { message: await client.db9.get(`${message.guild.id}_welcome_message3`), embed: await client.db9.get(`${message.guild.id}_welcome_embed3`) }
    ];

    const presetOptions = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('presetOption')
        .setPlaceholder('Choose the Welcome Embed Set...')
        .addOptions(
          presets.map((preset, index) => {
            return new StringSelectMenuOptionBuilder()
              .setLabel(`Preset ${index + 1}`)
              .setValue(`welcome${index + 1}`)
              .setDescription(preset.message || preset.embed ? 'Currently Active' : 'Currently Inactive');
          })
        )
    );


    const styleOptions = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('styleOption')
        .setPlaceholder('Choose the Welcome Style...')
        .addOptions([
          new StringSelectMenuOptionBuilder()
            .setLabel('Message Based')
            .setValue('style1'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Embed Based')
            .setValue('style2')
        ])
    );

    const messageEmbed = new ButtonBuilder().setStyle(2).setLabel('Content').setCustomId('message_welcome');
    const bodyEmbed = new ButtonBuilder().setStyle(2).setLabel('Body').setCustomId('body_welcome');
    const authorTextEmbed = new ButtonBuilder().setStyle(2).setLabel('Author Text').setCustomId('author_text_welcome');
    const authorIconEmbed = new ButtonBuilder().setStyle(2).setLabel('Author Icon').setCustomId('author_icon_welcome');
    const titleEmbed = new ButtonBuilder().setStyle(2).setLabel('Title').setCustomId('title_welcome');
    const descriptionEmbed = new ButtonBuilder().setStyle(2).setLabel('Description').setCustomId('description_welcome');
    const thumbnailEmbed = new ButtonBuilder().setStyle(2).setLabel('Thumbnail').setCustomId('thumbnail_welcome');
    const imageEmbed = new ButtonBuilder().setStyle(2).setLabel('Image').setCustomId('image_welcome');
    const colorEmbed = new ButtonBuilder().setStyle(2).setLabel('Color').setCustomId('color_welcome');
    const footerTextEmbed = new ButtonBuilder().setStyle(2).setLabel('Footer Text').setCustomId('footer_text_welcome');
    const footerIconEmbed = new ButtonBuilder().setStyle(2).setLabel('Footer Icon').setCustomId('footer_icon_welcome');
    const defaultEmbed = new ButtonBuilder().setStyle(1).setLabel('Default').setCustomId('default_welcome');
    const previewButton = new ButtonBuilder().setStyle(2).setLabel('Preview').setCustomId('preview_welcome');
    const saveButton = new ButtonBuilder().setStyle(3).setLabel('Save').setCustomId('save_welcome');
    const abortButton = new ButtonBuilder().setStyle(4).setLabel('Abort').setCustomId('abort_welcome');
    const backEmbed = new ButtonBuilder().setStyle(3).setLabel('Back').setCustomId('back_welcome');

    const button = new ActionRowBuilder().addComponents(bodyEmbed, previewButton, saveButton, abortButton);
    const button1 = new ActionRowBuilder().addComponents(bodyEmbed, previewButton, saveButton, abortButton);
    const button2 = new ActionRowBuilder().addComponents(messageEmbed, authorTextEmbed, authorIconEmbed, titleEmbed, descriptionEmbed);
    const button3 = new ActionRowBuilder().addComponents(thumbnailEmbed, imageEmbed, footerTextEmbed, footerIconEmbed, colorEmbed);
    const button4 = new ActionRowBuilder().addComponents(defaultEmbed, backEmbed);

    switch (args[0]) {
      case 'message':
        switch (args[1]) {
          case 'panel':
            const slotComponent = await message.channel.send({ content: `Please Choose the Slot for Welcome`, components: [presetOptions] });

            const collector = slotComponent.createMessageComponentCollector({
              filter: (interaction) => {
                if (interaction.user.id === message.author.id) return true;
                else {
                  return interaction.reply({ content: `${emoji.util.cross} | This Pagination is not for you.`, ephemeral: true });
                }
              },
              time: 400000,
              idle: 400000 / 2,
            });

            collector.on('collect', async (interaction) => {
              if (interaction.isSelectMenu()) {
                const selectedValue = interaction.values[0];
                if (selectedValue === 'welcome1') {
                  await slotComponent.delete();
                  const styleComponent = await message.channel.send({ content: `Please Choose the Style for Welcome`, components: [styleOptions] });

                  const collector = styleComponent.createMessageComponentCollector({
                    filter: (interaction) => {
                      if (interaction.user.id === message.author.id) return true;
                      else {
                        return interaction.reply({ content: `${emoji.util.cross} | This Pagination is not for you.`, ephemeral: true });
                      }
                    },
                    time: 400000,
                    idle: 400000 / 2,
                  });

                  collector.on('collect', async (interaction) => {
                    if (interaction.isSelectMenu()) {
                      const selectedValue = interaction.values[0];
                      if (selectedValue === 'style1') {
                        await interaction.reply({ content: '```xml\n<<server.member_count>> = server member count\n<<server.name>> = server name\n<<user.name>> = username of new member\n<<user.mention>> = mention of the new user\n<<user.created_at>> = creation time of account of user\n<<user.joined_at>> = joining time of the user.\n```', ephemeral: true });
                        await styleComponent.delete();

                        let messageText = await client.db9.get(`${message.guild.id}_welcome_message1.message`);
                        if (messageText !== undefined) {
                          messageText = messageText.toString();
                        } else {
                          messageText = `Your message will look like this.`;
                        }

                        const messageComponent = await message.channel.send({ content: messageText, components: [button] });

                        const collector = messageComponent.createMessageComponentCollector({
                          filter: (interaction) => {
                            if (interaction.user.id === message.author.id) return true;
                            else {
                              return interaction.reply({ content: `${emoji.util.cross} | This Pagination is not for you.`, ephemeral: true });
                            }
                          },
                          time: 400000,
                          idle: 400000 / 2,
                        });

                        collector.on('collect', async (interaction) => {
                          if (interaction.isButton()) {
                            if (interaction.customId === 'body_welcome') {
                              await interaction.reply({ content: `Please provide a message for Welcome message below maximum character limit is 4048`, ephemeral: true });
                              const messageCollectorFilter = msg => msg.author.id === message.author.id;
                              const messageCollector = message.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 300000
                              });

                              messageCollector.on('collect', async collectedMessage => {
                                const messageWelcome = collectedMessage.content.slice(0, 4048);
                                collectedMessage.delete();
                                messageComponent.edit({ content: messageWelcome });
                              });
                            } else if (interaction.customId === 'preview_welcome') {
                              await interaction.reply({ content: messageComponent.content, ephemeral: true });
                            } else if (interaction.customId === 'save_welcome') {
                              await interaction.reply({ content: 'Please provide the ID or mention of a channel through which this panel is to be submitted.', ephemeral: true });
                              const channelFilter = (msg) => msg.author.id === message.author.id && (msg.mentions.channels.size > 0 || /^[0-9]+$/.test(msg.content));
                              const channelCollector = message.channel.createMessageCollector({
                                filter: channelFilter,
                                max: 1,
                                time: 60000,
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

                                if (!channelId || !message.guild.channels.cache.has(channelId)) {
                                  return interaction.editReply({ content: 'Invalid channel ID or mention. Please provide a valid channel ID or mention a channel.', ephemeral: true });
                                }

                                await client.db9.set(`${message.guild.id}_welcome_message1`, {
                                  channelID: channelId,
                                  message: messageComponent.content
                                });
                                await client.db9.delete(`${message.guild.id}_welcome_embed1`)

                                collectedMessage.delete();
                                interaction.editReply({ content: `Welcome channel for this Slot set to <#${channelId}>.`, ephemeral: true });
                                messageComponent.edit({ components: [] });
                              });
                            } else if (interaction.customId === 'abort_welcome') {
                              await messageComponent.edit({ content: `Aborted this process`, components: [] });
                            }
                          }
                        });
                      } else if (selectedValue === 'style2') {
                        await interaction.reply({ content: '```xml\n<<server.member_count>> = server member count\n<<server.name>> = server name\n<<user.name>> = username of new member\n<<user.mention>> = mention of the new user\n<<user.created_at>> = creation time of account of user\n<<user.joined_at>> = joining time of the user.\n```', ephemeral: true });
                        await styleComponent.delete();
                        let messageText = await client.db9.get(`${message.guild.id}_welcome_embed1.messageText`);
                        if (messageText !== undefined) {
                          messageText = messageText.toString();
                        } else {
                          messageText = null;
                        }

                        let authorText = await client.db9.get(`${message.guild.id}_welcome_embed1.authorText`);
                        if (authorText !== undefined) {
                          authorText = authorText.toString();
                        } else {
                          authorText = '';
                        }

                        let authorIcon = await client.db9.get(`${message.guild.id}_welcome_embed1.authorIcon`);
                        if (authorIcon !== undefined) {
                          authorIcon = message.author.displayAvatarURL({ dynamic: true });
                        } else {
                          authorIcon = null;
                        }

                        let title = await client.db9.get(`${message.guild.id}_welcome_embed1.title`);
                        if (title !== undefined) {
                          title = title.toString();
                        } else {
                          title = '';
                        }

                        let description = await client.db9.get(`${message.guild.id}_welcome_embed1.description`);
                        if (description !== undefined) {
                          description = description.toString();
                        } else {
                          description = 'Default Embed Description';
                        }

                        let color = await client.db9.get(`${message.guild.id}_welcome_embed1.color`);
                        if (color === undefined) {
                          color = client.color;
                        }

                        let image = await client.db9.get(`${message.guild.id}_welcome_embed1.image`);
                        if (image !== undefined) {
                          image = image;
                        } else {
                          image = null;
                        }

                        let thumbnail = await client.db9.get(`${message.guild.id}_welcome_embed1.thumbnail`);
                        if (thumbnail !== undefined) {
                          thumbnail = message.author.displayAvatarURL({ dynamic: true });
                        } else {
                          thumbnail = null;
                        }

                        let footerText = await client.db9.get(`${message.guild.id}_welcome_embed1.footerText`);
                        if (footerText !== undefined) {
                          footerText = footerText.toString();
                        } else {
                          footerText = '';
                        }

                        let footerIcon = await client.db9.get(`${message.guild.id}_welcome_embed1.footerIcon`);
                        if (footerIcon !== undefined) {
                          footerIcon = footerIcon;
                        } else {
                          footerIcon = null;
                        }

                        const guideEmbed = new EmbedBuilder()
                          .setColor(color)
                          .setTitle(title)
                          .setDescription(description)
                          .setAuthor({ name: authorText, iconURL: authorIcon, url: null })
                          .setFooter({ text: footerText, iconURL: footerIcon })
                          .setThumbnail(thumbnail)
                          .setImage(image)

                        const messageComponent = await message.channel.send({ content: messageText, embeds: [guideEmbed], components: [button1] });

                        const collector = messageComponent.createMessageComponentCollector({
                          filter: (interaction) => {
                            if (interaction.user.id === message.author.id) return true;
                            else {
                              return interaction.reply({ content: `${emoji.util.cross} | This Pagination is not for you.`, ephemeral: true });
                            }
                          },
                          time: 400000,
                          idle: 400000 / 2,
                        });

                        collector.on('collect', async (interaction) => {
                          if (interaction.isButton()) {
                            if (interaction.customId === 'body_welcome') {
                              await interaction.update({ components: [button2, button3, button4] });
                            } else if (interaction.customId === 'author_text_welcome') {
                              await interaction.reply({ content: `Please provide an Author for the Embed below. The maximum character limit is 250.`, ephemeral: true });

                              const messageCollectorFilter = (msg) => msg.author.id === interaction.user.id;
                              const messageCollector = interaction.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 60000,
                              });

                              let authorName = '';
                              const authorIcon = guideEmbed.author ? guideEmbed.author.iconURL : null;

                              messageCollector.on('collect', async (collectedMessage) => {
                                authorName = collectedMessage.content.slice(0, 250);
                                collectedMessage.delete();

                                if (!guideEmbed.author) {
                                  guideEmbed.setAuthor(authorName, authorIcon, null);
                                } else {
                                  guideEmbed.setAuthor(authorName, guideEmbed.author.iconURL, guideEmbed.author.url);
                                }

                                messageComponent.edit({ embeds: [guideEmbed] });
                              });
                            } else if (interaction.customId === 'author_icon_welcome') {
                              await interaction.reply({
                                content: `Please provide a valid image URL (ending with .jpg, .jpeg, .png, or .gif) for the author icon, or type 'servericon' to set the server icon, 'usericon' to set the user icon, 'none' to remove the icon.`,
                                ephemeral: true,
                              });

                              const messageCollectorFilter = (msg) => msg.author.id === interaction.user.id;
                              const messageCollector = interaction.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 60000,
                              });

                              messageCollector.on('collect', async (collectedMessage) => {
                                const imageInput = collectedMessage.content.toLowerCase();

                                if (imageInput === 'none') {
                                  if (guideEmbed.author && guideEmbed.author.iconURL !== null) {
                                    guideEmbed.setAuthor(guideEmbed.author.name, null, null);
                                    await interaction.followUp({ content: 'Author icon removed successfully.', ephemeral: true });
                                    messageComponent.edit({ embeds: [guideEmbed] });
                                  } else {
                                    await interaction.followUp({ content: 'There is no author icon to remove.', ephemeral: true });
                                  }
                                } else {
                                  const imageRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/;
                                  if (!imageRegex.test(imageInput)) {
                                    return interaction.followUp({
                                      content: "Invalid input. Please provide a valid image URL (ending with .jpg, .jpeg, .png, or .gif), or type 'none' to remove the author icon.",
                                      ephemeral: true,
                                    });
                                  }
                                  collectedMessage.delete();

                                  if (!guideEmbed.author) {
                                    guideEmbed.setAuthor('', imageInput, null);
                                  } else {
                                    guideEmbed.setAuthor(guideEmbed.author.name, imageInput, guideEmbed.author.url);
                                  }

                                  await interaction.followUp({ content: 'Author icon added successfully.', ephemeral: true });
                                  messageComponent.edit({ embeds: [guideEmbed] });
                                }
                              });
                            } else if (interaction.customId === 'title_welcome') {
                              await interaction.reply({ content: `Please provide a Title for Embed below maximum character limit is 250`, ephemeral: true })
                              const messageCollectorFilter = msg => msg.author.id === message.author.id;
                              const messageCollector = message.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 60000
                              });

                              messageCollector.on('collect', async collectedMessage => {
                                const titleTicket = collectedMessage.content.slice(0, 250);
                                collectedMessage.delete();
                                guideEmbed.setTitle(titleTicket);
                                messageComponent.edit({ embeds: [guideEmbed] });
                              });
                            } else if (interaction.customId === 'description_welcome') {
                              await interaction.reply({ content: `Please provide a description for Embed below maximum character limit is 4048`, ephemeral: true })
                              const messageCollectorFilter = msg => msg.author.id === message.author.id;
                              const messageCollector = message.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 300000
                              });

                              messageCollector.on('collect', async collectedMessage => {
                                const titleDescription = collectedMessage.content.slice(0, 4048);
                                collectedMessage.delete();
                                guideEmbed.setDescription(titleDescription);
                                messageComponent.edit({ embeds: [guideEmbed] });
                              });
                            } else if (interaction.customId === 'color_welcome') {
                              await interaction.reply({ content: `Please provide a Color for Embed below and it should be hex code (#000000)`, ephemeral: true })
                              const messageCollectorFilter = msg => msg.author.id === message.author.id;
                              const messageCollector = message.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 60000
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
                            } else if (interaction.customId === 'thumbnail_welcome') {
                              const userAvatarURL = interaction.user.displayAvatarURL({ dynamic: true });

                              if (guideEmbed.thumbnail && guideEmbed.thumbnail.url === userAvatarURL) {
                                guideEmbed.setThumbnail(null);
                                await interaction.reply({ content: "Thumbnail (user avatar) removed successfully.", ephemeral: true });
                                messageComponent.edit({ embeds: [guideEmbed] });
                              } else {
                                guideEmbed.setThumbnail(userAvatarURL);
                                await interaction.reply({ content: "Thumbnail (user avatar) added successfully.", ephemeral: true });
                                messageComponent.edit({ embeds: [guideEmbed] });
                              }
                            } else if (interaction.customId === 'image_welcome') {
                              await interaction.reply({ content: `Please provide a valid image URL (ending with .jpg, .jpeg, .png, or .gif), or type 'none' to remove the image.`, ephemeral: true });

                              const messageCollectorFilter = msg => msg.author.id === interaction.user.id;
                              const messageCollector = interaction.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 60000
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
                                  await interaction.followUp({ content: "Image added successfully.", ephemeral: true });
                                  messageComponent.edit({ embeds: [guideEmbed] });
                                }
                              });
                            } else if (interaction.customId === 'footer_text_welcome') {
                              await interaction.reply({ content: `Please provide a footer for the Embed below. The maximum character limit is 250`, ephemeral: true });

                              const messageCollectorFilter = (msg) => msg.author.id === interaction.user.id;
                              const messageCollector = interaction.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 60000,
                              });

                              messageCollector.on('collect', async (collectedMessage) => {
                                const footerText = collectedMessage.content.slice(0, 250);
                                collectedMessage.delete();

                                if (!guideEmbed.footer) {
                                  guideEmbed.setFooter(footerText, null);
                                } else {
                                  guideEmbed.setFooter(footerText, guideEmbed.footer.iconURL);
                                }

                                messageComponent.edit({ embeds: [guideEmbed] });
                              });
                            } else if (interaction.customId === 'footer_icon_welcome') {
                              await interaction.reply({
                                content: `Please provide a valid image URL (ending with .jpg, .jpeg, .png, or .gif) for the footer icon, or type 'servericon' to set the server icon, 'usericon' to set the user icon, 'none' to remove the icon.`,
                                ephemeral: true,
                              });

                              const messageCollectorFilter = (msg) => msg.author.id === interaction.user.id;
                              const messageCollector = interaction.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 60000,
                              });

                              messageCollector.on('collect', async (collectedMessage) => {
                                const imageInput = collectedMessage.content.toLowerCase();

                                if (imageInput === 'none') {
                                  if (guideEmbed.footer && guideEmbed.footer.iconURL !== null) {
                                    guideEmbed.setFooter(guideEmbed.footer.text);
                                    await interaction.followUp({ content: 'Footer icon removed successfully.', ephemeral: true });
                                    messageComponent.edit({ embeds: [guideEmbed] });
                                  } else {
                                    await interaction.followUp({ content: 'There is no footer icon to remove.', ephemeral: true });
                                  }
                                } else {
                                  const imageRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/;
                                  if (!imageRegex.test(imageInput)) {
                                    return interaction.followUp({
                                      content: "Invalid input. Please provide a valid image URL (ending with .jpg, .jpeg, .png, or .gif), or type 'none' to remove the footer icon.",
                                      ephemeral: true,
                                    });
                                  }

                                  collectedMessage.delete();

                                  guideEmbed.setFooter(guideEmbed.footer.text, imageInput);
                                  await interaction.followUp({ content: 'Footer icon added successfully.', ephemeral: true });
                                  messageComponent.edit({ embeds: [guideEmbed] });
                                }
                              });
                            } else if (interaction.customId === 'message_welcome') {
                              await interaction.reply({ content: `Please provide a message for Welcome message below maximum character limit is 4048`, ephemeral: true });
                              const messageCollectorFilter = msg => msg.author.id === message.author.id;
                              const messageCollector = message.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 300000
                              });

                              messageCollector.on('collect', async collectedMessage => {
                                const messageWelcome = collectedMessage.content.slice(0, 4048);
                                collectedMessage.delete();
                                messageComponent.edit({ content: messageWelcome });
                              });
                            } else if (interaction.customId === 'abort_welcome') {
                              await messageComponent.edit({ content: `Aborted this process`, components: [] });
                            } else if (interaction.customId === 'default_welcome') {
                              guideEmbed.setColor(client.color);
                              guideEmbed.setTitle('');
                              guideEmbed.setDescription('Default Embed Description');
                              guideEmbed.setAuthor('', null, null);
                              guideEmbed.setFooter('', null);
                              guideEmbed.setThumbnail(null);
                              guideEmbed.setImage(null);
                              messageComponent.edit({ content: null, embeds: [guideEmbed], components: [button1] });
                              await interaction.reply({ content: 'Embed has been reset to the default state.', ephemeral: true });
                            } else if (interaction.customId === 'preview_welcome') {
                              await interaction.reply({ embeds: [guideEmbed], ephemeral: true });
                            } else if (interaction.customId === 'back_welcome') {
                              await interaction.update({ components: [button1] })
                            } else if (interaction.customId === 'save_welcome') {
                              await interaction.reply({ content: 'Please provide the ID or mention of a channel through which this panel is to be submitted.', ephemeral: true });
                              const channelFilter = (msg) => msg.author.id === message.author.id && (msg.mentions.channels.size > 0 || /^[0-9]+$/.test(msg.content));
                              const channelCollector = message.channel.createMessageCollector({
                                filter: channelFilter,
                                max: 1,
                                time: 60000,
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

                                if (!channelId || !message.guild.channels.cache.has(channelId)) {
                                  return interaction.editReply({ content: 'Invalid channel ID or mention. Please provide a valid channel ID or mention a channel.', ephemeral: true });
                                }

                                await client.db9.set(`${message.guild.id}_welcome_embed1`, {
                                  channelID: channelId,
                                  messageText: messageComponent.content,
                                  authorText: guideEmbed.author.name,
                                  authorIcon: guideEmbed.author.iconURL,
                                  title: guideEmbed.title,
                                  description: guideEmbed.description,
                                  color: guideEmbed.color,
                                  image: guideEmbed.image.url,
                                  thumbnail: guideEmbed.thumbnail.url,
                                  footerText: guideEmbed.footer.text,
                                  footerIcon: guideEmbed.footer.iconURL,
                                });
                                await client.db9.delete(`${message.guild.id}_welcome_message1`)

                                collectedMessage.delete();
                                interaction.editReply({ content: `Welcome channel for this Slot set to <#${channelId}>.`, ephemeral: true });
                                messageComponent.edit({ components: [] });
                              });
                            } else if (interaction.customId === 'abort_welcome') {
                              await messageComponent.edit({ content: `Aborted this process`, components: [] });
                            }
                          }
                        });
                      }
                    }
                  });
                } else if (selectedValue === 'welcome2') {
                  await slotComponent.delete();
                  if (premium.active !== true) {
                    return interaction.reply({ content: `Please buy premium to use this command! use ${prefix}premium purchase`, ephemeral: true })
                  }
                  const styleComponent = await message.channel.send({ content: `Please Choose the Style for Welcome`, components: [styleOptions] });

                  const collector = styleComponent.createMessageComponentCollector({
                    filter: (interaction) => {
                      if (interaction.user.id === message.author.id) return true;
                      else {
                        return interaction.reply({ content: `${emoji.util.cross} | This Pagination is not for you.`, ephemeral: true });
                      }
                    },
                    time: 400000,
                    idle: 400000 / 2,
                  });

                  collector.on('collect', async (interaction) => {
                    if (interaction.isSelectMenu()) {
                      const selectedValue = interaction.values[0];
                      if (selectedValue === 'style1') {
                        await interaction.reply({ content: '```xml\n<<server.member_count>> = server member count\n<<server.name>> = server name\n<<user.name>> = username of new member\n<<user.mention>> = mention of the new user\n<<user.created_at>> = creation time of account of user\n<<user.joined_at>> = joining time of the user.\n```', ephemeral: true });
                        await styleComponent.delete();

                        let messageText = await client.db9.get(`${message.guild.id}_welcome_message2.message`);
                        if (messageText !== undefined) {
                          messageText = messageText.toString();
                        } else {
                          messageText = `Your message will look like this.`;
                        }

                        const messageComponent = await message.channel.send({ content: messageText, components: [button] });

                        const collector = messageComponent.createMessageComponentCollector({
                          filter: (interaction) => {
                            if (interaction.user.id === message.author.id) return true;
                            else {
                              return interaction.reply({ content: `${emoji.util.cross} | This Pagination is not for you.`, ephemeral: true });
                            }
                          },
                          time: 400000,
                          idle: 400000 / 2,
                        });

                        collector.on('collect', async (interaction) => {
                          if (interaction.isButton()) {
                            if (interaction.customId === 'body_welcome') {
                              await interaction.reply({ content: `Please provide a message for Welcome message below maximum character limit is 4048`, ephemeral: true });
                              const messageCollectorFilter = msg => msg.author.id === message.author.id;
                              const messageCollector = message.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 300000
                              });

                              messageCollector.on('collect', async collectedMessage => {
                                const messageWelcome = collectedMessage.content.slice(0, 4048);
                                collectedMessage.delete();
                                messageComponent.edit({ content: messageWelcome });
                              });
                            } else if (interaction.customId === 'preview_welcome') {
                              await interaction.reply({ content: messageComponent.content, ephemeral: true });
                            } else if (interaction.customId === 'save_welcome') {
                              await interaction.reply({ content: 'Please provide the ID or mention of a channel through which this panel is to be submitted.', ephemeral: true });
                              const channelFilter = (msg) => msg.author.id === message.author.id && (msg.mentions.channels.size > 0 || /^[0-9]+$/.test(msg.content));
                              const channelCollector = message.channel.createMessageCollector({
                                filter: channelFilter,
                                max: 1,
                                time: 60000,
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

                                if (!channelId || !message.guild.channels.cache.has(channelId)) {
                                  return interaction.editReply({ content: 'Invalid channel ID or mention. Please provide a valid channel ID or mention a channel.', ephemeral: true });
                                }

                                await client.db9.set(`${message.guild.id}_welcome_message2`, {
                                  channelID: channelId,
                                  message: messageComponent.content
                                });
                                await client.db9.delete(`${message.guild.id}_welcome_embed2`)

                                collectedMessage.delete();
                                interaction.editReply({ content: `Welcome channel for this Slot set to <#${channelId}>.`, ephemeral: true });
                                messageComponent.edit({ components: [] });
                              });
                            } else if (interaction.customId === 'abort_welcome') {
                              await messageComponent.edit({ content: `Aborted this process`, components: [] });
                            }
                          }
                        });
                      } else if (selectedValue === 'style2') {
                        await interaction.reply({ content: '```xml\n<<server.member_count>> = server member count\n<<server.name>> = server name\n<<user.name>> = username of new member\n<<user.mention>> = mention of the new user\n<<user.created_at>> = creation time of account of user\n<<user.joined_at>> = joining time of the user.\n```', ephemeral: true });
                        await styleComponent.delete();
                        let messageText = await client.db9.get(`${message.guild.id}_welcome_embed2.messageText`);
                        if (messageText !== undefined) {
                          messageText = messageText.toString();
                        } else {
                          messageText = null;
                        }

                        let authorText = await client.db9.get(`${message.guild.id}_welcome_embed2.authorText`);
                        if (authorText !== undefined) {
                          authorText = authorText.toString();
                        } else {
                          authorText = '';
                        }

                        let authorIcon = await client.db9.get(`${message.guild.id}_welcome_embed2.authorIcon`);
                        if (authorIcon !== undefined) {
                          authorIcon = message.author.displayAvatarURL({ dynamic: true });
                        } else {
                          authorIcon = null
                        }

                        let title = await client.db9.get(`${message.guild.id}_welcome_embed2.title`);
                        if (title !== undefined) {
                          title = title.toString();
                        } else {
                          title = '';
                        }

                        let description = await client.db9.get(`${message.guild.id}_welcome_embed2.description`);
                        if (description !== undefined) {
                          description = description.toString();
                        } else {
                          description = 'Default Embed Description';
                        }

                        let color = await client.db9.get(`${message.guild.id}_welcome_embed2.color`);
                        if (color === undefined) {
                          color = client.color;
                        }

                        let image = await client.db9.get(`${message.guild.id}_welcome_embed2.image`);
                        if (image !== undefined) {
                          image = image;
                        } else {
                          image = null;
                        }

                        let thumbnail = await client.db9.get(`${message.guild.id}_welcome_embed2.thumbnail`);
                        if (thumbnail !== undefined) {
                          thumbnail = message.author.displayAvatarURL({ dynamic: true });
                        } else {
                          thumbnail = null;
                        }

                        let footerText = await client.db9.get(`${message.guild.id}_welcome_embed2.footerText`);
                        if (footerText !== undefined) {
                          footerText = footerText.toString();
                        } else {
                          footerText = '';
                        }

                        let footerIcon = await client.db9.get(`${message.guild.id}_welcome_embed2.footerIcon`);
                        if (footerIcon !== undefined) {
                          footerIcon = footerIcon;
                        } else {
                          footerIcon = null;
                        }

                        const guideEmbed = new EmbedBuilder()
                          .setColor(color)
                          .setTitle(title)
                          .setDescription(description)
                          .setAuthor({ name: authorText, iconURL: authorIcon, url: null })
                          .setFooter({ text: footerText, iconURL: footerIcon })
                          .setThumbnail(thumbnail)
                          .setImage(image)

                        const messageComponent = await message.channel.send({ content: messageText, embeds: [guideEmbed], components: [button1] });

                        const collector = messageComponent.createMessageComponentCollector({
                          filter: (interaction) => {
                            if (interaction.user.id === message.author.id) return true;
                            else {
                              return interaction.reply({ content: `${emoji.util.cross} | This Pagination is not for you.`, ephemeral: true });
                            }
                          },
                          time: 400000,
                          idle: 400000 / 2,
                        });

                        collector.on('collect', async (interaction) => {
                          if (interaction.isButton()) {
                            if (interaction.customId === 'body_welcome') {
                              await interaction.update({ components: [button2, button3, button4] });
                            } else if (interaction.customId === 'author_text_welcome') {
                              await interaction.reply({ content: `Please provide an Author for the Embed below. The maximum character limit is 250.`, ephemeral: true });

                              const messageCollectorFilter = (msg) => msg.author.id === interaction.user.id;
                              const messageCollector = interaction.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 60000,
                              });

                              let authorName = '';
                              const authorIcon = guideEmbed.author ? guideEmbed.author.iconURL : null;

                              messageCollector.on('collect', async (collectedMessage) => {
                                authorName = collectedMessage.content.slice(0, 250);
                                collectedMessage.delete();

                                if (!guideEmbed.author) {
                                  guideEmbed.setAuthor(authorName, authorIcon, null);
                                } else {
                                  guideEmbed.setAuthor(authorName, guideEmbed.author.iconURL, guideEmbed.author.url);
                                }

                                messageComponent.edit({ embeds: [guideEmbed] });
                              });
                            } else if (interaction.customId === 'author_icon_welcome') {
                              await interaction.reply({
                                content: `Please provide a valid image URL (ending with .jpg, .jpeg, .png, or .gif) for the author icon, or type 'servericon' to set the server icon, 'usericon' to set the user icon, 'none' to remove the icon.`,
                                ephemeral: true,
                              });

                              const messageCollectorFilter = (msg) => msg.author.id === interaction.user.id;
                              const messageCollector = interaction.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 60000,
                              });

                              messageCollector.on('collect', async (collectedMessage) => {
                                const imageInput = collectedMessage.content.toLowerCase();

                                if (imageInput === 'none') {
                                  if (guideEmbed.author && guideEmbed.author.iconURL !== null) {
                                    guideEmbed.setAuthor(guideEmbed.author.name, null, null);
                                    await interaction.followUp({ content: 'Author icon removed successfully.', ephemeral: true });
                                    messageComponent.edit({ embeds: [guideEmbed] });
                                  } else {
                                    await interaction.followUp({ content: 'There is no author icon to remove.', ephemeral: true });
                                  }
                                } else {
                                  const imageRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/;
                                  if (!imageRegex.test(imageInput)) {
                                    return interaction.followUp({
                                      content: "Invalid input. Please provide a valid image URL (ending with .jpg, .jpeg, .png, or .gif), or type 'none' to remove the author icon.",
                                      ephemeral: true,
                                    });
                                  }
                                  collectedMessage.delete();

                                  if (!guideEmbed.author) {
                                    guideEmbed.setAuthor('', imageInput, null);
                                  } else {
                                    guideEmbed.setAuthor(guideEmbed.author.name, imageInput, guideEmbed.author.url);
                                  }

                                  await interaction.followUp({ content: 'Author icon added successfully.', ephemeral: true });
                                  messageComponent.edit({ embeds: [guideEmbed] });
                                }
                              });
                            } else if (interaction.customId === 'title_welcome') {
                              await interaction.reply({ content: `Please provide a Title for Embed below maximum character limit is 250`, ephemeral: true })
                              const messageCollectorFilter = msg => msg.author.id === message.author.id;
                              const messageCollector = message.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 60000
                              });

                              messageCollector.on('collect', async collectedMessage => {
                                const titleTicket = collectedMessage.content.slice(0, 250);
                                collectedMessage.delete();
                                guideEmbed.setTitle(titleTicket);
                                messageComponent.edit({ embeds: [guideEmbed] });
                              });
                            } else if (interaction.customId === 'description_welcome') {
                              await interaction.reply({ content: `Please provide a description for Embed below maximum character limit is 4048`, ephemeral: true })
                              const messageCollectorFilter = msg => msg.author.id === message.author.id;
                              const messageCollector = message.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 300000
                              });

                              messageCollector.on('collect', async collectedMessage => {
                                const titleDescription = collectedMessage.content.slice(0, 4048);
                                collectedMessage.delete();
                                guideEmbed.setDescription(titleDescription);
                                messageComponent.edit({ embeds: [guideEmbed] });
                              });
                            } else if (interaction.customId === 'color_welcome') {
                              await interaction.reply({ content: `Please provide a Color for Embed below and it should be hex code (#000000)`, ephemeral: true })
                              const messageCollectorFilter = msg => msg.author.id === message.author.id;
                              const messageCollector = message.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 60000
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
                            } else if (interaction.customId === 'thumbnail_welcome') {
                              const userAvatarURL = interaction.user.displayAvatarURL({ dynamic: true });

                              if (guideEmbed.thumbnail && guideEmbed.thumbnail.url === userAvatarURL) {
                                guideEmbed.setThumbnail(null);
                                await interaction.reply({ content: "Thumbnail (user avatar) removed successfully.", ephemeral: true });
                                messageComponent.edit({ embeds: [guideEmbed] });
                              } else {
                                guideEmbed.setThumbnail(userAvatarURL);
                                await interaction.reply({ content: "Thumbnail (user avatar) added successfully.", ephemeral: true });
                                messageComponent.edit({ embeds: [guideEmbed] });
                              }
                            } else if (interaction.customId === 'image_welcome') {
                              await interaction.reply({ content: `Please provide a valid image URL (ending with .jpg, .jpeg, .png, or .gif), or type 'none' to remove the image.`, ephemeral: true });

                              const messageCollectorFilter = msg => msg.author.id === interaction.user.id;
                              const messageCollector = interaction.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 60000
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
                                  await interaction.followUp({ content: "Image added successfully.", ephemeral: true });
                                  messageComponent.edit({ embeds: [guideEmbed] });
                                }
                              });
                            } else if (interaction.customId === 'footer_text_welcome') {
                              await interaction.reply({ content: `Please provide a footer for the Embed below. The maximum character limit is 250`, ephemeral: true });

                              const messageCollectorFilter = (msg) => msg.author.id === interaction.user.id;
                              const messageCollector = interaction.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 60000,
                              });

                              messageCollector.on('collect', async (collectedMessage) => {
                                const footerText = collectedMessage.content.slice(0, 250);
                                collectedMessage.delete();

                                if (!guideEmbed.footer) {
                                  guideEmbed.setFooter(footerText, null);
                                } else {
                                  guideEmbed.setFooter(footerText, guideEmbed.footer.iconURL);
                                }

                                messageComponent.edit({ embeds: [guideEmbed] });
                              });
                            } else if (interaction.customId === 'footer_icon_welcome') {
                              await interaction.reply({
                                content: `Please provide a valid image URL (ending with .jpg, .jpeg, .png, or .gif) for the footer icon, or type 'servericon' to set the server icon, 'usericon' to set the user icon, 'none' to remove the icon.`,
                                ephemeral: true,
                              });

                              const messageCollectorFilter = (msg) => msg.author.id === interaction.user.id;
                              const messageCollector = interaction.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 60000,
                              });

                              messageCollector.on('collect', async (collectedMessage) => {
                                const imageInput = collectedMessage.content.toLowerCase();

                                if (imageInput === 'none') {
                                  if (guideEmbed.footer && guideEmbed.footer.iconURL !== null) {
                                    guideEmbed.setFooter(guideEmbed.footer.text);
                                    await interaction.followUp({ content: 'Footer icon removed successfully.', ephemeral: true });
                                    messageComponent.edit({ embeds: [guideEmbed] });
                                  } else {
                                    await interaction.followUp({ content: 'There is no footer icon to remove.', ephemeral: true });
                                  }
                                } else {
                                  const imageRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/;
                                  if (!imageRegex.test(imageInput)) {
                                    return interaction.followUp({
                                      content: "Invalid input. Please provide a valid image URL (ending with .jpg, .jpeg, .png, or .gif), or type 'none' to remove the footer icon.",
                                      ephemeral: true,
                                    });
                                  }

                                  collectedMessage.delete();

                                  guideEmbed.setFooter(guideEmbed.footer.text, imageInput);
                                  await interaction.followUp({ content: 'Footer icon added successfully.', ephemeral: true });
                                  messageComponent.edit({ embeds: [guideEmbed] });
                                }
                              });
                            } else if (interaction.customId === 'message_welcome') {
                              await interaction.reply({ content: `Please provide a message for Welcome message below maximum character limit is 4048`, ephemeral: true });
                              const messageCollectorFilter = msg => msg.author.id === message.author.id;
                              const messageCollector = message.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 300000
                              });

                              messageCollector.on('collect', async collectedMessage => {
                                const messageWelcome = collectedMessage.content.slice(0, 4048);
                                collectedMessage.delete();
                                messageComponent.edit({ content: messageWelcome });
                              });
                            } else if (interaction.customId === 'abort_welcome') {
                              await messageComponent.edit({ content: `Aborted this process`, components: [] });
                            } else if (interaction.customId === 'default_welcome') {
                              guideEmbed.setColor(client.color);
                              guideEmbed.setTitle('');
                              guideEmbed.setDescription('Default Embed Description');
                              guideEmbed.setAuthor('', null, null);
                              guideEmbed.setFooter('', null);
                              guideEmbed.setThumbnail(null);
                              guideEmbed.setImage(null);
                              messageComponent.edit({ content: null, embeds: [guideEmbed], components: [button1] });
                              await interaction.reply({ content: 'Embed has been reset to the default state.', ephemeral: true });
                            } else if (interaction.customId === 'preview_welcome') {
                              await interaction.reply({ embeds: [guideEmbed], ephemeral: true });
                            } else if (interaction.customId === 'back_welcome') {
                              await interaction.update({ components: [button1] })
                            } else if (interaction.customId === 'save_welcome') {
                              await interaction.reply({ content: 'Please provide the ID or mention of a channel through which this panel is to be submitted.', ephemeral: true });
                              const channelFilter = (msg) => msg.author.id === message.author.id && (msg.mentions.channels.size > 0 || /^[0-9]+$/.test(msg.content));
                              const channelCollector = message.channel.createMessageCollector({
                                filter: channelFilter,
                                max: 1,
                                time: 60000,
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

                                if (!channelId || !message.guild.channels.cache.has(channelId)) {
                                  return interaction.editReply({ content: 'Invalid channel ID or mention. Please provide a valid channel ID or mention a channel.', ephemeral: true });
                                }

                                await client.db9.set(`${message.guild.id}_welcome_embed2`, {
                                  channelID: channelId,
                                  messageText: messageComponent.content,
                                  authorText: guideEmbed.author.name,
                                  authorIcon: guideEmbed.author.iconURL,
                                  title: guideEmbed.title,
                                  description: guideEmbed.description,
                                  color: guideEmbed.color,
                                  image: guideEmbed.image.url,
                                  thumbnail: guideEmbed.thumbnail.url,
                                  footerText: guideEmbed.footer.text,
                                  footerIcon: guideEmbed.footer.iconURL,
                                });
                                await client.db9.delete(`${message.guild.id}_welcome_message2`)

                                collectedMessage.delete();
                                interaction.editReply({ content: `Welcome channel for this Slot set to <#${channelId}>.`, ephemeral: true });
                                messageComponent.edit({ components: [] });
                              });
                            } else if (interaction.customId === 'abort_welcome') {
                              await messageComponent.edit({ content: `Aborted this process`, components: [] });
                            }
                          }
                        });
                      }
                    }
                  });
                } else if (selectedValue === 'welcome3') {
                  await slotComponent.delete();
                  if (premium.active !== true) {
                    return interaction.reply({ content: `Please buy premium to use this command! use ${prefix}premium purchase`, ephemeral: true })
                  }
                  const styleComponent = await message.channel.send({ content: `Please Choose the Style for Welcome`, components: [styleOptions] });

                  const collector = styleComponent.createMessageComponentCollector({
                    filter: (interaction) => {
                      if (interaction.user.id === message.author.id) return true;
                      else {
                        return interaction.reply({ content: `${emoji.util.cross} | This Pagination is not for you.`, ephemeral: true });
                      }
                    },
                    time: 400000,
                    idle: 400000 / 2,
                  });

                  collector.on('collect', async (interaction) => {
                    if (interaction.isSelectMenu()) {
                      const selectedValue = interaction.values[0];
                      if (selectedValue === 'style1') {
                        await interaction.reply({ content: '```xml\n<<server.member_count>> = server member count\n<<server.name>> = server name\n<<user.name>> = username of new member\n<<user.mention>> = mention of the new user\n<<user.created_at>> = creation time of account of user\n<<user.joined_at>> = joining time of the user.\n```', ephemeral: true });
                        await styleComponent.delete();

                        let messageText = await client.db9.get(`${message.guild.id}_welcome_message3.message`);
                        if (messageText !== undefined) {
                          messageText = messageText.toString();
                        } else {
                          messageText = `Your message will look like this.`;
                        }

                        const messageComponent = await message.channel.send({ content: messageText, components: [button] });

                        const collector = messageComponent.createMessageComponentCollector({
                          filter: (interaction) => {
                            if (interaction.user.id === message.author.id) return true;
                            else {
                              return interaction.reply({ content: `${emoji.util.cross} | This Pagination is not for you.`, ephemeral: true });
                            }
                          },
                          time: 400000,
                          idle: 400000 / 2,
                        });

                        collector.on('collect', async (interaction) => {
                          if (interaction.isButton()) {
                            if (interaction.customId === 'body_welcome') {
                              await interaction.reply({ content: `Please provide a message for Welcome message below maximum character limit is 4048`, ephemeral: true });
                              const messageCollectorFilter = msg => msg.author.id === message.author.id;
                              const messageCollector = message.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 300000
                              });

                              messageCollector.on('collect', async collectedMessage => {
                                const messageWelcome = collectedMessage.content.slice(0, 4048);
                                collectedMessage.delete();
                                messageComponent.edit({ content: messageWelcome });
                              });
                            } else if (interaction.customId === 'preview_welcome') {
                              await interaction.reply({ content: messageComponent.content, ephemeral: true });
                            } else if (interaction.customId === 'save_welcome') {
                              await interaction.reply({ content: 'Please provide the ID or mention of a channel through which this panel is to be submitted.', ephemeral: true });
                              const channelFilter = (msg) => msg.author.id === message.author.id && (msg.mentions.channels.size > 0 || /^[0-9]+$/.test(msg.content));
                              const channelCollector = message.channel.createMessageCollector({
                                filter: channelFilter,
                                max: 1,
                                time: 60000,
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

                                if (!channelId || !message.guild.channels.cache.has(channelId)) {
                                  return interaction.editReply({ content: 'Invalid channel ID or mention. Please provide a valid channel ID or mention a channel.', ephemeral: true });
                                }

                                await client.db9.set(`${message.guild.id}_welcome_message3`, {
                                  channelID: channelId,
                                  message: messageComponent.content
                                });
                                await client.db9.delete(`${message.guild.id}_welcome_embed3`)

                                collectedMessage.delete();
                                interaction.editReply({ content: `Welcome channel for this Slot set to <#${channelId}>.`, ephemeral: true });
                                messageComponent.edit({ components: [] });
                              });
                            } else if (interaction.customId === 'abort_welcome') {
                              await messageComponent.edit({ content: `Aborted this process`, components: [] });
                            }
                          }
                        });
                      } else if (selectedValue === 'style2') {
                        await interaction.reply({ content: '```xml\n<<server.member_count>> = server member count\n<<server.name>> = server name\n<<user.name>> = username of new member\n<<user.mention>> = mention of the new user\n<<user.created_at>> = creation time of account of user\n<<user.joined_at>> = joining time of the user.\n```', ephemeral: true });
                        await styleComponent.delete();
                        let messageText = await client.db9.get(`${message.guild.id}_welcome_embed3.messageText`);
                        if (messageText !== undefined) {
                          messageText = messageText.toString();
                        } else {
                          messageText = null;
                        }

                        let authorText = await client.db9.get(`${message.guild.id}_welcome_embed3.authorText`);
                        if (authorText !== undefined) {
                          authorText = authorText.toString();
                        } else {
                          authorText = '';
                        }

                        let authorIcon = await client.db9.get(`${message.guild.id}_welcome_embed3.authorIcon`);
                        if (authorIcon !== undefined) {
                          authorIcon = message.author.displayAvatarURL({ dynamic: true });
                        } else {
                          authorIcon = null;
                        }

                        let title = await client.db9.get(`${message.guild.id}_welcome_embed3.title`);
                        if (title !== undefined) {
                          title = title.toString();
                        } else {
                          title = '';
                        }

                        let description = await client.db9.get(`${message.guild.id}_welcome_embed3.description`);
                        if (description !== undefined) {
                          description = description.toString();
                        } else {
                          description = 'Default Embed Description';
                        }

                        let color = await client.db9.get(`${message.guild.id}_welcome_embed3.color`);
                        if (color === undefined) {
                          color = client.color;
                        }

                        let image = await client.db9.get(`${message.guild.id}_welcome_embed3.image`);
                        if (image !== undefined) {
                          image = image;
                        } else {
                          image = null;
                        }

                        let thumbnail = await client.db9.get(`${message.guild.id}_welcome_embed3.thumbnail`);
                        if (thumbnail !== undefined) {
                          thumbnail = message.author.displayAvatarURL({ dynamic: true });
                        } else {
                          thumbnail = null;
                        }

                        let footerText = await client.db9.get(`${message.guild.id}_welcome_embed3.footerText`);
                        if (footerText !== undefined) {
                          footerText = footerText.toString();
                        } else {
                          footerText = '';
                        }

                        let footerIcon = await client.db9.get(`${message.guild.id}_welcome_embed3.footerIcon`);
                        if (footerIcon !== undefined) {
                          footerIcon = footerIcon;
                        } else {
                          footerIcon = null;
                        }

                        const guideEmbed = new EmbedBuilder()
                          .setColor(color)
                          .setTitle(title)
                          .setDescription(description)
                          .setAuthor({ name: authorText, iconURL: authorIcon, url: null })
                          .setFooter({ text: footerText, iconURL: footerIcon })
                          .setThumbnail(thumbnail)
                          .setImage(image)

                        const messageComponent = await message.channel.send({ content: messageText, embeds: [guideEmbed], components: [button1] });

                        const collector = messageComponent.createMessageComponentCollector({
                          filter: (interaction) => {
                            if (interaction.user.id === message.author.id) return true;
                            else {
                              return interaction.reply({ content: `${emoji.util.cross} | This Pagination is not for you.`, ephemeral: true });
                            }
                          },
                          time: 400000,
                          idle: 400000 / 2,
                        });

                        collector.on('collect', async (interaction) => {
                          if (interaction.isButton()) {
                            if (interaction.customId === 'body_welcome') {
                              await interaction.update({ components: [button2, button3, button4] });
                            } else if (interaction.customId === 'author_text_welcome') {
                              await interaction.reply({ content: `Please provide an Author for the Embed below. The maximum character limit is 250.`, ephemeral: true });

                              const messageCollectorFilter = (msg) => msg.author.id === interaction.user.id;
                              const messageCollector = interaction.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 60000,
                              });

                              let authorName = '';
                              const authorIcon = guideEmbed.author ? guideEmbed.author.iconURL : null;

                              messageCollector.on('collect', async (collectedMessage) => {
                                authorName = collectedMessage.content.slice(0, 250);
                                collectedMessage.delete();

                                if (!guideEmbed.author) {
                                  guideEmbed.setAuthor(authorName, authorIcon, null);
                                } else {
                                  guideEmbed.setAuthor(authorName, guideEmbed.author.iconURL, guideEmbed.author.url);
                                }

                                messageComponent.edit({ embeds: [guideEmbed] });
                              });
                            } else if (interaction.customId === 'author_icon_welcome') {
                              await interaction.reply({
                                content: `Please provide a valid image URL (ending with .jpg, .jpeg, .png, or .gif) for the author icon, or type 'servericon' to set the server icon, 'usericon' to set the user icon, 'none' to remove the icon.`,
                                ephemeral: true,
                              });

                              const messageCollectorFilter = (msg) => msg.author.id === interaction.user.id;
                              const messageCollector = interaction.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 60000,
                              });

                              messageCollector.on('collect', async (collectedMessage) => {
                                const imageInput = collectedMessage.content.toLowerCase();

                                if (imageInput === 'none') {
                                  if (guideEmbed.author && guideEmbed.author.iconURL !== null) {
                                    guideEmbed.setAuthor(guideEmbed.author.name, null, null);
                                    await interaction.followUp({ content: 'Author icon removed successfully.', ephemeral: true });
                                    messageComponent.edit({ embeds: [guideEmbed] });
                                  } else {
                                    await interaction.followUp({ content: 'There is no author icon to remove.', ephemeral: true });
                                  }
                                } else {
                                  const imageRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/;
                                  if (!imageRegex.test(imageInput)) {
                                    return interaction.followUp({
                                      content: "Invalid input. Please provide a valid image URL (ending with .jpg, .jpeg, .png, or .gif), or type 'none' to remove the author icon.",
                                      ephemeral: true,
                                    });
                                  }
                                  collectedMessage.delete();

                                  if (!guideEmbed.author) {
                                    guideEmbed.setAuthor('', imageInput, null);
                                  } else {
                                    guideEmbed.setAuthor(guideEmbed.author.name, imageInput, guideEmbed.author.url);
                                  }

                                  await interaction.followUp({ content: 'Author icon added successfully.', ephemeral: true });
                                  messageComponent.edit({ embeds: [guideEmbed] });
                                }
                              });
                            } else if (interaction.customId === 'title_welcome') {
                              await interaction.reply({ content: `Please provide a Title for Embed below maximum character limit is 250`, ephemeral: true })
                              const messageCollectorFilter = msg => msg.author.id === message.author.id;
                              const messageCollector = message.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 60000
                              });

                              messageCollector.on('collect', async collectedMessage => {
                                const titleTicket = collectedMessage.content.slice(0, 250);
                                collectedMessage.delete();
                                guideEmbed.setTitle(titleTicket);
                                messageComponent.edit({ embeds: [guideEmbed] });
                              });
                            } else if (interaction.customId === 'description_welcome') {
                              await interaction.reply({ content: `Please provide a description for Embed below maximum character limit is 4048`, ephemeral: true })
                              const messageCollectorFilter = msg => msg.author.id === message.author.id;
                              const messageCollector = message.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 300000
                              });

                              messageCollector.on('collect', async collectedMessage => {
                                const titleDescription = collectedMessage.content.slice(0, 4048);
                                collectedMessage.delete();
                                guideEmbed.setDescription(titleDescription);
                                messageComponent.edit({ embeds: [guideEmbed] });
                              });
                            } else if (interaction.customId === 'color_welcome') {
                              await interaction.reply({ content: `Please provide a Color for Embed below and it should be hex code (#000000)`, ephemeral: true })
                              const messageCollectorFilter = msg => msg.author.id === message.author.id;
                              const messageCollector = message.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 60000
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
                            } else if (interaction.customId === 'thumbnail_welcome') {
                              const userAvatarURL = interaction.user.displayAvatarURL({ dynamic: true });

                              if (guideEmbed.thumbnail && guideEmbed.thumbnail.url === userAvatarURL) {
                                guideEmbed.setThumbnail(null);
                                await interaction.reply({ content: "Thumbnail (user avatar) removed successfully.", ephemeral: true });
                                messageComponent.edit({ embeds: [guideEmbed] });
                              } else {
                                guideEmbed.setThumbnail(userAvatarURL);
                                await interaction.reply({ content: "Thumbnail (user avatar) added successfully.", ephemeral: true });
                                messageComponent.edit({ embeds: [guideEmbed] });
                              }
                            } else if (interaction.customId === 'image_welcome') {
                              await interaction.reply({ content: `Please provide a valid image URL (ending with .jpg, .jpeg, .png, or .gif), or type 'none' to remove the image.`, ephemeral: true });

                              const messageCollectorFilter = msg => msg.author.id === interaction.user.id;
                              const messageCollector = interaction.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 60000
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
                                  await interaction.followUp({ content: "Image added successfully.", ephemeral: true });
                                  messageComponent.edit({ embeds: [guideEmbed] });
                                }
                              });
                            } else if (interaction.customId === 'footer_text_welcome') {
                              await interaction.reply({ content: `Please provide a footer for the Embed below. The maximum character limit is 250`, ephemeral: true });

                              const messageCollectorFilter = (msg) => msg.author.id === interaction.user.id;
                              const messageCollector = interaction.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 60000,
                              });

                              messageCollector.on('collect', async (collectedMessage) => {
                                const footerText = collectedMessage.content.slice(0, 250);
                                collectedMessage.delete();

                                if (!guideEmbed.footer) {
                                  guideEmbed.setFooter(footerText, null);
                                } else {
                                  guideEmbed.setFooter(footerText, guideEmbed.footer.iconURL);
                                }

                                messageComponent.edit({ embeds: [guideEmbed] });
                              });
                            } else if (interaction.customId === 'footer_icon_welcome') {
                              await interaction.reply({
                                content: `Please provide a valid image URL (ending with .jpg, .jpeg, .png, or .gif) for the footer icon, or type 'servericon' to set the server icon, 'usericon' to set the user icon, 'none' to remove the icon.`,
                                ephemeral: true,
                              });

                              const messageCollectorFilter = (msg) => msg.author.id === interaction.user.id;
                              const messageCollector = interaction.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 60000,
                              });

                              messageCollector.on('collect', async (collectedMessage) => {
                                const imageInput = collectedMessage.content.toLowerCase();

                                if (imageInput === 'none') {
                                  if (guideEmbed.footer && guideEmbed.footer.iconURL !== null) {
                                    guideEmbed.setFooter(guideEmbed.footer.text);
                                    await interaction.followUp({ content: 'Footer icon removed successfully.', ephemeral: true });
                                    messageComponent.edit({ embeds: [guideEmbed] });
                                  } else {
                                    await interaction.followUp({ content: 'There is no footer icon to remove.', ephemeral: true });
                                  }
                                } else {
                                  const imageRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg)/;
                                  if (!imageRegex.test(imageInput)) {
                                    return interaction.followUp({
                                      content: "Invalid input. Please provide a valid image URL (ending with .jpg, .jpeg, .png, or .gif), or type 'none' to remove the footer icon.",
                                      ephemeral: true,
                                    });
                                  }

                                  collectedMessage.delete();

                                  guideEmbed.setFooter(guideEmbed.footer.text, imageInput);
                                  await interaction.followUp({ content: 'Footer icon added successfully.', ephemeral: true });
                                  messageComponent.edit({ embeds: [guideEmbed] });
                                }
                              });
                            } else if (interaction.customId === 'message_welcome') {
                              await interaction.reply({ content: `Please provide a message for Welcome message below maximum character limit is 4048`, ephemeral: true });
                              const messageCollectorFilter = msg => msg.author.id === message.author.id;
                              const messageCollector = message.channel.createMessageCollector({
                                filter: messageCollectorFilter,
                                max: 1,
                                time: 300000
                              });

                              messageCollector.on('collect', async collectedMessage => {
                                const messageWelcome = collectedMessage.content.slice(0, 4048);
                                collectedMessage.delete();
                                messageComponent.edit({ content: messageWelcome });
                              });
                            } else if (interaction.customId === 'abort_welcome') {
                              await messageComponent.edit({ content: `Aborted this process`, components: [] });
                            } else if (interaction.customId === 'default_welcome') {
                              guideEmbed.setColor(client.color);
                              guideEmbed.setTitle('');
                              guideEmbed.setDescription('Default Embed Description');
                              guideEmbed.setAuthor('', null, null);
                              guideEmbed.setFooter('', null);
                              guideEmbed.setThumbnail(null);
                              guideEmbed.setImage(null);
                              messageComponent.edit({ content: null, embeds: [guideEmbed], components: [button1] });
                              await interaction.reply({ content: 'Embed has been reset to the default state.', ephemeral: true });
                            } else if (interaction.customId === 'preview_welcome') {
                              await interaction.reply({ embeds: [guideEmbed], ephemeral: true });
                            } else if (interaction.customId === 'back_welcome') {
                              await interaction.update({ components: [button1] })
                            } else if (interaction.customId === 'save_welcome') {
                              await interaction.reply({ content: 'Please provide the ID or mention of a channel through which this panel is to be submitted.', ephemeral: true });
                              const channelFilter = (msg) => msg.author.id === message.author.id && (msg.mentions.channels.size > 0 || /^[0-9]+$/.test(msg.content));
                              const channelCollector = message.channel.createMessageCollector({
                                filter: channelFilter,
                                max: 1,
                                time: 60000,
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

                                if (!channelId || !message.guild.channels.cache.has(channelId)) {
                                  return interaction.editReply({ content: 'Invalid channel ID or mention. Please provide a valid channel ID or mention a channel.', ephemeral: true });
                                }

                                await client.db9.set(`${message.guild.id}_welcome_embed3`, {
                                  channelID: channelId,
                                  messageText: messageComponent.content,
                                  authorText: guideEmbed.author.name,
                                  authorIcon: guideEmbed.author.iconURL,
                                  title: guideEmbed.title,
                                  description: guideEmbed.description,
                                  color: guideEmbed.color,
                                  image: guideEmbed.image.url,
                                  thumbnail: guideEmbed.thumbnail.url,
                                  footerText: guideEmbed.footer.text,
                                  footerIcon: guideEmbed.footer.iconURL,
                                });
                                await client.db9.delete(`${message.guild.id}_welcome_message3`)

                                collectedMessage.delete();
                                interaction.editReply({ content: `Welcome channel for this Slot set to <#${channelId}>.`, ephemeral: true });
                                messageComponent.edit({ components: [] });
                              });
                            } else if (interaction.customId === 'abort_welcome') {
                              await messageComponent.edit({ content: `Aborted this process`, components: [] });
                            }
                          }
                        });
                      }
                    }
                  });
                }
              }
            });
            break;
        }
        break;

      case 'test':
        const slotComponent = await message.channel.send({ content: `Please Choose the Slot for Welcome`, components: [presetOptions] });

        const collector = slotComponent.createMessageComponentCollector({
          filter: (interaction) => {
            if (interaction.user.id === message.author.id) return true;
            else {
              return interaction.reply({ content: `${emoji.util.cross} | This Pagination is not for you.`, ephemeral: true });
            }
          },
          time: 400000,
          idle: 400000 / 2,
        });

        collector.on('collect', async (interaction) => {
          if (interaction.isSelectMenu()) {
            const selectedValue = interaction.values[0];
            if (selectedValue === 'welcome1') {
              await slotComponent.delete();
              const messageWelcome = await client.db9.get(`${message.guild.id}_welcome_message1`);
              const embedWelcome = await client.db9.get(`${message.guild.id}_welcome_embed1`);
              if (messageWelcome) {
                const channelID = await client.db9.get(`${message.guild.id}_welcome_message1.channelID`);
                const channel = message.guild.channels.cache.get(channelID);
                if (!channel) {
                  return message.channel.send({ content: `This Slot welcome channel has been deleted you have to set it up again` });
                } else {
                  let messageText = await client.db9.get(`${message.guild.id}_welcome_message1.message`);
                  if (messageText !== undefined) {
                    messageText = messageText.toString();
                  }
                  const placeholders = {
                    '<<server.member_count>>': message.guild.memberCount,
                    '<<server.name>>': message.guild.name,
                    '<<user.name>>': message.author.username,
                    '<<user.mention>>': message.author.toString(),
                    '<<user.created_at>>': message.author.createdAt.toDateString(),
                    '<<user.joined_at>>': message.member.joinedAt.toDateString(),
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
                const channelID = await client.db9.get(`${message.guild.id}_welcome_embed1.channelID`);
                const channel = message.guild.channels.cache.get(channelID);
                if (!channel) {
                  return message.channel.send({ content: `This Slot welcome channel has been deleted you have to set it up again` });
                }

                let messageText = await client.db9.get(`${message.guild.id}_welcome_embed1.messageText`);
                if (messageText !== undefined) {
                  messageText = messageText.toString();
                } else {
                  messageText = null;
                }

                let authorText = await client.db9.get(`${message.guild.id}_welcome_embed1.authorText`);
                if (authorText !== undefined) {
                  authorText = authorText.toString();
                } else {
                  authorText = '';
                }

                let authorIcon = await client.db9.get(`${message.guild.id}_welcome_embed1.authorIcon`);
                if (authorIcon !== undefined) {
                  authorIcon = message.author.displayAvatarURL({ dynamic: true });
                } else {
                  authorIcon = null;
                }

                let title = await client.db9.get(`${message.guild.id}_welcome_embed1.title`);
                if (title !== undefined) {
                  title = title.toString();
                } else {
                  title = '';
                }

                let description = await client.db9.get(`${message.guild.id}_welcome_embed1.description`);
                if (description !== undefined) {
                  description = description.toString();
                } else {
                  description = 'Default Embed Description';
                }

                let color = await client.db9.get(`${message.guild.id}_welcome_embed1.color`);
                if (color === undefined) {
                  color = client.color;
                }

                let image = await client.db9.get(`${message.guild.id}_welcome_embed1.image`);
                if (image !== undefined) {
                  image = image;
                } else {
                  image = null;
                }

                let thumbnail = await client.db9.get(`${message.guild.id}_welcome_embed1.thumbnail`);
                if (thumbnail !== undefined) {
                  thumbnail = message.author.displayAvatarURL({ dynamic: true });
                } else {
                  thumbnail = null;
                }

                let footerText = await client.db9.get(`${message.guild.id}_welcome_embed1.footerText`);
                if (footerText !== undefined) {
                  footerText = footerText.toString();
                } else {
                  footerText = '';
                }

                let footerIcon = await client.db9.get(`${message.guild.id}_welcome_embed1.footerIcon`);
                if (footerIcon !== undefined) {
                  footerIcon = footerIcon;
                } else {
                  footerIcon = null;
                }

                const placeholders = {
                  '<<server.member_count>>': message.guild.memberCount,
                  '<<server.name>>': message.guild.name,
                  '<<user.name>>': message.author.username,
                  '<<user.mention>>': message.author.toString(),
                  '<<user.created_at>>': message.author.createdAt.toDateString(),
                  '<<user.joined_at>>': message.member.joinedAt.toDateString(),
                };

                const replacePlaceholders = (text) => {
                  for (const [placeholder, replacement] of Object.entries(placeholders)) {
                    const regex = new RegExp(placeholder, 'g');
                    text = text.replace(regex, replacement);
                  }
                  return text;
                };

                const messageReplaced = replacePlaceholders(messageText);
                const authorReplaced = replacePlaceholders(authorText);
                const titleReplaced = replacePlaceholders(title);
                const descriptionReplaced = replacePlaceholders(description);
                const footerReplaced = replacePlaceholders(footerText)

                const guideEmbed = new EmbedBuilder()
                  .setColor(color)
                  .setAuthor({ name: authorReplaced, iconURL: authorIcon, url: null })
                  .setTitle(titleReplaced)
                  .setDescription(descriptionReplaced)
                  .setThumbnail(thumbnail)
                  .setImage(image)
                  .setFooter({ text: footerReplaced, iconURL: footerIcon })

                await channel.send({ content: messageReplaced, embeds: [guideEmbed] });
              }
            } else if (selectedValue === 'welcome2') {
              await slotComponent.delete();
              if (premium.active !== true) {
                return interaction.reply({ content: `Please buy premium to use this command! use ${prefix}premium purchase`, ephemeral: true })
              }
              const messageWelcome = await client.db9.get(`${message.guild.id}_welcome_message2`);
              const embedWelcome = await client.db9.get(`${message.guild.id}_welcome_embed2`);
              if (messageWelcome) {
                const channelID = await client.db9.get(`${message.guild.id}_welcome_message2.channelID`);
                const channel = message.guild.channels.cache.get(channelID);
                if (!channel) {
                  return message.channel.send({ content: `This Slot welcome channel has been deleted you have to set it up again` });
                } else {
                  let messageText = await client.db9.get(`${message.guild.id}_welcome_message2.message`);
                  if (messageText !== undefined) {
                    messageText = messageText.toString();
                  }
                  const placeholders = {
                    '<<server.member_count>>': message.guild.memberCount,
                    '<<server.name>>': message.guild.name,
                    '<<user.name>>': message.author.username,
                    '<<user.mention>>': message.author.toString(),
                    '<<user.created_at>>': message.author.createdAt.toDateString(),
                    '<<user.joined_at>>': message.member.joinedAt.toDateString(),
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
                const channelID = await client.db9.get(`${message.guild.id}_welcome_embed2.channelID`);
                const channel = message.guild.channels.cache.get(channelID);
                if (!channel) {
                  return message.channel.send({ content: `This Slot welcome channel has been deleted you have to set it up again` });
                }

                let messageText = await client.db9.get(`${message.guild.id}_welcome_embed2.messageText`);
                if (messageText !== undefined) {
                  messageText = messageText.toString();
                } else {
                  messageText = null;
                }

                let authorText = await client.db9.get(`${message.guild.id}_welcome_embed2.authorText`);
                if (authorText !== undefined) {
                  authorText = authorText.toString();
                } else {
                  authorText = '';
                }

                let authorIcon = await client.db9.get(`${message.guild.id}_welcome_embed2.authorIcon`);
                if (authorIcon !== null) {
                  authorIcon = message.author.displayAvatarURL({ dynamic: true });
                } else {
                  authorIcon = null;
                }

                let title = await client.db9.get(`${message.guild.id}_welcome_embed2.title`);
                if (title !== undefined) {
                  title = title.toString();
                } else {
                  title = '';
                }

                let description = await client.db9.get(`${message.guild.id}_welcome_embed2.description`);
                if (description !== undefined) {
                  description = description.toString();
                } else {
                  description = 'Default Embed Description';
                }

                let color = await client.db9.get(`${message.guild.id}_welcome_embed2.color`);
                if (color === undefined) {
                  color = client.color;
                }

                let image = await client.db9.get(`${message.guild.id}_welcome_embed2.image`);
                if (image !== undefined) {
                  image = image;
                } else {
                  image = null;
                }

                let thumbnail = await client.db9.get(`${message.guild.id}_welcome_embed2.thumbnail`);
                if (thumbnail !== null) {
                  thumbnail = message.author.displayAvatarURL({ dynamic: true });
                } else {
                  thumbnail = null;
                }

                let footerText = await client.db9.get(`${message.guild.id}_welcome_embed2.footerText`);
                if (footerText !== undefined) {
                  footerText = footerText.toString();
                } else {
                  footerText = '';
                }

                let footerIcon = await client.db9.get(`${message.guild.id}_welcome_embed2.footerIcon`);
                if (footerIcon !== undefined) {
                  footerIcon = footerIcon;
                } else {
                  footerIcon = null;
                }

                const placeholders = {
                  '<<server.member_count>>': message.guild.memberCount,
                  '<<server.name>>': message.guild.name,
                  '<<user.name>>': message.author.username,
                  '<<user.mention>>': message.author.toString(),
                  '<<user.created_at>>': message.author.createdAt.toDateString(),
                  '<<user.joined_at>>': message.member.joinedAt.toDateString(),
                };

                const replacePlaceholders = (text) => {
                  for (const [placeholder, replacement] of Object.entries(placeholders)) {
                    const regex = new RegExp(placeholder, 'g');
                    text = text.replace(regex, replacement);
                  }
                  return text;
                };

                const messageReplaced = replacePlaceholders(messageText);
                const authorReplaced = replacePlaceholders(authorText);
                const titleReplaced = replacePlaceholders(title);
                const descriptionReplaced = replacePlaceholders(description);
                const footerReplaced = replacePlaceholders(footerText)

                const guideEmbed = new EmbedBuilder()
                  .setColor(color)
                  .setAuthor({ name: authorReplaced, iconURL: authorIcon, url: null })
                  .setTitle(titleReplaced)
                  .setDescription(descriptionReplaced)
                  .setThumbnail(thumbnail)
                  .setImage(image)
                  .setFooter({ text: footerReplaced, iconURL: footerIcon })

                await channel.send({ content: messageReplaced, embeds: [guideEmbed] });
              }
            } else if (selectedValue === 'welcome3') {
              await slotComponent.delete();
              if (premium.active !== true) {
                return interaction.reply({ content: `Please buy premium to use this command! use ${prefix}premium purchase`, ephemeral: true })
              }
              const messageWelcome = await client.db9.get(`${message.guild.id}_welcome_message3`);
              const embedWelcome = await client.db9.get(`${message.guild.id}_welcome_embed3`);
              if (messageWelcome) {
                const channelID = await client.db9.get(`${message.guild.id}_welcome_message3.channelID`);
                const channel = message.guild.channels.cache.get(channelID);
                if (!channel) {
                  return message.channel.send({ content: `This Slot welcome channel has been deleted you have to set it up again` });
                } else {
                  let messageText = await client.db9.get(`${message.guild.id}_welcome_message3.message`);
                  if (messageText !== undefined) {
                    messageText = messageText.toString();
                  }
                  const placeholders = {
                    '<<server.member_count>>': message.guild.memberCount,
                    '<<server.name>>': message.guild.name,
                    '<<user.name>>': message.author.username,
                    '<<user.mention>>': message.author.toString(),
                    '<<user.created_at>>': message.author.createdAt.toDateString(),
                    '<<user.joined_at>>': message.member.joinedAt.toDateString(),
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
                const channelID = await client.db9.get(`${message.guild.id}_welcome_embed3.channelID`);
                const channel = message.guild.channels.cache.get(channelID);
                if (!channel) {
                  return message.channel.send({ content: `This Slot welcome channel has been deleted you have to set it up again` });
                }

                let messageText = await client.db9.get(`${message.guild.id}_welcome_embed3.messageText`);
                if (messageText !== undefined) {
                  messageText = messageText.toString();
                } else {
                  messageText = null;
                }

                let authorText = await client.db9.get(`${message.guild.id}_welcome_embed3.authorText`);
                if (authorText !== undefined) {
                  authorText = authorText.toString();
                } else {
                  authorText = '';
                }

                let authorIcon = await client.db9.get(`${message.guild.id}_welcome_embed3.authorIcon`);
                if (authorIcon !== null) {
                  authorIcon = message.author.displayAvatarURL({ dynamic: true });
                } else {
                  authorIcon = null;
                }

                let title = await client.db9.get(`${message.guild.id}_welcome_embed3.title`);
                if (title !== undefined) {
                  title = title.toString();
                } else {
                  title = '';
                }

                let description = await client.db9.get(`${message.guild.id}_welcome_embed3.description`);
                if (description !== undefined) {
                  description = description.toString();
                } else {
                  description = 'Default Embed Description';
                }

                let color = await client.db9.get(`${message.guild.id}_welcome_embed3.color`);
                if (color === undefined) {
                  color = client.color;
                }

                let image = await client.db9.get(`${message.guild.id}_welcome_embed3.image`);
                if (image !== undefined) {
                  image = image;
                } else {
                  image = null;
                }

                let thumbnail = await client.db9.get(`${message.guild.id}_welcome_embed3.thumbnail`);
                if (thumbnail !== null) {
                  thumbnail = message.author.displayAvatarURL({ dynamic: true });
                } else {
                  thumbnail = null;
                }

                let footerText = await client.db9.get(`${message.guild.id}_welcome_embed3.footerText`);
                if (footerText !== undefined) {
                  footerText = footerText.toString();
                } else {
                  footerText = '';
                }

                let footerIcon = await client.db9.get(`${message.guild.id}_welcome_embed3.footerIcon`);
                if (footerIcon !== undefined) {
                  footerIcon = footerIcon;
                } else {
                  footerIcon = null;
                }

                const placeholders = {
                  '<<server.member_count>>': message.guild.memberCount,
                  '<<server.name>>': message.guild.name,
                  '<<user.name>>': message.author.username,
                  '<<user.mention>>': message.author.toString(),
                  '<<user.created_at>>': message.author.createdAt.toDateString(),
                  '<<user.joined_at>>': message.member.joinedAt.toDateString(),
                };

                const replacePlaceholders = (text) => {
                  for (const [placeholder, replacement] of Object.entries(placeholders)) {
                    const regex = new RegExp(placeholder, 'g');
                    text = text.replace(regex, replacement);
                  }
                  return text;
                };

                const messageReplaced = replacePlaceholders(messageText);
                const authorReplaced = replacePlaceholders(authorText);
                const titleReplaced = replacePlaceholders(title);
                const descriptionReplaced = replacePlaceholders(description);
                const footerReplaced = replacePlaceholders(footerText)

                const guideEmbed = new EmbedBuilder()
                  .setColor(color)
                  .setAuthor({ name: authorReplaced, iconURL: authorIcon, url: null })
                  .setTitle(titleReplaced)
                  .setDescription(descriptionReplaced)
                  .setThumbnail(thumbnail)
                  .setImage(image)
                  .setFooter({ text: footerReplaced, iconURL: footerIcon })

                await channel.send({ content: messageReplaced, embeds: [guideEmbed] });
              }
            }
          }
        })
        break;

      case 'reset':
        const keysToDelete = [
          `${message.guild.id}_welcome_message1`,
          `${message.guild.id}_welcome_embed1`,
          `${message.guild.id}_welcome_message2`,
          `${message.guild.id}_welcome_embed2`,
          `${message.guild.id}_welcome_message3`,
          `${message.guild.id}_welcome_embed3`,
        ];

        await Promise.all(keysToDelete.map((key) => client.db9.delete(key)));
        await message.channel.send({ content: `The database for welcoming has been successfully deleted for this guild.` })
        break;

      default:
        const welcomeGuide = new EmbedBuilder()
          .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
          .setThumbnail(client.user.displayAvatarURL())
          .setColor(client.color)
          .addFields(
            { name: `${emoji.util.arrow} \`${prefix}welcome\``, value: "Show this Message.", inline: false },
            { name: `${emoji.util.arrow} \`${prefix}welcome message panel\``, value: "Set up a welcome message with customization options.", inline: false },
            { name: `${emoji.util.arrow} \`${prefix}welcome test\``, value: "Test the configured welcome message slot.", inline: false },
            { name: `${emoji.util.arrow} \`${prefix}welcome reset\``, value: "Reset the welcome configuration.", inline: false }
          )
          .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

        message.channel.send({ embeds: [welcomeGuide] });
        break;
    }
  }
}
