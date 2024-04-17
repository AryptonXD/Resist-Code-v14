const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const Settings = require('../../settings.js');
const emoji = require('../../emoji.js');
const owner = Settings.bot.credits.developerId;

module.exports = {
    name: "autorole",
    voteOnly: true,
    UserPerms: ['Administrator'],
    BotPerms: ['EmbedLinks', 'ManageRoles'],
    aboveRole: true,
    run: async (client, message, args) => {
        const roleMention = message.mentions.roles.first();
        const roleID = args[2];
        const role = roleMention || message.guild.roles.cache.get(roleID);
        const arypton = await client.users.fetch(owner);

        const dbKey = `${message.guild.id}_autorole`;
        let data = await client.db1.get(dbKey);
        if (!data) {
            await client.db1.set(dbKey, { role: { humans: [], bots: [] } });
            data = { role: { humans: [], bots: [] } };
        }

        switch (args[0]) {
            case "humans":
                handleRole(args, "humans", data.role.humans, role, message, client);
                break;

            case "bots":
                handleRole(args, "bots", data.role.bots, role, message, client);
                break;

            case "config":
                displayConfig(message, data, client, arypton);
                break;

            case "reset":
                resetAutorole(data, message, client);
                break;

            default:
                let prefix = await client.db8.get(`${message.guild.id}_prefix`);
                if (!prefix) prefix = Settings.bot.info.prefix;
                const guideEmbed = createAutoroleGuideEmbed(client, prefix, arypton);
                message.channel.send({ embeds: [guideEmbed] });
                break;
        }
    }
}

async function handleRole(args, type, autorole, role, message, client) {
    const premium = await client.db12.get(`${message.guild.id}_premium`);
    let limit;

    if (premium.active === true) {
        limit = 15;
    } else {
        limit = 2;
    }

    switch (args[1]) {
        case "add":
            if (!role) {
                return sendRoleMissingEmbed(message, client);
            }

            if (role.permissions.has("Administrator")) {
                return sendAdminRoleEmbed(message, client);
            }

            if (autorole.includes(role.id)) {
                return sendRoleAlreadyAddedEmbed(message, role, type, client);
            }

            if (autorole.length >= limit) {
                if (limit === 15) {
                    return message.channel.send({ content: `${emoji.util.cross} | Maximum number Autorole Addition of ${type} roles (15) with premium.` });
                } else {
                    return sendMaxRolesReachedEmbed(message, type, client);
                }
            }

            autorole.push(role.id);
            await client.db1.set(`${message.guild.id}_autorole.role.${type}`, autorole);
            return sendRoleAddedEmbed(message, role, type, client);

        case "remove":
            if (!role) {
                return sendRoleMissingEmbed(message, client);
            }

            if (role.permissions.has("Administrator")) {
                return sendAdminRoleEmbed(message, client);
            }

            if (!autorole.includes(role.id)) {
                return sendRoleNotInListEmbed(message, role, type, client);
            } else {
                autorole = autorole.filter(id => id !== role.id);
                await client.db1.set(`${message.guild.id}_autorole.role.${type}`, autorole);
                return sendRoleRemovedEmbed(message, role, type, client);
            }
    }
}

function sendRoleMissingEmbed(message, client) {
    return message.channel.send({ content: `${emoji.util.cross} | Prioritize mentioning the role or provide a valid role ID.` });
}

function sendAdminRoleEmbed(message, client) {
    return message.channel.send({ content: `${emoji.util.corss} | The Administrator role cannot be selected.` });
}

function sendRoleAlreadyAddedEmbed(message, role, type, client) {
    return message.channel.send({ content: `${emoji.util.cross} | \`${role.name}\` is already in Autorole ${type.charAt(0).toUpperCase() + type.slice(1)} List` });
}

function sendRoleAddedEmbed(message, role, type, client) {
    return message.channel.send({ content: `${emoji.util.tick} | Added \`${role.name}\` to autorole ${type.charAt(0).toUpperCase() + type.slice(1)}.` });
}

function sendRoleNotInListEmbed(message, role, type, client) {
    return message.channel.send({ content: `${emoji.util.cross} | \`${role.name}\` is not in Autorole ${type.charAt(0).toUpperCase() + type.slice(1)} List` });
}

function sendRoleRemovedEmbed(message, role, type, client) {
    return message.channel.send({ content: `${emoji.util.tick} | Removed \`${role.name}\` from autorole ${type.charAt(0).toUpperCase() + type.slice(1)}.` });
}

function sendMaxRolesReachedEmbed(message, type, client) {
    return message.channel.send({ content: `${emoji.util.cross} | Maximum number of ${type} roles (2) reached | With our premium subscription, you can enjoy an impressive whitelist addition limit of up to 10.` });
}

async function resetAutorole(data, message, client) {
    data.role.humans = [];
    data.role.bots = [];

    await client.db1.set(`${message.guild.id}_autorole`, { role: { humans: [], bots: [] } });
    message.channel.send({ content: `${emoji.util.tick} | AutoRole configuration has been reset.` });
}

function createAutoroleGuideEmbed(client, prefix, arypton) {
    const guide = new EmbedBuilder()
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setThumbnail(client.user.displayAvatarURL())
        .setColor(client.color)
        .addFields(
            { name: `${emoji.util.arrow} \`${prefix}autorole humans add <role mention/id>\``, value: "Add a role to the autorole list for humans.", inline: false },
            { name: `${emoji.util.arrow} \`${prefix}autorole humans remove <role mention/id>\``, value: "Remove a role from the autorole list for humans.", inline: false },
            { name: `${emoji.util.arrow} \`${prefix}autorole bots add <role mention/id>\``, value: "Add a role to the autorole list for bots.", inline: false },
            { name: `${emoji.util.arrow} \`${prefix}autorole bots remove <role mention/id>\``, value: "Remove a role from the autorole list for bots.", inline: false },
            { name: `${emoji.util.arrow} \`${prefix}autorole config\``, value: "Display the current autorole configuration.", inline: false },
            { name: `${emoji.util.arrow} \`${prefix}autorole reset\``, value: "Reset the autorole configuration.", inline: false }
        )
        .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    return guide;
}

async function displayConfig(message, data, client, arypton) {
    const humanRole = data.role.humans || "Nothing to Show";
    const botRole = data.role.bots || "Nothing to Show";

    const itemsPerPage = 15;
    const totalPages = Math.ceil(humanRole.length / itemsPerPage) || Math.ceil(botRole.length / itemsPerPage);
    let currentPage = 0;

    function generateEmbed(page) {
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, humanRole.length);
        const endIndex1 = Math.min(startIndex + itemsPerPage, botRole.length);
        const currentHumanRoles = humanRole.slice(startIndex, endIndex);
        const currentBotRoles = botRole.slice(startIndex, endIndex1);
        const roleMention = [];
        const roleMention1 = [];

        currentHumanRoles.forEach((roleId, i) => {
            const role = message.guild.roles.cache.get(roleId);
            if (role) {
                roleMention.push(`\`[${startIndex + i + 1}]\` | ID: [${roleId}](https://dsg.gg/resisthq) | <@&${roleId}>`);
            } else {
                roleMention.push(`\`[${startIndex + i + 1}]\` | ID: [${roleId}](https://dsg.gg/resisthq) | Deleted Role`);
            }
        });

        currentBotRoles.forEach((roleId, i) => {
            const role = message.guild.roles.cache.get(roleId);
            if (role) {
                roleMention1.push(`\`[${startIndex + i + 1}]\` | ID: [${roleId}](https://dsg.gg/resisthq) | <@&${roleId}>`);
            } else {
                roleMention1.push(`\`[${startIndex + i + 1}]\` | ID: [${roleId}](https://dsg.gg/resisthq) | Deleted Role`);
            }
        });

        const wlistembed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTitle(`AutoRole Config - Page ${currentPage + 1}/${totalPages}`);

        wlistembed.addFields(
            {
                name: "AutoRole Humans",
                value: roleMention.length > 0 ? roleMention.join('\n') : "No roles to display"
            },
            {
                name: "AutoRole Bots",
                value: roleMention1.length > 0 ? roleMention1.join('\n') : "No roles to display"
            }
        );

        wlistembed.setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

        return wlistembed;
    }

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
        filter: (interaction) => interaction.user.id === message.author.id,
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
