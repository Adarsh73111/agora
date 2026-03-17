import React, { useState, useEffect } from "react";
import "./index.css";

const API_URL = "https://" + window.location.hostname.replace("-3000", "-3001");

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
        messages.push({ name, emoji: emojis[name], color: colors[name], text: line.replace(name + ":", "").trim() });
      }
    });
  });
  return messages;
}

export default function App() {
  const [topic, setTopic] = useState("");
  const [rounds, setRounds] = useState(1);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debated, setDebated] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("agora-history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  async function startDebate() {
    if (!topic.trim()) return;
    setLoading(true);
    setMessages([]);
    setError("");
    setDebated(false);
    setVisibleCount(0);
    setShowHistory(false);

    try {
      const res = await fetch(`${API_URL}/api/debate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, rounds })
      });
      const data = await res.json();
      if (data.success) {
        const parsed = parseTranscript(data.transcript);
        setMessages(parsed);
        setDebated(true);

        // Animate messages appearing one by one
        parsed.forEach((_, i) => {
          setTimeout(() => setVisibleCount(i + 1), i * 400);
        });

        // Save to history
        const entry = { topic, rounds, date: new Date().toLocaleString(), messages: parsed };
        const updated = [entry, ...history].slice(0, 10);
        setHistory(updated);
        localStorage.setItem("agora-history", JSON.stringify(updated));
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Cannot connect to Agora API. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  function loadFromHistory(entry) {
    setTopic(entry.topic);
    setMessages(entry.messages);
    setDebated(true);
    setVisibleCount(entry.messages.length);
    setShowHistory(false);
    setError("");
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

        {/* Input Row */}
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
          <button style={{ ...styles.button, opacity: loading ? 0.6 : 1 }} onClick={startDebate} disabled={loading}>
            {loading ? "Debating..." : "Start Debate"}
          </button>
        </div>

        {/* Controls Row */}
        <div style={styles.controlsRow}>
          <div style={styles.roundSelector}>
            <span style={styles.controlLabel}>Rounds:</span>
            {[1, 2, 3].map(r => (
              <button
                key={r}
                style={{ ...styles.roundBtn, ...(rounds === r ? styles.roundBtnActive : {}) }}
                onClick={() => setRounds(r)}
                disabled={loading}
              >
                {r}
              </button>
            ))}
          </div>
          {history.length > 0 && (
            <button style={styles.historyBtn} onClick={() => setShowHistory(!showHistory)}>
              {showHistory ? "Hide History" : `📋 History (${history.length})`}
            </button>
          )}
        </div>

        {/* History Panel */}
        {showHistory && (
          <div style={styles.historyPanel}>
            <div style={styles.historyTitle}>Past Debates</div>
            {history.map((entry, i) => (
              <div key={i} style={styles.historyItem} onClick={() => loadFromHistory(entry)}>
                <div style={styles.historyTopic}>{entry.topic}</div>
                <div style={styles.historyMeta}>{entry.date} · {entry.rounds} round{entry.rounds > 1 ? "s" : ""}</div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && <div style={styles.error}>❌ {error}</div>}

        {/* Loading */}
        {loading && (
          <div style={styles.loadingBox}>
            <div style={styles.loadingText}>🏛️ The bots are debating...</div>
            <div style={styles.loadingSubtext}>{rounds} round{rounds > 1 ? "s" : ""} · ~{rounds * 20} seconds</div>
            <div style={styles.loadingBar}><div style={styles.loadingFill} /></div>
          </div>
        )}

        {/* Debate Messages */}
        {debated && (
          <div style={styles.transcript}>
            <div style={styles.transcriptHeader}>
              📌 Topic: <strong>{topic}</strong>
            </div>
            {messages.slice(0, visibleCount).map((msg, i) => (
              <div key={i} style={{ ...styles.message, animation: "fadeIn 0.4s ease" }}>
                <div style={{ ...styles.botName, color: msg.color }}>
                  {msg.emoji} {msg.name}
                </div>
                <div style={styles.botText}>{msg.text}</div>
              </div>
            ))}
            {visibleCount >= messages.length && messages.length > 0 && (
              <div style={styles.footer}>✅ Debate complete · {messages.length} arguments made</div>
            )}
          </div>
        )}

      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes loading { 0% { width: 0% } 100% { width: 100% } }
        input::placeholder { color: #555; }
        input:focus { border-color: #7F77DD !important; }
      `}</style>
    </div>
  );
}

const styles = {
  app: { minHeight: "100vh", background: "#0f0f0f", color: "#f0f0f0", fontFamily: "system-ui, sans-serif" },
  container: { maxWidth: "720px", margin: "0 auto", padding: "40px 20px" },
  header: { textAlign: "center", marginBottom: "40px" },
  title: { fontSize: "42px", fontWeight: "700", margin: "0 0 8px", letterSpacing: "-1px" },
  subtitle: { fontSize: "15px", color: "#888", margin: 0 },
  inputRow: { display: "flex", gap: "12px", marginBottom: "12px" },
  input: { flex: 1, padding: "14px 18px", fontSize: "15px", borderRadius: "10px", border: "1px solid #333", background: "#1a1a1a", color: "#f0f0f0", outline: "none", transition: "border-color 0.2s" },
  button: { padding: "14px 24px", fontSize: "15px", fontWeight: "600", borderRadius: "10px", border: "none", background: "#7F77DD", color: "#fff", cursor: "pointer", whiteSpace: "nowrap", transition: "background 0.2s" },
  controlsRow: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" },
  roundSelector: { display: "flex", alignItems: "center", gap: "8px" },
  controlLabel: { fontSize: "13px", color: "#888" },
  roundBtn: { width: "36px", height: "36px", borderRadius: "8px", border: "1px solid #333", background: "#1a1a1a", color: "#888", cursor: "pointer", fontSize: "14px", fontWeight: "600" },
  roundBtnActive: { background: "#7F77DD", border: "1px solid #7F77DD", color: "#fff" },
  historyBtn: { fontSize: "13px", padding: "8px 14px", borderRadius: "8px", border: "1px solid #333", background: "transparent", color: "#888", cursor: "pointer" },
  historyPanel: { background: "#1a1a1a", borderRadius: "12px", padding: "16px", marginBottom: "20px", border: "1px solid #2a2a2a" },
  historyTitle: { fontSize: "12px", color: "#555", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" },
  historyItem: { padding: "10px 12px", borderRadius: "8px", cursor: "pointer", marginBottom: "6px", border: "1px solid #2a2a2a", transition: "background 0.2s" },
  historyTopic: { fontSize: "14px", color: "#ddd", marginBottom: "2px" },
  historyMeta: { fontSize: "12px", color: "#555" },
  error: { background: "#2a1a1a", border: "1px solid #c0392b", borderRadius: "10px", padding: "14px 18px", marginBottom: "20px", color: "#e74c3c" },
  loadingBox: { textAlign: "center", padding: "40px", background: "#1a1a1a", borderRadius: "12px", marginBottom: "24px" },
  loadingText: { fontSize: "18px", marginBottom: "8px" },
  loadingSubtext: { fontSize: "13px", color: "#666", marginBottom: "16px" },
  loadingBar: { height: "3px", background: "#2a2a2a", borderRadius: "2px", overflow: "hidden" },
  loadingFill: { height: "100%", background: "#7F77DD", borderRadius: "2px", animation: "loading 20s linear forwards" },
  transcript: { display: "flex", flexDirection: "column", gap: "16px" },
  transcriptHeader: { background: "#1a1a1a", borderRadius: "10px", padding: "14px 18px", fontSize: "14px", color: "#aaa", borderLeft: "3px solid #7F77DD" },
  message: { background: "#1a1a1a", borderRadius: "12px", padding: "18px 20px", border: "1px solid #2a2a2a" },
  botName: { fontSize: "13px", fontWeight: "700", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" },
  botText: { fontSize: "15px", lineHeight: "1.7", color: "#ddd" },
  footer: { textAlign: "center", color: "#555", fontSize: "13px", padding: "10px" }
};
