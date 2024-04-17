const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, WebhookClient } = require('discord.js');
const { PremiumAccess } = require('../../owner.json');
const Settings = require('../../settings.js');
const emoji = require('../../emoji.js');
const owner = Settings.bot.credits.developerId;
const voucher_codes = require("voucher-code-generator");
const webhookPremiumGencodeClient = new WebhookClient({ url: 'https://discord.com/api/webhooks/1200060260518477864/SiHm2Dfr0OttIFedse09k45RUiZmoGee4-t2wblY2Ofpqb7AgVux9dkrfhoGyTJ7YiZ-' });
const webhookPremiumRedeemClient = new WebhookClient({ url: 'https://discord.com/api/webhooks/1200060260518477864/SiHm2Dfr0OttIFedse09k45RUiZmoGee4-t2wblY2Ofpqb7AgVux9dkrfhoGyTJ7YiZ-' });

module.exports = {
  name: 'premium',
  voteOnly: false,
  BotPerms: ['EmbedLinks'],
  run: async (client, message, args) => {
    const arypton = await client.users.fetch(owner);
    let prefix = await client.db8.get(`${message.guild.id}_prefix`) || Settings.bot.info.prefix;
    const user = message.guild.members.cache.get(args[1]) || message.mentions.members.first() || message.author;
    const ID = user.id

    const planOptions = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('planOption')
        .setPlaceholder(`Select a ${client.user.username} Premium Plan...`)
        .addOptions([
          new StringSelectMenuOptionBuilder()
            .setLabel('Trial (1w) - ₹9')
            .setValue('weekly')
            .setDescription('Duration: 7 days'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Basic (1m) - ₹29')
            .setValue('monthly')
            .setDescription('Duration: 28 days'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Professional (3m) - ₹79')
            .setValue('monthlyx3')
            .setDescription('Duration: 84 days'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Enterprise (1y) - ₹299')
            .setValue('yearly')
            .setDescription('Duration: 336 days'),
          new StringSelectMenuOptionBuilder()
            .setLabel('Godlike (69y) - ₹999')
            .setValue('lifetime')
            .setDescription('Duration: 69 years')
        ])
    );

    const DisplanOptions = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('planOption')
        .setPlaceholder(`Select a ${client.user.username} Premium Plan...`)
        .addOptions([
          new StringSelectMenuOptionBuilder()
            .setLabel('Trial (1w) - ₹9')
            .setValue('weekly')
            .setDescription('Duration: 7 days'),
        ])
        .setDisabled(true)
    );

    const data = await client.db12.get(`premium`);
    if (!data) {
      await client.db12.set(`premium`, { premiumServers: [] });
      return message.channel.send({ content: `Please use this command again.` });
    }

    const guide = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
      .setThumbnail(client.user.displayAvatarURL())
      .addFields(
        { name: `${emoji.util.arrow} \`premium\``, value: `Shows the guide embed for the module.` },
        { name: `${emoji.util.arrow} \`premium redeem\``, value: `Redeem premium code .` },
        { name: `${emoji.util.arrow} \`premium status\``, value: `Check the premium status of the server.` },
        { name: `${emoji.util.arrow} \`premium purchase\``, value: `Purchase the Premium Codes for your server.` },
        { name: `${emoji.util.arrow} \`premium features\``, value: `See the Premium Features for your server.` }
      )
      .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    const subcommand = args[0];
    switch (subcommand) {
      case undefined:
        return message.channel.send({ embeds: [guide] });
      case 'gencode':
      case 'gen':
      case 'code':
        if (!PremiumAccess.includes(message.author.id)) {
          return;
        }

        let msg = await message.channel.send({ content: `Please select the ${client.user.username} Premium plan, you want to opt:`, components: [planOptions] });

        const PLAN_DETAILS = {
          weekly: { name: 'Trial (7d)', days: 7, price: '₹9' },
          monthly: { name: 'Basic (28d)', days: 28, price: '₹29' },
          monthlyx3: { name: 'Professional (84d)', days: 84, price: '₹79' },
          yearly: { name: 'Enterprise (336d)', days: 336, price: '₹299' },
          lifetime: { name: 'Godlike (69y)', days: 69 * 365, price: '₹999' },
        };

        function generatePremiumCode() {
          const codePremium = voucher_codes.generate({
            postfix: '-resist',
            pattern: '####-####-####-####-####-####',
            charset: 'alphanumeric',
          });
          return codePremium.toString().toUpperCase();
        }

        function createBillReceipt(plan, code, time, ID) {
          const planDetails = PLAN_DETAILS[plan];
          const billReceipt = new EmbedBuilder()
            .setColor(client.color)
            .setTitle('Premium Code Purchase Receipt')
            .setAuthor({ name: `${client.user.username} Pvt. Ltd.`, iconURL: client.user.displayAvatarURL() })
            .setDescription('Thank you for your premium code purchase. Here is your receipt:')
            .addFields(
              { name: 'Customer', value: `<@${ID}>` },
              { name: 'Plan', value: planDetails.name },
              { name: 'Code', value: code },
              { name: 'Expire At', value: `<t:${Math.floor(time / 1000)}:F>` },
              { name: 'Bill', value: planDetails.price }
            )
            .setFooter({ text: `To redeem, use the following command: ${prefix}premium redeem/claim <code>`, iconURL: client.user.displayAvatarURL() });

          return billReceipt;
        }

        const collector = await msg.createMessageComponentCollector({
          filter: (interaction) => {
            if (message.author.id === interaction.user.id) return true;
            else {
              return interaction.reply({ content: `${emoji.util.cross} | This Pagination is not for you.`, ephemeral: true });
            }
          },
          time: 200000,
          idle: 300000 / 2
        });

        collector.on('collect', async (interaction) => {
          if (interaction.isStringSelectMenu()) {
            const value = interaction.values[0];

            if (PLAN_DETAILS.hasOwnProperty(value)) {
              const { name, days, price } = PLAN_DETAILS[value];
              const plan = value;
              const time = Date.now() + 86400000 * days;
              const code = generatePremiumCode();
              const billReceipt = createBillReceipt(plan, code, time, ID);

              await msg.edit({ content: `This redeem code will be usable till <t:${Math.floor(time / 1000)}:F>`, components: [DisplanOptions] });
              await interaction.reply({ embeds: [billReceipt] });

              const premiumUser = await client.users.fetch(message.member.id);
              await webhookPremiumGencodeClient.send({ content: `\`${premiumUser.username}\` Generated a Premium Code`, embeds: [billReceipt] });

              await client.db12.set(`${code}`, {
                plan,
                codeExpiresAt: time,
                active: true,
                redeemedAt: null,
              });
            }
          }
        });
        break;
      case 'claim':
      case 'redeem':

        function getExpirationTime(plan) {
          const planDurations = {
            'trial': 7,
            'monthly': 28,
            'monthlyx3': 84,
            'yearly': 336,
            'lifetime': 336 * 69,
          };
          return 86400000 * planDurations[plan];
        }

        function getActivationMessage(premiumActive) {
          return premiumActive ? 'extended' : 'activated';
        }

        const redeemCode = args.slice(1).join(" ");
        const data = await client.db12.get(redeemCode);
        const dataPremium = await client.db12.get(`${message.guild.id}_premium`);
        const premiumServer = await client.db12.get('premium');

        if (!data) {
          return message.channel.send({ content: `${emoji.util.cross} | The code you provided is invalid. Please try again with a valid one!` });
        }

        const codePlan = data.plan;
        const codeExpiry = data.codeExpiresAt;
        const codeActive = data.active;
        const premiumActive = dataPremium.active;
        const alreadyPremium = dataPremium.premiumExpiresAt;

        let samay;
        let actionMessage;
        let webhookMessage;

        if (codeActive === false) {
          actionMessage = `${emoji.util.cross} | This code is already being used. | Purchase a new one.`;
        } else if (Date.now() >= codeExpiry) {
          actionMessage = `${emoji.util.cross} | This code is expired.`;
        } else {
          if (premiumActive === true) {
            samay = alreadyPremium + getExpirationTime(codePlan);
          } else {
            samay = Date.now() + getExpirationTime(codePlan);
          }

          await Promise.all([
            client.db12.set(redeemCode, { plan: codePlan, codeExpiresAt: codeExpiry, active: false, redeemedAt: Date.now() }),
            client.db12.set(`${message.guild.id}_premium`, { active: true, premiumExpiresAt: samay }),
          ]);

          if (!premiumServer.premiumServers.includes(message.guild.id)) {
            await client.db12.push('premium.premiumServers', message.guild.id);
          }

          actionMessage = `Premium ${getActivationMessage(premiumActive)} for this server.\nPremium will expire on <t:${Math.floor(samay / 1000)}:F>`;
          webhookMessage = `Premium ${getActivationMessage(premiumActive)} for ${message.guild.name} | ${message.guild.id}.\nPremium will expire on <t:${Math.floor(samay / 1000)}:F>`;
        }

        await message.channel.send({ content: actionMessage });
        await webhookPremiumRedeemClient.send({ content: webhookMessage });
        break;

      case 'purchase':
      case 'buy':
        let msg1 = await message.channel.send({ content: `Please select the ${client.user.username} Premium plan, you want to opt:`, components: [planOptions] });

        const collector1 = await msg1.createMessageComponentCollector({
          filter: (interaction) => {
            if (message.author.id === interaction.user.id) return true;
            else {
              return interaction.reply({ content: `${emoji.util.cross} | This Pagination is not for you.`, ephemeral: true })
            }
          },
          time: 200000,
          idle: 300000 / 2
        });

        collector1.on('collect', async (interaction) => {
          if (interaction.isStringSelectMenu()) {
            for (const value of interaction.values) {
              if (value === `weekly`) {
                await msg1.edit({ components: [DisplanOptions] });
                await interaction.reply({ content: `You are about to purchase **${client.user.username} Trial Premium Code**\n\n[*Click Me to Continue the Payment Process*](https://discord.gg/hdyZ9kRv93)`, ephemeral: true });
                await msg1.edit({ components: [planOptions] });
              } else if (value === `monthly`) {
                await msg1.edit({ components: [DisplanOptions] });
                await interaction.reply({ content: `You are about to purchase **${client.user.username} Monthly Premium Code**\n\n[*Click Me to Continue the Payment Process*](https://discord.gg/hdyZ9kRv93)`, ephemeral: true });
                await msg1.edit({ components: [planOptions] });
              } else if (value === `monthlyx3`) {
                await msg1.edit({ components: [DisplanOptions] });
                await interaction.reply({ content: `You are about to purchase **${client.user.username} 3 Months Premium Code**\n\n[*Click Me to Continue the Payment Process*](https://discord.gg/hdyZ9kRv93)`, ephemeral: true });
                await msg1.edit({ components: [planOptions] });
              } else if (value === `yearly`) {
                await msg1.edit({ components: [DisplanOptions] });
                await interaction.reply({ content: `You are about to purchase **${client.user.username} Yearly Premium Code**\n\n[*Click Me to Continue the Payment Process*](https://discord.gg/hdyZ9kRv93)`, ephemeral: true });
                await msg1.edit({ components: [planOptions] });
              } else if (value === `lifetime`) {
                await msg1.edit({ components: [DisplanOptions] });
                await interaction.reply({ content: `You are about to purchase **${client.user.username} Lifetime Premium Code**\n\n[*Click Me to Continue the Payment Process*](https://discord.gg/hdyZ9kRv93)`, ephemeral: true });
                await msg1.edit({ components: [planOptions] });
              }
            }
          }
        });
        break;
      case 'status':
      case 'validity':
        const premiumData = await client.db12.get(`${message.guild.id}_premium`);

        if (!premiumData || premiumData.active === false) {
          const noPremium = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
            .addFields(
              { name: 'Server', value: '> Activated: No!' },
            )
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) });

          message.channel.send({ embeds: [noPremium] });
        } else {
          const ending = premiumData.premiumExpiresAt;
          const yesPremium = new EmbedBuilder()
            .setColor(client.color)
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
            .addFields(
              {
                name: 'Server', value: `> Activated: Yes!\n> Ending: <t:${Math.floor(ending / 1000)}:F>`,
              },
            )
            .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) });

          message.channel.send({ embeds: [yesPremium] });
        }
        break;
      case 'features':
      case 'feature':

        const premiumFeatures = new EmbedBuilder()
          .setColor(client.color)
          .setAuthor({ name: `Premium Features for ${client.user.username}`, iconURL: client.user.displayAvatarURL() })
          .setTitle(`Premium Features for ${client.user.username}`)
          .setDescription(`With ${client.user.username} Premium, you get access to the following features:`)
          .addFields(
            { name: 'Antinuke Prune', value: `> ${emoji.util.tick} accessible`, inline: true },
            { name: 'Antinuke Autorecovery', value: `> ${emoji.util.tick} accessible`, inline: true },
            { name: 'Antinuke Whitelist Limit', value: `> ${emoji.util.tick} 100`, inline: true },
            { name: 'Autorole Humans Limit', value: `> ${emoji.util.tick} 10`, inline: true },
            { name: 'Autorole Bots Limit', value: `> ${emoji.util.tick} 10`, inline: true },
            { name: 'Extra Owner Limit', value: `> ${emoji.util.tick} 100`, inline: true },
            { name: 'Extra Admin Limit', value: `> ${emoji.util.tick} 100`, inline: true },
            { name: 'Ignore Channel Limit', value: `> ${emoji.util.tick} 100`, inline: true },
            { name: 'Ignore Bypass Limit', value: `> ${emoji.util.tick} 100`, inline: true },
            { name: 'Nightmode Role Limit', value: `> ${emoji.util.tick} 100`, inline: true },
            { name: 'Nightmode Bypass Limit', value: `> ${emoji.util.tick} 100`, inline: true },
            { name: 'Media Channel Limit', value: `> ${emoji.util.tick} 100`, inline: true }
          )
          .setFooter({ text: `Enjoy the enhanced features with ${client.user.username} Premium!`, iconURL: client.user.displayAvatarURL() });

        await message.channel.send({ embeds: [premiumFeatures] });
        break;

      default:
        message.channel.send('Invalid command usage.');
        break;
    }
  }
};
