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

async function handleBan(guild, userId, reason) {
  if (!hasPermissions(guild.members.me, ['Administrator', 'BanMembers'])) {
    return;
  }

  const member = await guild.members.fetch(userId);
  if (!member) return;

  const botMember = guild.members.me;
  if (member.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

  await guild.members.ban(userId, { reason });
}

async function handleRoleCreate(role) {
  try {
    const auditLogs = await role.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleCreate });
    const logs = auditLogs.entries.first();

    if (!logs) return;

    const { executor, target } = logs;

    const whitelistData = await client.db.get(`${role.guild.id}_wl`);
    const trusted = whitelistData?.whitelisted.includes(executor.id);
    const extraOwner = await client.db11.get(`${role.guild.id}_eo.extraownerlist`);
    const antinuke = await client.db.get(`${role.guild.id}_antirolecreate`);
    const autorecovery = await client.db.get(`${role.guild.id}_autorecovery`);

    if (
      isExceptionalCase(executor.id, role.guild.ownerId) ||
      extraOwner.includes(executor.id) ||
      ownerIDS.includes(executor.id) ||
      antinuke !== true ||
      trusted === true ||
      role.managed
    ) return;

    if (!role.guild.members.me.permissions.has('ManageRoles')) {
      sendWebhookError('Bot lacks necessary permissions for role create actions.');
      return;
    }

    if (!role.guild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const member = await role.guild.members.fetch(executor.id);
    if (!member) return;

    const botMember = role.guild.members.me;
    if (member.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await role.guild.members.ban(member.id, { reason: 'Role Delete | Not Whitelisted' });

    if (autorecovery === true) {
      await role.delete();
    }
  } catch (err) {
    if (err.code === 429) {
      await handleRateLimit();
      return;
    }
    sendWebhookError(err);
  }
}

async function handleRoleDelete(role) {
  try {
    const auditLogs = await role.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleDelete });
    const logs = auditLogs.entries.first();

    if (!logs) return;

    const { executor, target } = logs;

    const whitelistData = await client.db.get(`${role.guild.id}_wl`);
    const trusted = whitelistData?.whitelisted.includes(executor.id);
    const extraOwner = await client.db11.get(`${role.guild.id}_eo.extraownerlist`);
    const antinuke = await client.db.get(`${role.guild.id}_antiroledelete`);
    const autorecovery = await client.db.get(`${role.guild.id}_autorecovery`);

    if (
      isExceptionalCase(executor.id, role.guild.ownerId) ||
      extraOwner.includes(executor.id) ||
      ownerIDS.includes(executor.id) ||
      antinuke !== true ||
      trusted === true ||
      role.managed
    ) return;

    if (!role.guild.members.me.permissions.has('ManageRoles')) {
      sendWebhookError('Bot lacks necessary permissions for role create actions.');
      return;
    }

    if (!role.guild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const member = await role.guild.members.fetch(executor.id);
    if (!member) return;

    const botMember = role.guild.members.me;
    if (member.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await role.guild.members.ban(member.id, { reason: 'Role Delete | Not Whitelisted' });

    if (autorecovery === true) {
      await role.guild.roles.create({
        name: role.name,
        color: role.color,
        hoist: role.hoist,
        permissions: role.permissions,
        position: role.position,
        mentionable: role.mentionable,
        reason: 'Anti Role Delete'
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

async function handleRoleUpdate(oldRole, newRole) {
  try {
    const auditLogs = await newRole.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.RoleUpdate });
    const logs = auditLogs.entries.first();

    if (!logs) return;

    const { executor, target } = logs;

    const whitelistData = await client.db.get(`${newRole.guild.id}_wl`);
    const trusted = whitelistData?.whitelisted.includes(executor.id);
    const extraOwner = await client.db11.get(`${newRole.guild.id}_eo.extraownerlist`);
    const antinuke = await client.db.get(`${newRole.guild.id}_antiroleupdate`);
    const autorecovery = await client.db.get(`${newRole.guild.id}_autorecovery`);

    if (
      isExceptionalCase(executor.id, newRole.guild.ownerId) ||
      extraOwner.includes(executor.id) ||
      ownerIDS.includes(executor.id) ||
      antinuke !== true ||
      trusted === true
    ) return;

    if (!newRole.guild.members.me.permissions.has('ManageRoles')) {
      sendWebhookError('Bot lacks necessary permissions for role create actions.');
      return;
    }

    if (!newRole.guild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const member = await newRole.guild.members.fetch(executor.id);
    if (!member) return;

    const botMember = newRole.guild.members.me;
    if (member.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await newRole.guild.members.ban(member.id, { reason: 'Role Delete | Not Whitelisted' });

    if (autorecovery === true) {
      await newRole.edit({
        name: oldRole.name,
        color: oldRole.color,
        hoist: oldRole.hoist,
        permissions: oldRole.permissions,
        position: oldRole.position,
        mentionable: oldRole.mentionable,
        reason: 'Anti Role Delete'
      });
    }
  } catch (err) {
    sendWebhookError(err);
  }
}

function isExceptionalCase(executorId, ownerId) {
  return executorId === ownerId || executorId === client.user.id;
}

client.on(Events.RoleCreate, async (role) => handleRoleCreate(role));
client.on(Events.RoleDelete, async (role) => handleRoleDelete(role));
client.on(Events.RoleUpdate, async (newRole, oldRole) => handleRoleUpdate(newRole, oldRole));
