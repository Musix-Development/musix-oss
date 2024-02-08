const {
  Client,
  Collection,
  Intents
} = require("discord.js");
const admin = require("firebase-admin");
const serviceAccount = require("./config/serviceAccount.json");
const fs = require("fs");
const path = require("path");
const SpotifyApi = require("spotify-web-api-node");
const YouTube = require("simple-youtube-api");
const config = require("./config/config");

const GatewayIntents = new Intents();
GatewayIntents.add(
  1 << 0, // GUILDS
  1 << 7, // GUILD_VOICE_STATES
  1 << 9, // GUILD_MESSAGES
);

module.exports = class extends Client {
  constructor() {
    super({
      disableEveryone: true,
      disabledEvents: ["TYPING_START"],
      ws: {
        intents: GatewayIntents
      }
    });

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    this.commands = new Collection();
    this.settingCmd = new Collection();
    this.queue = new Map();
    this.spotify = new SpotifyApi({
      id: config.spotify_client_id,
      secret: config.spotify_client_secret,
    });
    this.youtube = new YouTube(config.api_keys[(this.shard.ids / 2).toFixed()] || config.api_key);
    this.config = config;
    this.funcs = {};
    this.dispatcher = {};
    this.messages = require("./config/messages.js");
    this.db = admin.firestore();
    this.db.FieldValue = require("firebase-admin").firestore.FieldValue;
    this.global = {
      db: {
        guilds: {},
      },
    };
    this.logs = [];

    fs.readdirSync(path.join(__dirname, "funcs")).forEach((filename) => {
      this.funcs[filename.slice(0, -3)] = require(`./funcs/${filename}`);
    });

    const commandFiles = fs
      .readdirSync(path.join(path.dirname(__dirname), "commands"))
      .filter((f) => f.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`../commands/${file}`);
      command.uses = 0;
      this.commands.set(command.name, command);
    }
    const settingFiles = fs
      .readdirSync(path.join(path.dirname(__dirname), "commands/settings"))
      .filter((f) => f.endsWith(".js"));
    for (const file of settingFiles) {
      const option = require(`../commands/settings/${file}`);
      this.settingCmd.set(option.name, option);
    }
    if (this.config.devMode) {
      this.config.token = this.config.devToken;
    }

    require("../events/clientEvents/handler.js")(this);

    this.login(this.config.token).catch((err) =>
      console.log("Failed to login: " + err)
    );
  }
};