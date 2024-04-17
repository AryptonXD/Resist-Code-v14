const client = require('../index.js');
const tagCooldowns = new Map();
const stagCooldowns = new Map();

client.on('messageCreate', async (message) => {
  const tag = await client.db3.get(`tag_${message.guild.id}.Tag`);
  const stag = await client.db3.get(`stag_${message.guild.id}.Stag`);

  const content = message.content.toLowerCase();
  const authorId = message.author.id;

  const tagCooldown = 5000;
  const stagCooldown = 5000;

  const currentTime = Date.now();

  if (content === 'tag' && tag) {
    if (tagCooldowns.has(authorId) && currentTime - tagCooldowns.get(authorId) < tagCooldown) {
      const remainingCooldown = (tagCooldown - (currentTime - tagCooldowns.get(authorId))) / 1000;
      message.channel.send({ content: `You're in cooldown for the tag command. Time remaining: ${remainingCooldown.toFixed(1)} seconds.` });
      return;
    }

    message.channel.send({ content: tag });
    tagCooldowns.set(authorId, currentTime);
    return;
  }

  if (content === 'stag' && stag) {
    if (stagCooldowns.has(authorId) && currentTime - stagCooldowns.get(authorId) < stagCooldown) {
      const remainingCooldown = (stagCooldown - (currentTime - stagCooldowns.get(authorId))) / 1000;
      message.channel.send({ content: `You're in cooldown for the stag command. Time remaining: ${remainingCooldown.toFixed(1)} seconds.` });
      return;
    }

    message.channel.send({ content: stag });
    stagCooldowns.set(authorId, currentTime);
    return;
  }
});
