const { Client, Partials, ActivityType, GatewayIntentBits, Options } = require('discord.js');
const { getInfo } = require('discord-hybrid-sharding');

module.exports = class Resist extends Client {
    constructor() {
        super({
            shards: getInfo().SHARD_LIST,
            shardCount: getInfo().TOTAL_SHARDS,
            restTimeOffset: 2500,
            disableMentions: [
                "everyone",
                "here"
            ],
            debugger: true,
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildModeration,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.GuildVoiceStates,
            ],
            partials: [
                Partials.GuildMember,
                Partials.User,
                Partials.Message,
                Partials.Channel,
                Partials.Reaction,
                Partials.GuildScheduledEvent],
            allowedMentions: {
                repliedUser: true
            },
            presence: {
                activities: [{
                    name: `?help`,
                    type: ActivityType.Listening
                }],
                status: "idle",
                restRequestTimeout: 20000,
            },
            sweepers: {
                messages: { interval: 2, lifetime: 1, filter: () => message => message.id !== this.user.id }
            },
            makeCache: Options.cacheWithLimits({
                ApplicationCommandManager: 5,
                BaseGuildEmojiManager: 5,
                GuildBanManager: 0,
                GuildInviteManager: 0,
                GuildManager: Infinity,
                GuildMemberManager: {
                    maxSize: 200,
                    keepOverLimit: member => member.id === this.user.id,
                },
                GuildStickerManager: 0,
                GuildScheduledEventManager: 0,
                MessageManager: 5,
                PresenceManager: 0,
                ReactionManager: 0,
                ReactionUserManager: 0,
                StageInstanceManager: 500,
                ThreadManager: 0,
                ThreadMemberManager: 0,
            }),
        });
    }
}
