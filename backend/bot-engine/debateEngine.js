const Groq = require("groq-sdk");

const philosopher = require("../personas/philosopher");
const scientist = require("../personas/scientist");
const devilAdvocate = require("../personas/devil-advocate");
const historian = require("../personas/historian");
const futurist = require("../personas/futurist");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

const BOTS = [philosopher, scientist, devilAdvocate, historian, futurist];

async function askBot(bot, topic, conversationHistory) {
  const response = await client.chat.completions.create({
    model: bot.model,
    max_tokens: 200,
    messages: [
      { role: "system", content: bot.systemPrompt },
      {
        role: "user",
        content: `The debate topic is: "${topic}"\n\nHere is the conversation so far:\n${conversationHistory}\n\nNow give your response as ${bot.name}:`
      }
    ]
  });
  return response.choices[0].message.content;
}

async function runDebate(topic, rounds = 2) {
  console.log("\n🏛️  AGORA — AI DEBATE PLATFORM");
  console.log("================================");
  console.log(`📌 Topic: ${topic}`);
  console.log(`🔄 Rounds: ${rounds}`);
  console.log("================================\n");

  let conversationHistory = "";

  for (let round = 1; round <= rounds; round++) {
    console.log(`\n--- Round ${round} ---\n`);

    for (const bot of BOTS) {
      try {
        console.log(`${bot.emoji} ${bot.name} is thinking...`);
        const response = await askBot(bot, topic, conversationHistory);
        console.log(`${bot.emoji} ${bot.name}:\n${response}\n`);
        conversationHistory += `${bot.name}: ${response}\n\n`;
        await new Promise(r => setTimeout(r, 500));
      } catch (error) {
        console.error(`❌ Error with ${bot.name}:`, error.message);
      }
    }
  }

  console.log("\n================================");
  console.log("✅ Debate complete!");
  console.log("================================\n");

  return conversationHistory;
}

module.exports = { runDebate, askBot, BOTS };
