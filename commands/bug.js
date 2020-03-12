module.exports = {
    name: 'bug',
    alias: 'none',
    usage: '',
    description: 'Report a bug',
    onlyDev: false,
    permission: 'none',
    category: 'info',
    async execute(msg, args, client, Discord, prefix) {
        const embed = new Discord.MessageEmbed()
            .setTitle(`Found a bug with ${client.user.username}?\nDM the core developer:`)
            .setDescription(client.messages.bug)
            .setColor(client.config.embedColor);
        msg.channel.send(embed);
    },
};