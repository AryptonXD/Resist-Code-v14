const { WebhookClient } = require('discord.js');
const cron = require('node-cron');
const PremiumWebhook = new WebhookClient({ url: `https://discord.com/api/webhooks/1200060260518477864/SiHm2Dfr0OttIFedse09k45RUiZmoGee4-t2wblY2Ofpqb7AgVux9dkrfhoGyTJ7YiZ-` })

async function updateGuildPremiumStatus(client) {
    try {
        const allGuilds = client.guilds.cache.values();

        for (const guild of allGuilds) {
            const guildPremiumData = await client.db12.get(`${guild.id}_premium`);

            if (guildPremiumData && guildPremiumData.active && guildPremiumData.premiumExpiresAt <= Date.now()) {
                await client.db12.set(`${guild.id}_premium`, { active: false, premiumExpiresAt: null });
                const whitelisted = await client.db.get(`${guild.id}_wl`);
                whitelisted.whitelisted.splice(15);
                await client.db.set(`${guild.id}_wl`, whitelisted);
                await client.db.set(`${guild.id}_antiprune`, false);
                await client.db.set(`${guild.id}_autorecovery`, false);
                const autoroleData = await client.db1.get(`${guild.id}_autorole`);
                autoroleData.role.humans.splice(2);
                autoroleData.role.bots.splice(2);
                await client.db1.set(`${guild.id}_autorole`, autoroleData);
                const extraOwnerData = await client.db11.get(`${guild.id}_eo`);
                extraOwnerData.extraownerlist.splice(5);
                await client.db11.set(`${guild.id}_eo`, extraOwnerData);
                const extraAdminData = await client.db11.get(`${guild.id}_ea`);
                extraAdminData.extraadminlist.splice(10);
                await client.db11.set(`${guild.id}_ea`, extraAdminData);
                const ignoreData = await client.db10.get(`${guild.id}_ic`);
                ignoreData.ignorechannellist.splice(5);
                ignoreData.ignorebypasslist.splice(10);
                await client.db10.set(`${guild.id}_ic`, ignoreData);
                const mediaData = await client.db14.get(`${guild.id}_mediachannels`);
                mediaData.mediachannellist.splice(10);
                await client.db14.get(`${guild.id}_mediachannels`, mediaData);
                const nightmodeData = await client.db15.get(`${guild.id}_nightmode`);
                nightmodeData.nightmoderoleslist.splice(3);
                nightmodeData.nightmodebypasslist.splice(3);
                await client.db15.get(`${guild.id}_nightmode`, nightmodeData);
                PremiumWebhook.send({ content: `Guild ${guild.name} (${guild.id}) premium subscription has expired.` });
            }
        }
    } catch (error) {
        console.error('Error updating guild premium status:', error);
    }
}

module.exports = async (client) => {
    console.log('Loaded Premium Structure');
    try {
        cron.schedule('* * * * *', async () => {
            await updateGuildPremiumStatus(client);
        });
    } catch (error) {
        console.error('Error setting up cron job:', error);
    }
}