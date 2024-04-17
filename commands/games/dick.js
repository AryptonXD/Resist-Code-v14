const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "dicksize",
  aliases: ["dick", "pp", "ppsize"],
  run: async (client, message, args) => {
    const sizes = [
      "8D",
      "8=D",
      "8==D",
      "8===D",
      "8====D",
      "8=====D",
      "8======D",
      "8=======D",
      "8========D",
      "8=========D",
      "8==========D",
      "8===========D",
      "8============D",
      "8=============D",
      "8==============D",
      "8===============D",
      "8================D",
      "8==================D",
      "8===================D"
    ];

    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;

    const result = sizes[Math.floor(Math.random() * sizes.length)];

    const embed = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
      .addFields({ name: `${member.user.username}'s pp Size Is`, value: `${result}`, inline: true })
      .setFooter({ text: `Requested by ${message.author.username}` })
      .setTimestamp();

    message.channel.send({ embeds: [embed] });
  }
};
