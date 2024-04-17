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

async function handleGuildUpdate(oldGuild, newGuild) {
  try {
    if (globalCooldown) {
      await handleRateLimit();
    }

    const auditLogs = await newGuild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.GuildUpdate });
    const logs = auditLogs.entries.first();

    if (!logs) return;

    const { executor } = logs;

    const whitelistData = await client.db.get(`${oldGuild.id}_wl`);
    const trusted = whitelistData?.whitelisted.includes(executor.id);
    const extraOwner = await client.db11.get(`${newGuild.id}_eo.extraownerlist`);
    const antinuke = await client.db.get(`${newGuild.id}_antiguildupdate`);
    const autorecovery = await client.db.get(`${newGuild.id}_autorecovery`);

    if (
      isExceptionalCase(executor.id, guild.ownerId) ||
      extraOwner.includes(executor.id) ||
      ownerIDS.includes(executor.id) ||
      antinuke !== true ||
      trusted === true
    ) return;

    if (!newGuild.members.me.permissions.has('ManageEmojisAndStickers')) {
      sendWebhookError('Bot lacks necessary permissions for emoji create actions.');
      return;
    }

    if (!newGuild.members.me.permissions.has('BanMembers')) {
      sendWebhookError('Bot lacks necessary permissions for ban actions.');
      return;
    }

    const member = await newGuild.members.fetch(executor.id);
    if (!member) return;

    const botMember = newGuild.members.me;
    if (member.roles.highest.comparePositionTo(botMember.roles.highest) >= 0) return;

    await newGuild.members.ban(member.id, { reason: 'Emoji Delete | Not Whitelisted' });

    if (autorecovery === true) {
      const oldIcon = oldGuild.iconURL();
      const oldName = oldGuild.name;

      const newIcon = newGuild.iconURL();
      const newName = newGuild.name;

      if (oldName !== newName) {
        await newGuild.setName(oldName);
      }

      if (oldIcon !== newIcon) {
        await newGuild.setIcon(oldIcon);
      }

      if (!newGuild.equals(oldGuild)) {
        await newGuild.edit({
          features: oldGuild.features
        }).catch((_) => { });
      }

      if (oldGuild.name !== newGuild.name) {
        newGuild.setName(oldGuild.name);
      }

      if (oldGuild.iconURL() !== newGuild.iconURL()) {
        newGuild.setIcon(oldGuild.iconURL());
      }

      if (!newGuild.equals(oldGuild)) {
        newGuild.edit({
          features: oldGuild.features
        });
      }

      if (!oldGuild.features.includes('Community') && newGuild.features.includes('Community')) {
        newGuild.edit({
          features: oldGuild.features
        });

        for (let i = 0; i <= 3; i++) {
          newGuild.channels.cache.forEach((channel) => {
            if (channel.name === 'rules' || channel.name === 'moderator-only') {
              channel.delete().catch((_) => { });
            }
          });
        }
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

function isExceptionalCase(executorId, ownerId) {
  return executorId === ownerId || executorId === client.user.id;
}

function hasPermissions(member, permissions) {
  if (member.permissions.has('Administrator')) {
    return true;
  }

  const botPermissions = member.permissions.toArray();
  return permissions.every((perm) => botPermissions.includes(perm));
}

function sendWebhookError(error) {
  webhookClient.send(error).catch(() => { });
}

client.on(Events.GuildUpdate, async (oldGuild, newGuild) => handleGuildUpdate(oldGuild, newGuild));
