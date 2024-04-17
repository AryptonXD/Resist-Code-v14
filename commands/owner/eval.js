const { EmbedBuilder } = require("discord.js");
const { inspect } = require("util");
const { EvalAccess } = require('../../owner.json');

module.exports = {
  name: "eval",
  voteOnly: false,
  BotPerms: ['EmbedLinks'],
  run: async (client, message, args) => {
    function isBotOwner(user) {
      return EvalAccess.includes(user.id);
    }

    async function evaluateCode(code) {
      try {
        const asyncWrapper = eval(`(async () => { return ${code} })();`);
        const evaled = await asyncWrapper;
        if (typeof evaled !== "string") {
          return inspect(evaled, { depth: 0 });
        }
        return evaled;
      } catch (err) {
        return err;
      }
    }

    async function createEvalEmbed(message, code, output) {
      const embed1 = new EmbedBuilder()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
        .setDescription(`\`\`\`js\n${code}\n\`\`\``)
        .setColor(client.color);

      const embed2 = new EmbedBuilder()
        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
        .setDescription(`\`\`\`js\n${output}\n\`\`\``)
        .setColor(client.color);

      await message.channel.send({ embeds: [embed1, embed2] });
    }

    if (!isBotOwner(message.author)) {
      return message.channel.send("This command is limited to the bot owner only!");
    }

    const code = args.join(" ");
    if (!code) {
      return message.channel.send("Please provide code to evaluate.");
    }

    const output = await evaluateCode(code);
    await createEvalEmbed(message, code, output);
  },
};
