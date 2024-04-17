const { SlashCommandBuilder } = require('@discordjs/builders');
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
    data: new SlashCommandBuilder()
        .setName('support')
        .setDescription('Bot\'s Support Server.'),
    voteOnly: false,
    async execute(client, interaction) {
        const button = createCodeButton(client);
        await interaction.reply({ content: `Click the button below.`, components: [button] });
    },
};
