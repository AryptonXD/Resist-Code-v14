const { SlashCommandBuilder } = require('@discordjs/builders');
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
    data: new SlashCommandBuilder()
        .setName('documentation')
        .setDescription('Bot\'s documentation'),
    voteOnly: false,
    async execute(client, interaction) {
        const button = createCodeButton(client);
        await interaction.reply({ content: `Click the button below.`, components: [button] });
    },
};
