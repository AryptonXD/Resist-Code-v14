const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "privacy",
  aliases: ['policy'],
  voteOnly: false,
  BotPerms: ['EmbedLinks'],
  run: async (client, message, args) => {

    const embed1 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: `Privacy Policy for ${client.user.username}`, iconURL: client.user.displayAvatarURL(), url: client.website })
      .addFields(
        { name: '1. Introduction', value: `Welcome to ${client.user.username}. This Privacy Policy outlines how we collect, use, disclose, and protect the personal information of users ("Users" or "you") who interact with our Bot. By using the Bot, you consent to the practices described in this Privacy Policy.`, inline: false }
      )
      .setFooter({ text: `${client.user.username} • Page 1/15`, iconURL: client.user.displayAvatarURL() });

    const embed2 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: `Privacy Policy for ${client.user.username}`, iconURL: client.user.displayAvatarURL(), url: client.website })
      .addFields(
        { name: '2. Information We Collect', value: "(a) User-Provided Information: We may collect certain information that you provide directly to the Bot. This may include, Discord usernames, user IDs, messages IDs, and any other information you choose to share while using the Bot.\n\n(b) Automatically Collected Information: We may also collect certain information automatically when you interact with the Bot. This information may include your IP address, browser type, operating system, device information, and other usage details.\n\n(c) Cookies and Similar Technologies: We may use cookies and similar technologies to collect information about your interactions with the Bot. This information helps us improve the Bot's performance, enhance user experience, and analyze trends.", inline: false }
      )
      .setFooter({ text: `${client.user.username} • Page 2/15`, iconURL: client.user.displayAvatarURL() });

    const embed3 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: `Privacy Policy for ${client.user.username}`, iconURL: client.user.displayAvatarURL(), url: client.website })
      .addFields(
        { name: '3. How We Use Your Information', value: 'We may use the information we collect from you for the following purposes:\n\n(a) Providing and Improving the Bot: We use your information to provide, maintain, and enhance the Bot\'s functionality, features, and user experience.\n\n(b) Communication: We may use your contact information to respond to your inquiries, feedback, or support requests.\n\n(c) Personalization: We may use your information to personalize your experience with the Bot and provide content tailored to your preferences.\n\n(d) Analytics: We may use aggregated and anonymized data for analytical purposes, such as understanding user behavior, trends, and preferences.\n\n(e) Legal and Security: We may use your information to comply with legal obligations, enforce our Terms of Service, and protect the rights, property, or safety of our Users or others.', inline: false }
      )
      .setFooter({ text: `${client.user.username} • Page 3/15`, iconURL: client.user.displayAvatarURL() });

    const embed4 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: `Privacy Policy for ${client.user.username}`, iconURL: client.user.displayAvatarURL(), url: client.website })
      .addFields(
        { name: '4. Sharing Your Information', value: 'We will not share your personal information with third parties, except in the following circumstances:\n\n(a) Service Providers: We may share your information with trusted third-party service providers who assist us in operating the Bot and providing services to you. These providers are contractually obligated to protect your information and only use it for the purposes specified by us.\n\n(b) Legal Requirements: We may disclose your information when required by law, legal process, or a government request.\n\n(c) Business Transfers: In the event of a merger, acquisition, or sale of all or a portion of our company\'s assets, your information may be transferred as part of the transaction.', inline: false }
      )
      .setFooter({ text: `${client.user.username} • Page 4/15`, iconURL: client.user.displayAvatarURL() });


    const embed5 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: `Privacy Policy for ${client.user.username}`, iconURL: client.user.displayAvatarURL(), url: client.website })
      .addFields(
        { name: '5. Data Security', value: 'We implement reasonable measures to protect the information we collect from unauthorized access, disclosure, alteration, or destruction. However, please understand that no method of data transmission over the internet or method of electronic storage is entirely secure. Therefore, we cannot guarantee its absolute security.', inline: false }
      )
      .setFooter({ text: `${client.user.username} • Page 5/15`, iconURL: client.user.displayAvatarURL() });

    const embed6 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: `Privacy Policy for ${client.user.username}`, iconURL: client.user.displayAvatarURL(), url: client.website })
      .addFields(
        { name: '6. Data Retention', value: 'We will retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.', inline: false }
      )
      .setFooter({ text: `${client.user.username} • Page 6/15`, iconURL: client.user.displayAvatarURL() });

    const embed7 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: `Privacy Policy for ${client.user.username}`, iconURL: client.user.displayAvatarURL(), url: client.website })
      .addFields(
        { name: "7. Children's Privacy", value: `The Bot is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us at ${client.email} to request the removal of that information from our systems.`, inline: false }
      )
      .setFooter({ text: `${client.user.username} • Page 7/15`, iconURL: client.user.displayAvatarURL() });


    const embed8 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: `Privacy Policy for ${client.user.username}`, iconURL: client.user.displayAvatarURL(), url: client.website })
      .addFields(
        { name: '8. Your Rights', value: `You have the right to access, correct, or delete the personal information we hold about you. If you wish to exercise these rights or have any concerns about your information, please contact us at ${client.email}.`, inline: false }
      )
      .setFooter({ text: `${client.user.username} • Page 8/15`, iconURL: client.user.displayAvatarURL() });

    const embed9 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: `Privacy Policy for ${client.user.username}`, iconURL: client.user.displayAvatarURL(), url: client.website })
      .addFields(
        { name: '9. Changes to this Privacy Policy', value: 'We may update this Privacy Policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons. Any updates will be posted on this page with a revised effective date. We encourage you to review this Privacy Policy periodically for the latest information on our privacy practices.', inline: false }
      )
      .setFooter({ text: `${client.user.username} • Page 9/15`, iconURL: client.user.displayAvatarURL() });

    const embed10 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: `Privacy Policy for ${client.user.username}`, iconURL: client.user.displayAvatarURL(), url: client.website })
      .addFields(
        { name: '10. International Users', value: 'The Bot is hosted and operated in Bharat. If you are accessing the Bot from outside Bharat, please be aware that your information may be transferred to, stored, and processed in Bharat. By using the Bot, you consent to the transfer and processing of your information in Bharat.', inline: false }
      )
      .setFooter({ text: `${client.user.username} • Page 10/15`, iconURL: client.user.displayAvatarURL() });

    const embed11 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: `Privacy Policy for ${client.user.username}`, iconURL: client.user.displayAvatarURL(), url: client.website })
      .addFields(
        { name: '11. Data Breach Notification', value: 'In the event of a data breach that compromises the security of your personal information, we will take reasonable steps to notify you and relevant authorities (if required) in accordance with applicable laws.', inline: false }
      )
      .setFooter({ text: `${client.user.username} • Page 11/15`, iconURL: client.user.displayAvatarURL() });
    const embed12 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: `Privacy Policy for ${client.user.username}`, iconURL: client.user.displayAvatarURL(), url: client.website })
      .addFields(
        { name: '12. Advertising and Marketing', value: 'We do not use your personal information for advertising or marketing purposes without your consent.', inline: false }
      )
      .setFooter({ text: `${client.user.username} • Page 12/15`, iconURL: client.user.displayAvatarURL() });

    const embed13 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: `Privacy Policy for ${client.user.username}`, iconURL: client.user.displayAvatarURL(), url: client.website })
      .addFields(
        { name: '13. Consent Withdrawal', value: `If you wish to withdraw your consent to the processing of your personal information, please contact us at ${client.email}. Please note that withdrawing consent may impact your ability to use certain features or functionalities of the Bot.`, inline: false }
      )
      .setFooter({ text: `${client.user.username} • Page 13/15`, iconURL: client.user.displayAvatarURL() });

    const embed14 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: `Privacy Policy for ${client.user.username}`, iconURL: client.user.displayAvatarURL(), url: client.website })
      .addFields(
        {
          name: '14. Governing Law and Dispute Resolution', value: `This Privacy Policy shall be governed by and construed in accordance with the laws of India, specifically the state of Uttarakhand. Any dispute arising out of or relating to this Privacy Policy shall be resolved through arbitration in accordance with the provisions of the Indian Arbitration and Conciliation Act, 1996.

The arbitration shall be conducted in the city of Dehradun, Uttarakhand, and the language of arbitration shall be Hindi/English, as mutually agreed upon by both parties.

The arbitration proceedings shall be conducted by a sole arbitrator appointed mutually by both parties, or in the absence of mutual agreement, by the Chief Justice of the High Court of the State of Uttarakhand.

The arbitration award shall be final and binding on both parties. The prevailing party in any such arbitration shall be entitled to recover reasonable attorneys' fees and costs incurred in connection with the arbitration.`, inline: false
        }
      )
      .setFooter({ text: `${client.user.username} • Page 14/15`, iconURL: client.user.displayAvatarURL() });

    const embed15 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: `Privacy Policy for ${client.user.username}`, iconURL: client.user.displayAvatarURL(), url: client.website })
      .addFields(
        { name: '15. Contact Us', value: `If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please contact us at ${client.email}.`, inline: false }
      )
      .setFooter({ text: `${client.user.username} • Page 15/15`, iconURL: client.user.displayAvatarURL() });

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
          .setStyle("PRIMARY")
          .setCustomId("first")
          .setLabel("≪")
          .setDisabled(true),
        new ButtonBuilder()
          .setStyle("SUCCESS")
          .setCustomId("previous")
          .setLabel("Back")
          .setDisabled(true),
        new ButtonBuilder()
          .setStyle("DANGER")
          .setCustomId("close")
          .setLabel("Close")
          .setDisabled(true),
        new ButtonBuilder()
          .setStyle("SUCCESS")
          .setCustomId("next")
          .setLabel("Next")
          .setDisabled(true),
        new ButtonBuilder()
          .setStyle("PRIMARY")
          .setCustomId("last")
          .setLabel("≫")
          .setDisabled(true)
      );

      messageComponent.edit({ components: [disabledPag] });
    });
  },
};
