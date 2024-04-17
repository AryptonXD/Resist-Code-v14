const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const Settings = require('../../settings.js');
const emoji = require('../../emoji.js');
const owner = Settings.bot.credits.developerId;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('media')
        .setDescription('Manage media settings for the server')
        .addSubcommand(subcommand =>
            subcommand
                .setName('channel-add')
                .setDescription('Add a channel from the media list')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel to media')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('channel-remove')
                .setDescription('Remove a channel from the media list')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel to remove from the media list')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('show')
                .setDescription('Show media channels')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('reset')
                .setDescription('Reset media channel settings')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('guide')
                .setDescription('Show guide for media module')
        ),
    voteOnly: true,
    UserPerms: ['ManageChannels'],
    BotPerms: ['EmbedLinks'],
    async execute(client, interaction) {
        const arypton = await client.users.fetch(owner);
        const subcommand = interaction.options.getSubcommand();
        const channelOption = interaction.options.getChannel('channel');

        switch (subcommand) {
            case 'channel-add':
                await handleAddChannel(client, interaction, channelOption);
                break;
            case 'channel-remove':
                await handleRemoveChannel(client, interaction, channelOption);
                break;
            case 'show':
                await handleConfig(client, interaction);
                break;
            case 'reset':
                await handleReset(client, interaction);
                break;
            case 'guide':
                const guide = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
                    .setThumbnail(client.user.displayAvatarURL())
                    .addFields(
                        { name: `${emoji.util.arrow} \`/media\``, value: "Shows the guide embed for the module.", inline: false },
                        { name: `${emoji.util.arrow} \`/media channel add <channel>\``, value: "Add the channel in media channels.", inline: false },
                        { name: `${emoji.util.arrow} \`/media channel remove <channel>\``, value: "Remove the channel from media channels.", inline: false },
                        { name: `${emoji.util.arrow} \`/media config\``, value: "Show media module settings for the server.", inline: false },
                        { name: `${emoji.util.arrow} \`/media reset\``, value: "Resets media settings for the server.", inline: false }
                    )
                    .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                await interaction.reply({ embeds: [guide] });
                break;
        }
    },
};

async function handleAddChannel(client, interaction, channel) {
    const premium = await client.db12.get(`${interaction.guild.id}_premium`);
    let limit;
    if (premium.active === true) {
        limit = 100;
    } else {
        limit = 3;
    }
    await client.db14.get(`${interaction.guild.id}_mediachannels`).then(async (data) => {
        if (!data) {
            await client.db14.set(`${interaction.guild.id}_mediachannels`, { mediachannellist: [] });
            return interaction.reply({ content: `${emoji.util.cross} | Please run the media command again because earlier database was not set up` });
        } else {
            if (!channel) {
                return interaction.reply({ content: `${emoji.util.cross} | Prioritize Channel Mention` });
            } else {
                if (data.mediachannellist.includes(channel.id)) {
                    return interaction.reply({ content: `${emoji.util.cross} | Already added \`${channel.name}\` in media channel for this guild.` });
                }
                if (data.mediachannellist.length >= limit) {
                    if (limit === 100) {
                        return interaction.reply(`${emoji.util.cross} | With our premium subscription, you can enjoy an impressive media channel addition limit of up to 100.`);
                    } else {
                        return interaction.reply(`${emoji.util.cross} | Upgrade to our premium plan to access an enhanced media channel addition limit of up to 100. Without premium, the maximum media channel addition limit is restricted to 5. Unlock the potential for unlimited media channel additions by opting for our Premium subscription.`);
                    }
                } else {
                    await client.db14.push(`${interaction.guild.id}_mediachannels.mediachannellist`, channel.id);
                    return interaction.reply({ content: `${emoji.util.tick} | Added \`${channel.name}\` in media channel for this guild.` });
                }
            }
        }
    });
}

async function handleRemoveChannel(client, interaction, channel) {
    await client.db14.get(`${interaction.guild.id}_mediachannels`).then(async (data) => {
        if (!data) {
            await client.db14.set(`${interaction.guild.id}_mediachannels`, { mediachannellist: [] });
            return interaction.reply({ content: `${emoji.util.cross} | Please run the media command again because earlier database was not set up` });
        } else {
            if (!channel) {
                return interaction.reply({ content: `${emoji.util.cross} | Prioritize Channel Mention` });
            } else {
                if (!data.mediachannellist.includes(channel.id)) {
                    return interaction.reply({ content: `${emoji.util.cross} | \`${channel.name}\` Yet not added in media channel for this guild.` });
                } else {
                    await client.db14.pull(`${interaction.guild.id}_mediachannels.mediachannellist`, channel.id);
                    return interaction.reply({ content: `${emoji.util.tick} | \`${channel.name}\` is Removed from media channel for this guild.` });
                }
            }
        }
    });
}

async function handleConfig(client, interaction) {
    await client.db14.get(`${interaction.guild.id}_mediachannels`).then(async (data) => {
        if (!data) {
            await client.db14.set(`${interaction.guild.id}_mediachannels`, { mediachannellist: [] });
            return interaction.reply({ content: `${emoji.util.cross} | Please run the media command again because earlier database was not set up` });
        } else {
            const channels = data.mediachannellist;

            if (channels.length === 0) {
                return interaction.reply(`No channel is in Media Channel Database`);
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
                    const channel = interaction.guild.channels.cache.get(channelId);
                    if (channel) {
                        mentions.push(`\`[${startIndex + i + 1}]\` | ID: [${channelId}](https://discord.com/channels/${interaction.guild.id}/${channelId}) | <#${channelId}>`);
                    } else {
                        mentions.push(`\`[${startIndex + i + 1}]\` | Channel with ID ${channelId} has been deleted.`);
                    }
                });

                const configEmbed = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                    .setTitle(`Total Media Channels - Page ${currentPage + 1}/${totalPages}`)
                    .setDescription(mentions.join('\n'))
                    .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

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

            const messageComponent = await interaction.reply({ embeds: [embed], components: [pag] });

            const collector = messageComponent.createMessageComponentCollector({
                filter: (inter) => {
                    if (interaction.member.id === inter.user.id) return true;
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

                    firstButton.setDisabled(currentPage === 0);
                    backButton.setDisabled(currentPage === 0);
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

async function handleReset(client, interaction) {
    await client.db14.get(`${interaction.guild.id}_mediachannels`).then(async (data) => {
        if (!data) {
            await client.db14.set(`${interaction.guild.id}_mediachannels`, { mediachannellist: [] });
            return interaction.reply({ content: `${emoji.util.cross} | Please run the media command again because earlier database was not set up` });
        } else {
            const users = data.mediachannellist;
            if (users.length !== 0) {
                await client.db14.set(`${interaction.guild.id}_mediachannels`, { mediachannellist: [] });
                return interaction.reply(`Reseted Media Channel database`);
            } else {
                return interaction.reply(`No channel is in Media Channel Database`);
            }
        }
    });
}
