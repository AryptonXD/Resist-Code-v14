const client = require('../index');
const { ownerIDS } = require('../owner.json');
const { WebhookClient, AuditLogEvent, Events } = require('discord.js');

const webhookClient = new WebhookClient({
  id: '1198228168251818064',
  token: 'iF7yhDPqc6SWMWPg34mE0ycephH_T8mK1reKKGdcp0sgkVnj5yR0iE0bUM3EUMnwk5ja'
});

async function handleRateLimit() {
  await new Promise((resolve) => setTimeout(resolve, 5000));
}

async function handleWebhookCreate(webhook) {

  if (!webhook.guild.members.me.permissions.has('ViewAuditLog')) {
    return;
  }

  try {
    const auditLog = await webhook.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.WebhookCreate });
    const logs = auditLog.entries.first();

    if (!logs) return;

    const { executor, target } = logs;

    const whitelistData = await client.db.get(`${webhook.guild.id}_wl`);
    const trusted = whitelistData?.whitelisted.includes(executor.id);
    const extraOwner = await client.db11.get(`${webhook.guild.id}_eo.extraownerlist`);
    const antinuke = await client.db.get(`${webhook.guild.id}_antiwebhookcreate`);
    const autorecovery = await client.db.get(`${webhook.guild.id}_autorecovery`);

    if (
      executor.id === webhook.guild.ownerId ||
      executor.id === client.user.id ||
      ownerIDS.includes(executor.id) ||
      extraOwner.includes(executor.id) ||
      antinuke !== true ||
      trusted === true
    ) return;

    if (!webhook.guild.members.me.permissions.has('ManageWebhooks')) {
      sendWebhookError('Bot lacks necessary permissions for webhook create actions.');
      return;
    }

    if (!webhook.guild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const member = await webhook.guild.members.fetch(executor.id);
    if (!member) return;

    const botMember = webhook.guild.members.me;
    if (member.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await webhook.guild.members.ban(member.id, { reason: 'Channel Delete | Not Whitelisted' });

    if (autorecovery !== true) {
      await webhook.delete().catch(() => { });
    }
  } catch (err) {
    if (err.code === 429) {
      await handleRateLimit();
      return;
    }
    sendWebhookError(err);
  }
}

async function handleWebhookDelete(webhook) {

  if (!webhook.guild.members.me.permissions.has('ViewAuditLog')) {
    return;
  }

  try {
    const auditLog = await webhook.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.WebhookDelete });
    const logs = auditLog.entries.first();

    if (!logs) return;

    const { executor, target } = logs;

    const whitelistData = await client.db.get(`${webhook.guild.id}_wl`);
    const trusted = whitelistData?.whitelisted.includes(executor.id);
    const extraOwner = await client.db11.get(`${webhook.guild.id}_eo.extraownerlist`);
    const antinuke = await client.db.get(`${webhook.guild.id}_antiwebhookdelete`);
    const autorecovery = await client.db.get(`${webhook.guild.id}_autorecovery`);

    if (
      executor.id === webhook.guild.ownerId ||
      executor.id === client.user.id ||
      ownerIDS.includes(executor.id) ||
      extraOwner.includes(executor.id) ||
      antinuke !== true ||
      trusted === true
    ) return;

    if (!webhook.guild.members.me.permissions.has('ManageWebhooks')) {
      sendWebhookError('Bot lacks necessary permissions for webhook create actions.');
      return;
    }

    if (!webhook.guild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const member = await webhook.guild.members.fetch(executor.id);
    if (!member) return;

    const botMember = webhook.guild.members.me;
    if (member.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await webhook.guild.members.ban(member.id, { reason: 'Channel Delete | Not Whitelisted' });

    if (autorecovery === true) {
      const webhook = webhook.webhook;
      const webhookName = webhook.name;
      const webhookAvatar = webhook.avatar;

      await webhook.createWebhook(webhookName, {
        avatar: webhookAvatar,
      });
    }
  } catch (err) {
    if (err.code === 429) {
      await handleRateLimit();
      return;
    }
    sendWebhookError(err);
  }
}

async function handleWebhookUpdate(oldWebhook, newWebhook) {
  try {
    const auditLog = await newWebhook.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.WebhookUpdate });
    const logs = auditLog.entries.first();

    if (!logs) return;

    const { executor, target } = logs;

    const whitelistData = await client.db.get(`${newWebhook.guild.id}_wl`);
    const trusted = whitelistData?.whitelisted.includes(executor.id);
    const extraOwner = await client.db11.get(`${newWebhook.guild.id}_eo.extraownerlist`);
    const antinuke = await client.db.get(`${newWebhook.guild.id}_antiwebhookupdate`);
    const autorecovery = await client.db.get(`${newWebhook.guild.id}_autorecovery`);

    if (
      executor.id === newWebhook.guild.ownerId ||
      executor.id === client.user.id ||
      ownerIDS.includes(executor.id) ||
      extraOwner.includes(executor.id) ||
      antinuke !== true ||
      trusted === true
    ) return;

    if (!newWebhook.guild.members.me.permissions.has('ManageWebhooks')) {
      sendWebhookError('Bot lacks necessary permissions for webhook create actions.');
      return;
    }

    if (!newWebhook.guild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const member = await newWebhook.guild.members.fetch(executor.id);
    if (!member) return;

    const botMember = newWebhook.guild.members.me;
    if (member.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await newWebhook.guild.members.ban(member.id, { reason: 'Channel Delete | Not Whitelisted' });

    if (autorecovery === true) {
      await newWebhook.edit({
        name: oldWebhook.name,
        avatar: oldWebhook.avatar,
        channel: oldWebhook.channel,
      });
    }
  } catch (err) {
    if (err.code === 429) {
      await handleRateLimit();
      return;
    }
    sendWebhookError(err);
  }
}

function sendWebhookError(error) {
  webhookClient.send(error).catch(() => { });
}

client.on(Events.WebhooksUpdate, async (webhook) => handleWebhookCreate(webhook));
client.on(Events.WebhooksUpdate, async (webhook) => handleWebhookDelete(webhook));
client.on(Events.WebhooksUpdate, async (oldWebhook, newWebhook) => handleWebhookUpdate(oldWebhook, newWebhook));
