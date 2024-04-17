const { EmbedBuilder } = require('discord.js');
const Settings = require('../../settings.js');
const emoji = require('../../emoji.js');

module.exports = {
  name: 'kick',
  aliases: [`nikalchal`, `outhoja`, `bhagyahase`, `hogyatera`],
  UserPerms: ['KickMembers'],
  BotPerms: ['KickMembers'],
  aboveRole: true,
  run: async (client, message, args) => {
    const prefix = await client.db8.get(`${message.guild.id}_prefix`) || Settings.bot.info.prefix;

    async function kickUser(message, client, args) {
      const user = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null);

      if (!args[0]) {
        const errorEmbed = new EmbedBuilder()
          .setColor('ff0000')
          .setDescription(`\`\`\`diff
- [] = optional argument
- <> = required argument
- Do NOT type these when using commands!
\`\`\`
> Somebody is breaking rules again and again | kick them from the server as punishment`)
          .addFields(
            { name: 'Aliases', value: '`nikalchal` | `outhoja` | `bhagyahase` | `hogyatera`', inline: false },
            { name: 'Usage', value: `\`${prefix}kick <member> [reason=None]\``, inline: false }
          );

        return message.channel.send({ embeds: [errorEmbed] });
      }

      const targetMember = message.guild.members.cache.get(user.id);
      if (!targetMember) {
        return message.channel.send(`${emoji.util.cross} | The provided user is not a member of this server.`);
      }

      if (targetMember === message.author.id) {
        return message.channel.send(`${emoji.util.cross} | Please be advised that it is not possible to self-ban as per the established policies.`);
      }

      if (targetMember === client.user.id) {
        return message.channel.send(`${emoji.util.cross} | You can't kick the bot itself.`);
      }

      if (!targetMember.kickable || targetMember.roles.highest.comparePositionTo(message.guild.members.me.roles.highest) > 0) {
        return message.channel.send(`${emoji.util.cross} | I cannot kick this user. They may have a higher role than me or I do not have sufficient permissions.`);
      }

      args.shift();
      const reason = args.join(' ');

      await targetMember.kick({ reason });
      await message.channel.send({ content: `${emoji.util.tick} | Successfully kicked \`${user.username}\` | Reason: ${reason || 'Not provided.'}` });
      await targetMember.send(`You have been kicked from **${message.guild.name}** by \`${message.author.username}\`. | Reason: ${reason || 'Not provided.'}`);
    }

    await kickUser(message, client, args);
  }
};
