const { EmbedBuilder } = require("discord.js");
const moment = require("moment");
const sourcebin = require("sourcebin_js");

module.exports = {
  name: "haste",
  BotPerms: ['EmbedLinks'],
  voteOnly: false,
  run: async (client, message, args) => {
    message.delete();

    const content = args.join(" ");

    const bin = await sourcebin.create([
      {
        title: "JavaScript code",
        description: `This code was created in "${moment(message.createdAt).format("LLL")}"`,
        name: `Made By ${message.author.username}`,
        content,
        languageId: "javascript",
      },
    ]);

    const embed = new EmbedBuilder()
      .setTitle("Hastebin")
      .setColor(client.color)
      .setDescription(`Code:\n\`\`\`javascript\n${content}\n\`\`\`\n[Click Here to View](${bin.url})`)
      .addFields(
        { name: "Language", value: "JavaScript", inline: true },
        { name: "Created By", value: message.author.username, inline: true }
      )
      .setFooter({ text: "Code created" });

    message.channel.send({ embeds: [embed] });
  }
};
