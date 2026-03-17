const axios = require("axios");
require("dotenv").config({ path: "../.env" });

const NEWS_API_KEY = process.env.NEWS_API_KEY;

async function fetchTopNews() {
  try {
    console.log("📰 Fetching today's top news...");

    const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        language: "en",
        pageSize: 20,
        apiKey: NEWS_API_KEY
      }
    });

    const articles = response.data.articles
      .filter(a => a.title && a.description && !a.title.includes("[Removed]"))
      .slice(0, 20);

    console.log(`✅ Fetched ${articles.length} articles`);
    return articles;

  } catch (error) {
    console.error("❌ News fetch failed:", error.message);
    return [];
  }
}

async function selectDebatableTopics(articles) {
  const Groq = require("groq-sdk");
  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const headlines = articles.map((a, i) => `${i + 1}. ${a.title}`).join("\n");

  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    max_tokens: 300,
    messages: [
      {
        role: "system",
        content: `You are a debate topic selector. Given news headlines, pick the 2 most debatable, controversial, or thought-provoking topics. 
Return ONLY a JSON array with exactly 2 strings — the debate topics rephrased as debate motions.
Example: ["Should governments regulate AI development?", "Is remote work better than office work?"]
Return ONLY the JSON array, nothing else.`
      },
      {
        role: "user",
        content: `Today's headlines:\n${headlines}\n\nPick the 2 most debatable topics as debate motions.`
      }
    ]
  });

  try {
    const text = response.choices[0].message.content.trim();
    const topics = JSON.parse(text);
    console.log("🎯 Selected topics:", topics);
    return topics;
  } catch {
    return [articles[0].title, articles[1].title];
  }
}

module.exports = { fetchTopNews, selectDebatableTopics };
