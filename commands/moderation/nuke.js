const { ButtonBuilder, ActionRowBuilder } = require('discord.js');

async function nukeChannel(channel, reason) {
  await channel.clone({ reason });
  await channel.delete({ reason });
}

async function sendConfirmationMessage(channel) {
  const confirmButton = new ButtonBuilder()
    .setCustomId('confirm')
    .setLabel('Confirm')
    .setStyle('Success');

  const cancelButton = new ButtonBuilder()
    .setCustomId('cancel')
    .setLabel('Cancel')
    .setStyle('Danger');

  const row = new ActionRowBuilder().addComponents(confirmButton, cancelButton);

  const confirmationMsg = await channel.send({
    content: 'Are you sure you want to nuke this channel?',
    components: [row],
  });

  return confirmationMsg;
}

module.exports = {
  name: 'nuke',
  UserPerms: ['ManageChannels'],
  BotPerms: ['EmbedLinks', 'ManageChannels'],
  voteOnly: false,
  description: 'Nuke the channel',
  run: async (client, message, args) => {

    const reason = 'Channel Delete Command Used';

    const confirmationMsg = await sendConfirmationMessage(message.channel);

    const filter = (interaction) => interaction.user.id === message.author.id;

    const collector = confirmationMsg.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'confirm') {
        await nukeChannel(message.channel, reason);
      } else if (interaction.customId === 'cancel') {
        await confirmationMsg.delete();
      }
    });

    collector.on('end', async () => {
      confirmationMsg.edit({ components: [] });
    });
  },
};
