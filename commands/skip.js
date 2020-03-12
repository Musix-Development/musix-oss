module.exports = {
	name: 'skip',
	alias: 's',
	usage: '',
	description: 'Skip the currently playing song.',
	onlyDev: false,
	permission: 'MANAGE_MESSAGES',
	category: 'music',
	execute(msg, args, client, Discord, prefix, command) {
		const serverQueue = client.queue.get(msg.guild.id);
		const permissions = msg.channel.permissionsFor(msg.author);
		if (!serverQueue || !serverQueue.playing) return msg.channel.send(client.messages.noServerQueue);
		if (msg.author.id !== client.config.devId) {
			if (msg.member.voice.channel !== serverQueue.voiceChannel) return msg.channel.send(client.messages.wrongVoiceChannel);
			if (client.global.db.guilds[msg.guild.id].permissions) {
				if (!msg.member.roles.cache.has(client.global.db.guilds[msg.guild.id].djrole) || !permissions.has(command.permission)) {
					return vote(serverQueue, msg, client);
				} else {
					return skipSong(serverQueue, msg, client);
				}
			} else {
				return skipSong(serverQueue, msg, client);
			}
		} else {
			return skipSong(serverQueue, msg, client);
		}
	}
};
function skipSong(serverQueue, msg, client) {
	msg.channel.send(client.messages.skipped);
	serverQueue.endReason = "skip";
	serverQueue.connection.dispatcher.end();
};
function vote(serverQueue, msg, client) {
	serverQueue.votesNeeded = Math.floor(serverQueue.voiceChannel.members.size / 2);
	serverQueue.votesNeeded.toFixed();
	if (serverQueue.voiceChannel.members.size > 2) {
		if (serverQueue.voters.includes(msg.member.id)) return msg.channel.send(client.messages.alreadyVoted);
		serverQueue.votes++;
		serverQueue.voters.push(msg.member.id);
		if (serverQueue.votes >= serverQueue.votesNeeded) {
			serverQueue.voters = [];
			serverQueue.votes = 0;
			serverQueue.votesNeeded = null;
			return skipSong(serverQueue, msg);
		} else return msg.channel.send(`${client.messages.notEnoughVotes} ${serverQueue.votes} / ${serverQueue.votesNeeded}!`);
	} else {
		return skipSong(serverQueue, msg);
	}
};
