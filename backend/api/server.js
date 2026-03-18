const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { runDebate, BOTS } = require("../bot-engine/debateEngine");

const app = express();
const PORT = process.env.PORT || 3001;

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "🏛️ Agora API is running",
    version: "1.0.0",
    endpoints: ["GET  /api/bots", "POST /api/debate"]
  });
});

app.get("/api/bots", (req, res) => {
  const bots = BOTS.map(bot => ({ name: bot.name, emoji: bot.emoji }));
  res.json({ success: true, bots });
});

app.post("/api/debate", async (req, res) => {
  const { topic, rounds = 1 } = req.body;
  if (!topic) return res.status(400).json({ success: false, error: "Topic is required" });
  if (topic.length < 5) return res.status(400).json({ success: false, error: "Topic too short" });
  try {
    console.log(`\n🎯 New debate: "${topic}"`);
    const transcript = await runDebate(topic, rounds);
    res.json({ success: true, topic, rounds, transcript });
  } catch (error) {
    console.error("Debate error:", error.message);
    res.status(500).json({ success: false, error: "Debate failed — " + error.message });
  }
});

app.post("/api/trigger-debate", async (req, res) => {
  const { runDailyDebate } = require("../autonomous/dailyDebate");
  res.json({ success: true, message: "Daily debate triggered!" });
  runDailyDebate();
});

app.listen(PORT, () => {
  console.log(`\n🏛️  Agora API running on port ${PORT}`);
});

module.exports = app;
