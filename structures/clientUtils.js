const { ClusterClient } = require('discord-hybrid-sharding');

module.exports = (client) => {
    client.cluster = new ClusterClient(client);
    client.color = '#262733';
    client.website = 'https://iresist.netlify.app/';
    client.email = 'krishnaupadhyay1337@gmail.com';
    client.support = 'https://dsc.gg/resisthq';
    client.sponsor = 'https://hydra-hosting.eu/';
}