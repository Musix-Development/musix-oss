module.exports = {
    name: 'cmduses',
    alias: ["none"],
    usage: '',
    description: 'list all commands and how many times they\'ve been used',
    onlyDev: true,
    permission: 'dev',
    category: 'util',
    async execute(msg, args, client, Discord, command) {
        const cmduses = [];
        client.commands.forEach((value, key) => {
            cmduses.push([key, value.uses]);
        });
        cmduses.sort((a, b) => {
            return b[1] - a[1];
        });
        const cmdnamelength = Math.max(...cmduses.map(x => x[0].length)) + 4;
        const numberlength = Math.max(...cmduses.map(x => x[1].toString().length), 4);
        const markdownrows = ['Command' + ' '.repeat(cmdnamelength - 'command'.length) + ' '.repeat(numberlength - 'uses'.length) + 'Uses'];
        cmduses.forEach(x => {
            if (x[1] > 0) markdownrows.push(x[0] + '.'.repeat(cmdnamelength - x[0].length) + ' '.repeat(numberlength - x[1].toString().length) + x[1].toString());
        });
        const embed = new Discord.MessageEmbed();
        embed
            .setTitle(client.messages.cmdUsesTitle)
            .setDescription('```ml\n' + markdownrows.join('\n') + '\n```')
            .setFooter(client.messages.cmdUsesFooter)
            .setColor(client.config.embedColor);
        msg.channel.send(embed);
    },
};