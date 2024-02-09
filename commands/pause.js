const { PermissionFlagsBits } = require('discord.js');

module.exports = {
	name: 'pause',
	description: 'Pause command.',
	alias: 'pause',
	cooldown: 5,
	execute(message, args, client, prefix) {
		const serverQueue = client.queue.get(message.guild.id);
		const permissions = message.channel.permissionsFor(message.author);
		const voiceChannel = message.member.voice.channel;
		if (!serverQueue) return message.channel.send(':x: There is nothing playing.');
		if (serverQueue.playing && !serverQueue.paused) {
			if (voiceChannel !== serverQueue.voiceChannel) return message.channel.send(':x: I\'m sorry but you need to be in the same voice channel as Musix to pause the music!');
			if (client.global.db.guilds[message.guild.id].permissions === true) {
				if (client.global.db.guilds[message.guild.id].dj) {
					if (!message.member.roles.cache.has(client.global.db.guilds[message.guild.id].djrole)) return message.channel.send(':x: You need the `DJ` role to pause the music!');
				} else if (!permissions.has(PermissionFlagsBits.ManageMessages)) return message.channel.send(':x: You need the `MANAGE_MESSAGES` permission to pause the music!');
			}
			serverQueue.paused = true;
			serverQueue.audioPlayer.pause();
			return message.channel.send('⏸ Paused the music!');
		} else return message.channel.send(':x: There is nothing playing.');
	}
};
