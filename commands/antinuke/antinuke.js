const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const Settings = require('../../settings.js');
const emoji = require('../../emoji.js');
const owner = Settings.bot.credits.developerId;

module.exports = {
  name: 'antinuke',
  aliases: ['security', 'an'],
  UserPerms: ['Administrator'],
  BotPerms: ['EmbedLinks', 'ManageChannels', 'ManageGuild', 'ManageRoles', 'ManageEmojis', 'ManageWebhooks'],
  voteOnly: true,
  aboveRole: true,
  run: async (client, message, args) => {
    let prefix = await client.db8.get(`${message.guild.id}_prefix`) || Settings.bot.info.prefix;
    const premium = await client.db12.get(`${message.guild.id}_premium`);
    const arypton = await client.users.fetch(owner);
    let limit;

    if (premium.active === true) {
      limit = 100;
    } else {
      limit = 15;
    }

    const user = message.guild.members.cache.get(args[2]) || message.mentions.members.first() || message.author;
    const member = message.guild.members.cache.get(args[2]) || message.mentions.members.first() || message.author;
    const ID = user.id;
    const antiwizz = [];

    const [
      isActivatedAlready, antiban, antikick, antibot, antiunban, antiguildup,
      antimemberup, antichannelcreate, antichanneldelete, antichannelupdate,
      antirolecreate, antiroledelete, antiroleupdate, antiwebhookcreate,
      antiwebhookdelete, antiwebhookupdate, antiemojicreate, antiemojidelete,
      antiemojiupdate, antistickercreate, antistickerdelete, antistickerupdate, antiprune, autorecovery
    ] = await Promise.all([
      client.db.get(`${message.guild.id}_antinuke`),
      client.db.get(`${message.guild.id}_antiban`),
      client.db.get(`${message.guild.id}_antikick`),
      client.db.get(`${message.guild.id}_antibot`),
      client.db.get(`${message.guild.id}_antiunban`),
      client.db.get(`${message.guild.id}_antiguildupdate`),
      client.db.get(`${message.guild.id}_antimemberupdate`),
      client.db.get(`${message.guild.id}_antichannelcreate`),
      client.db.get(`${message.guild.id}_antichanneldelete`),
      client.db.get(`${message.guild.id}_antichannelupdate`),
      client.db.get(`${message.guild.id}_antirolecreate`),
      client.db.get(`${message.guild.id}_antiroledelete`),
      client.db.get(`${message.guild.id}_antiroleupdate`),
      client.db.get(`${message.guild.id}_antiwebhookcreate`),
      client.db.get(`${message.guild.id}_antiwebhookdelete`),
      client.db.get(`${message.guild.id}_antiwebhookupdate`),
      client.db.get(`${message.guild.id}_antiemojicreate`),
      client.db.get(`${message.guild.id}_antiemojidelete`),
      client.db.get(`${message.guild.id}_antiemojiupdate`),
      client.db.get(`${message.guild.id}_antistickercreate`),
      client.db.get(`${message.guild.id}_antistickerdelete`),
      client.db.get(`${message.guild.id}_antistickerupdate`),
      client.db.get(`${message.guild.id}_antiprune`),
      client.db.get(`${message.guild.id}_autorecovery`)
    ]);

    if (antiban) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Ban`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Ban`)
    }

    if (antikick) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Kick`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Kick`)
    }

    if (antibot) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Bot`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Bot`)
    }

    if (antiunban) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Unban`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Unban`)
    }

    if (antiguildup) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Guild Update`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Guild Update`)
    }

    if (antimemberup) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Member Update`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Member Update`)
    }

    if (antichannelcreate) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Channel Create`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Channel Create`)
    }

    if (antichanneldelete) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Channel Delete`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Channel Delete`)
    }

    if (antichannelupdate) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Channel Update`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Channel Update`)
    }

    if (antirolecreate) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Role Create`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Role Create`)
    }

    if (antiroledelete) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Role Delete`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Role Delete`)
    }

    if (antiroleupdate) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Role Update`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Role Update`)
    }

    if (antiwebhookcreate) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Webhook Create`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Webhook Create`)
    }

    if (antiwebhookdelete) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Webhook Delete`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Webhook Delete`)
    }

    if (antiwebhookupdate) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Webhook Update`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Webhook Update`)
    }

    if (antiemojicreate) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Emoji Create`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Emoji Create`)
    }

    if (antiemojidelete) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Emoji Delete`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Emoji Delete`)
    }

    if (antiemojiupdate) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Emoji Update`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Emoji Update`)
    }

    if (antistickercreate) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Sticker Create`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Sticker Create`)
    }

    if (antistickerdelete) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Sticker Delete`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Sticker Delete`)
    }

    if (antistickerupdate) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Sticker Update`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Sticker Update`)
    }

    if (antiprune) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Anti Prune`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Anti Prune`)
    }

    if (autorecovery) {
      antiwizz.push(`${emoji.util.disabler}${emoji.util.enabled} Auto Recovery`)
    } else {
      antiwizz.push(`${emoji.util.disabled}${emoji.util.enabler} Auto Recovery`)
    }

    const eeeee = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: `Security Settings`,
        value: `Antinuke is currently active on your server.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To deactivate this feature, please use the command ${prefix}antinuke disable`,
        iconURL: client.user.displayAvatarURL()
      });

    const eeee = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: `Security Settings`,
        value: `Antinuke settings have been successfully enabled on your server.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To deactivate this feature, please use the command ${prefix}antinuke disable`,
        iconURL: client.user.displayAvatarURL()
      });

    const ddddd = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: `Security Settings`,
        value: `Antinuke has already been deactivated on your server.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To activate this feature, please use the command ${prefix}antinuke enable`,
        iconURL: client.user.displayAvatarURL()
      });

    const dddd = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: `Security Settings`,
        value: `Antinuke settings have been successfully deactivated on your server.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To activate this feature, please use the command ${prefix}antinuke enable`,
        iconURL: client.user.displayAvatarURL()
      });

    const features = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .setThumbnail(client.user.displayAvatarURL())
      .setDescription(`**Welcome to ${client.user.username}'s Antinuke Page**
    If you need assistance, please join our [Support Server](${Settings.bot.credits.supportServer}).
    
**Astonishing Antinuke Features**

- ${emoji.util.arrow} Anti Ban
- ${emoji.util.arrow} Anti Kick
- ${emoji.util.arrow} Anti Bot
- ${emoji.util.arrow} Anti Unban
- ${emoji.util.arrow} Anti Guild Update
- ${emoji.util.arrow} Anti Member Update
- ${emoji.util.arrow} Anti Role Create
- ${emoji.util.arrow} Anti Role Delete
- ${emoji.util.arrow} Anti Role Update
- ${emoji.util.arrow} Anti Channel Create
- ${emoji.util.arrow} Anti Channel Delete
- ${emoji.util.arrow} Anti Channel Update
- ${emoji.util.arrow} Anti Webhook Create
- ${emoji.util.arrow} Anti Webhook Delete
- ${emoji.util.arrow} Anti Webhook Update
- ${emoji.util.arrow} Anti Emoji Create
- ${emoji.util.arrow} Anti Emoji Delete
- ${emoji.util.arrow} Anti Emoji Update
- ${emoji.util.arrow} Anti Sticker Create
- ${emoji.util.arrow} Anti Sticker Delete
- ${emoji.util.arrow} Anti Sticker Update
- ${emoji.util.arrow} Anti Prune [Premium](${Settings.bot.credits.supportServer})
- ${emoji.util.arrow} Auto Recovery [Premium](${Settings.bot.credits.supportServer})`)
      .addFields(
        {
          name: "Links",
          value: `• Join the magnificent support server if you require assistance.`,
          inline: false,
        }
      )
      .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

    const antibanalreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Ban is already enabled on your server.\nCurrent Status: ' + emoji.util.disabler + emoji.util.enabled,
        inline: true
      })
      .setFooter({
        text: 'To disable Anti Ban, please use the command ' + prefix + 'antinuke antiban disable'
      });

    const antibanon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Ban has been successfully enabled on your server.\nCurrent Status: ' + emoji.util.disabler + emoji.util.enabled,
        inline: true
      })
      .setFooter({
        text: 'To disable Anti Ban, please use the command ' + prefix + 'antinuke antiban disable'
      });

    const antibanalreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Ban is already disabled on your server.\nCurrent Status: ' + emoji.util.disabled + emoji.util.enabler,
        inline: true
      })
      .setFooter({
        text: 'To enable Anti Ban, please use the command ' + prefix + 'antinuke antiban enable'
      });

    const antibanoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Ban has been successfully disabled on your server.\nCurrent Status: ' + emoji.util.disabled + emoji.util.enabler,
        inline: true
      })
      .setFooter({
        text: 'To enable Anti Ban, please use the command ' + prefix + 'antinuke antiban enable'
      });

    const antikickalreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Kick is already enabled on your server.\nCurrent Status: ' + emoji.util.disabler + emoji.util.enabled,
        inline: true
      })
      .setFooter({
        text: 'To disable Anti Kick, please use the command ' + prefix + 'antinuke antikick disable'
      });

    const antikickon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Kick has been successfully enabled on your server.\nCurrent Status: ' + emoji.util.disabler + emoji.util.enabled,
        inline: true
      })
      .setFooter({
        text: 'To disable Anti Kick, please use the command ' + prefix + 'antinuke antikick disable'
      });

    const antikickalreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Kick is already disabled on your server.\nCurrent Status: ' + emoji.util.disabled + emoji.util.enabler,
        inline: true
      })
      .setFooter({
        text: 'To enable Anti Kick, please use the command ' + prefix + 'antinuke antikick enable'
      });

    const antikickoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Kick has been successfully disabled on your server.\nCurrent Status: ' + emoji.util.disabled + emoji.util.enabler,
        inline: true
      })
      .setFooter({
        text: 'To enable Anti Kick, please use the command ' + prefix + 'antinuke antikick enable'
      });

    const antibotalreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Oops! It seems that Anti Bot is already enabled on your server.\nCurrent Status: ' + emoji.util.disabler + emoji.util.enabled,
        inline: true
      })
      .setFooter({
        text: 'To disable it, use ' + prefix + 'antinuke antibot disable'
      });

    const antiboton = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Bot has been successfully enabled.\nCurrent Status: ' + emoji.util.disabler + emoji.util.enabled,
        inline: true
      })
      .setFooter({
        text: 'To disable it, use ' + prefix + 'antinuke antibot disable'
      });

    const antibotalreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Oops! It seems that Anti Bot is already disabled on your server.\nCurrent Status: ' + emoji.util.disabled + emoji.util.enabler,
        inline: true
      })
      .setFooter({
        text: 'To enable it, use ' + prefix + 'antinuke antibot enable'
      });

    const antibotoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Bot has been successfully disabled.\nCurrent Status: ' + emoji.util.disabled + emoji.util.enabler,
        inline: true
      })
      .setFooter({
        text: 'To enable it, use ' + prefix + 'antinuke antibot enable'
      });

    const antiunbanalreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Oops! It seems that Anti Unban is already enabled on your server.\nCurrent Status: ' + emoji.util.disabler + emoji.util.enabled,
        inline: true
      })
      .setFooter({
        text: 'To disable it, use ' + prefix + 'antinuke antiunban disable'
      });

    const antiunbanon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Unban has been successfully enabled.\nCurrent Status: ' + emoji.util.disabler + emoji.util.enabled,
        inline: true
      })
      .setFooter({
        text: 'To disable it, use ' + prefix + 'antinuke antiunban disable'
      });

    const antiunbanalreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Oops! It seems that Anti Unban is already disabled on your server.\nCurrent Status: ' + emoji.util.disabled + emoji.util.enabler,
        inline: true
      })
      .setFooter({
        text: 'To enable it, use ' + prefix + 'antinuke antiunban enable'
      });

    const antiunbanoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Unban has been successfully disabled.\nCurrent Status: ' + emoji.util.disabled + emoji.util.enabler,
        inline: true
      })
      .setFooter({
        text: 'To enable it, use ' + prefix + 'antinuke antiunban enable'
      });

    const antiguildupalreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Oops! It seems that Anti Guild Update is already enabled on your server.\nCurrent Status: ' + emoji.util.disabler + emoji.util.enabled,
        inline: true
      })
      .setFooter({
        text: 'To disable it, use ' + prefix + 'antinuke antiguild update disable'
      });

    const antiguildupon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Guild Update has been successfully enabled.\nCurrent Status: ' + emoji.util.disabler + emoji.util.enabled,
        inline: true
      })
      .setFooter({
        text: 'To disable it, use ' + prefix + 'antinuke antiguild update disable'
      });

    const antiguildupalreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Oops! It seems that Anti Guild Update is already disabled on your server.\nCurrent Status: ' + emoji.util.disabled + emoji.util.enabler,
        inline: true
      })
      .setFooter({
        text: 'To enable it, use ' + prefix + 'antinuke antiguild update enable'
      });

    const antiguildupoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Guild Update has been successfully disabled.\nCurrent Status: ' + emoji.util.disabled + emoji.util.enabler,
        inline: true
      })
      .setFooter({
        text: 'To enable it, use ' + prefix + 'antinuke antiguild update enable'
      });

    const antimemberupalreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Oops! It seems that Anti Member Update is already enabled on your server.\nCurrent Status: ' + emoji.util.disabler + emoji.util.enabled,
        inline: true
      })
      .setFooter({
        text: 'To disable it, use ' + prefix + 'antinuke antimember update disable'
      });

    const antimemberupon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Member Update has been successfully enabled.\nCurrent Status: ' + emoji.util.disabler + emoji.util.enabled,
        inline: true
      })
      .setFooter({
        text: 'To disable it, use ' + prefix + 'antinuke antimember update disable'
      });

    const antimemberupalreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Oops! It seems that Anti Member Update is already disabled on your server.\nCurrent Status: ' + emoji.util.disabled + emoji.util.enabler,
        inline: true
      })
      .setFooter({
        text: 'To enable it, use ' + prefix + 'antinuke antimember update enable'
      });

    const antimemberupoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Member Update has been successfully disabled.\nCurrent Status: ' + emoji.util.disabled + emoji.util.enabler,
        inline: true
      })
      .setFooter({
        text: 'To enable it, use ' + prefix + 'antinuke antimember update enable'
      });

    const antichannelcreatealreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Oops! It seems that Anti Channel Create is already enabled on your server.\nCurrent Status: ' + emoji.util.disabler + emoji.util.enabled,
        inline: true
      })
      .setFooter({
        text: 'To disable it, use ' + prefix + 'antinuke antichannel create disable'
      });

    const antichannelcreateon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Channel Create has been successfully enabled.\nCurrent Status: ' + emoji.util.disabler + emoji.util.enabled,
        inline: true
      })
      .setFooter({
        text: 'To disable it, use ' + prefix + 'antinuke antichannel create disable'
      });

    const antichannelcreatealreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Oops! It seems that Anti Channel Create is already disabled on your server.\nCurrent Status: ' + emoji.util.disabled + emoji.util.enabler,
        inline: true
      })
      .setFooter({
        text: 'To enable it, use ' + prefix + 'antinuke antichannel create enable'
      });

    const antichannelcreateoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Channel Create has been successfully disabled.\nCurrent Status: ' + emoji.util.disabled + emoji.util.enabler,
        inline: true
      })
      .setFooter({
        text: 'To enable it, use ' + prefix + 'antinuke antichannel create enable'
      });

    const antichanneldeletealreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Oops! It seems that Anti Channel Delete is already enabled on your server.\nCurrent Status: ' + emoji.util.disabler + emoji.util.enabled,
        inline: true
      })
      .setFooter({
        text: 'To disable it, use ' + prefix + 'antinuke antichannel delete disable'
      });

    const antichanneldeleteon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Channel Delete has been successfully enabled.\nCurrent Status: ' + emoji.util.disabler + emoji.util.enabled,
        inline: true
      })
      .setFooter({
        text: 'To disable it, use ' + prefix + 'antinuke antichannel delete disable'
      });

    const antichanneldeletealreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Oops! It seems that Anti Channel Delete is already disabled on your server.\nCurrent Status: ' + emoji.util.disabled + emoji.util.enabler,
        inline: true
      })
      .setFooter({
        text: 'To enable it, use ' + prefix + 'antinuke antichannel delete enable'
      });

    const antichanneldeleteoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Channel Delete has been successfully disabled.\nCurrent Status: ' + emoji.util.disabled + emoji.util.enabler,
        inline: true
      })
      .setFooter({
        text: 'To enable it, use ' + prefix + 'antinuke antichannel delete enable'
      });

    const antichannelupdatealreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Oops! It seems that Anti Channel Update is already enabled on your server.\nCurrent Status: ' + emoji.util.disabler + emoji.util.enabled,
        inline: true
      })
      .setFooter({
        text: 'To disable it, use ' + prefix + 'antinuke antichannel update disable'
      });

    const antichannelupdateon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Channel Update has been successfully enabled.\nCurrent Status: ' + emoji.util.disabler + emoji.util.enabled,
        inline: true
      })
      .setFooter({
        text: 'To disable it, use ' + prefix + 'antinuke antichannel update disable'
      });

    const antichannelupdatealreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Oops! It seems that Anti Channel Update is already disabled on your server.\nCurrent Status: ' + emoji.util.disabled + emoji.util.enabler,
        inline: true
      })
      .setFooter({
        text: 'To enable it, use ' + prefix + 'antinuke antichannel update enable'
      });

    const antichannelupdateoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Anti Channel Update has been successfully disabled.\nCurrent Status: ' + emoji.util.disabled + emoji.util.enabler,
        inline: true
      })
      .setFooter({
        text: 'To enable it, use ' + prefix + 'antinuke antichannel update enable'
      });

    const antirolecreatealreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Ohh uh! Looks like your server has already enabled Anti Role Create.\nCurrent Status: ' + emoji.util.disabler + emoji.util.enabled,
        inline: true
      })
      .setFooter({
        text: 'To disable it, use ' + prefix + 'antinuke antirole create disable'
      });

    const antirolecreateon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Successfully enabled Anti Role Create.\nCurrent Status: ' + emoji.util.disabler + emoji.util.enabled,
        inline: true
      })
      .setFooter({
        text: 'To disable it, use ' + prefix + 'antinuke antirole create disable'
      });

    const antirolecreatealreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Ohh uh! Looks like your server has already disabled Anti Role Create.\nCurrent Status: ' + emoji.util.disabled + emoji.util.enabler,
        inline: true
      })
      .setFooter({
        text: 'To enable it, use ' + prefix + 'antinuke antirole create enable'
      });

    const antirolecreateoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: 'Successfully disabled Anti Role Create.\nCurrent Status: ' + emoji.util.disabled + emoji.util.enabler,
        inline: true
      })
      .setFooter({
        text: 'To enable it, use ' + prefix + 'antinuke antirole create enable'
      });

    const antiroledeletealreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already enabled Anti Role Delete.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antirole delete disable`
      });

    const antiroledeleteon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully enabled Anti Role Delete.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antirole delete disable`
      });

    const antiroledeletealreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already disabled Anti Role Delete.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antirole delete enable`
      });

    const antiroledeleteoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully disabled Anti Role Delete.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antirole delete enable`
      });

    const antiroleupdatealreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already enabled Anti Role Update.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antirole update disable`
      });

    const antiroleupdateon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully enabled Anti Role Update.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antirole update disable`
      });

    const antiroleupdatealreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already disabled Anti Role Update.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antirole update enable`
      });

    const antiroleupdateoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully disabled Anti Role Update.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antirole update enable`
      });

    const antiwebhookcreatealreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already enabled Anti Webhook Create.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antiwebhook create disable`
      });

    const antiwebhookcreateon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully enabled Anti Webhook Create.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antiwebhook create disable`
      });

    const antiwebhookcreatealreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already disabled Anti Webhook Create.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antiwebhook create enable`
      });

    const antiwebhookcreateoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully disabled Anti Webhook Create.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antiwebhook create enable`
      });

    const antiwebhookdeletealreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already enabled Anti Webhook Delete.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antiwebhook delete disable`
      });

    const antiwebhookdeleteon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully enabled Anti Webhook Delete.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antiwebhook delete disable`
      });

    const antiwebhookdeletealreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already disabled Anti Webhook Delete.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antiwebhook delete enable`
      });

    const antiwebhookdeleteoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully disabled Anti Webhook Delete.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antiwebhook delete enable`
      });

    const antiwebhookupdatealreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already enabled Anti Webhook Update.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antiwebhook update disable`
      });

    const antiwebhookupdateon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully enabled Anti Webhook Update.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antiwebhook update disable`
      });

    const antiwebhookupdatealreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already disabled Anti Webhook Update.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antiwebhook update enable`
      });

    const antiwebhookupdateoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully disabled Anti Webhook Update.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antiwebhook update enable`
      });

    const antiemojicreatealreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already enabled Anti Emoji Create.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antiemoji create disable`
      });

    const antiemojicreateon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully enabled Anti Emoji Create.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antiemoji create disable`
      });

    const antiemojicreatealreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already disabled Anti Emoji Create.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antiemoji create enable`
      });

    const antiemojicreateoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully disabled Anti Emoji Create.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antiemoji create enable`
      });

    const antiemojideletealreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already enabled Anti Emoji Delete.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antiemoji delete disable`
      });

    const antiemojideleteon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully enabled Anti Emoji Delete.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antiemoji delete disable`
      });

    const antiemojideletealreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already disabled Anti Emoji Delete.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antiemoji delete enable`
      });

    const antiemojideleteoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully disabled Anti Emoji Delete.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antiemoji delete enable`
      });

    const antiemojiupdatealreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already enabled Anti Emoji Update.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antiemoji update disable`
      });

    const antiemojiupdateon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully enabled Anti Emoji Update.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antiemoji update disable`
      });

    const antiemojiupdatealreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already disabled Anti Emoji Update.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antiemoji update enable`
      });

    const antiemojiupdateoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully disabled Anti Emoji Update.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antiemoji update enable`
      });

    const antistickercreatealreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already enabled Anti Sticker Create.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antisticker create disable`
      });

    const antistickercreateon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully enabled Anti Sticker Create.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antisticker create disable`
      });

    const antistickercreatealreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already disabled Anti Sticker Create.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antisticker create enable`
      });

    const antistickercreateoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully disabled Anti Sticker Create.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antisticker create enable`
      });

    const antistickerdeletealreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already enabled Anti Sticker Delete.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antisticker delete disable`
      });

    const antistickerdeleteon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully enabled Anti Sticker Delete.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antisticker delete disable`
      });

    const antistickerdeletealreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already disabled Anti Sticker Delete.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antisticker delete enable`
      });

    const antistickerdeleteoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully disabled Anti Sticker Delete.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antisticker delete enable`
      });

    const antistickerupdatealreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already enabled Anti Sticker Update.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antisticker update disable`
      });

    const antistickerupdateon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully enabled Anti Sticker Update.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antisticker update disable`
      });

    const antistickerupdatealreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already disabled Anti Sticker Update.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antisticker update enable`
      });

    const antistickerupdateoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully disabled Anti Sticker Update.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antisticker update enable`
      });

    const antiprunealreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already enabled Anti Prune.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antiprune disable`
      });

    const antipruneon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully enabled Anti Prune.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke antiprune disable`
      });

    const antiprunealreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already disabled Anti Prune.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antiprune enable`
      });

    const antipruneoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully disabled Anti Prune.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke antiprune enable`
      });

    const autorecoveryalreadyon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already enabled Auto Recovery.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke autorecovery disable`
      });

    const autorecoveryon = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully Enabled Auto Recovery.\nCurrent Status: ${emoji.util.disabler}${emoji.util.enabled}`,
        inline: true
      })
      .setFooter({
        text: `To disable it, use ${prefix}antinuke autorecovery disable`
      });

    const autorecoveryalreadyoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Ohh uh! Looks like your server has already disabled Auto Recovery.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke autorecovery enable`
      });

    const autorecoveryoff = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .addFields({
        name: 'Security Settings',
        value: `Successfully disabled Auto Recovery.\nCurrent Status: ${emoji.util.disabled}${emoji.util.enabler}`,
        inline: true
      })
      .setFooter({
        text: `To enable it, use ${prefix}antinuke autorecovery enable`
      });

    const onkrle = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL()
      })
      .setDescription('Enable Antinuke First to use this Command.');

    const antiguidepg1 = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: 'Antinuke (33)',
        iconURL: client.user.displayAvatarURL(),
      })
      .addFields(
        { name: `${emoji.util.arrow} \`${prefix}antinuke\``, value: 'Access the Antinuke command.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke guide\``, value: 'View the Antinuke Help Menu.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke enable\``, value: 'Enable the server\'s security system.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke disable\``, value: 'Disable the server\'s security system.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke config\``, value: 'Retrieve details about the security settings.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke antiban enable/disable\``, value: 'Toggle Anti Ban.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke antikick enable/disable\``, value: 'Toggle Anti Kick.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke antibot enable/disable\``, value: 'Toggle Anti Bot.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke antiunban enable/disable\``, value: 'Toggle Anti Unban.', inline: false }
      )
      .setFooter({
        text: `${client.user.username} • Page 1/4`,
        iconURL: client.user.displayAvatarURL(),
      });

    const antiguidepg2 = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: 'Antinuke (33)',
        iconURL: client.user.displayAvatarURL(),
      })
      .addFields(
        { name: `${emoji.util.arrow} \`${prefix}antinuke antiguild update enable/disable\``, value: 'Toggle Anti Guild Update.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke antimember update enable/disable\``, value: 'Toggle Anti Member Update.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke antirole create enable/disable\``, value: 'Toggle Anti Role Create.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke antirole delete enable/disable\``, value: 'Toggle Anti Role Delete.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke antirole update enable/disable\``, value: 'Toggle Anti Role Update.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke antichannel create enable/disable\``, value: 'Toggle Anti Channel Create.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke antichannel delete enable/disable\``, value: 'Toggle Anti Channel Delete.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke antichannel update enable/disable\``, value: 'Toggle Anti Channel Update.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke antiwebhook create enable/disable\``, value: 'Toggle Anti Webhook Create.', inline: false }
      )
      .setFooter({
        text: `${client.user.username} • Page 2/4`,
        iconURL: client.user.displayAvatarURL(),
      });

    const antiguidepg3 = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: 'Antinuke (33)',
        iconURL: client.user.displayAvatarURL(),
      })
      .addFields(
        { name: `${emoji.util.arrow} \`${prefix}antinuke antiwebhook delete enable/disable\``, value: 'Toggle Anti Webhook Delete.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke antiwebhook update enable/disable\``, value: 'Toggle Anti Webhook Update.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke antiemoji create enable/disable\``, value: 'Toggle Anti Emoji Create.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke antiemoji delete enable/disable\``, value: 'Toggle Anti Emoji Delete.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke antiemoji update enable/disable\``, value: 'Toggle Anti Emoji Update.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke antisticker create enable/disable\``, value: 'Toggle Anti Sticker Create.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antisticker delete enable/disable\``, value: 'Toggle Anti Sticker Delete.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antisticker update enable/disable\``, value: 'Toggle Anti Sticker Update.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antiprune enable/disable\``, value: 'Toggle Anti Prune.', inline: false }
      )
      .setFooter({
        text: `${client.user.username} • Page 3/4`,
        iconURL: client.user.displayAvatarURL(),
      });

    const antiguidepg4 = new EmbedBuilder()
      .setColor(client.color)
      .setThumbnail(client.user.displayAvatarURL())
      .setAuthor({
        name: 'Antinuke (33)',
        iconURL: client.user.displayAvatarURL(),
      })
      .addFields(
        { name: `${emoji.util.arrow} \`${prefix}antinuke autorecovery enable/disable\``, value: 'Toggle Auto Recovery.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke reset\``, value: 'Reset all Antinuke Settings.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke whitelist user <user>\``, value: 'Add/Remove a user from whitelisted users in the server.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke whitelist reset\``, value: 'Remove all users/roles from whitelisted users/roles in the server.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke whitelist show\``, value: 'View a list of whitelisted users/roles in the server.', inline: false },
        { name: `${emoji.util.arrow} \`${prefix}antinuke features\``, value: 'Display all Antinuke features.', inline: false }
      )
      .setFooter({
        text: `${client.user.username} • Page 4/4`,
        iconURL: client.user.displayAvatarURL(),
      });


    if (args[0] === 'whitelist' && args[1] === 'add') {

      if (!isActivatedAlready) {
        return message.channel.send({ embeds: [onkrle] });
      } else {
        await client.db.get(`${message.guild.id}_wl`).then(async (data) => {
          if (!data) {
            await client.db.set(`${message.guild.id}_wl`, { whitelisted: [] });
            return message.channel.send({ content: `${emoji.util.cross} | Please run the whitelist command again because earlier database was not set up` });
          } else {
            if (!user || !args[2]) {
              return message.channel.send({ content: `${emoji.util.cross} | Prioritize mentioning the user or provide a valid user ID.` });
            } else {
              if (data.whitelisted.includes(ID)) {
                return message.channel.send({ content: `${emoji.util.cross} | \`${member.user.username}\` is already in the Whitelisted users.` });
              }
              if (data.whitelisted.length >= limit) {
                if (limit === 100) {
                  return message.channel.send(`${emoji.util.cross} | With our premium subscription, you can only enjoy an impressive whitelist addition limit of up to 100.`);
                } else {
                  return message.channel.send(`${emoji.util.cross} | Upgrade to our premium plan to access an enhanced whitelist addition limit of up to 100. Without premium, the maximum whitelist addition limit is restricted to 15. Unlock the potential for unlimited whitelist additions by opting for our Premium subscription.`);
                }
              } else {
                await client.db.push(`${message.guild.id}_wl.whitelisted`, ID);
                return message.channel.send({ content: `${emoji.util.tick} | Successfully added \`${member.user.username}\` to the Whitelisted users.` });
              }
            }
          }
        });
      }
    } else if (args[0] === 'whitelist' && args[1] === 'remove') {

      if (!isActivatedAlready) {
        return message.channel.send({ embeds: [onkrle] });
      } else {
        await client.db.get(`${message.guild.id}_wl`).then(async (data) => {
          if (!data) {
            await client.db.set(`${message.guild.id}_wl`, { whitelisted: [] });
            return message.channel.send({ content: `${emoji.util.cross} | Please run the whitelist command again because earlier database was not set up` });
          } else {
            if (!user || !args[2]) {
              return message.channel.send({ content: `${emoji.util.cross} | Prioritize mentioning the user or provide a valid user ID.` });
            } else {
              if (!data.whitelisted.includes(ID)) {
                return message.channel.send({ content: `${emoji.util.cross} | \`${member.user.username}\` has not been added to the Whitelisted users yet.` });
              } else {
                await client.db.pull(`${message.guild.id}_wl.whitelisted`, ID);
                return message.channel.send({ content: `${emoji.util.tick} | Successfully removed \`${member.user.username}\` from the Whitelisted users.` });
              }
            }
          }
        });
      }
    } else if (args[0] === 'wl' && args[1] === 'add') {

      if (!isActivatedAlready) {
        return message.channel.send({ embeds: [onkrle] });
      } else {
        await client.db.get(`${message.guild.id}_wl`).then(async (data) => {
          if (!data) {
            await client.db.set(`${message.guild.id}_wl`, { whitelisted: [] });
            return message.channel.send({ content: `${emoji.util.cross} | Please run the whitelist command again because earlier database was not set up` });
          } else {
            if (!user || !args[2]) {
              return message.channel.send({ content: `${emoji.util.cross} | Prioritize mentioning the user or provide a valid user ID.` });
            } else {
              if (data.whitelisted.includes(ID)) {
                return message.channel.send({ embeds: [alwlist] });
              }
              if (data.whitelisted.length >= limit) {
                if (limit === 100) {
                  return message.channel.send(`${emoji.util.cross} | With our premium subscription, you can enjoy an impressive whitelist addition limit of up to 100.`);
                } else {
                  return message.channel.send(`${emoji.util.cross} | Upgrade to our premium plan to access an enhanced whitelist addition limit of up to 100. Without premium, the maximum whitelist addition limit is restricted to 15. Unlock the potential for unlimited whitelist additions by opting for our Premium subscription.`);
                }
              } else {
                await client.db.push(`${message.guild.id}_wl.whitelisted`, ID);
                return message.channel.send({ content: `${emoji.util.tick} | Successfully added \`${member.user.username}\` to the Whitelisted users.` });
              }
            }
          }
        });
      }
    } else if (args[0] === 'wl' && args[1] === 'remove') {

      if (!isActivatedAlready) {
        return message.channel.send({ embeds: [onkrle] });
      } else {
        await client.db.get(`${message.guild.id}_wl`).then(async (data) => {
          if (!data) {
            await client.db.set(`${message.guild.id}_wl`, { whitelisted: [] });
            return message.channel.send({ content: `${emoji.util.cross} | Please run the whitelist command again because earlier database was not set up` });
          } else {
            if (!user || !args[2]) {
              return message.channel.send({ content: `${emoji.util.cross} | Prioritize mentioning the user or provide a valid user ID.` });
            } else {
              if (!data.whitelisted.includes(ID)) {
                return message.channel.send({ embeds: [nowlist] });
              } else {
                await client.db.pull(`${message.guild.id}_wl.whitelisted`, ID);
                return message.channel.send({ content: `${emoji.util.tick} | Successfully removed \`${member.user.username}\` from the Whitelisted users.` });
              }
            }
          }
        });
      }
    }

    const command = args.join(" ");

    switch (command) {
      case 'config':
      case 'show':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        } else {
          await client.db.get(`${message.guild.id}_wl`).then(async (wllisted) => {

            const settingss = new EmbedBuilder()
              .setColor(client.color)
              .setThumbnail(client.user.displayAvatarURL())
              .setAuthor({
                name: 'Antinuke Events Settings',
                iconURL: client.user.displayAvatarURL()
              })
              .setDescription(`${antiwizz.join("\n")}\n\nWhitelisted Users: ${wllisted.whitelisted.length || 0}`)
              .addFields(
                {
                  name: 'Other Settings',
                  value: `To toggle any event, type ${prefix}antinuke guide.\nAvailable Punishment: Ban (This is a fixed option; ensure to whitelist trusted individuals.)`
                }
              )
              .setFooter({
                text: `Thanks For Selecting ${client.user.username}`,
                iconURL: client.user.displayAvatarURL()
              });
            return message.channel.send({ embeds: [settingss] });
          });
        }
        break;

      case 'features':
        return message.channel.send({ embeds: [features] });

      case 'enable':
      case 'on':
        if (isActivatedAlready) {
          return message.channel.send({ embeds: [eeeee] });
        } else if (premium.active !== true) {
          await Promise.all([
            client.db.set(`${message.guild.id}_antinuke`, true),
            client.db.set(`${message.guild.id}_antiban`, true),
            client.db.set(`${message.guild.id}_antikick`, true),
            client.db.set(`${message.guild.id}_antibot`, true),
            client.db.set(`${message.guild.id}_antiunban`, true),
            client.db.set(`${message.guild.id}_antiguildupdate`, true),
            client.db.set(`${message.guild.id}_antimemberupdate`, true),
            client.db.set(`${message.guild.id}_antichannelcreate`, true),
            client.db.set(`${message.guild.id}_antichanneldelete`, true),
            client.db.set(`${message.guild.id}_antichannelupdate`, true),
            client.db.set(`${message.guild.id}_antirolecreate`, true),
            client.db.set(`${message.guild.id}_antiroledelete`, true),
            client.db.set(`${message.guild.id}_antiroleupdate`, true),
            client.db.set(`${message.guild.id}_antiwebhookcreate`, true),
            client.db.set(`${message.guild.id}_antiwebhookdelete`, true),
            client.db.set(`${message.guild.id}_antiwebhookupdate`, true),
            client.db.set(`${message.guild.id}_antiemojicreate`, true),
            client.db.set(`${message.guild.id}_antiemojidelete`, true),
            client.db.set(`${message.guild.id}_antiemojiupdate`, true),
            client.db.set(`${message.guild.id}_antistickercreate`, true),
            client.db.set(`${message.guild.id}_antistickerdelete`, true),
            client.db.set(`${message.guild.id}_antistickerupdate`, true),
            client.db.set(`${message.guild.id}_antiprune`, false),
            client.db.set(`${message.guild.id}_autorecovery`, false),
            client.db.set(`${message.guild.id}_wl`, { whitelisted: [] })
          ]);
          return message.channel.send({ embeds: [eeee] });
        } else {
          await Promise.all([
            client.db.set(`${message.guild.id}_antinuke`, true),
            client.db.set(`${message.guild.id}_antiban`, true),
            client.db.set(`${message.guild.id}_antikick`, true),
            client.db.set(`${message.guild.id}_antibot`, true),
            client.db.set(`${message.guild.id}_antiunban`, true),
            client.db.set(`${message.guild.id}_antiguildupdate`, true),
            client.db.set(`${message.guild.id}_antimemberupdate`, true),
            client.db.set(`${message.guild.id}_antichannelcreate`, true),
            client.db.set(`${message.guild.id}_antichanneldelete`, true),
            client.db.set(`${message.guild.id}_antichannelupdate`, true),
            client.db.set(`${message.guild.id}_antirolecreate`, true),
            client.db.set(`${message.guild.id}_antiroledelete`, true),
            client.db.set(`${message.guild.id}_antiroleupdate`, true),
            client.db.set(`${message.guild.id}_antiwebhookcreate`, true),
            client.db.set(`${message.guild.id}_antiwebhookdelete`, true),
            client.db.set(`${message.guild.id}_antiwebhookupdate`, true),
            client.db.set(`${message.guild.id}_antiemojicreate`, true),
            client.db.set(`${message.guild.id}_antiemojidelete`, true),
            client.db.set(`${message.guild.id}_antiemojiupdate`, true),
            client.db.set(`${message.guild.id}_antistickercreate`, true),
            client.db.set(`${message.guild.id}_antistickerdelete`, true),
            client.db.set(`${message.guild.id}_antistickerupdate`, true),
            client.db.set(`${message.guild.id}_antiprune`, true),
            client.db.set(`${message.guild.id}_autorecovery`, true),
            client.db.set(`${message.guild.id}_wl`, { whitelisted: [] })
          ]);
          return message.channel.send({ embeds: [eeee] });
        }

      case 'disable':
      case 'off':
      case 'reset':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [ddddd] });
        } else {
          await Promise.all([
            client.db.delete(`${message.guild.id}_antinuke`),
            client.db.delete(`${message.guild.id}_antiban`),
            client.db.delete(`${message.guild.id}_antikick`),
            client.db.delete(`${message.guild.id}_antibot`),
            client.db.delete(`${message.guild.id}_antiunban`),
            client.db.delete(`${message.guild.id}_antiguildupdate`),
            client.db.delete(`${message.guild.id}_antimemberupdate`),
            client.db.delete(`${message.guild.id}_antichannelcreate`),
            client.db.delete(`${message.guild.id}_antichanneldelete`),
            client.db.delete(`${message.guild.id}_antichannelupdate`),
            client.db.delete(`${message.guild.id}_antirolecreate`),
            client.db.delete(`${message.guild.id}_antiroledelete`),
            client.db.delete(`${message.guild.id}_antiroleupdate`),
            client.db.delete(`${message.guild.id}_antiwebhookcreate`),
            client.db.delete(`${message.guild.id}_antiwebhookdelete`),
            client.db.delete(`${message.guild.id}_antiwebhookupdate`),
            client.db.delete(`${message.guild.id}_antiemojicreate`),
            client.db.delete(`${message.guild.id}_antiemojidelete`),
            client.db.delete(`${message.guild.id}_antiemojiupdate`),
            client.db.delete(`${message.guild.id}_antistickercreate`),
            client.db.delete(`${message.guild.id}_antistickerdelete`),
            client.db.delete(`${message.guild.id}_antistickerupdate`),
            client.db.delete(`${message.guild.id}_antiprune`),
            client.db.delete(`${message.guild.id}_autorecovery`),
            client.db.set(`${message.guild.id}_wl`, { whitelisted: [] })
          ]);
          return message.channel.send({ embeds: [dddd] });
        }

      case 'antiban enable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antiban) {
          return message.channel.send({ embeds: [antibanalreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antiban`, true);
          return message.channel.send({ embeds: [antibanon] });
        }

      case 'antiban disable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antiban) {
          return message.channel.send({ embeds: [antibanalreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antiban`, true);
          return message.channel.send({ embeds: [antibanoff] });
        }

      case 'antikick enable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antikick) {
          return message.channel.send({ embeds: [antikickalreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antikick`, true);
          return message.channel.send({ embeds: [antikickon] });
        }

      case 'antikick disable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antikick) {
          return message.channel.send({ embeds: [antikickalreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antikick`, true);
          return message.channel.send({ embeds: [antikickoff] });
        }

      case 'antibot enable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antibot) {
          return message.channel.send({ embeds: [antibotalreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antibot`, true);
          return message.channel.send({ embeds: [antiboton] });
        }

      case 'antibot disable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antibot) {
          return message.channel.send({ embeds: [antibotalreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antibot`, true);
          return message.channel.send({ embeds: [antibotoff] });
        }

      case 'antiunban enable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antiunban) {
          return message.channel.send({ embeds: [antiunbanalreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antiunban`, true);
          return message.channel.send({ embeds: [antiunbanon] });
        }

      case 'antiunban disable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antiunban) {
          return message.channel.send({ embeds: [antiunbanalreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antiunban`, true);
          return message.channel.send({ embeds: [antiunbanoff] });
        }

      case 'antiguild update enable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antiguildup) {
          return message.channel.send({ embeds: [antiguildupalreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antiguildupdate`, true);
          return message.channel.send({ embeds: [antiguildupon] });
        }

      case 'antiguild update disable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antiguildup) {
          return message.channel.send({ embeds: [antiguildupalreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antiguildupdate`, true);
          return message.channel.send({ embeds: [antiguildupoff] });
        }

      case 'antimember update enable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antimemberup) {
          return message.channel.send({ embeds: [antimemberupalreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antimemberupdate`, true);
          return message.channel.send({ embeds: [antimemberupon] });
        }

      case 'antimember update disable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antimemberup) {
          return message.channel.send({ embeds: [antimemberupalreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antimemberupdate`, true);
          return message.channel.send({ embeds: [antimemberupoff] });
        }

      case 'antichannel create enable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antichannelcreate) {
          return message.channel.send({ embeds: [antichannelcreatealreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antichannelcreate`, true);
          return message.channel.send({ embeds: [antichannelcreateon] });
        }

      case 'antichannel create disable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antichannelcreate) {
          return message.channel.send({ embeds: [antichannelcreatealreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antichannelcreate`, true);
          return message.channel.send({ embeds: [antichannelcreateoff] });
        }

      case 'antichannel delete enable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antichanneldelete) {
          return message.channel.send({ embeds: [antichanneldeletealreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antichanneldelete`, true);
          return message.channel.send({ embeds: [antichanneldeleteon] });
        }

      case 'antichannel delete disable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antichanneldelete) {
          return message.channel.send({ embeds: [antichanneldeletealreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antichanneldelete`, true);
          return message.channel.send({ embeds: [antichanneldeleteoff] });
        }

      case 'antichannel update enable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antichannelupdate) {
          return message.channel.send({ embeds: [antichannelupdatealreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antichannelupdate`, true);
          return message.channel.send({ embeds: [antichannelupdateon] });
        }

      case 'antichannel update disable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antichannelupdate) {
          return message.channel.send({ embeds: [antichannelupdatealreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antichannelupdate`, true);
          return message.channel.send({ embeds: [antichannelupdateoff] });
        }

      case 'antirole create enable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antirolecreate) {
          return message.channel.send({ embeds: [antirolecreatealreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antirolecreate`, true);
          return message.channel.send({ embeds: [antirolecreateon] });
        }

      case 'antirole create disable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antirolecreate) {
          return message.channel.send({ embeds: [antirolecreatealreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antirolecreate`, true);
          return message.channel.send({ embeds: [antirolecreateoff] });
        }

      case 'antirole delete enable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antiroledelete) {
          return message.channel.send({ embeds: [antiroledeletealreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antiroledelete`, true);
          return message.channel.send({ embeds: [antiroledeleteon] });
        }

      case 'antirole delete disable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antiroledelete) {
          return message.channel.send({ embeds: [antiroledeletealreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antiroledelete`, true);
          return message.channel.send({ embeds: [antiroledeleteoff] });
        }

      case 'antirole update enable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antiroleupdate) {
          return message.channel.send({ embeds: [antiroleupdatealreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antiroleupdate`, true);
          return message.channel.send({ embeds: [antiroleupdateon] });
        }

      case 'antirole update disable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antiroleupdate) {
          return message.channel.send({ embeds: [antiroleupdatealreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antiroleupdate`, true);
          return message.channel.send({ embeds: [antiroleupdateoff] });
        }

      case 'antiwebhook create enable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antiwebhookcreate) {
          return message.channel.send({ embeds: [antiwebhookcreatealreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antiwebhookcreate`, true);
          return message.channel.send({ embeds: [antiwebhookcreateon] });
        }

      case 'antiwebhook create disable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antiwebhookcreate) {
          return message.channel.send({ embeds: [antiwebhookcreatealreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antiwebhookcreate`, true);
          return message.channel.send({ embeds: [antiwebhookcreateoff] });
        }

      case 'antiwebhook delete enable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antiwebhookdelete) {
          return message.channel.send({ embeds: [antiwebhookdeletealreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antiwebhookdelete`, true);
          return message.channel.send({ embeds: [antiwebhookdeleteon] });
        }

      case 'antiwebhook delete disable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antiwebhookdelete) {
          return message.channel.send({ embeds: [antiwebhookdeletealreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antiwebhookdelete`, true);
          return message.channel.send({ embeds: [antiwebhookdeleteoff] });
        }

      case 'antiwebhook update enable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antiwebhookupdate) {
          return message.channel.send({ embeds: [antiwebhookupdatealreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antiwebhookupdate`, true);
          return message.channel.send({ embeds: [antiwebhookupdateon] });
        }

      case 'antiwebhook update disable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antiwebhookupdate) {
          return message.channel.send({ embeds: [antiwebhookupdatealreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antiwebhookupdate`, true);
          return message.channel.send({ embeds: [antiwebhookupdateoff] });
        }

      case 'antiemoji create enable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antiemojicreate) {
          return message.channel.send({ embeds: [antiemojicreatealreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antiemojicreate`, true);
          return message.channel.send({ embeds: [antiemojicreateon] });
        }

      case 'antiemoji create disable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antiemojicreate) {
          return message.channel.send({ embeds: [antiemojicreatealreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antiemojicreate`, true);
          return message.channel.send({ embeds: [antiemojicreateoff] });
        }

      case 'antiemoji delete enable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antiemojidelete) {
          return message.channel.send({ embeds: [antiemojideletealreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antiemojidelete`, true);
          return message.channel.send({ embeds: [antiemojideleteon] });
        }

      case 'antiemoji delete disable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antiemojidelete) {
          return message.channel.send({ embeds: [antiemojideletealreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antiemojidelete`, true);
          return message.channel.send({ embeds: [antiemojideleteoff] });
        }

      case 'antiemoji update enable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antiemojiupdate) {
          return message.channel.send({ embeds: [antiemojiupdatealreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antiemojiupdate`, true);
          return message.channel.send({ embeds: [antiemojiupdateon] });
        }

      case 'antiemoji update disable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antiemojiupdate) {
          return message.channel.send({ embeds: [antiemojiupdatealreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antiemojiupdate`, true);
          return message.channel.send({ embeds: [antiemojiupdateoff] });
        }

      case 'antisticker create enable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antistickercreate) {
          return message.channel.send({ embeds: [antistickercreatealreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antistickercreate`, true);
          return message.channel.send({ embeds: [antistickercreateon] });
        }

      case 'antisticker create disable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antistickercreate) {
          return message.channel.send({ embeds: [antistickercreatealreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antistickercreate`, true);
          return message.channel.send({ embeds: [antistickercreateoff] });
        }

      case 'antisticker delete enable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antistickerdelete) {
          return message.channel.send({ embeds: [antistickerdeletealreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antistickerdelete`, true);
          return message.channel.send({ embeds: [antistickerdeleteon] });
        }

      case 'antisticker delete disable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antistickerdelete) {
          return message.channel.send({ embeds: [antistickerdeletealreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antistickerdelete`, true);
          return message.channel.send({ embeds: [antistickerdeleteoff] });
        }

      case 'antisticker update enable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antistickerupdate) {
          return message.channel.send({ embeds: [antistickerupdatealreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antistickerupdate`, true);
          return message.channel.send({ embeds: [antistickerupdateon] });
        }

      case 'antisticker update disable':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antistickerupdate) {
          return message.channel.send({ embeds: [antistickerupdatealreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antistickerupdate`, true);
          return message.channel.send({ embeds: [antistickerupdateoff] });
        }

      case 'antiprune enable':
        if (premium.active !== true) {
          return message.channel.send(`Please buy premium to use this command! use ${prefix}premium purchase`)
        }
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (antiprune) {
          return message.channel.send({ embeds: [antiprunealreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_antiprune`, true);
          return message.channel.send({ embeds: [antipruneon] });
        }

      case 'antiprune disable':
        if (premium.active !== true) {
          return message.channel.send(`Please buy premium to use this command! use ${prefix}premium purchase`)
        }
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!antiprune) {
          return message.channel.send({ embeds: [antiprunealreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_antiprune`, true);
          return message.channel.send({ embeds: [antipruneoff] });
        }

      case 'autorecovery enable':
        if (premium.active !== true) {
          return message.channel.send(`Please buy premium to use this command! use ${prefix}premium purchase`)
        }
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (autorecovery) {
          return message.channel.send({ embeds: [autorecoveryalreadyon] });
        } else {
          await client.db.set(`${message.guild.id}_autorecovery`, true);
          return message.channel.send({ embeds: [autorecoveryon] });
        }

      case 'autorecovery disable':
        if (premium.active !== true) {
          return message.channel.send(`Please buy premium to use this command! use ${prefix}premium purchase`)
        }
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        }
        if (!autorecovery) {
          return message.channel.send({ embeds: [autorecoveryalreadyoff] });
        } else {
          await client.db.delete(`${message.guild.id}_autorecovery`, true);
          return message.channel.send({ embeds: [autorecoveryoff] });
        }

      case 'whitelist show':
      case 'wl show':
        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        } else {
          return client.db.get(`${message.guild.id}_wl`).then(async (data) => {
            if (!data) {
              await client.db.set(`${message.guild.id}_wl`, { whitelisted: [] });
              return message.channel.send({ content: `${emoji.util.cross} | Please run the whitelist command again because earlier database was not set up` });
            } else {
              const listData = data.whitelisted;

              if (!listData || listData.length === 0) {
                return message.channel.send({ content: `${emoji.util.cross} | There are no whitelisted users in this server at the moment.` });
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

              const totalPages = Math.ceil(listData.length / 10);

              const generateEmbed = async (currentPage) => {
                const startIndex = currentPage * 10;
                const endIndex = Math.min(startIndex + 10, listData.length);
                const currentMembers = listData.slice(startIndex, endIndex);

                const fetchUserPromises = currentMembers.map(async (userId, index) => {
                  try {
                    const user = await client.users.fetch(userId);
                    if (!user) return `\`[${startIndex + index + 1}]\` | ID: [${userId}](https://discord.com/users/${userId}) | \`User Not Found\``;
                    return `\`[${startIndex + index + 1}]\` | ID: [${userId}](https://discord.com/users/${userId}) | \`${user.username}\``;
                  } catch (error) {
                    console.error(`Error fetching user ${userId}: ${error.message}`);
                    return '';
                  }
                });

                const memberList = (await Promise.all(fetchUserPromises)).join("\n");

                return memberList;
              };

              let currentPage = 0;
              const memberList = await generateEmbed(currentPage);

              const arypton = message.guild.members.cache.get(message.author.id);

              const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({
                  name: client.user.tag,
                  iconURL: client.user.displayAvatarURL()
                })
                .setTitle(`Total Whitelisted Users - Page ${currentPage + 1}/${totalPages}`)
                .setDescription(memberList)
                .setFooter({ text: `Thanks For Selecting ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })

              if (totalPages === 1) {
                pag.components.forEach((button) => {
                  button.setDisabled(true);
                });
              }

              const messageComponent = await message.channel.send({ embeds: [embed], components: [pag] });

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
                    messageComponent.delete().catch((error) => {
                      console.error("Failed to delete message:", error);
                    });
                    return;
                  }

                  const updatedEmbed = new EmbedBuilder(embed)
                    .setTitle(`Total Whitelisted Users - Page ${currentPage + 1}/${totalPages}`)
                    .setDescription(await generateEmbed(currentPage));

                  firstButton.setDisabled(currentPage === 0);
                  backButton.setDisabled(currentPage === 0);
                  nextButton.setDisabled(currentPage === totalPages - 1);
                  lastButton.setDisabled(currentPage === totalPages - 1);

                  interaction.update({ embeds: [updatedEmbed], components: [pag] });
                }
              });

              collector.on("end", () => {
                pag.components.forEach((button) => button.setDisabled(true));
                messageComponent.edit({ components: [pag] });
              });
            }
          });
        }

      case 'whitelist reset':
      case 'wl reset':

        if (!isActivatedAlready) {
          return message.channel.send({ embeds: [onkrle] });
        } else {
          return client.db.get(`${message.guild.id}_wl`).then(async (data) => {
            if (!data) {
              await client.db.set(`${message.guild.id}_wl`, { whitelisted: [] });
              return message.channel.send({ content: `${emoji.util.cross} | Please run the whitelist command again because earlier database was not set up` });
            } else {
              const users = data.whitelisted;
              if (users.length !== 0) {
                await client.db.set(`${message.guild.id}_wl`, { whitelisted: [] });
                return message.channel.send({ content: `${emoji.util.tick} | All users have been successfully removed from the whitelist.` });
              } else {
                return message.channel.send({ content: `${emoji.util.cross} | There are currently no whitelisted users in this server.` });
              }
            }
          });
        }

      default:
        if (args[0] === 'whitelist') {
          return;
        }

        if (args[0] === 'wl') {
          return;
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

        let msg = await message.channel.send({ embeds: [antiguidepg1], components: [pag] });

        const embeds = [antiguidepg1, antiguidepg2, antiguidepg3, antiguidepg4];
        const totalPages = embeds.length;
        let currentPage = 0;

        const collector = msg.createMessageComponentCollector({
          filter: (interaction) => {
            if (message.author.id === interaction.user.id) return true;
            else {
              return interaction.reply({ content: `${emoji.util.cross} | This Pagination is not for you.`, ephemeral: true });
            }
          },
          time: 60000,
        });

        const generateEmbed = () => {
          const embed = embeds[currentPage];
          embed.setFooter({ text: `${client.user.username} • Page ${currentPage + 1}/${totalPages}`, iconURL: client.user.displayAvatarURL() });
          return embed;
        };

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
              msg.edit({ components: [disabledPag] });
              return;
            }

            const updatedEmbed = generateEmbed();

            firstButton.setDisabled(currentPage === 0);
            backButton.setDisabled(currentPage === 0);
            nextButton.setDisabled(currentPage === totalPages - 1);
            lastButton.setDisabled(currentPage === totalPages - 1);

            interaction.update({ embeds: [updatedEmbed], components: [pag] });
          }
        });

        collector.on("end", () => {
          pag.components.forEach((button) => {
            button.setDisabled(true);
          });

          msg.edit({ components: [pag] });
        });
        break;
    }
  }
}
