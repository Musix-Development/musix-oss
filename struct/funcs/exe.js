module.exports = function (msg, args, client, Discord, prefix, command) {
    const permissions = msg.channel.permissionsFor(msg.client.user);
    if (!permissions.has('EMBED_LINKS')) return msg.channel.send(client.messages.noPermsEmbed);
    if (!permissions.has('USE_EXTERNAL_EMOJIS')) return msg.channel.send(client.noPermsUseExternalEmojis);
    try {
        command.uses++;
        command.execute(msg, args, client, Discord, prefix, command);
    } catch (error) {
        const date = new Date();
        msg.reply(client.messages.errorExe);
        const embed = new Discord.MessageEmbed()
            .setTitle(`Musix ${error.toString()}`)
            .setDescription(error.stack.replace(/at /g, '**at **'))
            .setFooter(`guild: ${msg.guild.id}, user: ${msg.member.id}, channel: ${msg.channel.id}, date: ${date}`)
            .setColor('#b50002');
        client.debug_channel.send(embed);
        console.error(error);
    }
};
