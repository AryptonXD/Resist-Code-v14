const { ownerIDS } = require('../owner.json');
const client = require('../index.js');
const { WebhookClient, AuditLogEvent, Events, ChannelType } = require('discord.js');

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

async function handleChannelCreate(channel) {
  try {
    if (globalCooldown) {
      await handleRateLimit();
    }

    const auditLogs = await channel.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelCreate });
    const logs = auditLogs.entries.first();

    if (!logs) return;

    const { executor } = logs;

    const whitelistData = await client.db.get(`${channel.guild.id}_wl`);
    const extraOwner = await client.db11.get(`${channel.guild.id}_eo.extraownerlist`);
    const trusted = whitelistData?.whitelisted.includes(executor.id);
    const antinuke = await client.db.get(`${channel.guild.id}_antichannelcreate`);
    const autorecovery = await client.db.get(`${channel.guild.id}_autorecovery`);

    if (
      isExceptionalCase(executor.id, channel.guild.ownerId) ||
      ownerIDS.includes(executor.id) ||
      extraOwner.includes(executor.id) ||
      antinuke !== true ||
      trusted === true
    ) return;

    if (!channel.guild.members.me.permissions.has('ManageChannels')) {
      sendWebhookError('Bot lacks necessary permissions for channel create actions.');
      return;
    }

    if (!channel.guild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const member = await channel.guild.members.fetch(executor.id);
    if (!member) return;

    const botMember = channel.guild.members.me;
    if (member.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await channel.guild.members.ban(member.id, { reason: 'Channel Create | Not Whitelisted' });

    if (autorecovery === true) {
      await channel.delete();
    }
  } catch (err) {
    if (err.code === 429) {
      await handleRateLimit();
      return;
    }
    sendWebhookError(err);
  }
}

async function handleChannelDelete(channel) {
  try {
    if (globalCooldown) {
      await handleRateLimit();
    }

    const auditLogs = await channel.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelDelete });
    const logs = auditLogs.entries.first();

    if (!logs) return;

    const { executor } = logs;

    const whitelistData = await client.db.get(`${channel.guild.id}_wl`);
    const extraOwner = await client.db11.get(`${channel.guild.id}_eo.extraownerlist`);
    const trusted = whitelistData?.whitelisted.includes(executor.id);
    const antinuke = await client.db.get(`${channel.guild.id}_antichanneldelete`);
    const autorecovery = await client.db.get(`${channel.guild.id}_autorecovery`);

    if (
      isExceptionalCase(executor.id, channel.guild.ownerId) ||
      ownerIDS.includes(executor.id) ||
      extraOwner.includes(executor.id) ||
      antinuke !== true ||
      trusted === true
    ) return;

    if (!channel.guild.members.me.permissions.has('ManageChannels')) {
      sendWebhookError('Bot lacks necessary permissions for channel create actions.');
      return;
    }

    if (!channel.guild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const member = await channel.guild.members.fetch(executor.id);
    if (!member) return;

    const botMember = channel.guild.members.me;
    if (member.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await channel.guild.members.ban(member.id, { reason: 'Channel Delete | Not Whitelisted' });

    if (autorecovery === true) {
      const clonedChannel = await channel.clone();
      await clonedChannel.setPosition(channel.position);
    }
  } catch (err) {
    if (err.code === 429) {
      await handleRateLimit();
      return;
    }
    sendWebhookError(err);
  }
}

async function handleChannelUpdate(oldChannel, newChannel) {
  try {
    if (globalCooldown) {
      await handleRateLimit();
    }

    const auditLogs = await newChannel.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.ChannelUpdate });
    const logs = auditLogs.entries.first();

    if (!logs) return;

    const { executor } = logs;

    const whitelistData = await client.db.get(`${newChannel.guild.id}_wl`);
    const trusted = whitelistData?.whitelisted.includes(executor.id);
    const antinuke = await client.db.get(`${newChannel.guild.id}_antichannelupdate`);
    const extraOwner = await client.db11.get(`${channel.guild.id}_eo.extraownerlist`);
    const autorecovery = await client.db.get(`${newChannel.guild.id}_autorecovery`);

    if (
      isExceptionalCase(executor.id, newChannel.guild.ownerId) ||
      ownerIDS.includes(executor.id) ||
      extraOwner.includes(executor.id) ||
      antinuke !== true ||
      trusted === true
    ) return;

    if (!newChannel.guild.members.me.permissions.has('ManageChannels')) {
      sendWebhookError('Bot lacks necessary permissions for channel create actions.');
      return;
    }

    if (!newChannel.guild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const member = await newChannel.guild.members.fetch(executor.id);
    if (!member) return;

    const botMember = newChannel.guild.members.me;
    if (member.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await newChannel.guild.members.ban(member.id, { reason: 'Channel Update | Not Whitelisted' });

    if (autorecovery === true) {
      if (newChannel.type === ChannelType.GuildText) {
        await handleTextChannelUpdate(oldChannel, newChannel);
      } else if (newChannel.type === ChannelType.GuildCategory) {
        await handleCategoryUpdate(oldChannel, newChannel);
      } else if (newChannel.type === ChannelType.GuildVoice) {
        await handleVoiceChannelUpdate(oldChannel, newChannel);
      }
    }
  } catch (err) {
    if (err.code === 429) {
      await handleRateLimit();
      return;
    }
    sendWebhookError(err);
  }
}

async function handleTextChannelUpdate(oldChannel, newChannel) {
  await newChannel.edit({
    name: oldChannel.name,
    type: oldChannel.type,
    position: oldChannel.position,
    topic: oldChannel.topic,
    permissionOverwrites: oldChannel.permissionOverwrites,
    rateLimitPerUser: oldChannel.rateLimitPerUser
  });
}

async function handleCategoryUpdate(oldChannel, newChannel) {
  await newChannel.edit({
    name: oldChannel.name,
    type: oldChannel.type,
    rawPosition: oldChannel.rawPosition,
    permissions: oldChannel.permissions,
    position: oldChannel.position
  });
}

async function handleVoiceChannelUpdate(oldChannel, newChannel) {
  await newChannel.edit({
    name: oldChannel.name,
    type: oldChannel.type,
    rawPosition: oldChannel.rawPosition,
    bitrate: oldChannel.bitrate,
    userLimit: oldChannel.userLimit,
    position: oldChannel.position
  });
}

function isExceptionalCase(executorId, ownerId) {
  return executorId === ownerId || executorId === client.user.id;
}

function sendWebhookError(error) {
  webhookClient.send(error).catch(() => { });
}

client.on(Events.ChannelCreate, async (channel) => handleChannelCreate(channel));
client.on(Events.ChannelDelete, async (channel) => handleChannelDelete(channel));
client.on(Events.ChannelUpdate, async (oldChannel, newChannel) => handleChannelUpdate(oldChannel, newChannel));
