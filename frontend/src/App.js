import React, { useState } from "react";
import "./index.css";

const API_URL = "https://effective-waffle-q796pv799wvqh6656-3001.app.github.dev";

function parseTranscript(transcript) {
  if (!transcript) return [];
  const botNames = ["Aristotle", "Dr. Nova", "Maverick", "Professor Huxley", "Zara 2050"];
  const emojis = { "Aristotle": "🏛️", "Dr. Nova": "🔬", "Maverick": "😈", "Professor Huxley": "📜", "Zara 2050": "🚀" };
  const colors = { "Aristotle": "#7F77DD", "Dr. Nova": "#1D9E75", "Maverick": "#D85A30", "Professor Huxley": "#BA7517", "Zara 2050": "#378ADD" };

  const lines = transcript.split("\n\n").filter(l => l.trim());
  const messages = [];

  lines.forEach(line => {
    botNames.forEach(name => {
      if (line.startsWith(name + ":")) {
        messages.push({
          name,
          emoji: emojis[name],
          color: colors[name],
          text: line.replace(name + ":", "").trim()
        });
      }
    });
  });

  return messages;
}

export default function App() {
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debated, setDebated] = useState(false);

  async function startDebate() {
    if (!topic.trim()) return;
    setLoading(true);
    setMessages([]);
    setError("");
    setDebated(false);

    try {
      const res = await fetch(`${API_URL}/api/debate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, rounds: 1 })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(parseTranscript(data.transcript));
        setDebated(true);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Cannot connect to Agora API. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !loading) startDebate();
  }

  return (
    <div style={styles.app}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>🏛️ Agora</h1>
          <p style={styles.subtitle}>AI Debate Platform — 5 minds, one topic, zero agenda</p>
        </div>

        {/* Input */}
        <div style={styles.inputRow}>
          <input
            style={styles.input}
            type="text"
            placeholder="Enter a debate topic..."
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={handleKey}
            disabled={loading}
          />
          <button
            style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}
            onClick={startDebate}
            disabled={loading}
          >
            {loading ? "Debating..." : "Start Debate"}
          </button>
        </div>

        {/* Error */}
        {error && <div style={styles.error}>❌ {error}</div>}

        {/* Loading */}
        {loading && (
          <div style={styles.loadingBox}>
            <div style={styles.loadingText}>🏛️ The bots are thinking...</div>
            <div style={styles.loadingSubtext}>This takes about 15–20 seconds</div>
          </div>
        )}

        {/* Messages */}
        {debated && (
          <div style={styles.transcript}>
            <div style={styles.transcriptHeader}>
              📌 Topic: <strong>{topic}</strong>
            </div>
            {messages.map((msg, i) => (
              <div key={i} style={styles.message}>
                <div style={{ ...styles.botName, color: msg.color }}>
                  {msg.emoji} {msg.name}
                </div>
                <div style={styles.botText}>{msg.text}</div>
              </div>
            ))}
            <div style={styles.footer}>✅ Debate complete</div>
          </div>
        )}

      </div>
    </div>
  );
}

const styles = {
  app: { minHeight: "100vh", background: "#0f0f0f", color: "#f0f0f0", fontFamily: "system-ui, sans-serif" },
  container: { maxWidth: "720px", margin: "0 auto", padding: "40px 20px" },
  header: { textAlign: "center", marginBottom: "40px" },
  title: { fontSize: "42px", fontWeight: "700", margin: "0 0 8px", letterSpacing: "-1px" },
  subtitle: { fontSize: "15px", color: "#888", margin: 0 },
  inputRow: { display: "flex", gap: "12px", marginBottom: "24px" },
  input: { flex: 1, padding: "14px 18px", fontSize: "15px", borderRadius: "10px", border: "1px solid #333", background: "#1a1a1a", color: "#f0f0f0", outline: "none" },
  button: { padding: "14px 24px", fontSize: "15px", fontWeight: "600", borderRadius: "10px", border: "none", background: "#7F77DD", color: "#fff", cursor: "pointer", whiteSpace: "nowrap" },
  error: { background: "#2a1a1a", border: "1px solid #c0392b", borderRadius: "10px", padding: "14px 18px", marginBottom: "20px", color: "#e74c3c" },
  loadingBox: { textAlign: "center", padding: "40px", background: "#1a1a1a", borderRadius: "12px", marginBottom: "24px" },
  loadingText: { fontSize: "18px", marginBottom: "8px" },
  loadingSubtext: { fontSize: "13px", color: "#666" },
  transcript: { display: "flex", flexDirection: "column", gap: "16px" },
  transcriptHeader: { background: "#1a1a1a", borderRadius: "10px", padding: "14px 18px", fontSize: "14px", color: "#aaa", borderLeft: "3px solid #7F77DD" },
  message: { background: "#1a1a1a", borderRadius: "12px", padding: "18px 20px", border: "1px solid #2a2a2a" },
  botName: { fontSize: "14px", fontWeight: "700", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" },
  botText: { fontSize: "15px", lineHeight: "1.7", color: "#ddd" },
  footer: { textAlign: "center", color: "#555", fontSize: "13px", padding: "10px" }
};
