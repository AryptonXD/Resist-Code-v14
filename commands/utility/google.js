const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: 'google',
  voteOnly: false,
  BotPerms: ['EmbedLinks'],
  run: async (client, message, args) => {
    try {
      const query = args.join("+");
      if (!query) return message.reply('Please specify a search query.');

      const searchResultURL = `https://www.google.com/search?q=${query}&oq=${query}&aqs=chrome.0.69i59l2j0l2j69i60j69i61l2j69i65.1147j0j7&sourceid=chrome&ie=UTF-8`;

      const embed = new EmbedBuilder()
        .setTitle('You Searched Google')
        .setDescription(`**Your Search Query:** ${args.join(" ")}\n\n **Search Result** - [Click Here](${searchResultURL})`)
        .setColor(client.color);

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error("Error executing Google search:", error);
      const errorEmbed = new EmbedBuilder()
        .setColor("#ff0000")
        .setDescription("An error occurred while performing the Google search.");

      message.reply({ embeds: [errorEmbed] });
    }
  }
};
