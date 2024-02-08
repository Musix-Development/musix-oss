module.exports = {
  name: "skipto",
  alias: ["st"],
  usage: "<point in queue>",
  description: "Skip to a point in the queue",
  onlyDev: false,
  permission: "MANAGE_MESSAGES",
  category: "music control",
  async execute(msg, args, client, Discord, command) {
    const queue = client.queue.get(msg.guild.id);
    if (client.funcs.check(client, msg, command)) {
      if (!args[1])
        return msg.channel.send(
          `${client.messages.correctUsage}\`${command.usage}\``
        );
      let point = parseInt(args[1]);
      point = point - 1;
      if (isNaN(point)) return msg.channel.send(client.messages.validNumber);
      if (point > queue.songs.length - 1)
        return msg.channel.send(client.messages.noSongs);
      if (point < 0) return msg.channel.send(client.messages.cantSkipToCurrent);
      for (let i = 0; i < point; i++) {
        queue.prevSongs.push(queue.songs.shift());
      }
      msg.channel.send(client.messages.skipped);
      queue.endReason = "skipto";
      queue.time = 0;
      queue.connection.dispatcher.end();
    }
  },
};