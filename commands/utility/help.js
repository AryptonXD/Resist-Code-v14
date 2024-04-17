const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionsBitField } = require("discord.js");
const Settings = require('../../settings.js');
const { ownerIDS } = require('../../owner.json');
const emoji = require('../../emoji.js');
const owner = Settings.bot.credits.developerId;

module.exports = {
  name: "help",
  aliases: ['h'],
  BotPerms: ['EmbedLinks'],
  voteOnly: false,
  run: async function (client, message, args) {
    const prefix = await client.db8.get(`${message.guild.id}_prefix`) || Settings.bot.info.prefix;
    const arypton = await client.users.fetch(owner);
    let commands;
    const data = await client.db11.get(`${message.guild.id}_eo.extraownerlist`);
    const data1 = await client.db11.get(`${message.guild.id}_ea.extraadminlist`);
    const premium = await client.db12.get(`${message.guild.id}_premium`);

    if (message.guild.ownerId.includes(message.author.id) || data.includes(message.author.id) || ownerIDS.includes(message.author.id)) {
      if (premium === true) {
        commands = 224;
      } else {
        commands = 224 - 4;
      }
      commands = 224 - 4;
    } else if (message.member.permissions.has(PermissionsBitField.Flags.Administrator) || data1.includes(message.author.id)) {
      commands = 224 - 52;
    } else {
      commands = 57;
    }

    const menuOptions = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('helpOption')
        .setPlaceholder('Choose wisely, shape your destiny.')
        .addOptions([
          new StringSelectMenuOptionBuilder()
            .setLabel('Home')
            .setValue('home')
            .setEmoji("1192316758154027109")
            .setDescription('Explore Home Page'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Antinuke')
            .setValue('antinuke')
            .setEmoji("1192316592999125042")
            .setDescription('Explore antinuke Commands'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Automod')
            .setValue('automod')
            .setEmoji("1192316445313466469")
            .setDescription('Explore Automod Commands'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Moderation')
            .setValue('moderation')
            .setEmoji("1192315738573254676")
            .setDescription('Explore Moderation Commands'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Welcome')
            .setValue('welcome')
            .setEmoji("1192350554454773781")
            .setDescription('Explore Welcome Commands'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Server')
            .setValue('server')
            .setEmoji("1192315909415645286")
            .setDescription('Explore Server Commands'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Voice Role')
            .setValue('voicerole')
            .setEmoji("1133397943030906941")
            .setDescription('Explore Voice Role Commands'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Custom Roles')
            .setValue('customroles')
            .setEmoji("1192316275960058008")
            .setDescription('Explore Custom Roles Commands'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Media')
            .setValue('media')
            .setEmoji("1192315760261988453")
            .setDescription('Explore Media Commands'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Games')
            .setValue('games')
            .setEmoji("1192316015376339035")
            .setDescription('Explore Games Commands'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Utility')
            .setValue('utility')
            .setEmoji("1192314971279859794")
            .setDescription('Explore Utility Commands')
        ])
    );

    const disabledMenuOptions = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('helpOption2')
        .setPlaceholder('Choose wisely, shape your destiny.')
        .addOptions([
          new StringSelectMenuOptionBuilder()
            .setLabel('Home')
            .setValue('home')
            .setEmoji("1192316758154027109")
            .setDescription('See Home Page')
        ])
        .setDisabled(true)
    );

    const embed1 = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL(), url: null })
      .setDescription(`- Prefix for this server is \`${prefix}\`
- Click on the menu to access commands
- Total commands: 224 | Usable by you (here): ${commands}
- Support Server: [${client.user.username} HQ](${Settings.bot.credits.supportServer})`)
      .addFields(
        {
          name: '__Resist Modules__',
          value: `${emoji.id.antinuke} Antinuke
${emoji.id.automod} Automod
${emoji.id.moderation} Moderation
${emoji.id.welcome} Welcome
${emoji.id.ignore} Server
${emoji.id.voiceroles} Voice Roles
${emoji.id.customroles} Custom Role
${emoji.id.media} Media
${emoji.id.games} Games
${emoji.id.utility} Utility`,
          inline: false
        },
        {
          name: '__Links__',
          value: `- Invite ${client.user.username} from [Here](${Settings.bot.credits.supportServer}) if you need help
- Privacy Policy of [${client.user.username}](${Settings.bot.info.privacy})
- Terms and Conditions of [${client.user.username}](${Settings.bot.info.terms})`,
          inline: false
        },
      );

    const embed2 = new EmbedBuilder()
      .setColor(client.color)
      .addFields(
        {
          name: `${emoji.id.antinuke} Antinuke Commands`,
          value: '`antinuke`, `antinuke guide`, `antinuke features`, `antinuke enable/disable`, `antinuke <event create/delete/update> enable/disable`, `antinuke whitelist add/remove <user mention/id>`, `antinuke whitelist reset`, `antinuke config`, `antinuke reset`, `nightmode`, `nightmode enable/disable`, `nightmode role add/remove <role mention/id>`, `nightmode bypass add/remove <user mention/id>`, `nightmode role/bypass show`, `nightmode role/bypass reset`',
          inline: false
        },
      );

    const embed3 = new EmbedBuilder()
      .setColor(client.color)
      .addFields(
        {
          name: `${emoji.id.automod} Automod Commands`,
          value: '`automod`, `automod anti pornography enable/disable`, `automod anti message spam enable/disable`, `automod anti mention spam enable/disable`, `automod anti toxicity enable/disable`, `automod config`, `automod reset`',
          inline: false
        },
      );

    const embed4 = new EmbedBuilder()
      .setColor(client.color)
      .addFields(
        {
          name: `${emoji.id.moderation} Moderation Commands`,
          value: '`clear bots`, `clear humans`, `clear embeds`, `clear files`, `clear mentions`, `clear pins`, `ban <user>`, `unban <user>`, `kick <user>`, `hide <channel>`, `unhide <channel>`, `lock <channel>`, `unlock <channel>`, `nuke`, `purge`, `voice`, `voice muteall`, `voice unmuteall`, `voice deafenall`, `voice undeafenall`, `voice mute <user>`, `voice unmute <user>`, `voice deafen <user>`, `voice undeafen <user>`',
          inline: false
        },
      );

    const embed5 = new EmbedBuilder()
      .setColor(client.color)
      .addFields(
        {
          name: `${emoji.id.welcome} Welcome Commands`,
          value: '`welcome`, `welcome message panel`, `welcome test`, `welcome reset`, `autorole`, `autorole humans add <role mention/id>`, `autorole humans remove <role mention/id>`, `autorole bots add <role mention/id>`, `autorole bots remove <role mention/id>`, `autorole config`, `autorole reset`',
          inline: false
        },
      );

    const embed6 = new EmbedBuilder()
      .setColor(client.color)
      .addFields(
        {
          name: `${emoji.id.ignore} Server Commands`,
          value: '`extra`, `extra owner add <user mention/id>`,  `extra admin add <user mention/id>`, `extra owner remove <user mention/id>`,  `extra admin remove <user mention/id>`, `extra owner show`, `extra admin show`, `extra owner reset`, `extra admin reset`, `ignore`, `ignore channel add <channel mention/id>`, `ignore bypass add <channel mention/id>`, `ignore channel remove <channel mention/id>`, `ignore bypass remove <channel mention/id>`, `ignore channel show`, `ignore bypass show`, `ignore channel reset`, `ignore bypass reset`',
          inline: false
        },
      );

    const embed7 = new EmbedBuilder()
      .setColor(client.color)
      .addFields(
        {
          name: `${emoji.id.voiceroles} Voice Roles Commands`,
          value: '`invc`, `invc humans <role>`, `invc bots <role>`, `invc config`, `invc reset`',
          inline: false
        },
      );

    const embed8 = new EmbedBuilder()
      .setColor(client.color)
      .addFields(
        {
          name: `${emoji.id.customroles} Custom Role Commands`,
          value: '`setup`, `setup config`, `setup reqrole <role mention/id>`, `setup admin <role mention/id>`, `setup official <role mention/id>`, `setup guest <role mention/id>`, `setup girl <role mention/id>`, `setup friend <role mention/id>`, `setup vip <role mention/id>`, `setup tag <tag>`, `setup stag <stag>`, `admin <user mention/id>`, `official <user mention/id>`, `guest <user mention/id>`, `girl <user mention/id>`, `friend <user mention/id>`, `vip <user mention/id>`, `setup reset`',
          inline: false
        },
      );

    const embed9 = new EmbedBuilder()
      .setColor(client.color)
      .addFields(
        {
          name: `${emoji.id.media} Media Commands`,
          value: '`media`, `media channel add <channel mention/id>`, `media channel remove <channel mention/id>`, `media config`, `media reset`',
          inline: false
        },
      );

    const embed10 = new EmbedBuilder()
      .setColor(client.color)
      .addFields(
        {
          name: `${emoji.id.games} Games Commands`,
          value: '`dick`, `gay`, `nitro`, `slap`, `8ball <msg>`',
          inline: false
        },
      );

    const embed11 = new EmbedBuilder()
      .setColor(client.color)
      .addFields(
        {
          name: `${emoji.id.utility} Utility Commands`,
          value: '`afk`, `premium`, `premium redeem`, `premium validity`, `premium purchase`, `premium features`, `embed create`, `code`, `help`, `info`, `invite`, `ping`, `privacy`, `terms`, `stats`, `uptime`, `vote`, `avatar user <user mention/id>`, `avatar server`, `banner <user mention/id>`, `serverbanner`, `google <query>`, `serverinfo`, `userinfo <user>`,`profile <user mention/id>`, `membercount`, `boostcount`, `rolecount`, `channelcount`, `emojicount`, `snipe`, `list bots`, `list bans`, `list admins`, `list inrole <role mention/id>`, `list boosters`, `list emojis`, `list roles`',
          inline: false
        },
      );

    const embeds = [embed1, embed2, embed3, embed4, embed5, embed6, embed7, embed8, embed9, embed10, embed11];
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

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Vote")
        .setStyle("Link")
        .setURL(`https://top.gg/bot/${client.user.id}/vote`),
      new ButtonBuilder()
        .setLabel("Invite")
        .setStyle("Link")
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`),
      new ButtonBuilder()
        .setLabel("Documentation")
        .setStyle("Link")
        .setURL(client.website),
      new ButtonBuilder()
        .setLabel("Sponsor")
        .setStyle("Link")
        .setURL(client.sponsor)
    )

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

    async function generateEmbed() {
      const embed = embeds[currentPage];
      embed.setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
      return embed;
    }

    async function sendMessage() {
      const embed = await generateEmbed();
      const messageComponent = await message.channel.send({ embeds: [embed], components: [pag, menuOptions, button] });
      return messageComponent;
    }

    async function updatePaginationButtons() {
      firstButton.setDisabled(currentPage === 0);
      backButton.setDisabled(currentPage === 0);
      nextButton.setDisabled(currentPage === totalPages - 1);
      lastButton.setDisabled(currentPage === totalPages - 1);
    }

    async function handleInteraction(interaction) {
      let updatedEmbed;

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
          collector.stop();
          messageComponent.edit({ components: [disabledPagg, disabledMenuOptions, button] });
          return;
        }

        updatedEmbed = await generateEmbed();
        updatePaginationButtons();

        interaction.update({ embeds: [updatedEmbed], components: [pag, menuOptions, button] });
      } else if (interaction.isStringSelectMenu()) {
        switch (interaction.values[0]) {
          case "home":
            currentPage = 0;
            break;
          case "antinuke":
            currentPage = 1;
            break;
          case "automod":
            currentPage = 2;
            break;
          case "moderation":
            currentPage = 3;
            break;
          case "welcome":
            currentPage = 4;
            break;
          case "server":
            currentPage = 5;
            break;
          case "voicerole":
            currentPage = 6;
            break;
          case "customroles":
            currentPage = 7;
            break;
          case "media":
            currentPage = 8;
            break;
          case "games":
            currentPage = 9;
            break;
          case "utility":
            currentPage = 10;
            break;
          default:
            currentPage = 0;
        }

        updatedEmbed = await generateEmbed();
        updatePaginationButtons();
      }

      interaction.update({ embeds: [updatedEmbed], components: [pag, menuOptions, button] });
    }

    const messageComponent = await sendMessage();

    const collector = messageComponent.createMessageComponentCollector({
      filter: (interaction) => {
        if (message.author.id === interaction.user.id) return true;
        else {
          return interaction.reply({ content: `${emoji.util.cross} | This Pagination is not for you.`, ephemeral: true });
        }
      },
      time: 200000,
      idle: 300000 / 2,
    });

    collector.on("collect", async (interaction) => {
      await handleInteraction(interaction);
    });

    collector.on("end", async () => {
      const disabledPag = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setStyle("Primary").setCustomId("first").setLabel("≪").setDisabled(true),
        new ButtonBuilder().setStyle("Success").setCustomId("previous").setLabel("Previous").setDisabled(true),
        new ButtonBuilder().setStyle("Danger").setCustomId("close").setLabel("Close").setDisabled(true),
        new ButtonBuilder().setStyle("Success").setCustomId("next").setLabel("Next").setDisabled(true),
        new ButtonBuilder().setStyle("Primary").setCustomId("last").setLabel("≫").setDisabled(true)
      );

      messageComponent.edit({ components: [disabledPag, disabledMenuOptions, button] });
    });
  },
};
