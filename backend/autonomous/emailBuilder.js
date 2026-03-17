function buildEmailHTML(debates) {
  const date = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });

  const debateHTML = debates.map((d, i) => `
    <div style="margin-bottom:40px;padding:28px;background:#0d0f1a;border-radius:12px;border:1px solid #1e1e2e;border-left:4px solid #c9a84c;">
      <div style="font-size:11px;color:#c9a84c;letter-spacing:3px;text-transform:uppercase;margin-bottom:10px;font-family:Georgia,serif;">
        Motion ${i + 1}
      </div>
      <div style="font-size:18px;color:#e8e8f0;font-style:italic;font-family:Georgia,serif;margin-bottom:24px;line-height:1.6;">
        "${d.topic}"
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="padding:12px;background:#111320;border-radius:8px 0 0 8px;border:1px solid #1e1e2e;">
            <div style="font-size:10px;color:#888;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">Verdict</div>
            <div style="font-size:14px;color:#e0e0e0;line-height:1.5;">${d.verdict.verdict}</div>
          </td>
          <td style="padding:12px;background:#111320;border-radius:0 8px 8px 0;border:1px solid #1e1e2e;border-left:none;width:120px;text-align:center;">
            <div style="font-size:10px;color:#888;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;">Score</div>
            <div style="font-size:20px;color:#c9a84c;font-weight:bold;font-family:Georgia,serif;">${d.verdict.score}</div>
          </td>
        </tr>
      </table>

      <div style="display:grid;gap:12px;">
        <div style="padding:14px;background:#0a0c14;border-radius:8px;border:1px solid #1a1a2e;">
          <div style="font-size:10px;color:#00e5cc;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">✓ Consensus</div>
          <div style="font-size:13px;color:#b0b0c0;line-height:1.6;">${d.verdict.consensus}</div>
        </div>
        <div style="padding:14px;background:#0a0c14;border-radius:8px;border:1px solid #1a1a2e;">
          <div style="font-size:10px;color:#ff4d6d;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">⚡ Key Dissent</div>
          <div style="font-size:13px;color:#b0b0c0;line-height:1.6;">${d.verdict.keyDissent}</div>
        </div>
        <div style="padding:14px;background:#0a0c14;border-radius:8px;border:1px solid #1a1a2e;">
          <div style="font-size:10px;color:#c9a84c;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;">🏆 Strongest Argument</div>
          <div style="font-size:13px;color:#b0b0c0;line-height:1.6;">${d.verdict.winner}</div>
        </div>
      </div>
    </div>
  `).join("");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#07070f;font-family:'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">

    <!-- Header -->
    <div style="text-align:center;margin-bottom:40px;padding:32px;background:linear-gradient(135deg,#0d0f1a,#07070f);border-radius:16px;border:1px solid #1e1e2e;">
      <div style="font-size:11px;letter-spacing:5px;color:#c9a84c;text-transform:uppercase;font-family:Georgia,serif;margin-bottom:12px;">AI Debate Platform</div>
      <h1 style="font-size:48px;font-weight:900;color:#c9a84c;font-family:Georgia,serif;margin:0 0 8px;letter-spacing:-2px;">AGORA</h1>
      <div style="font-size:12px;color:#444;letter-spacing:2px;text-transform:uppercase;">Daily Debate Digest</div>
      <div style="width:40px;height:1px;background:linear-gradient(90deg,transparent,#c9a84c,transparent);margin:16px auto 0;"></div>
      <div style="font-size:12px;color:#666;margin-top:12px;">${date}</div>
    </div>

    <!-- Intro -->
    <div style="text-align:center;margin-bottom:32px;">
      <p style="font-size:14px;color:#888;line-height:1.7;margin:0;">
        Your 5 AI debaters convened this morning and tackled today's most pressing topics. 
        Here are the verdicts — no bias, no agenda, just perspectives.
      </p>
    </div>

    <!-- Debates -->
    ${debateHTML}

    <!-- Footer -->
    <div style="text-align:center;margin-top:40px;padding-top:24px;border-top:1px solid #1e1e2e;">
      <div style="font-size:20px;color:#c9a84c22;margin-bottom:8px;">⚖</div>
      <div style="font-size:11px;color:#333;letter-spacing:2px;text-transform:uppercase;font-family:Georgia,serif;">Five Minds · One Truth · Zero Compromise</div>
      <div style="font-size:11px;color:#222;margin-top:16px;">Agora Daily Digest · Powered by AI</div>
    </div>

  </div>
</body>
</html>`;
}

module.exports = { buildEmailHTML };
