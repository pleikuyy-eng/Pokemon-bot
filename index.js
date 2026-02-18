const {
  Client,
  GatewayIntentBits,
  SlashCommandBuilder,
  REST,
  Routes,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const axios = require("axios");

// 🔥 LẤY TỪ RENDER ENVIRONMENT
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

let currentPokemon = null;

client.once("ready", async () => {
  console.log(`Bot online: ${client.user.tag}`);

  const commands = [
    new SlashCommandBuilder()
      .setName("spawn")
      .setDescription("Spawn 1 Pokémon hoang dã")
  ].map(cmd => cmd.toJSON());

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log("Đã đăng ký lệnh /spawn");
  } catch (err) {
    console.error(err);
  }
});

client.on("interactionCreate", async interaction => {

  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "spawn") {

      const randomId = Math.floor(Math.random() * 151) + 1;

      const res = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${randomId}`
      );

      const pokemon = res.data;
      currentPokemon = pokemon;

      const embed = new EmbedBuilder()
        .setTitle(`✨ ${pokemon.name.toUpperCase()} xuất hiện!`)
        .setImage(pokemon.sprites.front_default)
        .setDescription("Bấm nút bên dưới để bắt!")
        .setColor(0x00ff00);

      const button = new ButtonBuilder()
        .setCustomId("catch")
        .setLabel("🎯 Bắt Pokémon")
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(button);

      await interaction.reply({
        embeds: [embed],
        components: [row]
      });
    }
  }

  if (interaction.isButton()) {
    if (interaction.customId === "catch") {

      if (!currentPokemon) {
        return interaction.reply({
          content: "Không có Pokémon nào!",
          ephemeral: true
        });
      }

      await interaction.reply({
        content: `🎉 ${interaction.user} đã bắt được ${currentPokemon.name}!`
      });

      currentPokemon = null;
    }
  }

});

client.login(TOKEN);
