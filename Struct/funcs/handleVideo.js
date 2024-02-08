module.exports = async function (video, message, voiceChannel, client, playlist = false) {
    const Discord = require('discord.js');
    let song = {
        id: video.id,
        title: Discord.Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`,
        author: message.author
    }
    const serverQueue = client.queue.get(message.guild.id);
    if (!serverQueue) {
        const construct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: client.global.db.guilds[message.guild.id].defaultVolume,
            playing: false,
            paused: false,
            looping: false,
            votes: 0,
            voters: [],
            votesNeeded: null
        };
        construct.songs.push(song);
        client.queue.set(message.guild.id, construct);
        try {
            var connection = await voiceChannel.join();
            construct.connection = connection;
            client.funcs.play(message.guild, construct.songs[0], client, message, 0, true);
        } catch (error) {
            client.queue.delete(message.guild.id);
            client.channels.get(client.config.debug_channel).send("Error with connecting to voice channel: " + error);
            return message.channel.send(`:x: An error occured: ${error}`);
        }
    } else {
        serverQueue.songs.push(song);
        if (playlist) return undefined;
        return message.channel.send(`:white_check_mark: **${song.title}** has been added to the queue!`);
    }
    return undefined;
}
