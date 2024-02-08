module.exports = {
  name: "guildcreate",
  async execute(client, guild) {
    client.db.collection("guilds").doc(guild.id).set({
      prefix: client.config.prefix,
      defaultVolume: client.config.defaultVolume,
      permissions: client.config.permissions,
      dj: client.config.dj,
      djrole: client.config.djrole,
      startPlaying: client.config.startPlaying,
      bass: client.config.bass,
      blacklist: [],
      premium: false,
      autoPlay: client.config.autoPlay,
    });
    client.global.db.guilds[guild.id] = {
      prefix: client.config.prefix,
      defaultVolume: client.config.defaultVolume,
      permissions: client.config.permissions,
      dj: client.config.dj,
      djrole: client.config.djrole,
      startPlaying: client.config.startPlaying,
      bass: client.config.bass,
      blacklist: [],
      premium: false,
      autoPlay: client.config.autoPlay,
    };
  },
};