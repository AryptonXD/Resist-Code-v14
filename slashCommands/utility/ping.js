const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Returns bot ping.'),
  voteOnly: false,
  async execute(client, interaction) {
    const start = Date.now();
    const [setResult, getResult, deleteResult] = await Promise.all([
      client.db4.set("latency-test", "test-value"),
      client.db4.get("latency-test"),
      client.db4.delete("latency-test"),
    ]);
    const dbLatency = Date.now() - start;
    const apiLatency = client.ws.ping;

    interaction.reply({ content: `Pong🏓 API Latency: ${apiLatency.toFixed(0)}ms | Database Latency: ${dbLatency.toFixed(2)}ms\nI'm up and running!` });
  }
};
