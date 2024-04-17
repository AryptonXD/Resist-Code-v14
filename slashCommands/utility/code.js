const { SlashCommandBuilder } = require('@discordjs/builders');
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
  data: new SlashCommandBuilder()
    .setName('code')
    .setDescription('Bot\'s Source Code'),
  voteOnly: false,
  async execute(client, interaction) {
    const button = createCodeButton(client);
    await interaction.reply({ content: `Click the button below.`, components: [button] });
  },
};
