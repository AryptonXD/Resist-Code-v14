module.exports = {
  name: "ping",
  voteOnly: false,
  run: async (client, message, args) => {
    const start = Date.now();
    const [setResult, getResult, deleteResult] = await Promise.all([
      client.db4.set("latency-test", "test-value"),
      client.db4.get("latency-test"),
      client.db4.delete("latency-test"),
    ]);
    const dbLatency = Date.now() - start;
    const messageLatency = (Date.now() - message.createdTimestamp);
    const apiLatency = client.ws.ping;

    return message.channel.send({ content: `Pong🏓 Message Latency: ${messageLatency.toFixed(0)}ms | API Latency: ${apiLatency.toFixed(0)}ms | Database Latency: ${dbLatency.toFixed(2)}ms\nI'm up and running!` });
  },
};
