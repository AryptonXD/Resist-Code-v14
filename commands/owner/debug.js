const { ownerIDS } = require('../../owner.json');

module.exports = {
    name: 'debug',
    run: async (client, message, args) => {
        if (!ownerIDS.includes(message.author.id)) return;
        const commandPrompt = args[0];
        const startTime = Date.now();
        try {
            await client.commands.get(commandPrompt).run(client, message, args);
            const elapsedTime = Date.now() - startTime;
            message.channel.send(`Command \`${commandPrompt}\` took ${elapsedTime / 1000} seconds to execute.`);
        } catch (error) {
            message.channel.send(`An error occurred while executing the command \`${commandPrompt}\`: ${error.message}`);
        }
    }
};
