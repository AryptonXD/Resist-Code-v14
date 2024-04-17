const { ownerIDS } = require('../owner.json');
const client = require('../index.js');
const { WebhookClient, Events, AuditLogEvent } = require('discord.js');

const webhookClient = new WebhookClient({
  id: '1198228168251818064',
  token: 'iF7yhDPqc6SWMWPg34mE0ycephH_T8mK1reKKGdcp0sgkVnj5yR0iE0bUM3EUMnwk5ja'
});

let globalCooldown = false;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function handleRateLimit() {
  globalCooldown = true;
  await sleep(5000);
  globalCooldown = false;
}

async function handleEmojiCreate(emoji) {
  try {
    if (globalCooldown) {
      await handleRateLimit();
    }

    const auditLogs = await emoji.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.EmojiCreate });
    const logs = auditLogs.entries.first();

    if (!logs) return;

    const { executor } = logs;

    const whitelistData = await client.db.get(`${emoji.guild.id}_wl`);
    const extraOwner = await client.db11.get(`${emoji.guild.id}_eo.extraownerlist`);
    const trusted = whitelistData?.whitelisted.includes(executor.id);
    const antinuke = await client.db.get(`${emoji.guild.id}_antiemojicreate`);
    const autorecovery = await client.db.get(`${emoji.guild.id}_autorecovery`);

    if (
      isExceptionalCase(executor.id, emoji.guild.ownerId) ||
      extraOwner.includes(executor.id) ||
      ownerIDS.includes(executor.id) ||
      antinuke !== true ||
      trusted === true
    ) return;

    if (!emoji.guild.members.me.permissions.has('ManageEmojisAndStickers')) {
      sendWebhookError('Bot lacks necessary permissions for emoji create actions.');
      return;
    }

    if (!emoji.guild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const member = await emoji.guild.members.fetch(executor.id);
    if (!member) return;

    const botMember = emoji.guild.members.me;
    if (member.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await emoji.guild.members.ban(member.id, { reason: 'Emoji Delete | Not Whitelisted' });

    if (autorecovery === true) {
      await emoji.delete();
    }
  } catch (err) {
    if (err.code === 429) {
      await handleRateLimit();
      return;
    }
    sendWebhookError(err);
  }
}

async function handleEmojiDelete(emoji) {
  try {
    if (globalCooldown) {
      await handleRateLimit();
    }

    const auditLogs = await emoji.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.EmojiDelete });
    const logs = auditLogs.entries.first();

    if (!logs) return;

    const { executor } = logs;

    const whitelistData = await client.db.get(`${emoji.guild.id}_wl`);
    const trusted = whitelistData?.whitelisted.includes(executor.id);
    const extraOwner = await client.db11.get(`${emoji.guild.id}_eo.extraownerlist`);
    const antinuke = await client.db.get(`${emoji.guild.id}_antiemojidelete`);

    if (
      isExceptionalCase(executor.id, emoji.guild.ownerId) ||
      ownerIDS.includes(executor.id) ||
      extraOwner.includes(executor.id) ||
      antinuke !== true ||
      trusted === true
    ) return;

    if (!emoji.guild.members.me.permissions.has('ManageEmojisAndStickers')) {
      sendWebhookError('Bot lacks necessary permissions for emoji create actions.');
      return;
    }

    if (!emoji.guild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const member = await emoji.guild.members.fetch(executor.id);
    if (!member) return;

    const botMember = emoji.guild.members.me;
    if (member.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await emoji.guild.members.ban(member.id, { reason: 'Emoji Delete | Not Whitelisted' });

  } catch (err) {
    if (err.code === 429) {
      await handleRateLimit();
      return;
    }
    sendWebhookError(err);
  }
}

async function handleEmojiUpdate(oldEmoji, newEmoji) {
  try {
    if (globalCooldown) {
      await handleRateLimit();
    }

    const auditLogs = await newEmoji.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.EmojiUpdate });
    const logs = auditLogs.entries.first();

    if (!logs) return;

    const { executor } = logs;

    const whitelistData = await client.db.get(`${newEmoji.guild.id}_wl`);
    const trusted = whitelistData?.whitelisted.includes(executor.id);
    const extraOwner = await client.db11.get(`${newEmoji.guild.id}_eo.extraownerlist`);
    const antinuke = await client.db.get(`${newEmoji.guild.id}_antiemojiupdate`);
    const autorecovery = await client.db.get(`${newEmoji.guild.id}_autorecovery`);

    if (
      isExceptionalCase(executor.id, newEmoji.guild.ownerId) ||
      ownerIDS.includes(executor.id) ||
      extraOwner.includes(executor.id) ||
      antinuke !== true ||
      trusted === true
    ) return;

    if (!newEmoji.guild.members.me.permissions.has('ManageEmojisAndStickers')) {
      sendWebhookError('Bot lacks necessary permissions for emoji create actions.');
      return;
    }

    if (!newEmoji.guild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const member = await newEmoji.guild.members.fetch(executor.id);
    if (!member) return;

    const botMember = newEmoji.guild.members.me;
    if (member.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await newEmoji.guild.members.ban(member.id, { reason: 'Emoji Delete | Not Whitelisted' });

    if (autorecovery === true) {
      await newEmoji.setName(oldEmoji.name);
    }
  } catch (err) {
    if (err.code === 429) {
      await handleRateLimit();
      return;
    }
    sendWebhookError(err);
  }
}

function isExceptionalCase(executorId, ownerId) {
  return executorId === ownerId || executorId === client.user.id;
}

function sendWebhookError(error) {
  webhookClient.send(error).catch(() => { });
}

client.on(Events.EmojiCreate, async (emoji) => handleEmojiCreate(emoji));
client.on(Events.EmojiDelete, async (emoji) => handleEmojiDelete(emoji));
client.on(Events.EmojiUpdate, async (oldEmoji, newEmoji) => handleEmojiUpdate(oldEmoji, newEmoji));
