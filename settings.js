const prefix = process.env.prefix || '?'
const status = `${prefix}help`;

module.exports = {
  bot: {
    info: {
      prefix: '?',
      token: '',
      invLink: 'https://discord.com/api/oauth2/authorize?client_id=1133009695112708109&permissions=8&scope=bot%20applications.commands',
      privacy: 'https://github.com/AryptonXD/Resist/blob/main/ResistPrivacyPolicy.md',
      terms: 'https://github.com/AryptonXD/Resist/blob/main/ResistTermsAndConditions.md',
    },
    presence: {
      name: status,
      type: 'Listening',
      url: 'https://twitch.tv/pewdiepie'
    },
    credits: {
      developerId: '560115112078475266',
      supportServer: 'https://discord.gg/9qC6gSPj88'
    },
  }
}
