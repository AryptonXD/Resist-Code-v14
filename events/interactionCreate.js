const client = require('../index');
const st = require("../settings").bot;
const { ownerIDS } = require("../owner.json");
const { PermissionsBitField } = require("discord.js");

function isServerOwnerOrBotOwner(interaction) {
	return (
		interaction.member.id === interaction.guild?.ownerId ||
		ownerIDS.includes(interaction.member.id)
	);
}

function getReadablePermissions(permissions) {
	return permissions.map((perm) => `\`${perm}\``).join(", ");
}

function isUserAboveBotRole(interaction) {
	const botRolePosition = interaction.guild.members.me.roles.highest.position;
	const userRolePosition = interaction.member.roles.highest.position;
	return userRolePosition > botRolePosition;
}

async function isUserInblacklist(client, ID) {
	const data = await client.db4.get(`members_bl`);
	if (!data || !data.blacklist) return false;
	return data.blacklist.includes(ID);
}

async function handleCommand(client, interaction) {
	let slashCommand =
		client.slashCommands.get(interaction.commandName);
	const extraOwner =
		(await client.db11.get(`${interaction.guild.id}_eo.extraownerlist`)) || [];
	const extraAdmin =
		(await client.db11.get(`${interaction.guild.id}_ea.extraadminlist`)) || [];
	const premium = await client.db12.get(`${interaction.guild.id}_premium.active`);

	const userHasAdminPerm = interaction.member.permissions.has(PermissionsBitField.Flags.Administrator);
	const botHasAdminPerm = interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator);
	const channelId = interaction.channel.id;
	const ignoreChannels =
		(await client.db10.get(`${interaction.guild.id}_ic.ignorechannellist`)) || [];
	const ignoreBypass =
		(await client.db10.get(`${interaction.guild.id}_ic.ignorebypasslist`)) || [];
	const mediaChannels =
		(await client.db14.get(
			`${interaction.guild.id}_mediachannels.mediachannellist`,
		)) || [];

	if (interaction.member.bot) return;
	if (!slashCommand) return;

	if (slashCommand) {
		if (slashCommand.botOwner && !isServerOwnerOrBotOwner(interaction)) {
			return interaction.reply(
				"This command can only be used by the bot owner.",
			);
		}

		if (
			slashCommand.serverOwnerOnly &&
			!isServerOwnerOrBotOwner(interaction) &&
			!extraOwner.includes(interaction.member.id)
		) {
			return interaction.reply(
				"This command can only be used by the server owner or extra owners.",
			);
		}

		if (
			!isServerOwnerOrBotOwner(interaction) &&
			userHasAdminPerm &&
			botHasAdminPerm &&
			!slashCommand.aboveRole &&
			!extraOwner.includes(interaction.member.id) &&
			!extraAdmin.includes(interaction.member.id)
		) {
			if (slashCommand) {
				if (mediaChannels.includes(channelId)) return;
				if (
					ignoreChannels.includes(channelId) &&
					!ignoreBypass.includes(interaction.member.id)
				) {
					const ignoreMessage = await interaction.reply(
						"This channel is in my ignore list. You cannot use commands here.",
					);
					setTimeout(() => ignoreMessage.delete().catch(console.error), 5000);
					return;
				}
			}
			await slashCommand.execute(client, interaction);
			return;
		}

		if (
			!isServerOwnerOrBotOwner(interaction) &&
			botHasAdminPerm &&
			!extraOwner.includes(interaction.member.id) &&
			!extraAdmin.includes(interaction.member.id)
		) {
			const missingUserPerms = slashCommand.UserPerms || [];

			if (
				missingUserPerms.length > 0 &&
				!interaction.member.permissions.has(missingUserPerms)
			) {
				return interaction.reply(
					`You need ${getReadablePermissions(
						missingUserPerms,
					)} permission(s) to use this command.`,
				);
			}

			if (slashCommand.aboveRole && !isUserAboveBotRole(interaction)) {
				return interaction.reply(
					"You need a role higher than the bot's role to use this command.",
				);
			}

			if (slashCommand) {
				if (mediaChannels.includes(channelId)) return;
				if (
					ignoreChannels.includes(channelId) &&
					!ignoreBypass.includes(interaction.member.id)
				) {
					const ignoreMessage = await interaction.reply(
						"This channel is in my ignore list. You cannot use commands here.",
					);
					setTimeout(() => ignoreMessage.delete().catch(console.error), 5000);
					return;
				}
			}
			await slashCommand.execute(client, interaction);
			return;
		}

		if (
			!isServerOwnerOrBotOwner(interaction) &&
			userHasAdminPerm &&
			!extraOwner.includes(interaction.member.id) &&
			!extraAdmin.includes(interaction.member.id)
		) {
			const missingBotPerms = slashCommand.BotPerms || [];

			if (
				missingBotPerms.length > 0 &&
				!interaction.guild.members.me.permissions.has(missingBotPerms)
			) {
				return interaction.reply(
					`I need ${getReadablePermissions(
						missingBotPerms,
					)} permission(s) to execute this command.`,
				);
			}

			if (slashCommand.aboveRole && !isUserAboveBotRole(interaction)) {
				return interaction.reply(
					"You need a role higher than the bot's role to use this command.",
				);
			}

			if (slashCommand) {
				if (mediaChannels.includes(channelId)) return;
				if (
					ignoreChannels.includes(channelId) &&
					!ignoreBypass.includes(interaction.member.id)
				) {
					const ignoreMessage = await interaction.reply(
						"This channel is in my ignore list. You cannot use commands here.",
					);
					setTimeout(() => ignoreMessage.delete().catch(console.error), 5000);
					return;
				}
			}
			await slashCommand.execute(client, interaction);
			return;
		}

		if (
			!isServerOwnerOrBotOwner(interaction) &&
			!extraOwner.includes(interaction.member.id) &&
			!extraAdmin.includes(interaction.member.id)
		) {
			const missingUserPerms = slashCommand.UserPerms || [];
			const missingBotPerms = slashCommand.BotPerms || [];
			let missingPermsMessage = "";

			if (
				missingUserPerms.length > 0 &&
				!interaction.member.permissions.has(missingUserPerms)
			) {
				missingPermsMessage += `You need ${getReadablePermissions(
					missingUserPerms,
				)} permission(s) to use this command.\n`;
			}

			if (
				missingBotPerms.length > 0 &&
				!interaction.guild.members.me.permissions.has(missingBotPerms)
			) {
				missingPermsMessage += `I need ${getReadablePermissions(
					missingBotPerms,
				)} permission(s) to execute this command.\n`;
			}

			if (slashCommand.aboveRole && !isUserAboveBotRole(interaction)) {
				missingPermsMessage +=
					"You need a role higher than the bot's role to use this command.\n";
			}

			if (missingPermsMessage.trim() !== "") {
				return interaction.reply(missingPermsMessage);
			}
		}

		if (slashCommand) {
			if (mediaChannels.includes(channelId)) return;
			if (
				ignoreChannels.includes(channelId) &&
				!ignoreBypass.includes(interaction.member.id)
			) {
				const ignoreMessage = await interaction.reply(
					"This channel is in my ignore list. You cannot use commands here.",
				);
				setTimeout(() => ignoreMessage.delete().catch(console.error), 5000);
				return;
			}
			await slashCommand.execute(client, interaction);
		}
	}
}

function isBotOrDM(interaction) {
	return interaction.member.bot || !interaction.guild;
}

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;
	if (isBotOrDM(interaction)) return;

	if (!interaction.guild.members.me.permissionsIn(interaction.channel).has("SendMessages")) {
		return;
	}

	const isBlacklisted = await isUserInblacklist(client, interaction.member.id);
	if (isBlacklisted) return;

	try {
		await handleCommand(client, interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});
