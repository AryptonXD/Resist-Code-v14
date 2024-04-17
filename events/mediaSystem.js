const client = require('../index.js');
const { ChannelType } = require('discord.js');

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.type === ChannelType.GuildText) {
    const data = await client.db14.get(`${message.guild.id}_mediachannels.mediachannellist`) || [];

    if (data.includes(message.channel.id)) {
      if (message.attachments.size === 0) {
        try {
          await message.delete();
          const warningMessage = await message.channel.send({ content: 'This channel is designated exclusively for the sharing of images and videos.' });
          setTimeout(() => {
            warningMessage.delete();
          }, 5000);
        } catch (error) {
          console.error(error);
        }
      } else {
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.avi', '.mkv'];
        const attachment = message.attachments.first();

        if (!attachment || !allowedExtensions.some(ext => attachment.name.endsWith(ext))) {
          try {
            await message.delete();
            const warningMessage = await message.channel.send({ content: 'This channel is designated exclusively for the sharing of images and videos.' });
            setTimeout(() => {
              warningMessage.delete();
            }, 5000);
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  }
});
