const { EmbedBuilder } = require('discord.js');
const Settings = require('../../settings.js');
const emoji = require('../../emoji.js');
const owner = Settings.bot.credits.developerId;

async function bulkDeleteMessages(message, amount, client) {
  const fetchedMessages = await message.channel.messages.fetch({ limit: amount + 1 });
  await message.channel.bulkDelete(fetchedMessages, true);

  message.channel.send({
    embeds: [new EmbedBuilder().setColor(client.color).setDescription(`${emoji.util.tick} | Successfully deleted ${amount} messages.`)]
  }).then(m => {
    setTimeout(() => {
      m.delete().catch(() => { });
    }, 3000);
  });
}

module.exports = {
  name: 'clear',
  aliases: ['c', 'purge', 'prune'],
  UserPerms: ['ManageMessages'],
  BotPerms: ['ManageMessages', 'EmbedLinks'],
  run: async (client, message, args) => {

    const list = args[0];
    const amount = parseInt(args[0]);
    const listAmount = parseInt(args[1]) || 50;
    let prefix = await client.db8.get(`${message.guild.id}_prefix`) || Settings.bot.info.prefix;
    const arypton = await client.users.fetch(owner);

    const guide = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
      .addFields(
        {
          name: `${emoji.util.arrow}` + prefix + "clear bots",
          value: "Delete the bots messages in the channel."
        },
        {
          name: `${emoji.util.arrow}` + prefix + "clear humans",
          value: "Delete the humans messages in the channel."
        },
        {
          name: `${emoji.util.arrow}` + prefix + "clear embeds",
          value: "Delete the embeds messages in the channel."
        },
        {
          name: `${emoji.util.arrow}` + prefix + "clear files",
          value: "Delete the files messages in the channel."
        },
        {
          name: `${emoji.util.arrow}` + prefix + "clear mentions",
          value: "Delete the mentions messages in the channel."
        },
        {
          name: `${emoji.util.arrow}` + prefix + "clear pins",
          value: "Delete the pins messages in the channel."
        },
        {
          name: `${emoji.util.arrow}` + prefix + "clear <amount>",
          value: "Delete the provided amount of messages in the channel."
        }
      )
      .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    if (!list && !amount) {
      return message.channel.send({ embeds: [guide] });
    }

    const clearMessages = async (filter) => {
      const messages = await message.channel.messages.fetch({ limit: listAmount });
      const data = messages.filter(filter).map(m => m);

      await message.delete();
      await message.channel.bulkDelete(data.length ? data : 1, true).then(async (m) => {
        const successEmbed = new EmbedBuilder()
          .setColor(client.color)
          .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
          .setDescription(`${emoji.util.tick} | Cleared ${m.size}/${data.length} messages!`);
        const successMessage = await message.channel.send({ embeds: [successEmbed] });

        setTimeout(() => {
          successMessage.delete();
        }, 5000);
      });
    };

    switch (list) {
      case 'bots':
        return clearMessages(ms => ms.author.bot && !ms.pinned);
      case 'humans':
        return clearMessages(ms => !ms.author.bot && !ms.pinned);
      case 'embeds':
        return clearMessages(ms => ms.embeds.length && !ms.pinned);
      case 'files':
        return clearMessages(ms => ms.attachments.first() && !ms.pinned);
      case 'mentions':
        return clearMessages(ms => (ms.mentions.users.first() || ms.mentions.members.first() || ms.mentions.channels.first() || ms.mentions.roles.first()) && !ms.pinned);
      case 'pins':
        return clearMessages(ms => ms.pinned);
      default:
        if (isNaN(amount) || amount <= 0 || amount >= 100) {
          return message.reply({ embeds: [new EmbedBuilder().setColor(client.color).setDescription(`${emoji.util.cross} | Please provide a valid number of messages to be deleted (1-99).`)] });
        }
        await bulkDeleteMessages(message, amount, client);
    }
  },
};
