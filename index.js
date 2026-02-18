const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");
const express = require("express");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = "1472623586895462491"; // vào Discord Developer Portal copy
const GUILD_ID = "1472644187269758978"; // chuột phải server > copy ID

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const commands = [
    {
      name: "spawn",
      description: "Spawn a pokemon",
    },
  ];

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log("Slash command registered");
  } catch (error) {
    console.error(error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "spawn") {
    await interaction.reply("Một Pokemon hoang dã đã xuất hiện!");
  }
});

client.login(TOKEN);

// Web server cho Render
const app = express();
app.get("/", (req, res) => {
  res.send("Bot is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Web server running");
});
