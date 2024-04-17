const fs = require('fs').promises;
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require('../config.json');
const { token, application_id } = config;
const guild = null;

module.exports = async (client) => {
  const slashCommands = await loadSlashCommands(client);
  await registerSlashCommands(slashCommands);
};

async function loadSlashCommands(client) {
  const slashCommands = [];
  let loadedCommandsCount = 0;

  try {
    const dirs = await fs.readdir('./slashCommands/');
    for (const dir of dirs) {
      const slashCommandFiles = (await fs.readdir(`./slashCommands/${dir}/`)).filter((file) => file.endsWith('.js'));

      for (const file of slashCommandFiles) {
        try {
          const slashCommand = require(`../slashCommands/${dir}/${file}`);
          slashCommands.push(slashCommand.data.toJSON());

          if (slashCommand.data.name) {
            client.slashCommands.set(slashCommand.data.name, slashCommand);
            loadedCommandsCount++;
          }
        } catch (error) {
          console.error(error);
        }
      }
    }

    return slashCommands;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function registerSlashCommands(slashCommands) {
  const rest = new REST({ version: '10' }).setToken(token);
  try {
    await rest.put(
      guild ? Routes.applicationGuildCommands(application_id, guild) : Routes.applicationCommands(application_id),
      { body: slashCommands }
    );
  } catch (error) {
    console.error(error);
  }
}
