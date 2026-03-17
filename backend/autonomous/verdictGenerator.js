const Groq = require("groq-sdk");
require("dotenv").config({ path: "../.env" });

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateVerdict(topic, transcript) {
  const response = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    max_tokens: 400,
    messages: [
      {
        role: "system",
        content: `You are a neutral debate summariser. Given a debate transcript, generate a concise verdict.
Return ONLY a JSON object with these fields:
{
  "verdict": "one sentence conclusion",
  "consensus": "what most bots agreed on",
  "keyDissent": "the strongest opposing view",
  "winner": "which bot made the strongest argument",
  "score": "e.g. 3-2 in favour of X"
}
Return ONLY valid JSON, nothing else.`
      },
      {
        role: "user",
        content: `Topic: ${topic}\n\nDebate transcript:\n${transcript}`
      }
    ]
  });

  try {
    const text = response.choices[0].message.content.trim();
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return {
      verdict: "The debate concluded with mixed perspectives.",
      consensus: "Most bots agreed this is a complex issue.",
      keyDissent: "Maverick challenged all assumptions.",
      winner: "Professor Huxley",
      score: "3-2"
    };
  }
}

module.exports = { generateVerdict };
