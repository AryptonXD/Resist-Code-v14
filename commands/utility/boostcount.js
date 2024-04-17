const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "boostcount",
  aliases: ['bc'],
  voteOnly: false,
  BotPerms: ['EmbedLinks'],
  run: async (client, message, args) => {

    function createStatusEmbed(guild, message) {
      return new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
        .setDescription(`**${guild.premiumSubscriptionCount}** boosts`)
        .setFooter({ text: `Requested by: ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
    }

    const embed = createStatusEmbed(message.guild, message);
    message.channel.send({ embeds: [embed] });
  }
};
