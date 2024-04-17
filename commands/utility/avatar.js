const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const Settings = require('../../settings.js');
const owner = Settings.bot.credits.developerId;

module.exports = {
  name: "avatar",
  aliases: ["av", "pfp", "pic"],
  voteOnly: false,
  BotPerms: ['EmbedLinks'],
  run: async function (client, message, args) {
    const user = client.users.cache.get(args[1]) || message.mentions.users.first() || message.author;
    const user2 = message.guild.members.cache.get(`${user.id}`);
    const arypton = await client.users.fetch(owner);

    async function generateGuideEmbed() {
      const guide = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: client.user.tag, iconURL: client.user.displayAvatarURL() })
        .addFields(
          { name: "Avatar", value: "`?avatar server [server=<current server>]`\nShows avatar of the server.\n\n`?avatar user [user=<you>]`\nShows avatar of a user." }
        )
        .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

      return guide;
    }

    async function generateUserGuideEmbed() {
      const guide2 = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
        .setDescription("Choose your avatar style from the buttons below.")
        .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

      return guide2;
    }

    async function generateAvatarEmbed(targetUser, targetMember) {
      const avatarEmbed = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: targetUser.username, value: targetUser.displayAvatarURL({ dynamic: true }) })
        .setImage(targetUser.displayAvatarURL({ dynamic: true, size: 512 }));

      return avatarEmbed;
    }

    async function generateServerAvatarEmbed() {
      const serverAvatarEmbed = new EmbedBuilder()
        .setColor(client.color)
        .setAuthor({ name: message.guild.name, value: message.guild.iconURL({ dynamic: true }) })
        .setImage(message.guild.iconURL({ dynamic: true, size: 1024 }));

      return serverAvatarEmbed;
    }

    async function generateButtonRow() {
      const buttonRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setStyle("Secondary").setCustomId("lol1").setLabel("Global Avatar"),
        new ButtonBuilder().setStyle("Secondary").setCustomId("lol2").setLabel("Server Avatar")
      );

      return buttonRow;
    }

    async function generateAvatarButtons(targetUser, targetMember) {
      const avatarButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel("PNG").setStyle("Link").setURL(targetUser.displayAvatarURL({ format: "png" })),
        new ButtonBuilder().setLabel("JPG").setStyle("Link").setURL(targetUser.displayAvatarURL({ format: "jpg" })),
        new ButtonBuilder().setLabel("WEBP").setStyle("Link").setURL(targetUser.displayAvatarURL({ format: "webp" })),
        new ButtonBuilder().setLabel("DYNAMIC").setStyle("Link").setURL(targetUser.displayAvatarURL({ dynamic: true }))
      );

      return avatarButtons;
    }

    async function generateServerAvatarButtons() {
      const serverAvatarButtons = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel("PNG").setStyle("Link").setURL(message.guild.iconURL({ format: "png" })),
        new ButtonBuilder().setLabel("JPG").setStyle("Link").setURL(message.guild.iconURL({ format: "jpg" })),
        new ButtonBuilder().setLabel("WEBP").setStyle("Link").setURL(message.guild.iconURL({ format: "webp" })),
        new ButtonBuilder().setLabel("DYNAMIC").setStyle("Link").setURL(message.guild.iconURL({ dynamic: true }))
      );

      return serverAvatarButtons;
    }

    async function sendGuideEmbed() {
      const guideEmbed = await generateGuideEmbed();
      message.channel.send({ embeds: [guideEmbed] });
    }

    async function sendUserGuideEmbed() {
      const guideEmbed = await generateUserGuideEmbed();
      const buttonRow = await generateButtonRow();
      const msg = await message.channel.send({ embeds: [guideEmbed], components: [buttonRow] });

      const collector = await msg.createMessageComponentCollector({
        filter: (interaction) => {
          if (message.author.id === interaction.user.id) return true;
          else {
            interaction.reply({ content: `${emoji.util.cross} | This Pagination is not for you.`, ephemeral: true });
            return false;
          }
        },
        time: 20000,
        idle: 20000 / 2
      });

      collector.on("collect", async (interaction) => {
        if (interaction.isButton()) {
          if (interaction.customId === "lol1") {
            const avatarEmbed = await generateAvatarEmbed(user, user2);
            const avatarButtons = await generateAvatarButtons(user, user2);
            await interaction.update({ embeds: [avatarEmbed], components: [avatarButtons] });
          } else if (interaction.customId === "lol2") {
            if (!user2.avatarURL({ dynamic: true, size: 512 })) {
              const avatarEmbed = await generateAvatarEmbed(user, user2);
              const avatarButtons = await generateAvatarButtons(user, user2);
              await interaction.update({ embeds: [avatarEmbed], components: [avatarButtons] });
            } else {
              const avatarEmbed = await generateAvatarEmbed(user2.user, user2);
              const avatarButtons = await generateAvatarButtons(user2.user, user2);
              await interaction.update({ embeds: [avatarEmbed], components: [avatarButtons] });
            }
          }
        }
      });
    }

    async function sendServerAvatarEmbed() {
      const serverAvatarEmbed = await generateServerAvatarEmbed();
      const serverAvatarButtons = await generateServerAvatarButtons();
      message.channel.send({ embeds: [serverAvatarEmbed], components: [serverAvatarButtons] });
    }

    if (!args[0]) {
      await sendGuideEmbed();
    } else if (args[0] === "user") {
      await sendUserGuideEmbed();
    } else if (args[0] === "server") {
      await sendServerAvatarEmbed();
    }
  }
};
