const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const Settings = require('../../settings.js');
const emoji = require('../../emoji.js');
const owner = Settings.bot.credits.developerId;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invc')
        .addSubcommand(subcommand =>
            subcommand
                .setName('config')
                .setDescription('Shows invc role settings for the server.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('humans')
                .setDescription('Set up invc human role settings for the server.')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Specify the invc human role.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('bots')
                .setDescription('Set up invc bot role settings for the server.')
                .addRoleOption(option =>
                    option.setName('role')
                        .setDescription('Specify the invc bot role.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('reset')
                .setDescription('Resets invc role settings for the server.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('guide')
                .setDescription('Shows the setup guide for invc roles.')
        )
        .setDescription('Manage invc role settings for the server.'),
    voteOnly: true,
    UserPerms: ['ManageChannels', 'ManageRoles'],
    BotPerms: ['EmbedLinks'],
    async execute(client, interaction) {
        const prefix = await getPrefix(client, interaction);
        const arypton = await client.users.fetch(owner);
        const subcommand = interaction.options.getSubcommand();
        const role = interaction.options.getRole('role');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles) &&
            interaction.user.id !== interaction.guild.ownerId) {
            const embed = new EmbedBuilder()
                .setDescription("You don't have permission to use this command.")
                .setColor(client.color);
            interaction.reply({ embeds: [embed] });
            return;
        }

        switch (subcommand) {
            case 'config':
                const HumanRole = await client.db7.get(`invchumanrole_${interaction.guild.id}.HumanRole`) || "na";
                const BotRole = await client.db7.get(`invcbotrole_${interaction.guild.id}.BotRole`) || "na";

                let invcHumanRoleString;
                let invcBotRoleString;
                if (HumanRole === 'na') {
                    invcHumanRoleString = `\`Nothing To Show\``;
                } else {
                    const humanrole = interaction.guild.roles.cache.get(HumanRole);
                    invcHumanRoleString = humanrole ? `[1] | [${humanrole.id}](https://dsc.gg/resisthq) | \`${humanrole.name}\`` : `\`Invalid Role ID\``;
                }

                if (BotRole === 'na') {
                    invcBotRoleString = `\`Nothing To Show\``;
                } else {
                    const botrole = interaction.guild.roles.cache.get(BotRole);
                    invcBotRoleString = botrole ? `[1] | [${botrole.id}](https://dsc.gg/resisthq) | \`${botrole.name}\`` : `\`Invalid Role ID\``;
                }

                const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() });

                if (invcHumanRoleString && invcHumanRoleString !== '') {
                    embed.addFields(
                        { name: "InVC Humans Role", value: invcHumanRoleString }
                    );
                }

                if (invcBotRoleString && invcBotRoleString !== '') {
                    embed.addFields(
                        { name: "InVC Bot Role", value: invcBotRoleString }
                    );
                }

                embed.setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

                await interaction.reply({ embeds: [embed] });
                break;
            case 'humans':
                if (!role) {
                    await interaction.reply({ content: `${emoji.util.cross} | Provide a Role` });
                    return;
                }

                if (role.permissions.has("Administrator")) {
                    await interaction.reply({ content: `${emoji.util.cross} | \`Administrator\` Role cannot be Selected` });
                    return;
                }

                const existingHumanRole = await client.db7.get(`invchumanrole_${interaction.guild.id}.HumanRole`);
                if (existingHumanRole === role.id) {
                    await interaction.reply({ content: `${emoji.util.cross} | \`${role.name}\` is already in the database as a human role` });
                    return;
                }

                if (role.comparePositionTo(interaction.guild.me.roles.highest) >= 0) {
                    await interaction.reply({ content: `${emoji.util.cross} | \`${role.name}\` has a higher or equal position than the bot's role` });
                    return;
                }

                await client.db7.set(`invchumanrole_${interaction.guild.id}.HumanRole`, role.id);
                await client.db7.set(`invcroleguild_${interaction.guild.id}.Guild`, interaction.guild.id);
                await interaction.reply({ content: `${emoji.util.tick} | Successfully added \`${role.name}\` as invc human Role` });
                break;

            case 'bots':
                if (!role) {
                    await interaction.reply({ content: `${emoji.util.cross} | Provide a Role` });
                    return;
                }

                if (role.permissions.has("Administrator")) {
                    await interaction.reply({ content: `${emoji.util.cross} | \`Administrator\` Role cannot be Selected` });
                    return;
                }

                const existingBotRole = await client.db7.get(`invcbotrole_${interaction.guild.id}.BotRole`);
                if (existingBotRole === role.id) {
                    await interaction.reply({ content: `${emoji.util.cross} | \`${role.name}\` is already in the database as a bot role` });
                    return;
                }

                if (role.comparePositionTo(interaction.guild.me.roles.highest) >= 0) {
                    await interaction.reply({ content: `${emoji.util.cross} | \`${role.name}\` has a higher or equal position than the bot's role` });
                    return;
                }

                await client.db7.set(`invcbotrole_${interaction.guild.id}.BotRole`, role.id);
                await client.db7.set(`invcroleguild_${interaction.guild.id}.Guild`, interaction.guild.id);
                await interaction.reply({ content: `${emoji.util.tick} | Successfully added \`${role.name}\` as invc bot Role` });
                break;
            case 'reset':
                const promises = [
                    client.db7.delete(`invchumanrole_${interaction.guild.id}`),
                    client.db7.delete(`invcroleguild_${interaction.guild.id}.Guild`),
                    client.db7.delete(`invcbotrole_${interaction.guild.id}`),
                ];

                await Promise.all(promises);

                await interaction.reply(`InVC roles have been reset for this server.`);
                break;

            case 'guide':
                const guide = createSetupGuide(client, arypton);
                await interaction.reply({ embeds: [guide] });
                break;
        }
    },
};

async function getPrefix(client, interaction) {
    let prefix = await client.db8.get(`${interaction.guild.id}_prefix`);
    if (!prefix) prefix = Settings.bot.info.prefix;
    return prefix;
}

function createSetupGuide(client, arypton) {
    const guide = new EmbedBuilder()
        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
        .setThumbnail(client.user.displayAvatarURL())
        .setColor(client.color)
        .addFields(
            { name: `${emoji.util.arrow} \`/invc config\``, value: "Shows invc role settings for the server.", inline: false },
            { name: `${emoji.util.arrow} \`/invc humans <role>\``, value: "Setups invc human role settings for the server.", inline: false },
            { name: `${emoji.util.arrow} \`/invc bots <role>\``, value: "Setups invc bot role settings for the server.", inline: false },
            { name: `${emoji.util.arrow} \`/invc reset\``, value: "Resets invc role settings for the server.", inline: false }
        )
        .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    return guide;
}
