const { WebhookClient } = require('discord.js');
const client = require('../index.js');

const webhookUrl = 'https://discord.com/api/webhooks/1198228168251818064/iF7yhDPqc6SWMWPg34mE0ycephH_T8mK1reKKGdcp0sgkVnj5yR0iE0bUM3EUMnwk5ja';
const webhookClient = new WebhookClient({ url: webhookUrl });

client.on('error', (error) => {
  handleError(error);
});

process.on('uncaughtException', (error) => {
  handleError(error);
});

process.on('unhandledRejection', (reason, promise) => {
  handleError(reason);
});

async function handleError(error) {
  const errorMessage = error instanceof Error ? error.stack || error.toString() : JSON.stringify(error);
  await sendErrorMessage(errorMessage);
}

async function sendErrorMessage(errorMessage) {
  try {
    await webhookClient.send({ content: `\`\`\`js\n${errorMessage}\n\`\`\`` });
  } catch (error) {
    console.error('Failed to send error message:', error);
  }
}
