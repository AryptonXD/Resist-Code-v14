const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const Settings = require('../../settings.js');
const emoji = require('../../emoji.js');
const owner = Settings.bot.credits.developerId;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
        .addSubcommand(subcommand =>
            subcommand
                .setName('reqrole')
                .setDescription('Set up required role.')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Specify the required role.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('admin')
                .setDescription('Set up admin role.')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Specify the admin role.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('official')
                .setDescription('Set up official role.')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Specify the official role.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('guest')
                .setDescription('Set up guest role.')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Specify the guest role.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('girl')
                .setDescription('Set up girl role.')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Specify the girl role.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('friend')
                .setDescription('Set up friend role.')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Specify the friend role.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('vip')
                .setDescription('Set up vip role.')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Specify the vip role.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('config')
                .setDescription('Displays custom role settings for the server.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('reset')
                .setDescription('Resets custom role settings for the server.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('guide')
                .setDescription('Show the setup guide.')
        )
        .setDescription('Displays custom role settings for the server.'),
    voteOnly: true,
    UserPerms: ['ManageRoles'],
    BotPerms: ['EmbedLinks'],
    async execute(client, interaction) {
        const prefix = await getPrefix(client, interaction);
        const arypton = await client.users.fetch(owner);
        const option = interaction.options.getSubcommand();
        const role = interaction.options.getRole('role');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator) &&
            interaction.user.id !== interaction.guild.ownerId) {
            const embed = new EmbedBuilder()
                .setDescription("You don't have permission to use this command.")
                .setColor(client.color);
            interaction.reply({ embeds: [embed] });
            return;
        }

        if (!option) {
            const guide = createGuideEmbed(client, prefix, arypton);
            interaction.reply({ embeds: [guide] });
            return;
        } else {
            switch (option) {
                case 'reqrole':
                case 'admin':
                case 'official':
                case 'guest':
                case 'girl':
                case 'friend':
                case 'vip':
                    await handleRoleCommand(client, interaction, option, role);
                    break;
                case 'reset':
                    await handleResetCommand(client, interaction);
                    break;
                case 'config':
                    await handleConfigCommand(client, interaction);
                    break;
                case 'guide':
                    const guide = new EmbedBuilder()
                        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
                        .setThumbnail(client.user.displayAvatarURL())
                        .setColor(client.color)
                        .addFields(
                            { name: `${emoji.util.arrow} \`setup config\``, value: "Displays custom role settings for the server.", inline: false },
                            { name: `${emoji.util.arrow} \`setup reset\``, value: "Resets custom role settings for the server.", inline: false },
                            { name: `${emoji.util.arrow} \`setup reqrole <role mention/id>\``, value: "Sets up a required role for the server.", inline: false },
                            { name: `${emoji.util.arrow} \`setup admin <role mention/id>\``, value: "Sets up an admin role for the server.", inline: false },
                            { name: `${emoji.util.arrow} \`setup official <role mention/id>\``, value: "Sets up an official role for the server.", inline: false },
                            { name: `${emoji.util.arrow} \`setup guest <role mention/id>\``, value: "Sets up a guest role for the server.", inline: false },
                            { name: `${emoji.util.arrow} \`setup girl <role mention/id>\``, value: "Sets up a girl role for the server.", inline: false },
                            { name: `${emoji.util.arrow} \`setup friend <role mention/id>\``, value: "Sets up a friend role for the server.", inline: false },
                            { name: `${emoji.util.arrow} \`setup vip <role mention/id>\``, value: "Sets up a VIP role for the server.", inline: false }
                        )
                        .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });
                    interaction.reply({ embeds: [guide] });
                    break;
            }
        }
    },
};

async function handleRoleCommand(client, interaction, roleType, selectedRole) {
    if (!selectedRole) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
            .setDescription(`${emoji.util.cross} | Role is missing in your argument.`)
            .setColor(client.color);
        interaction.reply({ embeds: [embed] });
        return;
    }

    const permissions = ['Administrator', 'ManageGuild', 'ManageRoles', 'ManageChannels', 'BanMembers', 'KickMembers'];
    if (permissions.some(p => selectedRole.permissions.has(p))) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
            .setDescription(`${emoji.util.cross} | The mentioned role cannot be selected because it has dangerous permissions.`)
            .setColor(client.color);
        interaction.reply({ embeds: [embed] });
        return;
    }

    await client.db3.set(`${roleType}_${interaction.guild.id}`, selectedRole.id);

    const embed = new EmbedBuilder()
        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
        .setDescription(`${emoji.util.tick} | Successfully added ${selectedRole} as the ${roleType} role.`)
        .setColor(client.color);

    interaction.reply({ embeds: [embed] });
}

async function getPrefix(client, interaction) {
    let prefix = await client.db8.get(`${interaction.guild.id}_prefix`);
    if (!prefix) prefix = Settings.bot.info.prefix;
    return prefix;
}

async function handleRoleCommand(client, interaction, roleType) {
    const role = interaction.options.getRole('role');
    if (!role) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
            .setDescription(`${emoji.util.cross} | Role is missing in your argument.`)
            .setColor(client.color);
        interaction.reply({ embeds: [embed] });
        return;
    }

    const permissions = ['Administrator', 'ManageGuild', 'ManageRoles', 'ManageChannels', 'BanMembers', 'KickMembers'];
    if (permissions.some(p => role.permissions.has(p))) {
        const embed = new EmbedBuilder()
            .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
            .setDescription(`${emoji.util.cross} | The mentioned role cannot be selected because it has dangerous permissions.`)
            .setColor(client.color);
        interaction.reply({ embeds: [embed] });
        return;
    }

    await client.db3.set(`${roleType}_${interaction.guild.id}`, role.id);

    const embed = new EmbedBuilder()
        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
        .setDescription(`${emoji.util.tick} | Successfully added ${role} as the ${roleType} role.`)
        .setColor(client.color);

    interaction.reply({ embeds: [embed] });
}

async function handleResetCommand(client, interaction) {
    const roleKeys = ['reqrole', 'admin', 'official', 'guest', 'girl', 'friend', 'vip'];
    const guildId = interaction.guild.id;

    try {
        for (const key of roleKeys) {
            await client.db3.delete(`${key}_${guildId}`);
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
            .setDescription(`${emoji.util.tick} | Custom role settings have been reset.`)
            .setColor(client.color);

        interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error("Error while resetting custom role settings:", error);
        const embed = new EmbedBuilder()
            .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
            .setDescription(`${emoji.util.cross} | An error occurred while resetting custom role settings.`)
            .setColor(client.color);

        interaction.reply({ embeds: [embed] });
    }
}

async function handleConfigCommand(client, interaction) {
    const roleKeys = ['reqrole', 'admin', 'official', 'guest', 'girl', 'friend', 'vip'];
    const roles = await Promise.all(roleKeys.map(async (key) => {
        const roleId = await client.db3.get(`${key}_${interaction.guild.id}`) || "na";
        const role = roleId === "na" ? "`Nothing To Show`" : `<@&${roleId}>`;
        return role;
    }));

    const embed = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
        .setTitle("Custom Role Settings for this Server")
        .setThumbnail(client.user.displayAvatarURL())
        .addFields(
            { name: `${emoji.util.arrow} Required Role`, value: roles[0], inline: false },
            { name: `${emoji.util.arrow} Admin Role`, value: roles[1], inline: false },
            { name: `${emoji.util.arrow} Official Role`, value: roles[2], inline: false },
            { name: `${emoji.util.arrow} Guest Role`, value: roles[3], inline: false },
            { name: `${emoji.util.arrow} Girl Role`, value: roles[4], inline: false },
            { name: `${emoji.util.arrow} Friend Role`, value: roles[5], inline: false },
            { name: `${emoji.util.arrow} VIP Role`, value: roles[6], inline: false }
        )

    interaction.reply({ embeds: [embed] });
}
