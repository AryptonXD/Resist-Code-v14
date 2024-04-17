const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

function createVoteButton(client) {
    const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel("Vote Me")
            .setStyle("Link")
            .setURL(`https://top.gg/bot/${client.user.id}/vote`)
    );

    return button;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Vote Bot'),
    voteOnly: false,
    async execute(client, interaction) {
        const button = createVoteButton(client);
        await interaction.reply({ content: `Click the button below.`, components: [button] });
    },
};
