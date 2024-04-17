const client = require("../index.js");
const st = require("../settings").bot;
const { ownerIDS } = require("../owner.json");
const { PermissionsBitField } = require("discord.js");

function isServerOwnerOrBotOwner(message) {
  return (
    message.author.id === message.guild?.ownerId ||
    ownerIDS.includes(message.author.id)
  );
}

function getReadablePermissions(permissions) {
  return permissions.map((perm) => `\`${perm}\``).join(", ");
}

function isUserAboveBotRole(message) {
  const botRolePosition = message.guild.members.me.roles.highest.position;
  const userRolePosition = message.member.roles.highest.position;
  return userRolePosition > botRolePosition;
}

async function isUserInblacklist(client, ID) {
  const data = await client.db4.get(`members_bl`);
  if (!data || !data.blacklist) return false;
  return data.blacklist.includes(ID);
}

async function handleCommand(client, message, args) {
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;

  let command =
    client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  const extraOwner =
    (await client.db11.get(`${message.guild.id}_eo.extraownerlist`)) || [];
  const extraAdmin =
    (await client.db11.get(`${message.guild.id}_ea.extraadminlist`)) || [];
  const premium = await client.db12.get(`${message.guild.id}_premium.active`);

  const userHasAdminPerm = message.member.permissions.has(PermissionsBitField.Flags.Administrator);
  const botHasAdminPerm = message.guild.members.me.permissions.has(PermissionsBitField.Flags.Administrator);
  const channelId = message.channel.id;
  const ignoreChannels =
    (await client.db10.get(`${message.guild.id}_ic.ignorechannellist`)) || [];
  const ignoreBypass =
    (await client.db10.get(`${message.guild.id}_ic.ignorebypasslist`)) || [];
  const mediaChannels =
    (await client.db14.get(
      `${message.guild.id}_mediachannels.mediachannellist`,
    )) || [];

  if (message.author.bot) return;
  if (!command) return;

  if (command) {
    if (command.botOwner && !isServerOwnerOrBotOwner(message)) {
      return message.channel.send(
        "This command can only be used by the bot owner.",
      );
    }

    if (
      command.serverOwnerOnly &&
      !isServerOwnerOrBotOwner(message) &&
      !extraOwner.includes(message.author.id)
    ) {
      return message.channel.send(
        "This command can only be used by the server owner or extra owners.",
      );
    }

    if (
      !isServerOwnerOrBotOwner(message) &&
      userHasAdminPerm &&
      botHasAdminPerm &&
      !command.aboveRole &&
      !extraOwner.includes(message.author.id) &&
      !extraAdmin.includes(message.author.id)
    ) {
      if (command) {
        if (mediaChannels.includes(channelId)) return;
        if (
          ignoreChannels.includes(channelId) &&
          !ignoreBypass.includes(message.author.id)
        ) {
          const ignoreMessage = await message.channel.send(
            "This channel is in my ignore list. You cannot use commands here.",
          );
          setTimeout(() => ignoreMessage.delete().catch(console.error), 5000);
          return;
        }
      }

      command.run(client, message, args);
      return;
    }

    if (
      !isServerOwnerOrBotOwner(message) &&
      botHasAdminPerm &&
      !extraOwner.includes(message.author.id) &&
      !extraAdmin.includes(message.author.id)
    ) {
      const missingUserPerms = command.UserPerms || [];

      if (
        missingUserPerms.length > 0 &&
        !message.member.permissions.has(missingUserPerms)
      ) {
        return message.channel.send(
          `You need ${getReadablePermissions(
            missingUserPerms,
          )} permission(s) to use this command.`,
        );
      }

      if (command.aboveRole && !isUserAboveBotRole(message)) {
        return message.channel.send(
          "You need a role higher than the bot's role to use this command.",
        );
      }

      if (command) {
        if (mediaChannels.includes(channelId)) return;
        if (
          ignoreChannels.includes(channelId) &&
          !ignoreBypass.includes(message.author.id)
        ) {
          const ignoreMessage = await message.channel.send(
            "This channel is in my ignore list. You cannot use commands here.",
          );
          setTimeout(() => ignoreMessage.delete().catch(console.error), 5000);
          return;
        }
      }

      command.run(client, message, args);
      return;
    }

    if (
      !isServerOwnerOrBotOwner(message) &&
      userHasAdminPerm &&
      !extraOwner.includes(message.author.id) &&
      !extraAdmin.includes(message.author.id)
    ) {
      const missingBotPerms = command.BotPerms || [];

      if (
        missingBotPerms.length > 0 &&
        !message.guild.members.me.permissions.has(missingBotPerms)
      ) {
        return message.channel.send(
          `I need ${getReadablePermissions(
            missingBotPerms,
          )} permission(s) to execute this command.`,
        );
      }

      if (command.aboveRole && !isUserAboveBotRole(message)) {
        return message.channel.send(
          "You need a role higher than the bot's role to use this command.",
        );
      }

      if (command) {
        if (mediaChannels.includes(channelId)) return;
        if (
          ignoreChannels.includes(channelId) &&
          !ignoreBypass.includes(message.author.id)
        ) {
          const ignoreMessage = await message.channel.send(
            "This channel is in my ignore list. You cannot use commands here.",
          );
          setTimeout(() => ignoreMessage.delete().catch(console.error), 5000);
          return;
        }
      }

      command.run(client, message, args);
      return;
    }

    if (
      !isServerOwnerOrBotOwner(message) &&
      !extraOwner.includes(message.author.id) &&
      !extraAdmin.includes(message.author.id)
    ) {
      const missingUserPerms = command.UserPerms || [];
      const missingBotPerms = command.BotPerms || [];
      let missingPermsMessage = "";

      if (
        missingUserPerms.length > 0 &&
        !message.member.permissions.has(missingUserPerms)
      ) {
        missingPermsMessage += `You need ${getReadablePermissions(
          missingUserPerms,
        )} permission(s) to use this command.\n`;
      }

      if (
        missingBotPerms.length > 0 &&
        !message.guild.members.me.permissions.has(missingBotPerms)
      ) {
        missingPermsMessage += `I need ${getReadablePermissions(
          missingBotPerms,
        )} permission(s) to execute this command.\n`;
      }

      if (command.aboveRole && !isUserAboveBotRole(message)) {
        missingPermsMessage +=
          "You need a role higher than the bot's role to use this command.\n";
      }

      if (missingPermsMessage.trim() !== "") {
        return message.channel.send(missingPermsMessage);
      }
    }

    if (command) {
      if (mediaChannels.includes(channelId)) return;
      if (
        ignoreChannels.includes(channelId) &&
        !ignoreBypass.includes(message.author.id)
      ) {
        const ignoreMessage = await message.channel.send(
          "This channel is in my ignore list. You cannot use commands here.",
        );
        setTimeout(() => ignoreMessage.delete().catch(console.error), 5000);
        return;
      }

      command.run(client, message, args);
    }
  }
}

async function getPrefix(guildId) {
  return (await client.db8.get(`${guildId}_prefix`)) || st.info.prefix;
}

function isBotOrDM(message) {
  return message.author.bot || !message.guild;
}

function getCommandAndArgs(message, prefix, noprefixed, np) {
  const regex = new RegExp(`^<@!?${client.user.id}>`);
  const pre = message.content.match(regex)
    ? message.content.match(regex)[0]
    : prefix;

  if (
    !noprefixed.includes(message.author.id) &&
    !message.content.startsWith(pre)
  )
    return null;

  return np.includes(message.author.id) === false
    ? message.content.slice(pre.length).trim().split(/ +/)
    : message.content.startsWith(pre)
      ? message.content.slice(pre.length).trim().split(/ +/)
      : message.content.trim().split(/ +/);
}

client.on("messageCreate", async (message) => {
  try {
    if (isBotOrDM(message)) return;

    if (!message.guild.members.me.permissionsIn(message.channel).has("SendMessages")) {
      return;
    }

    const isBlacklisted = await isUserInblacklist(client, message.author.id);
    if (isBlacklisted) return;

    const prefix = await getPrefix(message.guild.id);
    const data = await client.db4.get(`members_np`);
    const noprefixed = data.noprefixlist;
    const np = [...noprefixed];

    const args = getCommandAndArgs(message, prefix, noprefixed, np);
    if (args) {
      await handleCommand(client, message, args);
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
});
