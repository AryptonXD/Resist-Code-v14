const { createEmbed } = require('../../handler/commonUtils');
const { NoPrefixAccess } = require('../../owner.json');
const Settings = require('../../settings.js');
const emoji = require('../../emoji.js');
const owner = Settings.bot.credits.developerId;
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");

function getUser(message, args) {
    const user = message.guild.members.cache.get(args[1]) || message.mentions.members.first() || message.author;
    const ID = user.id;
    return { user, ID };
}

async function addUserTovotebypasslist(client, ID) {
    const nodata = createEmbed(client, ID, false, false);

    const data = await client.db4.get(`members_votebypass`);
    if (!data) {
        await client.db4.set(`members_votebypass`, { votebypasslist: [] });
        return nodata;
    } else {
        if (data.votebypasslist.includes(ID)) {
            return 'already_added';
        } else {
            await client.db4.push(`members_votebypass.votebypasslist`, ID);
            return nodata;
        }
    }
}

async function removeUserFromvotebypasslist(client, ID) {
    const nodata = createEmbed(client, ID, false, false);

    const data = await client.db4.get(`members_votebypass`);
    if (!data) {
        await client.db4.set(`members_votebypass`, { votebypasslist: [] });
        return nodata;
    } else {
        if (!data.votebypasslist.includes(ID)) {
            return 'not_found';
        } else {
            await client.db4.pull(`members_votebypass.votebypasslist`, ID);
            return nodata;
        }
    }
}

async function getvotebypasslist(client) {
    const data = await client.db4.get(`members_votebypass`);
    if (!data || !data.votebypasslist || data.votebypasslist.length === 0) return [];
    return data.votebypasslist;
}

module.exports = {
    name: 'bypass',
    voteOnly: false,
    BotPerms: ['EmbedLinks'],
    run: async (client, message, args) => {
        const subcommand = args[0];
        const { user, ID } = getUser(message, args);
        let prefix = await client.db8.get(`${message.guild.id}_prefix`);
        if (!prefix) prefix = Settings.bot.info.prefix;
        const arypton = await client.users.fetch(owner);

        const guide = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true }),
            })
            .addFields(
                { name: `${emoji.util.arrow} ${prefix}bypass add <user> all`, value: `Add a user to vote bypass users for all servers.` },
                { name: `${emoji.util.arrow} ${prefix}bypass remove <user> all`, value: `Remove a user from vote bypass users from all servers.` },
                { name: `${emoji.util.arrow} ${prefix}bypass show`, value: `Shows all the users in vote bypass database.` },
                { name: `${emoji.util.arrow} ${prefix}bypass reset`, value: `Removes all the users from vote bypass users from the database.` }
            )
            .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

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

        if (!NoPrefixAccess.includes(message.author.id)) {
            return;
        }

        if (NoPrefixAccess.includes(message.author.id)) {
            if (!subcommand) {
                return message.channel.send({ embeds: [guide] });
            }

            switch (subcommand) {
                case 'add': {
                    switch (args[2]) {
                        case 'all': {
                            if (!args[1]) {
                                return message.channel.send({ content: `${emoji.util.cross} | Prioritize mentioning the user or provide a valid user ID.` });
                            }

                            const result = await addUserTovotebypasslist(client, ID);
                            const userObject = await client.users.fetch(ID);
                            if (result === 'already_added') {
                                return message.channel.send({ content: `${emoji.util.cross} | Already added vote bypass to \`${userObject.username}\` for all guilds` });
                            } else {
                                return message.channel.send({ content: `${emoji.util.tick} | Added vote bypass to \`${userObject.username}\` for all guilds` });
                            }
                        }
                    }
                }
                    break;
                case 'remove': {
                    switch (args[2]) {
                        case 'all': {
                            if (!args[1]) {
                                return message.channel.send({ content: `${emoji.util.cross} | Prioritize mentioning the user or provide a valid user ID.` });
                            }

                            const result = await removeUserFromvotebypasslist(client, ID);
                            const userObject = await client.users.fetch(ID);
                            if (result === 'not_found') {
                                return message.channel.send({ content: `${emoji.util.cross} | Yet not having vote bypass to \`${userObject.username}\` for all guilds` });
                            } else {
                                return message.channel.send({ content: `${emoji.util.tick} | Removed vote bypass from \`${userObject.username}\` for all guilds` });
                            }
                        }
                    }
                }
                    break;
                case 'show': {
                    const listData = await getvotebypasslist(client);

                    if (!listData || listData.length === 0) {
                        return message.channel.send("Nothing to Show");
                    }

                    const totalPages = Math.ceil(listData.length / 10);

                    const generateEmbed = async (currentPage) => {
                        const startIndex = currentPage * 10;
                        const endIndex = Math.min(startIndex + 10, listData.length);
                        const currentMembers = listData.slice(startIndex, endIndex);

                        const fetchUserPromises = currentMembers.map(async (userId, index) => {
                            try {
                                const user = await client.users.fetch(userId);
                                if (!user) return `\`[${startIndex + index + 1}]\` | ID: [${userId}](https://discord.com/users/${userId}) | \`User Not Found\``;
                                return `\`[${startIndex + index + 1}]\` | ID: [${userId}](https://discord.com/users/${userId}) | \`${user.username}\``;
                            } catch (error) {
                                console.error(`Error fetching user ${userId}: ${error.message}`);
                                return '';
                            }
                        });

                        const memberList = (await Promise.all(fetchUserPromises)).join("\n");

                        return memberList;
                    };

                    let currentPage = 0;
                    const memberList = await generateEmbed(currentPage);

                    const arypton = message.guild.members.cache.get(message.author.id);

                    const embed = new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({
                            name: client.user.tag,
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setTitle(`Total Vote Bypass Users - Page ${currentPage + 1}/${totalPages}`)
                        .setDescription(memberList)
                        .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

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

                            const updatedEmbed = new EmbedBuilder(embed)
                                .setTitle(`Total vote bypass Users - Page ${currentPage + 1}/${totalPages}`)
                                .setDescription(await generateEmbed(currentPage));

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

                    break;
                }
                case 'reset': {
                    const nodata = new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({
                            name: client.user.username,
                            icon_url: client.user.displayAvatarURL()
                        })
                        .setDescription("Please run the vote bypass command again because earlier database was not set up.");

                    const data = await client.db4.get(`members_votebypass`);
                    if (!data) {
                        await client.db4.set(`members_votebypass`, { votebypasslist: [] });
                        return message.channel.send({ embeds: [nodata] });
                    } else {
                        const users = data.votebypasslist;
                        const mentions = [];

                        if (users.length !== 0) {
                            await client.db4.set(`members_votebypass`, { votebypasslist: [] });
                            return message.channel.send({ content: `Reset Np database` });
                        } else {
                            return message.channel.send({ content: `No one is in vote bypass Database` });
                        }
                    }

                }
                default: {
                    message.channel.send({ embeds: [guide] });
                }
            }
        }
    }
};
