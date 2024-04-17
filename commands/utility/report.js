const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
  name: 'report',
  voteOnly: false,
  BotPerms: ['EmbedLinks'],
  run: async (client, message, args) => {
    const reportEmbed = new EmbedBuilder()
      .setColor(client.color)
      .setTitle('Report Form')
      .setDescription('Please provide the necessary details for your report below.');

    const submitButton = new ButtonBuilder()
      .setCustomId('submit')
      .setLabel('Submit')
      .setStyle('Success');

    const cancelButton = new ButtonBuilder()
      .setCustomId('cancel')
      .setLabel('Cancel')
      .setStyle('Danger');

    const actionRow = new ActionRowBuilder()
      .addComponents(submitButton, cancelButton);

    const reportMessage = await message.channel.send({
      embeds: [reportEmbed]
    });

    const messageCollectorFilter = msg => msg.author.id === message.author.id;
    const messageCollector = message.channel.createMessageCollector({
      filter: messageCollectorFilter,
      max: 1,
      time: 60000
    });

    messageCollector.on('collect', async collectedMessage => {
      const userReportContent = collectedMessage.content;
      collectedMessage.delete();
      reportEmbed.setDescription(userReportContent);
      reportMessage.edit({ embeds: [reportEmbed], components: [actionRow] });

      const collectorFilter = i => (i.customId === 'submit' || i.customId === 'cancel') && i.user.id === message.author.id;
      const collector = reportMessage.createMessageComponentCollector({ filter: collectorFilter, time: 60000 });

      collector.on('collect', async i => {
        if (i.customId === 'submit') {
          await i.update({
            embeds: [reportEmbed.setDescription('Your report has been submitted. Thank you for your feedback!')],
            components: []
          });

          const targetChannel = await client.channels.fetch('1139937188486852740');
          const serverName = message.guild ? message.guild.name : 'Direct Messages';
          const authorInfo = `User: ${message.author.tag} (${message.author.id})\nServer: ${serverName}\n\nComplain: ${userReportContent}`;
          reportEmbed.setAuthor({ name: message.author.tag, iconURL: message.member.displayAvatarURL({ dynamic: true }) })
          reportEmbed.setDescription(authorInfo);
          targetChannel.send({ embeds: [reportEmbed] });
        } else if (i.customId === 'cancel') {
          await i.update({
            embeds: [reportEmbed.setDescription('Report submission has been canceled.')],
            components: []
          });
        }
      });

      collector.on('end', collected => {
        if (collected.size === 0) {
          reportMessage.edit({ components: [] });
        }
      });
    });

    messageCollector.on('end', collected => {
      if (collected.size === 0) {
        reportMessage.edit({ components: [] });
      }
    });
  }
};
