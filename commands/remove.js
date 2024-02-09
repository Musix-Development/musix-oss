const { PermissionFlagsBits } = require("discord.js");

module.exports = {
    name: 'remove',
    description: 'Remove command.',
    alias: 'rm',
    cooldown: 5,
    execute(message, args, client, prefix) {
        const voiceChannel = message.member.voice.channel;
        const serverQueue = client.queue.get(message.guild.id);
        const permissions = message.channel.permissionsFor(message.author);
        if (!serverQueue) return message.channel.send(':x: There is nothing playing.');
        if (!serverQueue.playing) return message.channel.send(':x: There is nothing playing');
        if (!args[1]) return message.channel.send(':x: Please provide a song position in queue for me to remove!');
        const pos = parseInt(args[1]);
        if (isNaN(pos)) return message.channel.send(':x: You need to enter a number!');
        if (pos === 0) return message.channel.send(':x: You can not remove the currently playing song!');
        if (pos > serverQueue.songs.size) return message.channel.send(`:x: There is only ${serverQueue.songs.size} amount of songs in the queue!`);
        if (voiceChannel !== serverQueue.voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in the same voice channel as Musix to remove songs!');
        if (client.global.db.guilds[message.guild.id].dj) {
            if (serverQueue.songs[pos].author !== message.author) {
                if (!message.member.roles.cache.has(client.global.db.guilds[message.guild.id].djrole)) return message.channel.send(':x: You need the `DJ` role to remove songs queue by others!');
            }
        } else if (!permissions.has(PermissionFlagsBits.ManageMessages) && serverQueue.songs[pos].author !== message.author) return message.channel.send(':x: You need the `MANAGE_MESSAGES` permission to remove songs queued by others!');
        message.channel.send(`🗑️ removed \`${serverQueue.songs[pos].title}\` from the queue!`);
        return serverQueue.songs.splice(pos, 1);
    }
};
