const similarSongs = require("similar-songs");
const ytdl = require("ytdl-core");
const Discord = require("discord.js");

module.exports = {
  async execute(client, guild) {
    const queue = client.queue.get(guild.id);
    queue.playing = false;
    if (queue.endReason === "seek") {
      return (queue.playing = true);
    }

    if (!queue.songLooping) {
      if (queue.looping) {
        queue.songs.push(queue.songs[0]);
      }

      queue.time = 0;
      queue.votes = 0;
      queue.voters = [];
      if (queue.endReason !== "replay") {
        if (queue.endReason === "previous")
          queue.songs.unshift(queue.prevSongs.pop());
        if (queue.endReason !== "previous")
          queue.prevSongs.push(queue.songs.shift());
        if (
          client.global.db.guilds[guild.id].autoPlay &&
          !queue.songs[0] &&
          queue.endReason !== "stop"
        ) {
          if (queue.prevSongs.length > 0)
            return findSimilar(client, queue, queue.prevSongs, guild);
        }
      }
    }
    client.funcs.play(guild, queue.songs[0], client, 0, true);
  },
};

function findSimilar(client, queue, prevSongs, guild) {
  let retries = 0;
  const query =
    prevSongs[Math.floor(Math.random() * Math.floor(prevSongs.length))];
  if (!query || !query.track) return findSimilar(client, queue, prevSongs, guild);
  similarSongs.find({
      title: query.track.name,
      artist: query.track.artists[0].name,
      limit: 10,
      lastfmAPIKey: client.config.lastfm_api_key,
      lastfmAPISecret: client.config.lastfm_secret,
      youtubeAPIKey: client.config.api_keys[(client.shard.ids / 2).toFixed() || client.config.api_key],
    },
    async function (err, songs) {
      if (err) {
        if (
          err.message ==
          'The request cannot be completed because you have exceeded your <a href="/youtube/v3/getting-started#quota">quota</a>.'
        ) {
          queue.voiceChannel.leave();
          queue.exists = false;
          client.queue.delete(guild.id);
          queue.textChannel.send(client.messages.quotaReached);
          return;
        }
        console.log(err.message);
        queue.voiceChannel.leave();
        queue.exists = false;
        client.queue.delete(guild.id);
        return queue.textChannel.send(client.messages.error);
      }
      if (songs[0]) {
        const random = Math.floor(Math.random() * Math.floor(songs.length));
        const songInfo = await ytdl.getInfo(
          `https://www.youtube.com/watch?v=${songs[random].youtubeId}`
        );
        queue.songs.push({
          title: Discord.Util.escapeMarkdown(songInfo.videoDetails.title),
          url: `https://www.youtube.com/watch?v=${songs[random].youtubeId}`,
          author: client.user,
          type: "ytdl",
          info: songInfo.videoDetails,
          track: query.track,
        });
        client.funcs.play(guild, queue.songs[0], client, 0, true);
      } else {
        if (prevSongs.length > 4 && retries < 6) {
          findSimilar(client, queue, prevSongs, guild);
          retries++;
          return;
        }
        queue.textChannel.send(client.messages.noSimilarResults);
        client.funcs.play(guild, queue.songs[0], client, 0, true);
      }
    }
  );
}