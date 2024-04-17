module.exports = {
    apps: [
        {
            name: 'Resist',
            script: 'shard.js',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '900M',
        },
    ],
};
