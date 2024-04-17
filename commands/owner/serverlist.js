const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const { ownerIDS } = require('../../owner.json');

module.exports = {
  name: "serverlist",
  aliases: ["srlist"],
  VoteOnly: true,
  BotPerms: ['EmbedLinks'],
  run: async (client, message, args) => {

    if (!ownerIDS.includes(message.author.id)) return;

    const serversPerPage = 10;

    const guildsArray = Array.from(client.guilds.cache.values());
    const totalGuilds = guildsArray.length;

    let currentPage = 0;

    const totalPages = Math.ceil(totalGuilds / serversPerPage);

    const generateDescription = () => {
      const startIndex = currentPage * serversPerPage;
      const endIndex = startIndex + serversPerPage;
      const currentGuilds = guildsArray
        .slice(startIndex, endIndex)
        .sort((a, b) => b.memberCount - a.memberCount);

      return currentGuilds
        .map((guild, index) => {
          const memberCount = guild.memberCount.toLocaleString();
          return `\`${startIndex + index + 1}\` - ${guild.name} | ${memberCount} Members | ${guild.id}`;
        })
        .join("\n");
    };


    const generateEmbed = () => {
      const sortedGuilds = guildsArray.sort((a, b) => b.memberCount - a.memberCount);

      const startIndex = currentPage * serversPerPage;
      const endIndex = startIndex + serversPerPage;
      const currentGuilds = sortedGuilds.slice(startIndex, endIndex);

      const embed = new EmbedBuilder()
        .setAuthor({
          name: message.author.tag,
          iconURL: message.author.displayAvatarURL({ dynamic: true })
        })
        .setColor(client.color)
        .setFooter({
          text: `Page - ${currentPage + 1}/${totalPages}`
        })
        .setDescription(`Total Servers - ${totalGuilds}\n\n${generateDescription(currentGuilds)}`);

      return embed;
    };

    const sortedGuilds = guildsArray.sort((a, b) => b.memberCount - a.memberCount);
    const startIndex = currentPage * serversPerPage;
    const endIndex = startIndex + serversPerPage;
    const currentGuilds = sortedGuilds.slice(startIndex, endIndex);

    if (currentGuilds.length === 0) {

      const embed = new EmbedBuilder()
        .setTitle(`Page ${totalPages}`)
        .setDescription("Nothing to Show.")
        .setColor(client.color);

      pag.components.forEach((button) => {
        button.setDisabled(true);
      });

      return embed;
    }

    const firstButton = new ButtonBuilder()
      .setStyle("Primary")
      .setCustomId("first")
      .setLabel("≪")
      .setDisabled(true)
    const backButton = new ButtonBuilder()
      .setStyle("Success")
      .setCustomId("previous")
      .setLabel("Previous")
      .setDisabled(true)
    const cancelButton = new ButtonBuilder()
      .setStyle("Danger")
      .setCustomId("close")
      .setLabel("Close")
      .setDisabled(false)
    const nextButton = new ButtonBuilder()
      .setStyle("Success")
      .setCustomId("next")
      .setLabel("Next")
      .setDisabled(false)
    const lastButton = new ButtonBuilder()
      .setStyle("Primary")
      .setCustomId("last")
      .setLabel("≫")
      .setDisabled(false)

    const pag = new ActionRowBuilder().addComponents(firstButton, backButton, cancelButton, nextButton, lastButton);

    if (totalPages === 1) {
      pag.components.forEach((button) => {
        button.setDisabled(true);
      });
    }

    const msg = await message.channel.send({ embeds: [generateEmbed()], components: [pag] });

    const collector = msg.createMessageComponentCollector({ filter: (interaction) => interaction.user.id === message.author.id, time: 60000 });

    collector.on("collect", async (interaction) => {
      try {
        if (interaction.customId === "previous") {
          if (currentPage > 0) {
            currentPage--;
          }
        } else if (interaction.customId === "next") {
          if (currentPage < totalPages - 1) {
            currentPage++;
          }
        } else if (interaction.customId === "first") {
          currentPage = 0;
        } else if (interaction.customId === "last") {
          currentPage = totalPages - 1;
        } else if (interaction.customId === "close") {
          collector.stop();
          return;
        }

        const updatedEmbed = generateEmbed();

        firstButton.setDisabled(currentPage === 0);
        previousButton.setDisabled(currentPage === 0);
        nextButton.setDisabled(currentPage === totalPages - 1);
        lastButton.setDisabled(currentPage === totalPages - 1);

        interaction.update({ embeds: [updatedEmbed], components: [pag] });
      } catch (error) {
        console.error("An error occurred while handling the interaction:", error);
      }
    });

    collector.on("end", () => {
      pag.components.forEach((button) => {
        button.setDisabled(true);
      });

      msg.edit({ components: [pag] });
    });
  },
};
