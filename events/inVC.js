const client = require('../index.js');
const { WebhookClient } = require('discord.js');

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

async function addVoiceChannelRole(member, role) {
  if (!globalCooldown) {
    try {
      await member.roles.add(role);
    } catch (error) {
      console.error(`Error adding voice channel role to member ${member.user.tag}:`, error);
    }
  } else {
    await handleRateLimit();
    await addVoiceChannelRole(member, role);
  }
}

async function removeVoiceChannelRole(member, role) {
  if (!globalCooldown) {
    try {
      await member.roles.remove(role);
    } catch (error) {
      console.error(`Error removing voice channel role from member ${member.user.tag}:`, error);
    }
  } else {
    await handleRateLimit();
    await removeVoiceChannelRole(member, role);
  }
}

client.on('voiceStateUpdate', async (oldState, newState) => {
  const guildId = oldState.guild.id;

  const invcGuildId = await client.db7.get(`invcroleguild_${guildId}.Guild`);
  if (!invcGuildId || guildId !== invcGuildId) return;

  const invcHumanRoleId = await client.db7.get(`invchumanrole_${guildId}.HumanRole`);
  const invcBotRoleId = await client.db7.get(`invcbotrole_${guildId}.BotRole`);

  const humanRole = newState.guild.roles.cache.get(invcHumanRoleId);
  const botRole = newState.guild.roles.cache.get(invcBotRoleId);

  const member = newState.member;

  if (member.user.bot && botRole) {
    if (!oldState.channel && newState.channel) {
      await addVoiceChannelRole(member, botRole);
    } else if (oldState.channel && (!newState.channel || oldState.guildId === newState.guildId) && !member.voice.channel) {
      await removeVoiceChannelRole(member, botRole);
    }
  } else if (!member.user.bot && humanRole) {
    if (!oldState.channel && newState.channel) {
      await addVoiceChannelRole(member, humanRole);
    } else if (oldState.channel && (!newState.channel || oldState.guildId === newState.guildId) && !member.voice.channel) {
      await removeVoiceChannelRole(member, humanRole);
    }
  }
});

function sendWebhookError(error) {
  webhookClient.send(error).catch(() => { });
}
