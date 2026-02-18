const { 
  Client, 
  GatewayIntentBits, 
  SlashCommandBuilder, 
  REST, 
  Routes,
  EmbedBuilder 
} = require("discord.js");

const axios = require("axios");

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;

if (!TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.log("❌ Thiếu biến môi trường TOKEN / CLIENT_ID / GUILD_ID");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once("ready", () => {
  console.log(`✅ Bot online: ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    return interaction.reply("🟢 Bot đang hoạt động!");
  }

  if (interaction.commandName === "spawn") {
    try {
      const randomId = Math.floor(Math.random() * 151) + 1;

      const response = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${randomId}`
      );

      const pokemon = response.data;

      const embed = new EmbedBuilder()
        .setTitle(`✨ ${pokemon.name.toUpperCase()} đã xuất hiện!`)
        .setImage(pokemon.sprites.front_default)
        .setColor(0x00ff00);

      await interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      await interaction.reply("❌ Lỗi khi spawn Pokemon.");
    }
  }
});

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Kiểm tra bot"),

  new SlashCommandBuilder()
    .setName("spawn")
    .setDescription("Spawn Pokemon ngẫu nhiên")
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log("🔄 Đang đăng ký slash commands...");
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log("✅ Slash commands đã đăng ký.");
  } catch (err) {
    console.error(err);
  }
})();

client.login(TOKEN);
