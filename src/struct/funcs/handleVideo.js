const Discord = require("discord.js");
const ytdl = require("ytdl-core");

module.exports = async function (
  resource,
  msg,
  voiceChannel,
  client,
  playlist,
  type,
  spotifyTrackData
) {
  const songInfo = await ytdl.getInfo(resource).catch(err => console.log(err));
  const song = {
    title: Discord.Util.escapeMarkdown(songInfo.videoDetails.title),
    url: resource,
    author: msg.author,
    type: type,
    info: songInfo.videoDetails,
    track: spotifyTrackData
  };

  const queue = client.queue.get(msg.guild.id);

  if (queue) {
    queue.songs.push(song);
    queue.textChannel = msg.channel;
    if (playlist) return;
    let message;
    message = client.messages.songAdded.replace("%TITLE%", song.title);
    return msg.channel.send(message);
  }

  const construct = {
    textChannel: msg.channel,
    voiceChannel: voiceChannel,
    connection: null,
    songs: [],
    prevSongs: [],
    volume: client.global.db.guilds[msg.guild.id].defaultVolume,
    bass: client.global.db.guilds[msg.guild.id].bass,
    nightCore: false,
    playing: false,
    paused: false,
    looping: false,
    songLooping: false,
    votes: 0,
    voters: [],
    votesNeeded: null,
    time: 0,
    endReason: null,
    exists: true
  };

  construct.songs.push(song);

  client.queue.set(msg.guild.id, construct);

  try {
    const connection = await voiceChannel.join();
    construct.connection = connection;
    require("../../events/connectionEvents/handler")(client, connection);
    client.funcs.play(msg.guild, construct.songs[0], client, 0, true);
  } catch (error) {
    client.queue.delete(msg.guild.id);
    console.log(error);
    return msg.channel.send(client.messages.error + error);
  }
  return;
};