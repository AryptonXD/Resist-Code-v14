const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");

function createCodeButton(client) {
    const button = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel("Website")
            .setStyle("Link")
            .setURL(client.sponsor),
        new ButtonBuilder()
            .setLabel("Discord Server")
            .setStyle("Link")
            .setURL('https://discord.gg/gdW2fudg7Y')

    );

    return button;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sponsor')
        .setDescription('Bot\'s Sponser'),
    voteOnly: false,
    async execute(client, interaction) {
        const button = createCodeButton(client);

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: client.user.username + ' - Sponsor Information', iconURL: client.user.displayAvatarURL() })
            .setTitle('__Hydra Hosting__')
            .setDescription(`HYDRA HOSTING  is a hosting service expanding globally around the world with multiple locations for bot hosting and game servers hosting.It provide hosting at affordable price and with high quality with 99% Uptime.

**__Check Out Them__**
[Webiste](https://hydra-hosting.eu/) | [Discord](https://discord.gg/gdW2fudg7Y)`)
            .setImage('https://cdn.discordapp.com/attachments/1100489479619354654/1109334764911087726/logo-_-titolo.png?ex=65e2a902&is=65d03402&hm=f1231de12bdd24f1a502e048f00bb81d375607a39248f019963a9e783c9e8656&')

        await interaction.reply({ embeds: [embed], components: [button] });
    },
};
