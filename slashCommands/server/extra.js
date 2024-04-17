const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const { ownerIDS } = require('../../owner.json');
const Settings = require('../../settings.js');
const emoji = require('../../emoji.js');
const owner = Settings.bot.credits.developerId;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('extra')
        .setDescription('Manage extra owner/admin settings for the server')
        .addSubcommand(subcommand =>
            subcommand
                .setName('owner-add')
                .setDescription('Add a user from the extra owner list')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to add in the extra owner')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('owner-remove')
                .setDescription('Remove a user from the extra owner list')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to remove from the extra owner list')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('owner-show')
                .setDescription('Show extra owner users')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('owner-reset')
                .setDescription('Reset extra owner settings')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('admin-add')
                .setDescription('Manage extra admin settings')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to add to the extra admin list')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('admin-remove')
                .setDescription('Remove a user from the extra admin list')
                .addUserOption(option =>
                    option.setName('user')
                        .setDescription('The user to remove from the extra admin list')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('admin-show')
                .setDescription('Show extra admin users')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('admin-reset')
                .setDescription('Reset extra admin settings')
        )

        .addSubcommand(subcommand =>
            subcommand
                .setName('guide')
                .setDescription('Show guide for extra owner/admin module')
        ),
    voteOnly: true,
    async execute(client, interaction) {
        const prefix = await client.db8.get(`${interaction.guild.id}_prefix`) || Settings.bot.info.prefix;
        const arypton = await client.users.fetch(owner);
        const extraOwner = await client.db11.get(`${interaction.guild.id}_eo.extraownerlist`);
        const subcommand = interaction.options.getSubcommand();
        const userOption = interaction.options.getUser('user');

        switch (subcommand) {
            case 'owner-add':
                if (!interaction.guild.ownerId.includes(interaction.member.id) && !ownerIDS.includes(interaction.member.id)) {
                    return interaction.reply({ content: `Only Server Owner Can Use This Command.`, ephemeral: true });
                }
                await handleExtraOwnerAdd(client, interaction, userOption);
                break;
            case 'owner-remove':
                if (!interaction.guild.ownerId.includes(interaction.member.id) && !ownerIDS.includes(interaction.member.id)) {
                    return interaction.reply({ content: `Only Server Owner Can Use This Command.`, ephemeral: true });
                }
                await handleExtraOwnerRemove(client, interaction, userOption);
                break;
            case 'owner-show':
                if (!interaction.guild.ownerId.includes(interaction.member.id) && !ownerIDS.includes(interaction.member.id)) {
                    return interaction.reply({ content: `Only Server Owner Can Use This Command.`, ephemeral: true });
                }
                await handleExtraOwnerConfig(client, interaction);
                break;
            case 'owner-reset':
                if (!interaction.guild.ownerId.includes(interaction.member.id) && !ownerIDS.includes(interaction.member.id)) {
                    return interaction.reply({ content: `Only Server Owner Can Use This Command.`, ephemeral: true });
                }
                await handleExtraOwnerReset(client, interaction);
                break;
            case 'admin-add':
                if (!interaction.guild.ownerId.includes(interaction.member.id) && !ownerIDS.includes(interaction.member.id) && !extraOwner.includes(interaction.member.id)) {
                    return interaction.reply({ content: `Only Server Owner or Extra Owners Can Use This Command.`, ephemeral: true });
                }
                await handleExtraAdminAdd(client, interaction, userOption);
                break;
            case 'admin-remove':
                if (!interaction.guild.ownerId.includes(interaction.member.id) && !ownerIDS.includes(interaction.member.id) && !extraOwner.includes(interaction.member.id)) {
                    return interaction.reply({ content: `Only Server Owner or Extra Owners Can Use This Command.`, ephemeral: true });
                }
                await handleExtraAdminRemove(client, interaction, userOption);
                break;
            case 'admin-show':
                if (!interaction.guild.ownerId.includes(interaction.member.id) && !ownerIDS.includes(interaction.member.id) && !extraOwner.includes(interaction.member.id)) {
                    return interaction.reply({ content: `Only Server Owner or Extra Owners Can Use This Command.`, ephemeral: true });
                }
                await handleExtraAdminConfig(client, interaction);
                break;
            case 'admin-reset':
                if (!interaction.guild.ownerId.includes(interaction.member.id) && !ownerIDS.includes(interaction.member.id) && !extraOwner.includes(interaction.member.id)) {
                    return interaction.reply({ content: `Only Server Owner or Extra Owners Can Use This Command.`, ephemeral: true });
                }
                await handleExtraAdminReset(client, interaction);
                break;
            case 'guide':
                const guide = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: `${client.user.username}`, iconURL: client.user.displayAvatarURL() })
                    .setThumbnail(client.user.displayAvatarURL())
                    .addFields(
                        { name: `${emoji.util.arrow} \`/extra guide\``, value: "Shows the guide embed for the module.", inline: false },
                        { name: `${emoji.util.arrow} \`/extra owner add <user mention/id>\``, value: "Add the extra owner for the server.", inline: false },
                        { name: `${emoji.util.arrow} \`/extra admin add <user mention/id>\``, value: "Add the extra admin for the server.", inline: false },
                        { name: `${emoji.util.arrow} \`/extra owner remove <user mention/id>\``, value: "Remove the extra owner for the server.", inline: false },
                        { name: `${emoji.util.arrow} \`/extra admin remove <user mention/id>\``, value: "Remove the extra admin for the server.", inline: false },
                        { name: `${emoji.util.arrow} \`/extra owner show\``, value: "Shows the extra owner for this server.", inline: false },
                        { name: `${emoji.util.arrow} \`/extra admin show\``, value: "Shows the extra admin for this server.", inline: false },
                        { name: `${emoji.util.arrow} \`/extra owner reset\``, value: "Resets extra owner settings for the server.", inline: false },
                        { name: `${emoji.util.arrow} \`/extra admin reset\``, value: "Resets extra admin settings for the server.", inline: false }
                    )
                    .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
                await interaction.reply({ embeds: [guide] });
                break;
        }
    },
};

async function handleExtraOwnerAdd(client, interaction, user) {
    const premium = await client.db12.get(`${interaction.guild.id}_premium`);
    let ownerLimit;
    if (premium.active === true) {
        ownerLimit = 100;
    } else {
        ownerLimit = 5;
    }
    const data = await client.db11.get(`${interaction.guild.id}_eo`);
    if (!data) {
        await client.db11.set(`${interaction.guild.id}_eo`, { extraownerlist: [] });
        return interaction.reply({ content: `${emoji.util.cross} | Please run the extra owner/admin command again because earlier database was not set up` });
    }

    if (!user) {
        return interaction.reply({ content: `${emoji.util.cross} | Prioritize mentioning the user or provide a valid user user.id.` });
    }

    if (data.extraownerlist.includes(user.id)) {
        return interaction.reply({ content: `${emoji.util.cross} | Already added \`${user.username}\` to Extra Owner for this guild .` });
    }

    if (data.extraownerlist.length >= ownerLimit) {
        if (ownerLimit === 100) {
            return interaction.reply(`${emoji.util.cross} | With our premium subscription, you can enjoy an impressive extra owner addition limit of up to 100.`);
        } else {
            return interaction.reply(`${emoji.util.cross} | Upgrade to our premium plan to access an enhanced extra owner addition limit of up to 100. Without premium, the maximum extra owner addition limit is restricted to 5. Unlock the potential for unlimited extra owner additions by opting for our Premium subscription.`);
        }
    }

    await client.db11.push(`${interaction.guild.id}_eo.extraownerlist`, user.id);
    return interaction.reply({ content: `${emoji.util.tick} | Added \`${user.username}\` to Extra Owner for this guild .` });
};

async function handleExtraOwnerRemove(client, interaction, user) {
    const data = await client.db11.get(`${interaction.guild.id}_eo`);
    if (!data) {
        await client.db11.set(`${interaction.guild.id}_eo`, { extraownerlist: [] });
        return interaction.reply({ content: `${emoji.util.cross} | Please run the extra owner/admin command again because earlier database was not set up` });
    }

    if (!user) {
        return interaction.reply({ content: `${emoji.util.cross} | Prioritize mentioning the user or provide a valid user user.id.` });
    }

    if (!data.extraownerlist.includes(user.id)) {
        return interaction.reply({ content: `${emoji.util.cross} | Yet not added \`${user.username}\` in Extra Owner for this guild .` });
    }

    await client.db11.pull(`${interaction.guild.id}_eo.extraownerlist`, user.id);
    return interaction.reply({ content: `${emoji.util.tick} | Removed \`${user.username}\` Extra Owner from this guild .` });
};

async function handleExtraOwnerConfig(client, interaction) {
    const data = await client.db11.get(`${interaction.guild.id}_eo`);
    if (!data) {
        await client.db11.set(`${interaction.guild.id}_eo`, { extraownerlist: [] });
        return interaction.reply({ content: `${emoji.util.cross} | Please run the extra owner/admin command again because earlier database was not set up` });
    }

    const users = data.extraownerlist;
    const mentions = [];

    if (users.length === 0) {
        return interaction.reply(`No Extra Owner List`);
    }

    const itemsPerPage = 10;
    const totalPages = Math.ceil(users.length / itemsPerPage);
    let currentPage = 0;

    const generateEmbed = (page) => {
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, users.length);
        const currentUsers = users.slice(startIndex, endIndex);

        currentUsers.forEach((userId, i) => {
            mentions.push(`\`[${startIndex + i + 1}]\` | ID: [${userId}](https://discord.com/users/${userId}) | <@${userId}>`);
        });

        const configEmbed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
            .setTitle(`Extra Owner List - Page ${currentPage + 1}/${totalPages}`)
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
};

async function handleExtraOwnerReset(client, interaction) {
    const data = await client.db11.get(`${interaction.guild.id}_eo`);
    if (!data) {
        await client.db11.set(`${interaction.guild.id}_eo`, { extraownerlist: [] });
        return interaction.reply({ content: `${emoji.util.cross} | Please run the extra owner/admin command again because earlier database was not set up` });
    }

    const users = data.extraownerlist;
    if (users.length !== 0) {
        await client.db11.set(`${interaction.guild.id}_eo`, { extraownerlist: [] });
        return interaction.reply(`Reseted Extra Owner List`);
    } else {
        return interaction.reply(`No one is in Extra Owner List`);
    }
};

async function handleExtraAdminAdd(client, interaction, user) {
    const premium = await client.db12.get(`${interaction.guild.id}_premium`);
    let adminLimit;
    if (premium.active === true) {
        adminLimit = 100;
    } else {
        adminLimit = 10;
    }
    const data = await client.db11.get(`${interaction.guild.id}_ea`);
    if (!data) {
        await client.db11.set(`${interaction.guild.id}_ea`, { extraadminlist: [] });
        return interaction.reply({ content: `${emoji.util.cross} | Please run the extra owner/admin command again because earlier database was not set up` });
    }

    if (!user) {
        return interaction.reply({ content: `${emoji.util.cross} | Prioritize mentioning the user or provide a valid user user.id.` });
    }

    if (data.extraadminlist.includes(user.id)) {
        return interaction.reply({ content: `${emoji.util.cross} | Already added \`${user.username}\` to extra admin for this guild .` });
    }

    if (data.extraadminlist.length >= adminLimit) {
        if (adminLimit === 100) {
            return interaction.reply(`${emoji.util.cross} | With our premium subscription, you can enjoy an impressive extra admin addition limit of up to 100.`);
        } else {
            return interaction.reply(`${emoji.util.cross} | Upgrade to our premium plan to access an enhanced extra admin addition limit of up to 100. Without premium, the maximum extra admin addition limit is restricted to 10. Unlock the potential for unlimited extra admin additions by opting for our Premium subscription.`);
        }
    }

    await client.db11.push(`${interaction.guild.id}_ea.extraadminlist`, user.id);
    return interaction.reply({ content: `${emoji.util.tick} | Added \`${user.username}\` to extra admin for this guild .` });
};

async function handleExtraAdminRemove(client, interaction, user) {
    const data = await client.db11.get(`${interaction.guild.id}_ea`);
    if (!data) {
        await client.db11.set(`${interaction.guild.id}_ea`, { extraadminlist: [] });
        return interaction.reply({ content: `${emoji.util.cross} | Please run the extra owner/admin command again because earlier database was not set up` });
    }

    if (!user) {
        return interaction.reply({ content: `${emoji.util.cross} | Prioritize mentioning the user or provide a valid user user.id.` });
    }

    if (!data.extraadminlist.includes(user.id)) {
        return interaction.reply({ content: `${emoji.util.cross} | Yet not added \`${user.username}\` in extra admin for this guild .` });
    }

    await client.db11.pull(`${interaction.guild.id}_ea.extraadminlist`, user.id);
    return interaction.reply({ content: `${emoji.util.tick} | Removed \`${user.username}\` extra admin from this guild .` });
};

async function handleExtraAdminConfig(client, interaction) {
    const data = await client.db11.get(`${interaction.guild.id}_ea`);
    if (!data) {
        await client.db11.set(`${interaction.guild.id}_ea`, { extraadminlist: [] });
        return interaction.reply({ content: `${emoji.util.cross} | Please run the extra owner/admin command again because earlier database was not set up` });
    }

    const users = data.extraadminlist;
    const mentions = [];

    if (users.length === 0) {
        return interaction.reply(`No Extra Admin List`);
    }

    const itemsPerPage = 10;
    const totalPages = Math.ceil(users.length / itemsPerPage);
    let currentPage = 0;

    const generateEmbed = (page) => {
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, users.length);
        const currentUsers = users.slice(startIndex, endIndex);

        currentUsers.forEach((userId, i) => {
            mentions.push(`\`[${startIndex + i + 1}]\` | ID: [${userId}](https://discord.com/users/${userId}) | <@${userId}>`);
        });

        const configEmbed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
            .setTitle(`Extra Admin List - Page ${currentPage + 1}/${totalPages}`)
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
};

async function handleExtraAdminReset(client, interaction) {
    const data = await client.db11.get(`${interaction.guild.id}_ea`);
    if (!data) {
        await client.db11.set(`${interaction.guild.id}_ea`, { extraadminlist: [] });
        return interaction.reply({ content: `${emoji.util.cross} | Please run the extra owner/admin command again because earlier database was not set up` });
    }

    const users = data.extraadminlist;
    if (users.length !== 0) {
        await client.db11.set(`${interaction.guild.id}_ea`, { extraadminlist: [] });
        return interaction.reply(`Reseted Extra Admin List`);
    } else {
        return interaction.reply(`No one is in Extra Admin List`);
    }
};