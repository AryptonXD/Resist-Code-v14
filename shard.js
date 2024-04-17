const { ClusterManager, HeartbeatManager } = require('discord-hybrid-sharding');
const config = require("./config.json");

const manager = new ClusterManager(`./index.js`, {
  totalShards: 'auto',
  shardsPerClusters: 3,
  totalClusters: 'auto',
  respawn: true,
  mode: 'worker',
  token: config.token,
});

manager.spawn().catch(console.error);

manager.extend(
  new HeartbeatManager({
    interval: 2000,
    maxMissedHeartbeats: 5,
  })
);
