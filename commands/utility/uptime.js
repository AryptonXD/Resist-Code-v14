module.exports = {
  name: "uptime",
  aliases: ['up'],
  voteOnly: false,
  run: async (client, message, args) => {
    function formatUptime(totalSeconds) {
      const days = Math.floor(totalSeconds / 86400);
      totalSeconds %= 86400;
      const hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = Math.floor(totalSeconds % 60);

      const uptimeParts = [];

      if (days > 0) uptimeParts.push(`${days} day${days === 1 ? '' : 's'}`);
      if (hours > 0) uptimeParts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
      if (minutes > 0) uptimeParts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
      if (seconds > 0) uptimeParts.push(`${seconds} second${seconds === 1 ? '' : 's'}`);

      return uptimeParts.join(', ');
    }

    const uptimeInSeconds = Math.floor(client.uptime / 1000);
    const uptime = formatUptime(uptimeInSeconds);

    message.channel.send(`Uptime: ${uptime}`);
  },
};
