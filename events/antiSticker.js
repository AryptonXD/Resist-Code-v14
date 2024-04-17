const { ownerIDS } = require('../owner.json');
const client = require('../index.js');
const { WebhookClient, AuditLogEvent, Events } = require('discord.js');

const webhookClient = new WebhookClient({
  id: '1198228168251818064',
  token: 'iF7yhDPqc6SWMWPg34mE0ycephH_T8mK1reKKGdcp0sgkVnj5yR0iE0bUM3EUMnwk5ja'
});

async function handleRateLimit() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
}

async function handleStickerCreate(sticker) {
  try {
    const auditLogs = await sticker.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.StickerCreate });
    const logs = auditLogs.entries.first();

    if (!logs) return;

    const { executor, target } = logs;

    const whitelistData = await client.db.get(`${sticker.guild.id}_wl`);
    const trusted = whitelistData?.whitelisted.includes(executor.id);
    const extraOwner = await client.db11.get(`${sticker.guild.id}_eo.extraownerlist`);
    const antinuke = await client.db.get(`${sticker.guild.id}_antiroleupdate`);
    const autorecovery = await client.db.get(`${sticker.guild.id}_autorecovery`);

    if (
      executor.id === sticker.guild.ownerId ||
      ownerIDS.includes(executor.id) ||
      executor.id === client.user.id ||
      extraOwner.includes(executor.id) ||
      antinuke !== true ||
      trusted === true
    ) return;

    if (!newRole.guild.members.me.permissions.has('ManageEmojisAndStickers')) {
      sendWebhookError('Bot lacks necessary permissions for role create actions.');
      return;
    }

    if (!newRole.guild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const sticker = await newRole.guild.members.fetch(executor.id);
    if (!sticker) return;

    const botMember = newRole.guild.members.me;
    if (sticker.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await newRole.guild.members.ban(sticker.id, { reason: 'Role Delete | Not Whitelisted' });

    if (autorecovery !== true) {
      await sticker.delete().catch(() => { });
    }
  } catch (err) {
    if (err.code === 429) {
      await handleRateLimit();
      return;
    }
    sendWebhookError(err);
  }
}

async function handleStickerDelete(sticker) {
  try {
    const auditLogs = await sticker.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.StickerDelete });
    const logs = auditLogs.entries.first();

    if (!logs) return;

    const { executor, target } = logs;

    const antinuke = await client.db.get(`${sticker.guild.id}_antistickerdelete`);
    const whitelistData = await client.db.get(`${sticker.guild.id}_wl`);
    const trusted = whitelistData?.whitelisted.includes(executor.id);
    const extraOwner = await client.db11.get(`${sticker.guild.id}_eo.extraownerlist`);

    if (
      executor.id === sticker.guild.ownerId ||
      ownerIDS.includes(executor.id) ||
      executor.id === client.user.id ||
      extraOwner.includes(executor.id) ||
      antinuke !== true ||
      trusted === true
    ) return;

    if (!newRole.guild.members.me.permissions.has('ManageEmojisAndStickers')) {
      sendWebhookError('Bot lacks necessary permissions for role create actions.');
      return;
    }

    if (!newRole.guild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const sticker = await newRole.guild.members.fetch(executor.id);
    if (!sticker) return;

    const botMember = newRole.guild.members.me;
    if (sticker.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await newRole.guild.members.ban(sticker.id, { reason: 'Role Delete | Not Whitelisted' });

  } catch (err) {
    if (err.code === 429) {
      await handleRateLimit();
      return;
    }
    sendWebhookError(err);
  }
}

async function handleStickerUpdate(oldSticker, newSticker) {
  try {
    const auditLogs = await newSticker.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.StickerUpdate });
    const logs = auditLogs.entries.first();

    if (!logs) return;

    const { executor, target } = logs;

    const antinuke = await client.db.get(`${newSticker.guild.id}_antistickerdelete`);
    const whitelistData = await client.db.get(`${newSticker.guild.id}_wl`);
    const extraOwner = await client.db11.get(`${newSticker.guild.id}_eo.extraownerlist`);
    const trusted = whitelistData?.whitelisted.includes(executor.id);
    const autorecovery = await client.db.get(`${newSticker.guild.id}_autorecovery`);

    if (
      executor.id === sticker.guild.ownerId ||
      ownerIDS.includes(executor.id) ||
      executor.id === client.user.id ||
      extraOwner.includes(executor.id) ||
      antinuke !== true ||
      trusted === true
    ) return;

    if (!newSticker.guild.members.me.permissions.has('ManageEmojisAndStickers')) {
      sendWebhookError('Bot lacks necessary permissions for role create actions.');
      return;
    }

    if (!newSticker.guild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const sticker = await newSticker.guild.members.fetch(executor.id);
    if (!sticker) return;

    const botMember = newSticker.guild.members.me;
    if (sticker.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await newSticker.guild.members.ban(sticker.id, { reason: 'Role Delete | Not Whitelisted' });

    if (autorecovery === true) {
      await newSticker.edit({ name: oldSticker.name }).catch(() => { });
    }
  } catch (err) {
    sendWebhookError(err);
  }
}

function hasPermissions(sticker, permissions) {
  if (sticker.permissions.has('Administrator')) {
    return true;
  }

  const botPermissions = sticker.permissions.toArray();
  return permissions.every((perm) => botPermissions.includes(perm));
}

function sendWebhookError(error) {
  webhookClient.send(error).catch(() => { });
}

client.on(Events.GuildStickerCreate, async (sticker) => handleStickerCreate(sticker));
client.on(Events.GuildStickerDelete, async (sticker) => handleStickerDelete(sticker));
client.on(Events.GuildStickerUpdate, async (oldSticker, newSticker) => handleStickerUpdate(oldSticker, newSticker));
