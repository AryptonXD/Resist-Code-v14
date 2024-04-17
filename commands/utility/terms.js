const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "terms",
  voteOnly: false,
  BotPerms: ['EmbedLinks'],
  run: async (client, message, args) => {

    const embed1 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `Terms and Conditions for ${client.user.username}`,
        iconURL: client.user.displayAvatarURL()
      })
      .setDescription(`Effective Date: \`July 18, 2023.\``)
      .addFields(
        { name: `1. Introduction`, value: `Welcome to ${client.user.username} ("the Bot"). These Terms and Conditions ("Terms") govern your use of the Bot and the services provided by the Bot. By using the Bot, you agree to be bound by these Terms. If you do not agree to these Terms, do not use the Bot.`, inline: true }
      )
      .setFooter({
        text: `${client.user.username} • Page 1/15`,
        iconURL: client.user.displayAvatarURL()
      });

    const embed2 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `Terms and Conditions for ${client.user.username}`,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields(
        { name: `2. License to Use`, value: `Subject to these Terms, we grant you a non-exclusive, revocable, non-transferable license to use the Bot for personal, non-commercial purposes. You may not use the Bot for any illegal or unauthorized purpose, nor may you, in the use of the Bot, violate any laws in your jurisdiction.`, inline: true }
      )
      .setFooter({
        text: `${client.user.username} • Page 2/15`,
        iconURL: client.user.displayAvatarURL()
      });

    const embed3 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `Terms and Conditions for ${client.user.username}`,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields(
        { name: `3. Bot Availability`, value: `We strive to ensure that the Bot is available at all times. However, we do not guarantee the continuous availability of the Bot, and we will not be liable for any downtime or interruptions in service.`, inline: true }
      )
      .setFooter({
        text: `${client.user.username} • Page 3/15`,
        iconURL: client.user.displayAvatarURL()
      });

    const embed4 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `Terms and Conditions for ${client.user.username}`,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields(
        { name: `4. User Conduct`, value: `You agree not to use the Bot to:\n- Violate any applicable laws or regulations.\n- Impersonate any person or entity or falsely state or otherwise misrepresent yourself.\n- Interfere with or disrupt the operation of the Bot or servers.\n- Transmit any viruses, worms, malware, or any other harmful or destructive content.\n- Engage in any conduct that restricts or inhibits any other user from using or enjoying the Bot.\nWe reserve the right to terminate your access to the Bot for violating any of these rules.`, inline: true }
      )
      .setFooter({
        text: `${client.user.username} • Page 4/15`,
        iconURL: client.user.displayAvatarURL()
      });

    const embed5 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `Terms and Conditions for ${client.user.username}`,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields(
        { name: `5. Intellectual Property`, value: `The Bot and its original content, features, and functionality are owned by ${client.user.username} and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.\nYou may not reproduce, modify, distribute, or otherwise use any portion of the Bot without express written permission from us.`, inline: true }
      )
      .setFooter({
        text: `${client.user.username} • Page 5/15`,
        iconURL: client.user.displayAvatarURL()
      });

    const embed6 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `Terms and Conditions for ${client.user.username}`,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields(
        { name: `6. Termination`, value: `We may terminate or suspend your access to the Bot without prior notice or liability for any reason, including, but not limited to, your breach of these Terms or for any other conduct we deem unacceptable.\nAll provisions of these Terms, which by their nature should survive termination, shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.`, inline: true }
      )
      .setFooter({
        text: `${client.user.username} • Page 6/15`,
        iconURL: client.user.displayAvatarURL()
      });

    const embed7 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `Terms and Conditions for ${client.user.username}`,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields(
        { name: `7. Limitation of Liability`, value: `To the fullest extent permitted by applicable law, in no event shall ${client.user.username} or its developers be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from (i) your access to or use of or inability to access or use the Bot; (ii) any conduct or content of any third party on the Bot; (iii) any content obtained from the Bot; or (iv) unauthorized access, use, or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence), or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed its essential purpose.`, inline: true }
      )
      .setFooter({
        text: `${client.user.username} • Page 7/15`,
        iconURL: client.user.displayAvatarURL()
      });

    const embed8 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `Terms and Conditions for ${client.user.username}`,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields(
        { name: `8. Indemnification`, value: `You agree to indemnify and hold harmless ${client.user.username} and its developers from and against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable legal and accounting fees, arising out of or in any way connected with your access to or use of the Bot or your violation of these Terms.`, inline: true }
      )
      .setFooter({
        text: `${client.user.username} • Page 8/15`,
        iconURL: client.user.displayAvatarURL()
      });

    const embed9 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `Terms and Conditions for ${client.user.username}`,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields(
        { name: `9. Modifications to the Bot`, value: `We reserve the right to modify or discontinue, temporarily or permanently, the Bot or any features or portions thereof without prior notice.\nWe may also add new features or impose limits on certain features or restrict access to parts or all of the Bot without notice or liability.`, inline: true }
      )
      .setFooter({
        text: `${client.user.username} • Page 9/15`,
        iconURL: client.user.displayAvatarURL()
      });

    const embed10 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `Terms and Conditions for ${client.user.username}`,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields(
        { name: `10. Governing Law and Jurisdiction`, value: `These Terms shall be governed by and construed in accordance with the laws of Bharat, without regard to its conflict of laws principles.\nAny dispute arising out of or relating to these Terms or your access to or use of the Bot shall be subject to the exclusive jurisdiction of the courts located in Bharat.`, inline: true }
      )
      .setFooter({
        text: `${client.user.username} • Page 10/15`,
        iconURL: client.user.displayAvatarURL()
      });

    const embed11 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `Terms and Conditions for ${client.user.username}`,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields(
        { name: `11. Entire Agreement`, value: `These Terms constitute the entire agreement between you and ${client.user.username} regarding the use of the Bot and supersede all prior and contemporaneous agreements, understandings, negotiations, and discussions, whether oral or written.`, inline: true }
      )
      .setFooter({
        text: `${client.user.username} • Page 11/15`,
        iconURL: client.user.displayAvatarURL()
      });

    const embed12 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `Terms and Conditions for ${client.user.username}`,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields(
        { name: `12. Severability`, value: `If any provision of these Terms is found to be invalid or unenforceable under applicable law, such provision shall be modified or limited to the minimum extent necessary to make it valid and enforceable. The remaining provisions of these Terms will remain in full force and effect.`, inline: true }
      )
      .setFooter({
        text: `${client.user.username} • Page 12/15`,
        iconURL: client.user.displayAvatarURL()
      });

    const embed13 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `Terms and Conditions for ${client.user.username}`,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields(
        { name: `13. Waiver`, value: `The failure of ${client.user.username} to enforce any right or provision of these Terms will not be deemed a waiver of such right or provision.\nOur failure to exercise or enforce any right or provision of these Terms shall not constitute a waiver of such right or provision in that or any other instance.`, inline: true }
      )
      .setFooter({
        text: `${client.user.username} • Page 13/15`,
        iconURL: client.user.displayAvatarURL()
      });

    const embed14 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `Terms and Conditions for ${client.user.username}`,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields(
        { name: `14. Contact Information`, value: `If you have any questions or concerns about these Terms or the Bot, please contact us at ${client.email}.`, inline: true }
      )
      .setFooter({
        text: `${client.user.username} • Page 14/15`,
        iconURL: client.user.displayAvatarURL()
      });

    const embed15 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: `Terms and Conditions for ${client.user.username}`,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields(
        { name: `15. Acknowledgment`, value: `By using the Bot, you acknowledge that you have read these Terms and agree to be bound by them.`, inline: true }
      )
      .setFooter({
        text: `${client.user.username} • Page 15/15`,
        iconURL: client.user.displayAvatarURL()
      });

    const embeds = [embed1, embed2, embed3, embed4, embed5, embed6, embed7, embed8, embed9, embed10, embed11, embed12, embed13, embed14, embed15];
    const totalPages = embeds.length;
    let currentPage = 0;

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

    const disabledPagg = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle("Primary")
        .setCustomId("first")
        .setLabel("≪")
        .setDisabled(true),
      new ButtonBuilder()
        .setStyle("Success")
        .setCustomId("previous")
        .setLabel("Previous")
        .setDisabled(true),
      new ButtonBuilder()
        .setStyle("Danger")
        .setCustomId("close")
        .setLabel("Close")
        .setDisabled(true),
      new ButtonBuilder()
        .setStyle("Success")
        .setCustomId("next")
        .setLabel("Next")
        .setDisabled(true),
      new ButtonBuilder()
        .setStyle("Primary")
        .setCustomId("last")
        .setLabel("≫")
        .setDisabled(true)
    );

    const generateEmbed = () => {
      const embed = embeds[currentPage];
      embed.setFooter({ text: `${client.user.username} • Page ${currentPage + 1}/${totalPages}`, iconURL: client.user.displayAvatarURL() });
      return embed;
    };

    const sendMessage = async () => {
      const embed = generateEmbed();
      const messageComponent = await message.channel.send({ embeds: [embed], components: [pag] });
      return messageComponent;
    };

    const messageComponent = await sendMessage();

    const collector = messageComponent.createMessageComponentCollector({
      filter: (interaction) => interaction.user.id === message.author.id,
      time: 200000,
      idle: 300000 / 2,
    });

    collector.on("collect", async (interaction) => {
      if (interaction.isButton()) {
        if (interaction.customId === "next") {
          if (currentPage < totalPages - 1) {
            currentPage++;
          }
        } else if (interaction.customId === "previous") {
          if (currentPage > 0) {
            currentPage--;
          }
        } else if (interaction.customId === "first") {
          currentPage = 0;
        } else if (interaction.customId === "last") {
          currentPage = totalPages - 1;
        } else if (interaction.customId === "close") {
          messageComponent.edit({ components: [disabledPagg] });
          return;
        }

        const updatedEmbed = generateEmbed();

        if (currentPage === 0) {
          firstButton.setDisabled(true);
          backButton.setDisabled(true);
          nextButton.setDisabled(false);
          lastButton.setDisabled(false);
        } else if (currentPage === totalPages - 1) {
          firstButton.setDisabled(false);
          backButton.setDisabled(false);
          nextButton.setDisabled(true);
          lastButton.setDisabled(true);
        } else {
          firstButton.setDisabled(false);
          backButton.setDisabled(false);
          nextButton.setDisabled(false);
          lastButton.setDisabled(false);
        }

        interaction.update({ embeds: [updatedEmbed], components: [pag] });
      }
    });

    collector.on("end", async () => {
      const disabledPag = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setStyle("Primary")
          .setCustomId("first")
          .setLabel("≪")
          .setDisabled(true),
        new ButtonBuilder()
          .setStyle("Success")
          .setCustomId("previous")
          .setLabel("Back")
          .setDisabled(true),
        new ButtonBuilder()
          .setStyle("Danger")
          .setCustomId("close")
          .setLabel("Close")
          .setDisabled(true),
        new ButtonBuilder()
          .setStyle("Success")
          .setCustomId("next")
          .setLabel("Next")
          .setDisabled(true),
        new ButtonBuilder()
          .setStyle("Primary")
          .setCustomId("last")
          .setLabel("≫")
          .setDisabled(true)
      );

      messageComponent.edit({ components: [disabledPag] });
    });
  },
};
