const { Collection } = require('discord.js');
const Client = require('./base/ResistClient.js');
const config = require('./config.json');
const fs = require('fs')
const { QuickDB } = require('quick.db');
const token = config.token;
const Dokdo = require('dokdo')

const client = new Client();

const DokdoHandler = new Dokdo.Client(client, {
  aliases: ['dokdo', 'dok', 'jsk'],
  prefix: '.'
});

module.exports = client;

function setupDatabases(client) {
  client.db = new QuickDB({ filePath: './database/antinuke.sqlite' });
  client.db1 = new QuickDB({ filePath: './database/autorole.sqlite' });
  client.db2 = new QuickDB({ filePath: './database/badges.sqlite' });
  client.db3 = new QuickDB({ filePath: './database/customroles.sqlite' });
  client.db4 = new QuickDB({ filePath: './database/noprefix.sqlite' });
  client.db5 = new QuickDB({ filePath: './database/automod.sqlite' });
  client.db7 = new QuickDB({ filePath: './database/voiceroles.sqlite' });
  client.db8 = new QuickDB({ filePath: './database/guild.sqlite' });
  client.db9 = new QuickDB({ filePath: './database/welcome.sqlite' });
  client.db10 = new QuickDB({ filePath: './database/ignore.sqlite' });
  client.db11 = new QuickDB({ filePath: './database/extra.sqlite' });
  client.db12 = new QuickDB({ filePath: './database/premium.sqlite' });
  client.db13 = new QuickDB({ filePath: './database/users.sqlite' });
  client.db14 = new QuickDB({ filePath: './database/mediachannel.sqlite' });
  client.db15 = new QuickDB({ filePath: './database/nightmode.sqlite' });
}

function setupCollections(client) {
  client.commands = new Collection();
  client.aliases = new Collection();
  client.events = new Collection();
  client.slashCommands = new Collection();
  client.categories = fs.readdirSync('./commands');
}

client.on('messageCreate', async (message, args) => {
  await DokdoHandler.run(message, args)
});

function loadHandlers(client) {
  ['command', 'slashCommand'].forEach((handler) => {
    require(`./handler/${handler}`)(client);
  });
}

function loadClientAccessories(client) {
  ['clientUtils', 'clientPremium', 'clientConnection'].forEach((accessories) => {
    require(`./structures/${accessories}`)(client);
  });
}

function setupClient(client) {
  setupDatabases(client);
  setupCollections(client);
  loadHandlers(client);
  loadClientAccessories(client);
}

client.on("ready", async (client) => {
  setupClient(client);
  console.log(`Made by Arypton_xD`)
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(token);
