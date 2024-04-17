module.exports = {
  name: "slap",
  description: "Slaps a user",
  run: async (client, message, args) => {
    let member = message.mentions.members.first();

    if (!member) {
      return message.channel.send("You need to mention a user to slap!");
    }

    if (member.id === message.author.id) {
      return message.channel.send("Wanna slap yourself? Ouch! That's a bit extreme, don't you think?");
    }

    if (member.id === client.user.id) {
      return message.channel.send("After all the great service I've provided, you want to slap me? Rude!");
    }

    message.channel.send({ content: `${message.author.username} slapped <a:slapthatbich:1161566743395831868> ${member.user.username}, and now, ${member.user.username} is taking an unplanned vacation at the Hospital Resort! :hospital:` });
  },
};
