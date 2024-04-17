const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const Settings = require('../../settings.js');
const emoji = require('../../emoji.js');
const owner = Settings.bot.credits.developerId;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ignore')
        .setDescription('Manage ignore settings for the server')
        .addSubcommand(subcommand =>
            subcommand
                .setName('channel-add')
                .setDescription('Add a channel from the ignore list')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel to ignore')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('channel-remove')
                .setDescription('Remove a channel from the ignore list')
                .addChannelOption(option =>
                    option.setName('channel')
                        .setDescription('The channel to remove from the ignore list')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('channel-show')
                .setDescription('Show ignored channels')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('channel-reset')
                .setDescription('Reset ignore channel settings')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('bypass-add')
                .setDescription('Manage ignore bypass settings')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to add to the ignore bypass list')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('bypass-remove')
                .setDescription('Remove a user from the ignore bypass list')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to remove from the ignore bypass list')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('bypass-show')
                .setDescription('Show ignored bypass users')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('bypass-reset')
                .setDescription('Reset ignore bypass settings')
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName('guide')
                .setDescription('Show guide for ignore module')
        ),
    voteOnly: true,
    UserPerms: ['ManageChannels'],
    BotPerms: ['EmbedLinks'],
    async execute(client, interaction) {
        const prefix = await client.db8.get(`${interaction.guild.id}_prefix`) || Settings.bot.info.prefix;
        const arypton = await client.users.fetch(owner);

        const subcommand = interaction.options.getSubcommand();
        const channelOption = interaction.options.getChannel('channel');
        const userOption = interaction.options.getUser('user');

        switch (subcommand) {
            case 'channel-add':
                await handleAddChannel(client, interaction, channelOption);
                break;
            case 'channel-remove':
                await handleRemoveChannel(client, interaction, channelOption);
                break;
            case 'channel-show':
                await handleConfig(client, interaction);
                break;
            case 'channel-reset':
                await handleReset(client, interaction);
                break;
            case 'bypass-add':
                await handleAddBypass(client, interaction, userOption);
                break;
            case 'bypass-remove':
                await handleRemoveBypass(client, interaction, userOption);
                break;
            case 'bypass-show':
                await handleBypassConfig(client, interaction);
                break;
            case 'bypass-reset':
                await handleBypassReset(client, interaction);
                break;
            case 'guide':
                const guide = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: `${client.username}`, iconURL: client.user.displayAvatarURL() })
                    .setThumbnail(client.user.displayAvatarURL())
                    .addFields(
                        { name: `${emoji.util.arrow} \`/ignore\``, value: "Shows the guide embed for the module.", inline: false },
                        { name: `${emoji.util.arrow} \`/ignore channel add <channel>\``, value: "Add the channel in ignore channels.", inline: false },
                        { name: `${emoji.util.arrow} \`/ignore bypass add <user mention/id>\``, value: "Add the user in ignore bypass.", inline: false },
                        { name: `${emoji.util.arrow} \`/ignore channel remove <channel>\``, value: "Remove the channel from ignore channels.", inline: false },
                        { name: `${emoji.util.arrow} \`/ignore bypass remove <user mention/id>\``, value: "Remove the user from ignore bypass.", inline: false },
                        { name: `${emoji.util.arrow} \`/ignore channel show\``, value: "Show ignore module settings for the server.", inline: false },
                        { name: `${emoji.util.arrow} \`/ignore bypass show\``, value: "Show ignore bypass module settings for the server.", inline: false },
                        { name: `${emoji.util.arrow} \`/ignore channel reset\``, value: "Resets ignore settings for the server.", inline: false },
                        { name: `${emoji.util.arrow} \`/ignore bypass reset\``, value: "Resets ignore bypass settings for the server.", inline: false }
                    )
                    .setFooter({ text: `Thanks For Selecting ${client.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                await interaction.reply({ embeds: [guide] });
                break;
        }
    },
};

async function handleAddChannel(client, interaction, channel) {
    const premium = await client.db12.get(`${interaction.guild.id}_premium`);
    let channelLimit;
    if (premium.active === true) {
        channelLimit = 100;
    } else {
        channelLimit = 5;
    }
    await client.db10.get(`${interaction.guild.id}_ic`).then(async (data) => {
        if (!data) {
            await client.db10.set(`${interaction.guild.id}_ic`, { ignorechannellist: [], ignorebypasslist: [] });
            return interaction.reply({ content: `${emoji.util.cross} | Please run the ignore command again because earlier database was not set up` });
        } else {
            if (!channel) {
                return interaction.reply({ content: `${emoji.util.cross} | Prioritize mentioning the channel or provide a valid channel ID.` });
            } else {
                if (data.ignorechannellist.includes(channel.id)) {
                    return interaction.reply({ content: `${emoji.util.cross} | Already added \`${channel.name}\` in ignore channel for this guild.` });
                }
                if (data.ignorechannellist.length >= channelLimit) {
                    if (channelLimit === 100) {
                        return interaction.reply(`${emoji.util.cross} | With our premium subscription, you can enjoy an impressive channel addition limit of up to 100.`);
                    } else {
                        return interaction.reply(`${emoji.util.cross} | Upgrade to our premium plan to access an enhanced channel Addition limit of up to 100. Without premium, the maximum channel addition limit is restricted to 5. Unlock the potential for unlimited channel additions by opting for our Premium subscription.`);
                    }
                } else {
                    await client.db10.push(`${interaction.guild.id}_ic.ignorechannellist`, channel.id);
                    return interaction.reply({ content: `${emoji.util.tick} | Added \`${channel.name}\` in ignore channel for this guild.` });
                }
            }
        }
    });
}

async function handleRemoveChannel(client, interaction, channel) {
    await client.db10.get(`${interaction.guild.id}_ic`).then(async (data) => {
        if (!data) {
            await client.db10.set(`${interaction.guild.id}_ic`, { ignorechannellist: [], ignorebypasslist: [] });
            return interaction.reply({ content: `${emoji.util.cross} | Please run the ignore command again because earlier database was not set up` });
        } else {
            if (!channel) {
                return interaction.reply({ content: `${emoji.util.cross} | Prioritize mentioning the channel or provide a valid channel ID.` });
            } else {
                if (!data.ignorechannellist.includes(channel.id)) {
                    return interaction.reply({ content: `${emoji.util.cross} | \`${channel.name}\` Yet not added in ignore channel for this guild.` });
                } else {
                    await client.db10.pull(`${interaction.guild.id}_ic.ignorechannellist`, channel.id);
                    return interaction.reply({ content: `${emoji.util.tick} | \`${channel.name}\` is Removed from ignore channel for this guild.` });
                }
            }
        }
    });
}

async function handleConfig(client, interaction) {
    await client.db10.get(`${interaction.guild.id}_ic`).then(async (data) => {
        if (!data) {
            await client.db10.set(`${interaction.guild.id}_ic`, { ignorechannellist: [], ignorebypasslist: [] });
            return interaction.reply({ content: `${emoji.util.cross} | Please run the ignore command again because the database was not set up.` });
        } else {
            const channels = data.ignorechannellist;

            if (channels.length === 0) {
                return interaction.reply(`No channels are in the ignore list.`);
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
                    }
                });

                const configEmbed = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                    .setTitle(`Ignore List - Page ${currentPage + 1}/${totalPages}`)
                    .setDescription(mentions.join('\n'))
                    .setFooter({ text: `Thanks For Selecting ${client.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

                return configEmbed;
            };

            const embed = generateEmbed(currentPage);

            const firstButton = new ButtonBuilder()
                .setStyle("Primary")
                .setCustomId("first")
                .setLabel("≪")
                .setDisabled(true);
            const backButton = new ButtonBuilder()
                .setStyle("Success")
                .setCustomId("previous")
                .setLabel("Previous")
                .setDisabled(true);
            const cancelButton = new ButtonBuilder()
                .setStyle("Danger")
                .setCustomId("close")
                .setLabel("Close")
                .setDisabled(false);
            const nextButton = new ButtonBuilder()
                .setStyle("Success")
                .setCustomId("next")
                .setLabel("Next")
                .setDisabled(false);
            const lastButton = new ButtonBuilder()
                .setStyle("Primary")
                .setCustomId("last")
                .setLabel("≫")
                .setDisabled(false);

            const pag = new ActionRowBuilder().addComponents(firstButton, backButton, cancelButton, nextButton, lastButton);

            if (totalPages === 1) {
                pag.components.forEach((button) => {
                    button.setDisabled(true);
                });
            }

            interaction.reply({ embeds: [embed], components: [pag] }).then((messageComponent) => {
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
                });

                collector.on("end", () => {
                    pag.components.forEach((button) => button.setDisabled(true));
                    messageComponent.edit({ components: [pag] });
                });
            });
        }
    });
}

async function handleReset(client, interaction) {
    await client.db10.get(`${interaction.guild.id}_ic`).then(async (data) => {
        if (!data) {
            await client.db10.set(`${interaction.guild.id}_ic`, { ignorechannellist: [], ignorebypasslist: [] });
            return interaction.reply({ content: `${emoji.util.cross} | Please run the ignore command again because the database was not set up.` });
        } else {
            const channels = data.ignorechannellist;
            if (channels.length !== 0) {
                await client.db10.set(`${interaction.guild.id}_ic`, { ignorechannellist: [], ignorebypasslist: [] });
                return interaction.reply(`Reset the ignore list for this guild.`);
            } else {
                return interaction.reply(`No channels are in the ignore list.`);
            }
        }
    });
}

async function handleAddBypass(client, interaction, user) {
    const premium = await client.db12.get(`${interaction.guild.id}_premium`);
    let bypassLimit;
    if (premium.active === true) {
        bypassLimit = 100;
    } else {
        bypassLimit = 10
    }
    await client.db10.get(`${interaction.guild.id}_ic`).then(async (data) => {
        if (!data) {
            await client.db10.set(`${interaction.guild.id}_ic`, { ignorechannellist: [], ignorebypasslist: [] });
            return interaction.reply({ content: `${emoji.util.cross} | Please run the ignore command again because earlier database was not set up` });
        } else {
            if (!user) {
                return interaction.reply({ content: `${emoji.util.cross} | Please mention a valid user or provide a valid user ID.` });
            } else {
                if (data.ignorebypasslist.includes(user.id)) {
                    return interaction.reply({ content: `${emoji.util.cross} | The user \`${user.username}\` is already added to the ignore bypass list for this guild.` });
                }
                if (data.ignorebypasslist.length >= bypassLimit) {
                    if (bypassLimit === 100) {
                        return interaction.reply(`${emoji.util.cross} | With our premium subscription, you can enjoy an impressive Ignore Bypass addition limit of up to 100.`);
                    } else {
                        return interaction.reply(`${emoji.util.cross} | Upgrade to our premium plan to access an enhanced Ignore Bypass addition limit of up to 100. Without premium, the maximum Ignore Bypass addition limit is restricted to 10. Unlock the potential for unlimited Ignore Bypass additions by opting for our Premium subscription.`);
                    }
                } else {
                    await client.db10.push(`${interaction.guild.id}_ic.ignorebypasslist`, user.id);
                    return interaction.reply({ content: `${emoji.util.tick} | Added \`${user.username}\` to the ignore bypass list for this guild.` });
                }
            }
        }
    });
}

async function handleRemoveBypass(client, interaction, user) {
    await client.db10.get(`${interaction.guild.id}_ic`).then(async (data) => {
        if (!data) {
            await client.db10.set(`${interaction.guild.id}_ic`, { ignorechannellist: [], ignorebypasslist: [] });
            return interaction.reply({ content: `${emoji.util.cross} | Please run the ignore command again because earlier database was not set up` });
        } else {
            if (!user) {
                return interaction.reply({ content: `${emoji.util.cross} | Please mention a valid user or provide a valid user ID.` });
            } else {
                if (!data.ignorebypasslist.includes(user.id)) {
                    return interaction.reply({ content: `${emoji.util.cross} | The user \`${user.username}\` is not in the ignore bypass list for this guild.` });
                } else {
                    await client.db10.pull(`${interaction.guild.id}_ic.ignorebypasslist`, user.id);
                    return interaction.reply({ content: `${emoji.util.tick} | Removed \`${user.username}\` from the ignore bypass list for this guild.` });
                }
            }
        }
    });
}

async function handleBypassConfig(client, interaction) {
    await client.db10.get(`${interaction.guild.id}_ic`).then(async (data) => {
        if (!data) {
            await client.db10.set(`${interaction.guild.id}_ic`, { ignorechannellist: [], ignorebypasslist: [] });
            return interaction.reply({ content: `${emoji.util.cross} | Please run the ignore command again because earlier database was not set up` });
        } else {
            const bypassUsers = data.ignorebypasslist;

            if (bypassUsers.length === 0) {
                return interaction.reply(`No users are in the ignore bypass list.`);
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
                    const member = interaction.guild.members.cache.get(userId);
                    if (member) {
                        mentions.push(`\`[${startIndex + i + 1}]\` | ID: [${userId}](https://discord.com/users/${userId}) | <@${userId}>`);
                    }
                });

                const configEmbed = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                    .setTitle(`Total Ignore Bypass Users - Page ${currentPage + 1}/${totalPages}`)
                    .setDescription(mentions.join('\n'))
                    .setFooter({ text: `Thanks For Selecting ${client.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

                return configEmbed;
            };

            const embed = generateEmbed(currentPage);

            const firstButton = new ButtonBuilder()
                .setStyle("Primary")
                .setCustomId("first")
                .setLabel("≪")
                .setDisabled(true);
            const backButton = new ButtonBuilder()
                .setStyle("Success")
                .setCustomId("previous")
                .setLabel("Previous")
                .setDisabled(true);
            const cancelButton = new ButtonBuilder()
                .setStyle("Danger")
                .setCustomId("close")
                .setLabel("Close")
                .setDisabled(false);
            const nextButton = new ButtonBuilder()
                .setStyle("Success")
                .setCustomId("next")
                .setLabel("Next")
                .setDisabled(false);
            const lastButton = new ButtonBuilder()
                .setStyle("Primary")
                .setCustomId("last")
                .setLabel("≫")
                .setDisabled(false);

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

async function handleBypassReset(client, interaction) {
    await client.db10.get(`${interaction.guild.id}_ic`).then(async (data) => {
        if (!data) {
            await client.db10.set(`${interaction.guild.id}_ic`, { ignorechannellist: [], ignorebypasslist: [] });
            return interaction.reply({ content: `${emoji.util.cross} | Please run the ignore command again because earlier database was not set up` });
        } else {
            const users = data.ignorebypasslist;
            if (users.length !== 0) {
                await client.db10.set(`${interaction.guild.id}_ic`, { ignorechannellist: [], ignorebypasslist: [] });
                return interaction.reply(`Reset the ignore bypass list.`);
            } else {
                return interaction.reply(`No users are in the ignore bypass list.`);
            }
        }
    });
}
