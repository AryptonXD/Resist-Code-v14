const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

function createCodeButton(client) {
  const button = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Support Server")
      .setStyle("Link")
      .setURL(client.support)
  );

  return button;
}

module.exports = {
  name: "support",
  voteOnly: false,
  run: async (client, message, args) => {
    const button = createCodeButton(client);
    message.channel.send({ content: `Click the button below.`, components: [button] });
  },
};
