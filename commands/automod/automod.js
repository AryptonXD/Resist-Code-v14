const { EmbedBuilder, AutoModerationRuleTriggerType } = require('discord.js');
const Settings = require('../../settings.js');
const emoji = require('../../emoji.js');
const owner = Settings.bot.credits.developerId;

module.exports = {
    name: 'automod',
    aliases: ['am'],
    userPerms: ['Administrator'],
    botPerms: ['EmbedLinks', 'ManageMessages'],
    aboveRole: true,
    voteOnly: true,
    run: async (client, message, args) => {
        const prefix = await client.db8.get(`${message.guild.id}_prefix`) || Settings.bot.info.prefix;
        const arypton = await client.users.fetch(owner);

        const guide = new EmbedBuilder()
            .setColor(client.color)
            .setThumbnail(client.user.displayAvatarURL())
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
            .addFields(
                { name: `${emoji.util.arrow} \`${prefix}automod anti pornography enable/disable\``, value: `Enable/Disable anti-pornography filter`, inline: false },
                { name: `${emoji.util.arrow} \`${prefix}automod anti message spam enable/disable\``, value: `Enable/Disable message spam filter`, inline: false },
                { name: `${emoji.util.arrow} \`${prefix}automod anti mention spam enable/disable\``, value: `Enable/Disable mention spam filter`, inline: false },
                { name: `${emoji.util.arrow} \`${prefix}automod anti toxicity enable/disable\``, value: `Enable/Disable toxicity filter`, inline: false },
                { name: `${emoji.util.arrow} \`${prefix}automod config\``, value: `Configure automod settings`, inline: false },
                { name: `${emoji.util.arrow} \`${prefix}automod reset\``, value: `Reset automod settings to default`, inline: false }
            )
            .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) });

        switch (args[0]) {
            case 'anti':
                switch (args[1]) {
                    case 'pornography':
                        switch (args[2]) {
                            case 'enable':
                                await enableAntiPornography(client, message);
                                break;
                            case 'disable':
                                await disableAntiPornography(client, message);
                                break;
                            default:
                                message.channel.send({ embeds: [guide] });
                                break;
                        }
                        break;
                    case 'message':
                        switch (args[2]) {
                            case 'spam':
                                switch (args[3]) {
                                    case 'enable':
                                        await enableAntiSpam1(client, message);
                                        break;
                                    case 'disable':
                                        await disableAntiSpam1(client, message);
                                        break;
                                    default:
                                        message.channel.send({ embeds: [guide] });
                                        break;
                                }
                                break;
                            default:
                                message.channel.send({ embeds: [guide] });
                                break;
                        }
                        break;
                    case 'mention':
                        switch (args[2]) {
                            case 'spam':
                                switch (args[3]) {
                                    case 'enable':
                                        await enableAntiSpam2(client, message);
                                        break;
                                    case 'disable':
                                        await disableAntiSpam2(client, message);
                                        break;
                                    default:
                                        message.channel.send({ embeds: [guide] });
                                        break;
                                }
                                break;
                            default:
                                message.channel.send({ embeds: [guide] });
                                break;
                        }
                        break;
                    case 'toxicity':
                        switch (args[2]) {
                            case 'enable':
                                await enableAntiToxicity(client, message);
                                break;
                            case 'disable':
                                await disableAntiToxicity(client, message);
                                break;
                            default:
                                message.channel.send({ embeds: [guide] });
                                break;
                        }
                        break;
                    default:
                        message.channel.send({ embeds: [guide] });
                        break;
                }
                break;
            case 'config':
                await automodConfig(client, message);
                break;
            case 'reset':
                message.channel.send({ content: 'soon' });
                break;
            default:
                message.channel.send({ embeds: [guide] });
                break;
        }
    }
}

async function automodConfig(client, message) {
    const automodRules = await message.guild.autoModerationRules.fetch();
    let automodArray = [];
    const pornRule = automodRules.find((rule) => rule.triggerType === AutoModerationRuleTriggerType.KeywordPreset);
    const toxicRule = automodRules.find((rule) => rule.triggerType === AutoModerationRuleTriggerType.Keyword);
    const messageRule = automodRules.find((rule) => rule.triggerType === AutoModerationRuleTriggerType.Spam);
    const mentionRule = automodRules.find((rule) => rule.triggerType === AutoModerationRuleTriggerType.MentionSpam);

    if (pornRule && pornRule.creatorId === client.user.id && pornRule.enabled === true) {
        automodArray.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Pornography`)
    } else {
        automodArray.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Pornography`)
    }

    if (toxicRule && toxicRule.creatorId === client.user.id && toxicRule.enabled === true) {
        automodArray.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Toxicity`)
    } else {
        automodArray.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Toxicity`)
    }

    if (messageRule && messageRule.creatorId === client.user.id && messageRule.enabled === true) {
        automodArray.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Message Spam`)
    } else {
        automodArray.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Message Spam`)
    }

    if (mentionRule && mentionRule.creatorId === client.user.id && mentionRule.enabled === true) {
        automodArray.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Mention Spam`)
    } else {
        automodArray.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Mention Spam`)
    }

    const settingss = new EmbedBuilder()
        .setColor(client.color)
        .setThumbnail(client.user.displayAvatarURL())
        .setAuthor({
            name: 'Automod Events',
            iconURL: client.user.displayAvatarURL()
        })
        .setDescription(`${automodArray.join("\n")}`)
        .setFooter({
            text: `Thanks For Selecting ${client.user.username}`,
            iconURL: client.user.displayAvatarURL()
        });

    message.channel.send({ embeds: [settingss] });
}

async function enableAntiPornography(client, message) {
    const automodRules = await message.guild.autoModerationRules.fetch();
    const pornRule = automodRules.find((rule) => rule.triggerType === AutoModerationRuleTriggerType.KeywordPreset);
    if (pornRule && pornRule.creatorId !== client.user.id) {
        await pornRule.delete();
        message.channel.send({ content: `${emoji.util.cross} | Run this command again` });
    } else if (pornRule && pornRule.creatorId === client.user.id && pornRule.enabled === false) {
        await pornRule.setEnabled(true);
        message.channel.send({ content: `${emoji.util.tick} | Successfully enabled Anti Pornography Rule` });
    } else if (pornRule && pornRule.creatorId === client.user.id && pornRule.enabled === true) {
        message.channel.send({ content: `${emoji.util.tick} | Already enabled Anti Pornography Rule` });
    } else if (!pornRule) {
        await message.guild.autoModerationRules.create({
            name: `Resist Anti Pornography`,
            creatorId: client.user.id,
            enabled: true,
            eventType: 1,
            triggerType: 4,
            triggerMetadata:
            {
                presets: [1, 2, 3]
            },
            actions: [
                {
                    type: 1,
                    metadata: {
                        channel: message.channel,
                        durationSeconds: 10,
                        customMessage: 'This message has been blocked.'
                    }
                }
            ]
        });
        message.channel.send({ content: `${emoji.util.tick} | Successfully enabled Anti Pornography Rule` });
    }
}

async function disableAntiPornography(client, message) {
    const automodRules = await message.guild.autoModerationRules.fetch();
    const pornRule = automodRules.find((rule) => rule.triggerType === AutoModerationRuleTriggerType.KeywordPreset);
    if (pornRule && pornRule.creatorId !== client.user.id) {
        await pornRule.delete();
        message.channel.send({ content: `${emoji.util.tick} | Successfully disabled Anti Pornography Rule` });
    } else if (pornRule && pornRule.creatorId === client.user.id && pornRule.enabled === true) {
        await pornRule.setEnabled(false);
        message.channel.send({ content: `${emoji.util.tick} | Successfully disabled Anti Pornography Rule` });
    } else if (pornRule && pornRule.creatorId === client.user.id && pornRule.enabled === false) {
        message.channel.send({ content: `${emoji.util.cross} | Already disabled Anti Pornography Rule` });
    } else {
        message.channel.send({ content: `${emoji.util.cross} | Rule not found or i don't have permission to disable it.` });
    }
}

async function enableAntiToxicity(client, message) {
    const automodRules = await message.guild.autoModerationRules.fetch();
    const toxicRule = automodRules.find((rule) => rule.triggerType === AutoModerationRuleTriggerType.Keyword);
    if (toxicRule && toxicRule.creatorId !== client.user.id) {
        await toxicRule.delete();
        message.channel.send({ content: `${emoji.util.cross} | Run this command again` });
    } else if (toxicRule && toxicRule.creatorId === client.user.id && toxicRule.enabled === false) {
        await toxicRule.setEnabled(true);
        message.channel.send({ content: `${emoji.util.tick} | Successfully enabled Anti Toxicity Rule` });
    } else if (toxicRule && toxicRule.creatorId === client.user.id && toxicRule.enabled === true) {
        message.channel.send({ content: `${emoji.util.tick} | Already enabled Anti Toxicity Rule` });
    } else if (!toxicRule) {
        await message.guild.autoModerationRules.create({
            name: `Resist Anti Toxicity`,
            creatorId: client.user.id,
            enabled: true,
            eventType: 1,
            triggerType: 1,
            triggerMetadata:
            {
                keywordFilter: [`*https://*`, `*https://*`, `*discord.gg*`, `*discord.com/invite*`, `-NUS*`, `anal`, `anus`, `anus*`, `ANUS*`, `arse`, `asshat`, `asshat*`, `asshole`, `asshole*`, `b0`, `b1tch`, `b1tch*`, `ballsac`, `ballsac*`, `ballsack`, `ballsack*`, `bct`, `bct*`, `bct.`, `bcta`, `bcta*`, `bdsm`, `bdsm*`, `beastiality`, `beastiality*`, `beefcurtains`, `beefcurtains*`, `biatch`, `biatch*`, `bitch`, `bitch*`, `blowjob`, `blowjob*`, `Blowjob`, `Blowjob*`, `blowjobs`, `blowjobs*`, `bo0b`, `bollock`, `bollock*`, `bollok`, `bollok*`, `boner`, `boner*`, `boob`, `boobs`, `booty`, `booty*`, `Boquete`, `Boquete*`, `BOQUETE*`, `BOSSETA*`, `Brasino`, `buceta`, `buceta*`, `BUCETA*`, `Bucetão`, `Bucetão*`, `bucetinha`, `bucetinha*`, `Bucetuda`, `Bucetuda*`, `Bucetudinha`, `Bucetudinha*`, `bucta`, `bucta*`, `Busseta`, `Busseta*`, `BUSSETA*`, `Buttock`, `Buttock*`, `buttplug`, `buttplug*`, `buzeta`, `buzeta*`, `ceu pau`, `chupo paus`, `clitoris`, `clitoris*`, `cock`, `comendo a tua`, `comendo o teu`, `comendo teu`, `comendo tua`, `comerei a sua`, `comerei o seu`, `comerei sua`, `comi a sua`, `comi o seu`, `comi sua`, `Culhao`, `Culhao*`, `cum`, `cunt`, `cunt*`, `Curalho`, `Curalho*`, `Cuzinho`, `Cuzinho*`, `Cuzuda`, `Cuzuda*`, `CUZUDA*`, `Cuzudo`, `Cuzudo*`, `CUZUDO*`, `da o cu`, `deepthroat`, `deepthroat*`, `dei o cu`, `dick`, `dick*`, `dildo`, `dildov`, `ecchi`, `ecchi*`, `ejaculate`, `erection`, `erection*`, `f0de`, `f0de*`, `feck`, `feck*`, `felching`, `felching*`, `fellate`, `fellate*`, `fellatio`, `fellatio*`, `fiIho da pta`, `Fiquei ate ereto`, `Fiquei até ereto`, `fodar`, `fodar*`, `fode`, `fode*`, `FODE*`, `foder`, `foder*`, `FODIDA*`, `FORNICA*`, `fuc`, `fuck*`, `fucks`, `fucks*`, `Fucky`, `FUDE¦+O*`, `FUDECAO*`, `FUDENDO*`, `FUDIDA*`, `FUDIDO*`, `g0z@ndo`, `g0z@ndo*`, `g0z@r`, `g0z@r*`, `g0zando`, `g0zando*`, `g0zar`, `g0zar*`, `gemida`, `gemida*`, `genitals`, `genitals*`, `gey`, `gey*`, `gosei`, `gosei*`, `goz@r`, `goz@r*`, `gozando`, `gozando*`, `gozar`, `gozar*`, `Gozei`, `Gozei*`, `horny`, `horny*`, `Kudasai`, `Kudasai*`, `kys`, `kys*`, `labia`, `labia*`, `M.A.M.A.D.A`, `M.A.M.A.D.A*`, `mama`, `mamado`, `mamado*`, `mamo`, `masterbating`, `masterbating*`, `masturbate`, `masturbate*`, `memama`, `memama*`, `meu penis`, `meu pênis`, `Nadega`, `Nadega*`, `nakedphotos`, `nakedphotos*`, `P-NIS*`, `p0rn`, `P0rn0`, `P0rn0*`, `paugrand`, `paugrand*`, `peituda`, `peituda*`, `pelad0`, `pelad0*`, `PELAD4`, `PELAD4*`, `pen15`, `pen15*`, `pen1s`, `pen1s*`, `penezis`, `penezis*`, `penis`, `piroca`, `piroca*`, `Piroca`, `Piroca*`, `Piroco`, `Piroco*`, `Pirocudo`, `piroquinha`, `piroquinha*`, `piss`, `porn`, `PornHub`, `PornHub*`, `porno`, `pornô`, `pornohug`, `pornohug*`, `pu55y`, `pu55y*`, `PUNHET+O*`, `Punheta`, `Punheta*`, `PUNHETA*`, `PUNHETAO*`, `punheteiro`, `punheteiro*`, `pussy`, `pussy*`, `r@b@`, `r@b@*`, `r@ba`, `r@ba*`, `rab@`, `rab@*`, `raba`, `raba*`, `rape`, `rimjob`, `rimjob*`, `rule34`, `rule34*`, `scat`, `scat*`, `scrotum`, `scrotum*`, `seqsu`, `seqsu*`, `Sequisu`, `Sequisu*`, `seu c`, `seu cu`, `seu pau`, `seu penis`, `seu pênis`, `Sex0`, `Sex0*`, `sexslaves`, `sexslaves*`, `sh1t`, `shemale`, `shemale*`, `smegma`, `smegma*`, `sperm`, `spunk`, `spunk*`, `strap-on`, `strap-on*`, `strapon`, `strapon*`, `stripper`, `stripper*`, `Tesao*`, `testicle`, `testicle*`, `testicules`, `testicules*`, `tetinha`, `tetinha*`, `Tezao`, `Tezao*`, `Tezuda`, `Tezuda*`, `Tezudo`, `Tezudo*`, `throat`, `throat*`, `tits`, `tits*`, `titt`, `titty`, `titty*`, `toma no cu`, `tosser`, `tosser*`, `trannie`, `trannie*`, `trannies`, `trannies*`, `tranny`, `tranny*`, `Transa`, `Transa*`, `tubgirl`, `tubgirl*`, `turd`, `turd*`, `twat`, `twat*`, `vadge`, `vadge*`, `vagane`, `vagane*`, `vagina`, `vagina*`, `vai se foder`, `vai toma no c`, `vai toma no cu`, `vai tomar no`, `você mama`, `wank`, `wank*`, `wanker`, `wanker*`, `whore`, `whore*`, `x-rated`, `x-rated*`, `Xereca*`, `XERERECA*`, `XEXECA*`, `Xota`, `Xota*`, `Xoxota*`, `xVideos`, `xVideos*`, `xVidros`, `xVidros*`, `Yamete`, `Yamete*`, `you mama`, `zoophile`, `zoophile*`]
            },
            actions: [
                {
                    type: 1,
                    metadata: {
                        channel: message.channel,
                        durationSeconds: 10,
                        customMessage: 'This message has been blocked.'
                    }
                }
            ]
        });
        message.channel.send({ content: `${emoji.util.tick} | Successfully enabled Anti Toxicity Rule` });
    }
}

async function disableAntiToxicity(client, message) {
    const automodRules = await message.guild.autoModerationRules.fetch();
    const toxicRule = automodRules.find((rule) => rule.triggerType === AutoModerationRuleTriggerType.Keyword);
    if (toxicRule && toxicRule.creatorId !== client.user.id) {
        await toxicRule.delete();
        message.channel.send({ content: `${emoji.util.tick} | Successfully disabled Anti Toxicity Rule` });
    } else if (toxicRule && toxicRule.creatorId === client.user.id && toxicRule.enabled === true) {
        await toxicRule.setEnabled(false);
        message.channel.send({ content: `${emoji.util.tick} | Successfully disabled Anti Toxicity Rule` });
    } else if (toxicRule && toxicRule.creatorId === client.user.id && toxicRule.enabled === false) {
        message.channel.send({ content: `${emoji.util.cross} | Already disabled Anti Toxicity Rule` });
    } else {
        message.channel.send({ content: `${emoji.util.cross} | Rule not found or i don't have permission to disable it.` });
    }
}

async function enableAntiSpam1(client, message) {
    const automodRules = await message.guild.autoModerationRules.fetch();
    const messageRule = automodRules.find((rule) => rule.triggerType === AutoModerationRuleTriggerType.Spam);
    if (messageRule && messageRule.creatorId !== client.user.id) {
        await messageRule.delete();
        message.channel.send({ content: `${emoji.util.cross} | Run this command again` });
    } else if (messageRule && messageRule.creatorId === client.user.id && messageRule.enabled === false) {
        await messageRule.setEnabled(true);
        message.channel.send({ content: `${emoji.util.tick} | Successfully enabled Anti Message Spam Rule` });
    } else if (messageRule && messageRule.creatorId === client.user.id && messageRule.enabled === true) {
        message.channel.send({ content: `${emoji.util.tick} | Already enabled Anti Message Spam Rule` });
    } else if (!messageRule) {
        await message.guild.autoModerationRules.create({
            name: `Resist Anti Message Spam`,
            creatorId: client.user.id,
            enabled: true,
            eventType: 1,
            triggerType: 3,
            actions: [
                {
                    type: 1,
                    metadata: {
                        channel: message.channel,
                        durationSeconds: 10,
                        customMessage: 'This message has been blocked.'
                    }
                }
            ]
        });
        message.channel.send({ content: `${emoji.util.tick} | Successfully enabled Anti Message Spam Rule` });
    }
}

async function disableAntiSpam1(client, message) {
    const automodRules = await message.guild.autoModerationRules.fetch();
    const messageRule = automodRules.find((rule) => rule.triggerType === AutoModerationRuleTriggerType.Spam);
    if (messageRule && messageRule.creatorId !== client.user.id) {
        await messageRule.delete();
        message.channel.send({ content: `${emoji.util.tick} | Successfully disabled Anti Message Spam Rule` });
    } else if (messageRule && messageRule.creatorId === client.user.id && messageRule.enabled === true) {
        await messageRule.setEnabled(false);
        message.channel.send({ content: `${emoji.util.tick} | Successfully disabled Anti Message Spam Rule` });
    } else if (messageRule && messageRule.creatorId === client.user.id && messageRule.enabled === false) {
        message.channel.send({ content: `${emoji.util.cross} | Already disabled Anti Message Spam Rule` });
    } else {
        message.channel.send({ content: `${emoji.util.cross} | Rule not found or i don't have permission to disable it.` });
    }
}

async function enableAntiSpam2(client, message) {
    const automodRules = await message.guild.autoModerationRules.fetch();
    const mentionRule = automodRules.find((rule) => rule.triggerType === AutoModerationRuleTriggerType.MentionSpam);
    if (mentionRule && mentionRule.creatorId !== client.user.id) {
        await mentionRule.delete();
        message.channel.send({ content: `${emoji.util.cross} | Run this command again` });
    } else if (mentionRule && mentionRule.creatorId === client.user.id && mentionRule.enabled === false) {
        await mentionRule.setEnabled(true);
        message.channel.send({ content: `${emoji.util.tick} | Successfully enabled Anti Mention Spam Rule` });
    } else if (mentionRule && mentionRule.creatorId === client.user.id && mentionRule.enabled === true) {
        message.channel.send({ content: `${emoji.util.tick} | Already enabled Anti Mention Spam Rule` });
    } else if (!mentionRule) {
        await message.guild.autoModerationRules.create({
            name: `Resist Anti Mention Spam`,
            creatorId: client.user.id,
            enabled: true,
            eventType: 1,
            triggerType: 5,
            triggerMetadata: {
                mentionTotalLimit: 5,
                mentionSpamRule: true
            },
            actions: [
                {
                    type: 1,
                    metadata: {
                        channel: message.channel,
                        durationSeconds: 10,
                        customMessage: 'This message has been blocked.'
                    }
                }
            ]
        });
        message.channel.send({ content: `${emoji.util.tick} | Successfully enabled Anti Mention Spam Rule` });
    }
}

async function disableAntiSpam2(client, message) {
    const automodRules = await message.guild.autoModerationRules.fetch();
    const mentionRule = automodRules.find((rule) => rule.triggerType === AutoModerationRuleTriggerType.MentionSpam);
    if (mentionRule && mentionRule.creatorId !== client.user.id) {
        await mentionRule.delete();
        message.channel.send({ content: `${emoji.util.tick} | Successfully disabled Anti Mention Spam Rule` });
    } else if (mentionRule && mentionRule.creatorId === client.user.id && mentionRule.enabled === true) {
        await mentionRule.setEnabled(false);
        message.channel.send({ content: `${emoji.util.tick} | Successfully disabled Anti Mention Spam Rule` });
    } else if (mentionRule && mentionRule.creatorId === client.user.id && mentionRule.enabled === false) {
        message.channel.send({ content: `${emoji.util.cross} | Already disabled Anti Mention Spam Rule` });
    } else {
        message.channel.send({ content: `${emoji.util.cross} | Rule not found or i don't have permission to disable it.` });
    }
}
