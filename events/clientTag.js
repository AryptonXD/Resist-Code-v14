const client = require('../index');
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { bot } = require('../settings');

async function isUserInblacklist(client, ID) {
  const data = await client.db4.get(`members_bl`);
  if (!data || !data.blacklist) return false;
  return data.blacklist.includes(ID);
}

function isBotOrDM(message) {
  return message.author.bot || !message.guild;
}

async function handleMessageCreate(message) {
  try {
    if (isBotOrDM(message)) return;

    const prefix = await client.db8.get(`${message.guild.id}_prefix`) || bot.info.prefix;

    if (!message.guild.members.me.permissionsIn(message.channel).has("SendMessages")) {
      return;
    }

    const isBlacklisted = await isUserInblacklist(client, message.author.id);
    if (isBlacklisted) return;

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Invite Me")
        .setStyle("Link")
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`),
      new ButtonBuilder()
        .setLabel("Support Server")
        .setStyle("Link")
        .setURL(client.support),
      new ButtonBuilder()
        .setLabel("Website")
        .setStyle("Link")
        .setURL(client.website)
    )

    if (message.content === `<@${client.user.id}>`) {
      return message.channel.send({ content: `My prefix for this Server is \`${prefix}\``, components: [button] });
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

client.on('messageCreate', async (message) => handleMessageCreate(message));
