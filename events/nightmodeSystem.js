const client = require('../index.js');
const { ownerIDS } = require('../owner.json');
const { AuditLogEvent, Events } = require('discord.js');

client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {

    if (!newMember.guild.members.me.permissions.has('ViewAuditLog')) {
        return;
    }
    const auditLogs = await newMember.guild.fetchAuditLogs({ limit: 1, type: AuditLogEvent.MemberRoleUpdate });
    const logs = auditLogs.entries.first();
    if (!logs) return;

    const { executor, target } = logs;
    const extraOwner = await client.db11.get(`${newMember.guild.id}_eo.extraownerlist`) || [];
    const roleData = await client.db15.get(`${newMember.guild.id}_nightmode.nightmoderoleslist`) || [];
    const bypassData = await client.db15.get(`${newMember.guild.id}_nightmode.nightmodebypasslist`) || [];

    if (!roleData) return;

    const botHighestRolePosition = newMember.guild.members.me.roles.highest.position;

    const rolesToRemove = newMember.roles.cache.filter((role) => {
        const rolePosition = role.position;
        return (
            roleData.includes(role.id) &&
            rolePosition < botHighestRolePosition
        );
    });

    if (newMember.guild.ownerId.includes(executor.id) || ownerIDS.includes(executor.id) || extraOwner.includes(executor.id) || bypassData.includes(executor.id)) return;

    if (rolesToRemove.size > 0) {
        await newMember.roles.remove(rolesToRemove);
    }
});
