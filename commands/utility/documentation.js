const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

function createCodeButton(client) {
  const button = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Documentation")
      .setStyle("Link")
      .setURL(client.website)
  );

  return button;
}

module.exports = {
  name: "documentation",
  aliases: ['docs'],
  voteOnly: false,
  run: async (client, message, args) => {
    const button = createCodeButton(client);
    message.channel.send({ content: `Click the button below.`, components: [button] });
  },
};
