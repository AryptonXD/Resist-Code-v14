const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, WebhookClient } = require('discord.js');
const Settings = require('../../settings.js');
const emoji = require('../../emoji.js');
const owner = Settings.bot.credits.developerId;
const webhookPremiumRedeemClient = new WebhookClient({ url: 'https://discord.com/api/webhooks/1200060260518477864/SiHm2Dfr0OttIFedse09k45RUiZmoGee4-t2wblY2Ofpqb7AgVux9dkrfhoGyTJ7YiZ-' });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('premium')
        .addSubcommand(subcommand =>
            subcommand
                .setName('validity')
                .setDescription('Check the validity of Premium Subscription.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('features')
                .setDescription('Check the features of Premium Subscription.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('redeem')
                .setDescription('Can Redeem the Premium Subscription.')
                .addStringOption(option =>
                    option.setName('code')
                        .setDescription('The redeem code')
                        .setRequired(true)
                )
        )
        .setDescription('Show the validity of Premium Subscription.'),
    voteOnly: false,
    BotPerms: ['EmbedLinks'],
    async execute(client, interaction) {
        const subcommand = interaction.options.getSubcommand();

        switch (subcommand) {
            case 'validity':
                const premiumData = await client.db12.get(`${interaction.guild.id}_premium`);

                if (!premiumData || premiumData.active === false) {
                    const noPremium = new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .addFields(
                            { name: 'Server', value: '> Activated: No!' },
                        )
                        .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

                    interaction.reply({ embeds: [noPremium] });
                } else {
                    const ending = premiumData.premiumExpiresAt;
                    const yesPremium = new EmbedBuilder()
                        .setColor(client.color)
                        .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                        .addFields(
                            { name: 'Server', value: `> Activated: Yes!\n> Ending: <t:${Math.floor(ending / 1000)}:F>` },
                        )
                        .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

                    interaction.reply({ embeds: [yesPremium] });
                }
                break;

            case 'features':
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

                await interaction.reply({ embeds: [premiumFeatures] });
                break;

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

                const redeemCode = interaction.options.getString('code');
                const data = await client.db12.get(redeemCode);
                const dataPremium = await client.db12.get(`${interaction.guild.id}_premium`);
                const premiumServer = await client.db12.get('premium');

                if (!data) {
                    const invalidCodeMessage = `${emoji.util.cross} | The code you provided is invalid. Please try again with a valid one!`;
                    return interaction.reply({ content: invalidCodeMessage });
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
                        client.db12.set(`${interaction.guild.id}_premium`, { active: true, premiumExpiresAt: samay }),
                    ]);

                    if (!premiumServer.premiumServers.includes(interaction.guild.id)) {
                        await client.db12.push('premium.premiumServers', interaction.guild.id);
                    }

                    actionMessage = `Premium ${getActivationMessage(premiumActive)} for this server.\nPremium will expire on <t:${Math.floor(samay / 1000)}:F>`;
                    webhookMessage = `Premium ${getActivationMessage(premiumActive)} for ${interaction.guild.name} | ${interaction.guild.id}.\nPremium will expire on <t:${Math.floor(samay / 1000)}:F>`;
                }

                await interaction.reply({ content: actionMessage });
                await webhookPremiumRedeemClient.send({ content: webhookMessage });
                break;
        }
    }
};
