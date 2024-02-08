module.exports = {
    name: 'loopsong',
    alias: ["none"],
    usage: '',
    description: 'loop the currently playing song.',
    onlyDev: false,
    permission: 'MANAGE_MESSAGES',
    category: 'music control',
    async execute(msg, args, client, Discord, command) {
        const queue = client.queue.get(msg.guild.id);
        if (client.funcs.check(client, msg, command)) {
            if (!queue.songLooping) {
                queue.songLooping = true;
                let message;
                message = client.messages.loopingSong.replace("%TITLE%", queue.songs[0].title);
                msg.channel.send(message);
            } else {
                queue.songLooping = false;
                msg.channel.send(client.messages.noLoopingSong);
            }
        }
    }
};