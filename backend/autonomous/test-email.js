require("dotenv").config({ path: __dirname + "/../.env" });
const { testEmailConnection } = require("./emailSender");
const { buildEmailHTML } = require("./emailBuilder");
const { sendEmail } = require("./emailSender");

async function test() {
  console.log("🧪 Testing Agora email system...\n");

  // Test 1: Gmail connection
  const connected = await testEmailConnection();
  if (!connected) {
    console.log("❌ Fix Gmail connection first");
    process.exit(1);
  }

  // Test 2: Send sample email
  const sampleDebates = [{
    topic: "Should artificial intelligence replace human teachers?",
    verdict: {
      verdict: "AI can assist but cannot fully replace human teachers due to emotional intelligence gaps.",
      consensus: "Most bots agreed AI is a powerful supplement but not a replacement.",
      keyDissent: "Maverick argued that clinging to human teachers is just nostalgia.",
      winner: "Professor Huxley made the most historically grounded argument.",
      score: "4-1 against full replacement"
    }
  }];

  const html = buildEmailHTML(sampleDebates);
  await sendEmail(html, ["Should AI replace human teachers?"]);

  console.log("\n✅ Test complete! Check workonprojects24@gmail.com");
}

test().catch(console.error);
