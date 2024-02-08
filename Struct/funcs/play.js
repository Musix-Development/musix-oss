module.exports = async function (guild, song, client, message, seek, play) {
    const Discord = require('discord.js');
    const ytdl = require('ytdl-core');
    const serverQueue = client.queue.get(guild.id);
    if (!song) {
        console.log('No song')
        serverQueue.voiceChannel.leave();
        client.queue.delete(guild.id);
        return;
    }
    const dispatcher = serverQueue.connection
        .playStream(ytdl(song.url, { filter: "audio", highWaterMark: 1 << 25 }), { seek: seek, bitrate: 1024, passes: 10, volume: 1 })
        .on("end", reason => {
            if (reason === "Stream is not generating quickly enough.") {
                console.log("Song ended");
            } else if (reason === "seek") {
                return;
            } else {
                console.log(reason);
            }
            serverQueue.playing = false;
            if (serverQueue.looping) {
                serverQueue.songs.push(serverQueue.songs[0]);
            }
            serverQueue.songs.shift();
            client.funcs.play(guild, serverQueue.songs[0], client, message);
        });
    dispatcher.setVolume(serverQueue.volume / 10);
    dispatcher.on("error", error => console.error(error));
    if (client.global.db.guilds[guild.id].startPlaying || play) {
        let data = await Promise.resolve(ytdl.getInfo(serverQueue.songs[0].url));
        let songtime = (data.length_seconds * 1000).toFixed(0);
        const embed = new Discord.RichEmbed()
            .setTitle(`:musical_note: Start playing: **${song.title}**`)
            .setDescription(`Song duration: \`${client.funcs.msToTime(songtime)}\``)
            .setColor("#b50002")
        serverQueue.textChannel.send(embed);
    }
    serverQueue.playing = true;
}
