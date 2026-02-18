const { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } = require("discord.js");
const express = require("express");
const axios = require("axios");

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = "1473553985033207981";
const GUILD_ID = "1472645818132725914";

let currentWildPokemon = null;
let userInventory = {};

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);

  const commands = [
    { name: "spawn", description: "Spawn a wild pokemon" },
    { name: "catch", description: "Catch the current wild pokemon" },
  ];

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );

  console.log("Slash commands registered");
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // SPAWN
  if (interaction.commandName === "spawn") {
    const randomId = Math.floor(Math.random() * 151) + 1;
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const pokemon = response.data;

    currentWildPokemon = {
      name: pokemon.name,
      image: pokemon.sprites.other["official-artwork"].front_default
    };

    const embed = new EmbedBuilder()
      .setTitle("Một Pokémon hoang dã xuất hiện!")
      .setDescription(`✨ ${pokemon.name.toUpperCase()}`)
      .setImage(currentWildPokemon.image)
      .setColor(0xff0000);

    await interaction.reply({ embeds: [embed] });
  }

  // CATCH
  if (interaction.commandName === "catch") {
    if (!currentWildPokemon) {
      return interaction.reply("❌ Không có Pokémon hoang dã nào!");
    }

    const userId = interaction.user.id;

    if (!userInventory[userId]) {
      userInventory[userId] = [];
    }

    userInventory[userId].push(currentWildPokemon.name);

    await interaction.reply(`🎉 Bạn đã bắt được ${currentWildPokemon.name}!`);

    currentWildPokemon = null;
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
