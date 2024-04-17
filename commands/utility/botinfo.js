const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const emoji = require('../../emoji.js');

module.exports = {
  name: "info",
  aliases: ["botinfo", "bi", "resistinfo"],
  voteOnly: false,
  BotPerms: ['EmbedLinks'],
  run: async (client, message, args) => {

    const button1 = new ButtonBuilder()
      .setStyle("Success")
      .setCustomId("first")
      .setLabel("Basic Info")
      .setEmoji("1147576309925544046")
      .setDisabled(true);

    const button2 = new ButtonBuilder()
      .setStyle("Secondary")
      .setCustomId("second")
      .setLabel("Team Info")
      .setEmoji("1147576417056460864")
      .setDisabled(false);

    const row = new ActionRowBuilder().addComponents(row2);

    const createEmbed = (fields) => {
      const embed = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: message.author.tag, value: message.member.displayAvatarURL({ dynamic: true }) })
        .setThumbnail(message.member.displayAvatarURL({ dynamic: true }));

      fields.forEach((field) => {
        if (field.value) {
          embed.addFields({ name: field.name, value: field.value, inline: false });
        }
      });

      return embed;
    };

    const embed1 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`Resist Bot - Your Discord server's all-in-one solution. Featuring Antinuke, Automod, Autorole, Welcome, Leave, Boost-Message, Custom-Roles, Voice-Roles, Nightmode, Media-Channels, Ignore-Channels, Extra Owner/Admin and more. Use '?' prefix to empower your server.`)
      .addFields(
        { name: "__Basic Information__", value: `**NodeJs Version**: v${process.version.slice(1)}\n**Library**: [discord.js](https://discord.js.org/)` },
        { name: "__Links__", value: `[Invite](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands) : [Support](${client.support}) : [Vote](https://top.gg/bot/${client.user.id}/vote) : [Website](${client.website})` }
      )
      .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    const embed2 = createEmbed([
      {
        name: `__Owners__`, value: `- [1] [Sumant](https://discord.com/users/762146129927340052) [ID: 762146129927340052]
- [2] [Headache](https://discord.com/users/1015990861122768968) [ID: 1015990861122768968]
- [3] [Invisible](https://discord.com/users/218151216650256384) [ID: 218151216650256384]
- [4] [Ragnor](https://discord.com/users/1090957904410071120) [ID: 1090957904410071120]
- [5] [Zeus](https://discord.com/users/1022080754135613480) [ID: 1022080754135613480]` },
      { name: `__Developer__`, value: `- [1] [Arypton](https://discord.com/users/560115112078475266) [ID: 560115112078475266]` },
      { name: `__Contributors__`, value: `- [1] [Devil Groxan](https://discord.com/users/785927566174846988) [ID: 785927566174846988]` },
    ]);

    const messageComponent = await message.channel.send({ embeds: [embed1], components: [row] });

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
            await button1.setDisabled(true).setStyle("Success");
            await button2.setDisabled(false).setStyle("Secondary");
            interaction.update({ embeds: [embed1], components: [row] });
            break;
          case "second":
            await button1.setDisabled(false).setStyle("Secondary");
            await button2.setDisabled(true).setStyle("Success");
            interaction.update({ embeds: [embed2], components: [button2, button] });
            break;
        }
      }
    });

    collector.on("end", async () => {
      await button1.setDisabled(true);
      await button2.setDisabled(true);
      messageComponent.edit({ components: [row] });
    });
  }
};
