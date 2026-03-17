require("dotenv").config({ path: __dirname + "/../.env" });
const cron = require("node-cron");
const { fetchTopNews, selectDebatableTopics } = require("./newsFetcher");
const { runDebate } = require("../bot-engine/debateEngine");
const { generateVerdict } = require("./verdictGenerator");
const { buildEmailHTML } = require("./emailBuilder");
const { sendEmail } = require("./emailSender");

async function runDailyDebate() {
  console.log("\n🏛️  AGORA AUTONOMOUS DEBATE ENGINE");
  console.log("=====================================");
  console.log(`⏰ Triggered at: ${new Date().toLocaleString()}`);

  try {
    // Step 1: Fetch news
    const articles = await fetchTopNews();
    if (!articles.length) {
      console.log("❌ No articles found — aborting");
      return;
    }

    // Step 2: Select topics
    const topics = await selectDebatableTopics(articles);
    console.log(`📌 Topics selected: ${topics.length}`);

    // Step 3: Run debates
    const debates = [];
    for (const topic of topics) {
      console.log(`\n🎯 Debating: "${topic}"`);
      const transcript = await runDebate(topic, 1);
      const verdict = await generateVerdict(topic, transcript);
      debates.push({ topic, transcript, verdict });
      console.log(`✅ Verdict: ${verdict.verdict}`);
    }

    // Step 4: Build & send email
    const html = buildEmailHTML(debates);
    await sendEmail(html, topics);
    console.log("\n✅ Daily debate complete! Email sent.");

  } catch (error) {
    console.error("❌ Daily debate failed:", error.message);
  }
}

// Schedule: Every day at 8AM IST (2:30 AM UTC)
cron.schedule("30 2 * * *", () => {
  console.log("⏰ Cron triggered — starting daily debate...");
  runDailyDebate();
}, { timezone: "Asia/Kolkata" });

console.log("🏛️  Agora Autonomous Engine started");
console.log("⏰ Scheduled: Every day at 8:00 AM IST");
console.log("📧 Waiting for next trigger...\n");

module.exports = { runDailyDebate };
