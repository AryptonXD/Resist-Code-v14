/*const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, version } = require("discord.js");
const emoji = require('../../emoji.js');
const os = require('os');

module.exports = {
    name: "serverinfo",
    aliases: ["si"],
    voteOnly: false,
    BotPerms: ['EmbedLinks'],
    run: async (client, message, args) => {

        const button1 = new ButtonBuilder()
            .setStyle('Success')
            .setCustomId('first')
            .setLabel('General')
            .setDisabled(true);

        const button2 = new ButtonBuilder()
            .setStyle('Secondary')
            .setCustomId('second')
            .setLabel('System')
            .setDisabled(false);

        const button3 = new ButtonBuilder()
            .setStyle('Secondary')
            .setCustomId('third')
            .setLabel('Module')
            .setDisabled(false);

        const createRow = new ActionRowBuilder().addComponents(button1, button2, button3);

        const createEmbed = (fields) => {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: message.author.tag, iconURL: message.member.displayAvatarURL({ dynamic: true }) })
                .setThumbnail(message.member.displayAvatarURL({ dynamic: true }));

            fields.forEach((field) => {
                if (field.value) {
                    embed.addFields({ name: field.name, value: field.value, inline: false });
                }
            });

            return embed;
        };

        const embed1 = createEmbed([
            { name: "__Bot Information__", value: `` }
        ]);

        const embed2 = createEmbed([
            { name: `__CPU Information__`, value: `` },
            { name: `__Memory Information__`, value: `` },
        ]);

        const embed3 = createEmbed([
            { name: `__Module Information__`, value: `` }
        ]);

        const messageComponent = await message.channel.send({ embeds: [embed1], components: [createRow] });

        const collector = messageComponent.createMessageComponentCollector({
            filter: (interaction) => {
                if (message.author.id === interaction.user.id) return true;
                else {
                    interaction.reply({ content: `${emoji.util.cross} | This Pagination is not for you.`, ephemeral: true });
                    return false;
                }
            },
            time: 600000,
            idle: 800000 / 2,
        });

        collector.on("collect", async (interaction) => {
            if (interaction.isButton()) {
                switch (interaction.customId) {
                    case "first":
                        await button1.setDisabled(true).setStyle('Secondary');
                        await button2.setDisabled(false).setStyle('Secondary');
                        await button3.setDisabled(false).setStyle('Secondary');
                        await button4.setDisabled(false).setStyle('Secondary');
                        await interaction.update({ embeds: [embed1], components: [createRow] });
                        break;
                    case "second":
                        await button1.setDisabled(false).setStyle('Secondary');
                        await button2.setDisabled(true).setStyle('Success');
                        await button3.setDisabled(false).setStyle('Secondary');
                        await interaction.update({ embeds: [embed2], components: [createRow] });
                        break;
                    case "third":
                        await button1.setDisabled(false).setStyle('Secondary');
                        await button2.setDisabled(false).setStyle('Secondary');
                        await button3.setDisabled(true).setStyle('Success');
                        await interaction.update({ embeds: [embed3], components: [createRow] });
                        break;
                }
            }
        });

        collector.on("end", () => {
            button1.setDisabled(true).setStyle('Secondary');
            button2.setDisabled(true).setStyle('Secondary');
            button3.setDisabled(true).setStyle('Secondary');
            messageComponent.edit({ components: [createRow] });
        });
    }
};*/