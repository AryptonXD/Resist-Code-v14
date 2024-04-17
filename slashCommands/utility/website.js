const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

function createCodeButton(client) {
    const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel("Website")
            .setStyle("Link")
            .setURL(client.website)
    );

    return button;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('website')
        .setDescription('Bot\'s Website'),
    voteOnly: false,
    async execute(client, interaction) {
        const button = createCodeButton(client);
        await interaction.reply({ content: `Click the button below.`, components: [button] });
    },
};
