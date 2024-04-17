const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const Settings = require('../../settings.js');
const emoji = require('../../emoji.js');
const owner = Settings.bot.credits.developerId;

module.exports = {
  name: 'ignore',
  voteOnly: true,
  UserPerms: ['ManageGuild', 'ManageChannels'],
  BotPerms: ['EmbedLinks'],
  run: async (client, message, args) => {
    const prefix = await client.db8.get(`${message.guild.id}_prefix`) || Settings.bot.info.prefix;
    const arypton = await client.users.fetch(owner);
    const user = message.guild.members.cache.get(args[2]) || message.mentions.members.first() || message.author;
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]) || message.channel;
    const premium = await client.db12.get(`${message.guild.id}_premium`);
    let channelLimit;
    let bypassLimit;

    if (premium.active === true) {
      channelLimit = 100;
      bypassLimit = 100;
    } else {
      channelLimit = 5;
      bypassLimit = 10
    }

    const embeds = {
      guide: new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
          { name: `${emoji.util.arrow} \`${prefix}ignore\``, value: "Shows the guide embed for the module.", inline: false },
          { name: `${emoji.util.arrow} \`${prefix}ignore channel add <channel>\``, value: "Add the channel in ignore channels.", inline: false },
          { name: `${emoji.util.arrow} \`${prefix}ignore bypass add <user mention/id>\``, value: "Add the user in ignore bypass.", inline: false },
          { name: `${emoji.util.arrow} \`${prefix}ignore channel remove <channel>\``, value: "Remove the channel from ignore channels.", inline: false },
          { name: `${emoji.util.arrow} \`${prefix}ignore bypass remove <user mention/id>\``, value: "Remove the user from ignore bypass.", inline: false },
          { name: `${emoji.util.arrow} \`${prefix}ignore channel show\``, value: "Show ignore module settings for the server.", inline: false },
          { name: `${emoji.util.arrow} \`${prefix}ignore bypass show\``, value: "Show ignore bypass module settings for the server.", inline: false },
          { name: `${emoji.util.arrow} \`${prefix}ignore channel reset\``, value: "Resets ignore settings for the server.", inline: false },
          { name: `${emoji.util.arrow} \`${prefix}ignore bypass reset\``, value: "Resets ignore bypass settings for the server.", inline: false }
        )
        .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
    };

    await handleIgnoreCommand(client, message, args);

    async function handleIgnoreCommand(client, message, args) {
      const option = args[0];
      const user = message.guild.members.cache.get(args[2]) || message.mentions.members.first() || message.author;
      const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]) || message.channel;

      switch (option) {
        case 'guide':
          return message.channel.send({ embeds: [embeds.guide] });
          break;
        case 'channel':
          if (args[1] === 'add') {
            await handleAddChannel(client, message, channel);
          } else if (args[1] === 'remove') {
            await handleRemoveChannel(client, message, channel);
          } else if (args[1] === 'show') {
            await handleConfig(client, message);
          } else if (args[1] === 'reset') {
            await handleReset(client, message);
          }
          break;
        case 'bypass':
          if (args[1] === 'add') {
            await handleAddBypass(client, message, user);
          } else if (args[1] === 'remove') {
            await handleRemoveBypass(client, message, user);
          } else if (args[1] === 'show') {
            await handleBypassConfig(client, message);
          } else if (args[1] === 'reset') {
            await handleBypassReset(client, message);
          }
          break;
        default:
          return message.channel.send({ embeds: [embeds.guide] });
      }
    }

    async function handleAddChannel(client, message, channel) {
      await client.db10.get(`${message.guild.id}_ic`).then(async (data) => {
        if (!data) {
          await client.db10.set(`${message.guild.id}_ic`, { ignorechannellist: [], ignorebypasslist: [] });
          return message.channel.send({ content: `${emoji.util.cross} | Please run the ignore command again because earlier database was not set up` });
        } else {
          if (!args[2]) {
            return message.channel.send({ content: `${emoji.util.cross} | Prioritize mentioning the channel or provide a valid channel ID.` });
          }
          if (!channel) {
            return message.channel.send({ content: `${emoji.util.cross} | Prioritize mentioning the channel or provide a valid channel ID.` });
          } else {
            if (data.ignorechannellist.includes(channel.id)) {
              return message.channel.send({ content: `${emoji.util.cross} | Already added \`${channel.name}\` in ignore channel for this guild.` });
            }
            if (data.ignorechannellist.length >= channelLimit) {
              if (channelLimit === 100) {
                return message.channel.send(`${emoji.util.cross} | With our premium subscription, you can enjoy an impressive channel addition limit of up to 100.`);
              } else {
                return message.channel.send(`${emoji.util.cross} | Upgrade to our premium plan to access an enhanced channel Addition limit of up to 100. Without premium, the maximum channel addition limit is restricted to 5. Unlock the potential for unlimited channel additions by opting for our Premium subscription.`);
              }
            } else {
              await client.db10.push(`${message.guild.id}_ic.ignorechannellist`, channel.id);
              return message.channel.send({ content: `${emoji.util.tick} | Added \`${channel.name}\` in ignore channel for this guild.` });
            }
          }
        }
      });
    }

    async function handleRemoveChannel(client, message, channel) {
      await client.db10.get(`${message.guild.id}_ic`).then(async (data) => {
        if (!data) {
          await client.db10.set(`${message.guild.id}_ic`, { ignorechannellist: [], ignorebypasslist: [] });
          return message.channel.send({ content: `${emoji.util.cross} | Please run the ignore command again because earlier database was not set up` });
        } else {
          if (!args[2]) {
            return message.channel.send({ content: `${emoji.util.cross} | Prioritize mentioning the channel or provide a valid channel ID.` });
          }
          if (!channel) {
            return message.channel.send({ content: `${emoji.util.cross} | Prioritize mentioning the channel or provide a valid channel ID.` });
          } else {
            if (!data.ignorechannellist.includes(channel.id)) {
              return message.channel.send({ content: `${emoji.util.cross} | \`${channel.name}\` Yet not added in ignore channel for this guild.` });
            } else {
              await client.db10.pull(`${message.guild.id}_ic.ignorechannellist`, channel.id);
              return message.channel.send({ content: `${emoji.util.tick} | \`${channel.name}\` is Removed from ignore channel for this guild.` });
            }
          }
        }
      });
    }

    async function handleConfig(client, message) {
      await client.db10.get(`${message.guild.id}_ic`).then(async (data) => {
        if (!data) {
          await client.db10.set(`${message.guild.id}_ic`, { ignorechannellist: [], ignorebypasslist: [] });
          return message.channel.send({ content: `${emoji.util.cross} | Please run the ignore command again because earlier database was not set up` });
        } else {
          const channels = data.ignorechannellist;

          if (channels.length === 0) {
            return message.channel.send(`No channel is in ignore bypass Database`);
          }

          const itemsPerPage = 10;
          const totalPages = Math.ceil(channels.length / itemsPerPage);
          let currentPage = 0;

          const generateEmbed = (page) => {
            const startIndex = page * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, channels.length);
            const currentChannels = channels.slice(startIndex, endIndex);
            const mentions = [];

            currentChannels.forEach((channelId, i) => {
              const channel = message.guild.channels.cache.get(channelId);
              if (channel) {
                mentions.push(`\`[${startIndex + i + 1}]\` | ID: [${channelId}](https://discord.com/channels/${message.guild.id}/${channelId}) | <#${channelId}>`);
              }
            });

            const configEmbed = new EmbedBuilder()
              .setColor(client.color)
              .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
              .setTitle(`Total ignore bypasss - Page ${currentPage + 1}/${totalPages}`)
              .setDescription(mentions.join('\n'))
              .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return configEmbed;
          };

          const embed = generateEmbed(currentPage);

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

          if (totalPages === 1) {
            pag.components.forEach((button) => {
              button.setDisabled(true);
            });
          }

          const messageComponent = await message.channel.send({ embeds: [embed], components: [pag] });

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

              const updatedEmbed = generateEmbed(currentPage);

              const firstButton = pag.components.find((component) => component.customId === "first");
              const previousButton = pag.components.find((component) => component.customId === "previous");
              const nextButton = pag.components.find((component) => component.customId === "next");
              const lastButton = pag.components.find((component) => component.customId === "last");

              firstButton.setDisabled(currentPage === 0);
              previousButton.setDisabled(currentPage === 0);
              nextButton.setDisabled(currentPage === totalPages - 1);
              lastButton.setDisabled(currentPage === totalPages - 1);

              interaction.update({ embeds: [updatedEmbed], components: [pag] });
            }
          });

          collector.on("end", () => {
            pag.components.forEach((button) => button.setDisabled(true));
            messageComponent.edit({ components: [pag] });
          });
        }
      });
    }

    async function handleReset(client, message) {
      await client.db10.get(`${message.guild.id}_ic`).then(async (data) => {
        if (!data) {
          await client.db10.set(`${message.guild.id}_ic`, { ignorechannellist: [], ignorebypasslist: [] });
          return message.channel.send({ content: `${emoji.util.cross} | Please run the ignore command again because earlier database was not set up` });
        } else {
          const users = data.ignorechannellist;
          const mentions = [];
          if (users.length !== 0) {
            await client.db10.set(`${message.guild.id}_ic`, { ignorechannellist: [], ignorebypasslist: [] });
            return message.channel.send(`Reseted ignore bypass database`);
          } else {
            return message.channel.send(`No channel is in ignore bypass Database`);
          }
        }
      });
    }

    async function handleAddBypass(client, message, user) {
      await client.db10.get(`${message.guild.id}_ic`).then(async (data) => {
        if (!data) {
          await client.db10.set(`${message.guild.id}_ic`, { ignorechannellist: [], ignorebypasslist: [] });
          return message.channel.send({ content: `${emoji.util.cross} | Please run the ignore command again because earlier database was not set up` });
        } else {
          if (!args[2]) {
            return message.channel.send({ content: `${emoji.util.cross} | Prioritize mentioning the user or provide a valid user ID.` });
          }
          if (!user) {
            return message.channel.send({ content: `${emoji.util.cross} | Prioritize mentioning the user or provide a valid user ID.` });
          } else {
            if (data.ignorebypasslist.includes(user.id)) {
              return message.channel.send({ content: `${emoji.util.cross} | Already added \`${user.user.username}\` in ignore bypass for this guild.` });
            }
            if (data.ignorebypasslist.length >= bypassLimit) {
              if (bypassLimit === 100) {
                return message.channel.send(`${emoji.util.cross} | With our premium subscription, you can enjoy an impressive Ignore Bypass ignore bypass Addition limit of up to 100.`);
              } else {
                return message.channel.send(`${emoji.util.cross} | Upgrade to our premium plan to access an enhanced Ignore Bypass ignore bypass Addition limit of up to 100. Without premium, the maximum Ignore Bypass ignore bypass Addition limit is restricted to 5. Unlock the potential for unlimited Ignore Bypass ignore bypass Additions by opting for our Premium subscription.`);
              }
            } else {
              await client.db10.push(`${message.guild.id}_ic.ignorebypasslist`, user.id);
              return message.channel.send({ content: `${emoji.util.tick} | Added \`${user.user.username}\` in ignore bypass for this guild.` });
            }
          }
        }
      });
    }

    async function handleRemoveBypass(client, message, user) {
      await client.db10.get(`${message.guild.id}_ic`).then(async (data) => {
        if (!data) {
          await client.db10.set(`${message.guild.id}_ic`, { ignorechannellist: [], ignorebypasslist: [] });
          return message.channel.send({ content: `${emoji.util.cross} | Please run the ignore command again because earlier database was not set up` });
        } else {
          if (!args[2]) {
            return message.channel.send({ content: `${emoji.util.cross} | Prioritize mentioning the user or provide a valid user ID.` });
          }
          if (!user) {
            return message.channel.send({ content: `${emoji.util.cross} | Prioritize mentioning the user or provide a valid user ID.` });
          } else {
            if (!data.ignorebypasslist.includes(user.id)) {
              return message.channel.send({ content: `${emoji.util.cross} | \`${user.user.username}\` Yet not added in ignore bypass for this guild.` });
            } else {
              await client.db10.pull(`${message.guild.id}_ic.ignorebypasslist`, user.id);
              return message.channel.send({ content: `${emoji.util.tick} | \`${user.user.username}\` is Removed from ignore bypass for this guild.` });
            }
          }
        }
      });
    }

    async function handleBypassConfig(client, message) {
      await client.db10.get(`${message.guild.id}_ic`).then(async (data) => {
        if (!data) {
          await client.db10.set(`${message.guild.id}_ic`, { ignorechannellist: [], ignorebypasslist: [] });
          return message.channel.send({ content: `${emoji.util.cross} | Please run the ignore command again because earlier database was not set up` });
        } else {
          const bypassUsers = data.ignorebypasslist;

          if (bypassUsers.length === 0) {
            return message.channel.send(`No users are in ignore bypass Database`);
          }

          const itemsPerPage = 10;
          const totalPages = Math.ceil(bypassUsers.length / itemsPerPage);
          let currentPage = 0;

          const generateEmbed = (page) => {
            const startIndex = page * itemsPerPage;
            const endIndex = Math.min(startIndex + itemsPerPage, bypassUsers.length);
            const currentBypass = bypassUsers.slice(startIndex, endIndex);
            const mentions = [];

            currentBypass.forEach((userId, i) => {
              const member = message.guild.members.cache.get(userId);
              if (member) {
                mentions.push(`\`[${startIndex + i + 1}]\` | ID: [${userId}](https://discord.com/users/${userId}) | <@${userId}>`);
              }
            });

            const configEmbed = new EmbedBuilder()
              .setColor(client.color)
              .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
              .setTitle(`Total Ignore Bypass Users - Page ${currentPage + 1}/${totalPages}`)
              .setDescription(mentions.join('\n'))
              .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

            return configEmbed;
          };

          const embed = generateEmbed(currentPage);

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

          if (totalPages === 1) {
            pag.components.forEach((button) => {
              button.setDisabled(true);
            });
          }

          const messageComponent = await message.channel.send({ embeds: [embed], components: [pag] });

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

              const updatedEmbed = generateEmbed(currentPage);

              const firstButton = pag.components.find((component) => component.customId === "first");
              const previousButton = pag.components.find((component) => component.customId === "previous");
              const nextButton = pag.components.find((component) => component.customId === "next");
              const lastButton = pag.components.find((component) => component.customId === "last");

              firstButton.setDisabled(currentPage === 0);
              previousButton.setDisabled(currentPage === 0);
              nextButton.setDisabled(currentPage === totalPages - 1);
              lastButton.setDisabled(currentPage === totalPages - 1);

              interaction.update({ embeds: [updatedEmbed], components: [pag] });
            }
          });

          collector.on("end", () => {
            pag.components.forEach((button) => button.setDisabled(true));
            messageComponent.edit({ components: [pag] });
          });
        }
      });
    }

    async function handleBypassReset(client, message) {
      await client.db10.get(`${message.guild.id}_ic`).then(async (data) => {
        if (!data) {
          await client.db10.set(`${message.guild.id}_ic`, { ignorechannellist: [], ignorebypasslist: [] });
          return message.channel.send({ content: `${emoji.util.cross} | Please run the ignore command again because earlier database was not set up` });
        } else {
          const users = data.ignorebypasslist;
          if (users.length !== 0) {
            await client.db10.set(`${message.guild.id}_ic`, { ignorechannellist: [], ignorebypasslist: [] });
            return message.channel.send(`Reseted ignore bypass database`);
          } else {
            return message.channel.send(`No users are in ignore bypass Database`);
          }
        }
      });
    }
  }
};
