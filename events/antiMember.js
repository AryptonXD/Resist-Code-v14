const { ownerIDS } = require('../owner.json');
const client = require('../index.js');
const { WebhookClient, AuditLogEvent, Events } = require('discord.js');

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

async function handleGuildBanAdd(member) {
  try {
    if (globalCooldown) {
      await handleRateLimit();
    }

    const auditLogs = await member.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberBanAdd });
    const logs = auditLogs.entries.first();

    if (!logs) return;

    const { executor, target } = logs;

    const whitelistData = await client.db.get(`${member.guild.id}_wl`);
    const trusted = whitelistData?.whitelisted.includes(executor.id);
    const extraOwner = await client.db11.get(`${member.guild.id}_eo.extraownerlist`);
    const antinuke = await client.db.get(`${member.guild.id}_antiban`);
    const autorecovery = await client.db.get(`${member.guild.id}_autorecovery`);

    if (
      isExceptionalCase(executor.id, member.guild.ownerId) ||
      extraOwner.includes(executor.id) ||
      ownerIDS.includes(executor.id) ||
      antinuke !== true ||
      trusted === true
    ) return;

    if (!member.guild.members.me.permissions.has('ManageRoles')) {
      sendWebhookError('Bot lacks necessary permissions for member create actions.');
      return;
    }

    if (!member.guild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const member = await member.guild.members.fetch(executor.id);
    if (!member) return;

    const botMember = member.guild.members.me;
    if (member.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await member.guild.members.ban(member.id, { reason: 'Member Delete | Not Whitelisted' });

    if (autorecovery === true) {
      await member.guild.members.unban(target.id).catch((_) => { });
    }
  } catch (err) {
    if (err.code === 429) {
      await handleRateLimit();
      return;
    }
    sendWebhookError(err);
  }
}

async function handleGuildBanRemove(member) {
  try {
    if (globalCooldown) {
      await handleRateLimit();
    }

    const auditLogs = await member.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberBanRemove });
    const logs = auditLogs.entries.first();

    if (!logs) return;

    const { executor, target } = logs;

    const whitelistData = await client.db.get(`${member.guild.id}_wl`);
    const trusted = whitelistData?.whitelisted.includes(executor.id);
    const extraOwner = await client.db11.get(`${member.guild.id}_eo.extraownerlist`);
    const antinuke = await client.db.get(`${member.guild.id}_antiunban`);
    const autorecovery = await client.db.get(`${member.guild.id}_autorecovery`);

    if (
      isExceptionalCase(executor.id, member.guild.ownerId) ||
      extraOwner.includes(executor.id) ||
      ownerIDS.includes(executor.id) ||
      antinuke !== true ||
      trusted === true
    ) return;

    if (!member.guild.members.me.permissions.has('ManageRoles')) {
      sendWebhookError('Bot lacks necessary permissions for member create actions.');
      return;
    }

    if (!member.guild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const member = await member.guild.members.fetch(executor.id);
    if (!member) return;

    const botMember = member.guild.members.me;
    if (member.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await member.guild.members.ban(member.id, { reason: 'Member Delete | Not Whitelisted' });

    if (autorecovery === true) {
      await member.guild.members.ban(target.id, {
        reason: 'Anti Member Unban'
      }).catch((_) => { });
    }
  } catch (err) {
    if (err.code === 429) {
      await handleRateLimit();
      return;
    }
    sendWebhookError(err);
  }
}

async function handleGuildMemberAdd(member) {
  try {
    if (globalCooldown) {
      await handleRateLimit();
    }

    const auditLogs = await member.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.BotAdd });
    const logs = auditLogs.entries.first();

    if (!logs) return;

    const { executor, target } = logs;

    const whitelistData = await client.db.get(`${member.guild.id}_wl`);
    const trusted = whitelistData?.whitelisted.includes(executor.id);
    const extraOwner = await client.db11.get(`${member.guild.id}_eo.extraownerlist`);
    const antinuke = await client.db.get(`${member.guild.id}_antibot`);
    const autorecovery = await client.db.get(`${member.guild.id}_autorecovery`);

    if (
      isExceptionalCase(executor.id, member.guild.ownerId) ||
      extraOwner.includes(executor.id) ||
      ownerIDS.includes(executor.id) ||
      !target.bot ||
      antinuke !== true ||
      trusted === true ||
      target.id !== member.id
    ) return;

    if (!member.guild.members.me.permissions.has('ManageRoles')) {
      sendWebhookError('Bot lacks necessary permissions for member create actions.');
      return;
    }

    if (!member.guild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const member = await member.guild.members.fetch(executor.id);
    if (!member) return;

    const botMember = member.guild.members.me;
    if (member.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await member.guild.members.ban(member.id, { reason: 'Member Delete | Not Whitelisted' });

    if (autorecovery === true) {
      await member.guild.members.ban(target.id, {
        reason: 'Illegal Bot | Not Whitelisted'
      }).catch((_) => { });
    }
  } catch (err) {
    if (err.code === 429) {
      await handleRateLimit();
      return;
    }
    sendWebhookError(err);
  }
}

async function handleGuildMemberRemove(member) {
  try {
    if (globalCooldown) {
      await handleRateLimit();
    }

    const auditLogs = await member.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberKick });
    const logs = auditLogs.entries.first();

    if (!logs) return;

    const { executor, target } = logs;

    const whitelistData = await client.db.get(`${member.guild.id}_wl`);
    const trusted = whitelistData?.whitelisted.includes(executor.id);
    const extraOwner = await client.db11.get(`${member.guild.id}_eo.extraownerlist`);
    const antinuke = await client.db.get(`${member.guild.id}_antikick`);

    if (
      isExceptionalCase(executor.id, member.guild.ownerId) ||
      extraOwner.includes(executor.id) ||
      ownerIDS.includes(executor.id) ||
      member.id !== target.id ||
      antinuke !== true ||
      trusted === true
    ) return;

    if (!member.guild.members.me.permissions.has('ManageRoles')) {
      sendWebhookError('Bot lacks necessary permissions for member create actions.');
      return;
    }

    if (!member.guild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const member = await member.guild.members.fetch(executor.id);
    if (!member) return;

    const botMember = member.guild.members.me;
    if (member.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await member.guild.members.ban(member.id, { reason: 'Member Delete | Not Whitelisted' });

  } catch (err) {
    if (err.code === 429) {
      await handleRateLimit();
      return;
    }
    sendWebhookError(err);
  }
}

async function handleGuildMemberPrune(member) {

  if (!member.guild.members.me.permissions.has('ViewAuditLog')) {
    return;
  }

  try {
    const auditLogs = await member.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberPrune });
    const logs = auditLogs.entries.first();

    if (!logs) return;

    const { executor } = logs;

    const antinuke = await client.db.get(`${member.guild.id}_antiprune`);
    const extraOwner = await client.db11.get(`${member.guild.id}_eo.extraownerlist`);

    if (
      isExceptionalCase(executor.id, member.guild.ownerId) ||
      extraOwner.includes(executor.id) ||
      ownerIDS.includes(executor.id) ||
      antinuke !== true
    ) return;

    if (!member.guild.members.me.permissions.has('ManageRoles')) {
      sendWebhookError('Bot lacks necessary permissions for member create actions.');
      return;
    }

    if (!member.guild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const member = await member.guild.members.fetch(executor.id);
    if (!member) return;

    const botMember = member.guild.members.me;
    if (member.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await member.guild.members.ban(member.id, { reason: 'Member Delete | Not Whitelisted' });

  } catch (err) {
    sendWebhookError(err);
  }
}

async function handleGuildMemberUpdate(oldMember, newMember) {
  try {
    const auditLogs = await newMember.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberRoleUpdate });
    const logs = auditLogs.entries.first();

    if (!logs) return;

    const { executor, target } = logs;

    const whitelistData = await client.db.get(`${newMember.guild.id}_wl`);
    const trusted = whitelistData?.whitelisted.includes(executor.id);
    const extraOwner = await client.db11.get(`${newMember.guild.id}_eo.extraownerlist`);
    const antinuke = await client.db.get(`${newMember.guild.id}_antimemberupdate`);
    const autorecovery = await client.db.get(`${newMember.guild.id}_autorecovery`);
    const executorMember = newMember.guild.members.cache.get(executor.id);

    if (!executorMember.permissions.has('ManageRoles') && !executorMember.permissions.has('Administrator')) {
      return;
    }

    if (
      isExceptionalCase(executor.id, newMember.guild.ownerId) ||
      extraOwner.includes(executor.id) ||
      ownerIDS.includes(executor.id) ||
      antinuke !== true ||
      trusted === true
    ) return;

    if (!newMember.guild.members.me.permissions.has('ManageRoles')) {
      sendWebhookError('Bot lacks necessary permissions for member create actions.');
      return;
    }

    if (!newMember.guild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const member = await newMember.guild.members.fetch(executor.id);
    if (!member) return;

    const botMember = newMember.guild.members.me;
    if (newMember.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await newMember.guild.members.ban(member.id, { reason: 'Member Delete | Not Whitelisted' });

    if (autorecovery === true && !newMember.roles.cache.equals(oldMember.roles.cache)) {
      await newMember.roles.set(oldMember.roles.cache).catch((_) => { });
    }
  } catch (err) {
    sendWebhookError(err);
  }
}

function isExceptionalCase(executorId, ownerId) {
  return executorId === ownerId || executorId === client.user.id;
}

function sendWebhookError(error) {
  webhookClient.send(error).catch(() => { });
}

client.on(Events.GuildBanAdd, async (member) => handleGuildBanAdd(member));
client.on(Events.GuildBanRemove, async (member) => handleGuildBanRemove(member));
client.on(Events.GuildMemberAdd, async (member) => handleGuildMemberAdd(member));
client.on(Events.GuildMemberRemove, async (member) => handleGuildMemberRemove(member));
client.on(Events.GuildMembersChunk, async (member) => handleGuildMemberPrune(member));
client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => handleGuildMemberUpdate(oldMember, newMember));
