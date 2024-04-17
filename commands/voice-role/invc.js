const { EmbedBuilder } = require('discord.js');
const Settings = require('../../settings.js');
const emoji = require('../../emoji.js');
const owner = Settings.bot.credits.developerId;

module.exports = {
    name: 'invc',
    voteOnly: true,
    UserPerms: ['ManageRoles'],
    BotPerms: ['EmbedLinks', 'ManageRoles'],
    aboveRole: true,
    run: async (client, message, args) => {
        const prefix = await client.db8.get(`${message.guild.id}_prefix`) || Settings.bot.info.prefix;
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
        const arypton = await client.users.fetch(owner);

        const guide = new EmbedBuilder()
            .setAuthor({ name: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true }) })
            .setThumbnail(client.user.displayAvatarURL())
            .setColor(client.color)
            .addFields(
                { name: `${emoji.util.arrow} \`${prefix}invc config\``, value: "Shows invc role settings for the server." },
                { name: `${emoji.util.arrow} \`${prefix}invc humans <role>\``, value: "Setups invc human role settings for the server." },
                { name: `${emoji.util.arrow} \`${prefix}invc bots <role>\``, value: "Setups invc bot role settings for the server." },
                { name: `${emoji.util.arrow} \`${prefix}invc reset\``, value: "Resets invc role settings for the server." }
            )
            .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

        switch (args[0]) {
            case 'config':
                const HumanRole = await client.db7.get(`invchumanrole_${message.guild.id}.HumanRole`) || "na";
                const BotRole = await client.db7.get(`invcbotrole_${message.guild.id}.BotRole`) || "na";

                let invcHumanRoleString;
                let invcBotRoleString;
                if (HumanRole === 'na') {
                    invcHumanRoleString = `\`Nothing To Show\``;
                } else {
                    const humanrole = message.guild.roles.cache.get(HumanRole);
                    invcHumanRoleString = humanrole ? `[1] | [${humanrole.id}](https://dsc.gg/resisthq) | \`${humanrole.name}\`` : `\`Invalid Role ID\``;
                }

                if (BotRole === 'na') {
                    invcBotRoleString = `\`Nothing To Show\``;
                } else {
                    const botrole = message.guild.roles.cache.get(BotRole);
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

                await message.channel.send({ embeds: [embed] });
                break;
            case 'humans':
            case 'human':
                if (!role || !args[1]) {
                    await message.channel.send({ content: `${emoji.util.cross} | Provide a Role` });
                    return;
                }

                if (role.permissions.has("Administrator")) {
                    await message.channel.send({ content: `${emoji.util.cross} | \`Administrator\` Role cannot be Selected` });
                    return;
                }

                const existingHumanRole = await client.db7.get(`invchumanrole_${message.guild.id}.HumanRole`);
                if (existingHumanRole === role.id) {
                    await message.channel.send({ content: `${emoji.util.cross} | \`${role.name}\` is already in the database as a human role` });
                    return;
                }

                if (role.comparePositionTo(message.guild.members.me.roles.highest) >= 0) {
                    await message.channel.send({ content: `${emoji.util.cross} | \`${role.name}\` has a higher or equal position than the bot's role` });
                    return;
                }

                await client.db7.set(`invchumanrole_${message.guild.id}.HumanRole`, role.id);
                await client.db7.set(`invcroleguild_${message.guild.id}.Guild`, message.guild.id);
                await message.channel.send({ content: `${emoji.util.tick} | Successfully added \`${role.name}\` as invc human Role` });
                break;

            case 'bots':
            case 'bot':
                if (!role || !args[1]) {
                    await message.channel.send({ content: `${emoji.util.cross} | Provide a Role` });
                    return;
                }

                if (role.permissions.has("Administrator")) {
                    await message.channel.send({ content: `${emoji.util.cross} | \`Administrator\` Role cannot be Selected` });
                    return;
                }

                const existingBotRole = await client.db7.get(`invcbotrole_${message.guild.id}.BotRole`);
                if (existingBotRole === role.id) {
                    await message.channel.send({ content: `${emoji.util.cross} | \`${role.name}\` is already in the database as a bot role` });
                    return;
                }

                if (role.comparePositionTo(message.guild.members.me.roles.highest) >= 0) {
                    await message.channel.send({ content: `${emoji.util.cross} | \`${role.name}\` has a higher or equal position than the bot's role` });
                    return;
                }

                await client.db7.set(`invcbotrole_${message.guild.id}.BotRole`, role.id);
                await client.db7.set(`invcroleguild_${message.guild.id}.Guild`, message.guild.id);
                await message.channel.send({ content: `${emoji.util.tick} | Successfully added \`${role.name}\` as invc bot Role` });
                break;
            case 'reset':
                const promises = [
                    client.db7.delete(`invchumanrole_${message.guild.id}`),
                    client.db7.delete(`invcroleguild_${message.guild.id}.Guild`),
                    client.db7.delete(`invcbotrole_${message.guild.id}`),
                ];

                await Promise.all(promises);

                await message.channel.send(`InVC roles have been reset for this server.`);
                break;

            default:
                await message.channel.send({ embeds: [guide] });
                break;
        }
    }
}
