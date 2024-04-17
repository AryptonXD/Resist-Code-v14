const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

function createCodeButton() {
  const button = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("Source Code")
      .setStyle("Link")
      .setURL(`https://github.com/AryptonXD/Resist-Code`)
  );

  return button;
}

module.exports = {
  name: "code",
  aliases: ['source'],
  voteOnly: false,
  BotPerms: ['EmbedLinks'],
  run: async (client, message, args) => {
    const button = createCodeButton();
    message.channel.send({ content: `Click the button below.`, components: [button] });
  },
};
