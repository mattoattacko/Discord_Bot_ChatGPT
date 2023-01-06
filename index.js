//create a Discord bot using OpenAI API that interacts with a Discord server
require('dotenv').config();

// Prepare to connect to the Discord API
const { Client, GatewayIntentBits } = require('discord.js');

// init client and pass in the intents we want to use
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

// Configuration to connect to OpenAI API
// Prepare connection to OpenAI API
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

// Checks for a message on discord being sent
// 'client.on' is a discord command that listens for a message and pulls it out
// we use a ping pong message where if a user sends a message, the bot sends the message back to me. We reply with the same message.
// need to ignore the bot's own messages to avoid infinite loops
client.on('messageCreate', async function (message) {
  try {
    if (message?.author?.bot) return;
    // console.log(message.content);
    // message.reply(`You said: ${message.content}`);

    const gptResponse = await openai.createCompletion({
      model: "davinci",
      prompt: `ChatGPT is a friendly chatbot\n\
ChatGPT: Hello! How are you today?\n\
${message?.author?.username}: ${message?.content}\n\
ChatGPT:`,
      temperature: 0.7,
      max_tokens: 100,
      stop: ["Kaido:", "Matto"],
    })
    message.reply(`${gptResponse?.data?.choices[0]?.text}`);
    return;
  } catch (err) {
    console.log(err);
  }
});

// Connect bot to Discord server
client.login(process.env.DISCORD_TOKEN);
console.log("Bot is running on Discord");