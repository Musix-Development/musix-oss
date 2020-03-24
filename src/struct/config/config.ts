require('dotenv/config');

module.exports = {
    token: process.env.TOKEN,
    devToken: process.env.DEVTOKEN,
    dblKey: process.env.DBLKEY,
    api_key: process.env.GOOGLE_API_KEY,
    testServer: "489111553321336832",
    debug_channel: "634718645188034560",
    primary_test_channel: "617633098296721409",
    secondary_test_channel: "570531724002328577",
    devId: "360363051792203779",
    embedColor: "#b50002",
    invite: "https://discordapp.com/oauth2/authorize?client_id=607266889537945605&permissions=3427328&scope=bot",
    supportServer: "https://discord.gg/rvHuJtB",
    devMode: false,
    dblApi: false,
    saveDB: true,
    respawn: true,
    shards: 10,
    shardDelay: 10000,
    spawnTimeout: 60000,
    respawnDelay: 1000,
    prefix: ">",
    devPrefix: "-",
    defaultVolume: 5,
    permissions: false,
    dj: false,
    djrole: null,
    startPlaying: true,
    bass: 1
}
