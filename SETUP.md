# 🏛️ Agora — Local Setup Guide

## Prerequisites
- Node.js v18 or above
- A free [Groq API key](https://console.groq.com)
- A free [NewsAPI key](https://newsapi.org)
- A Gmail account with [App Password](https://myaccount.google.com/apppasswords)

---

## Option A — Automatic Setup (Recommended)
```bash
git clone https://github.com/Adarsh73111/agora.git
cd agora
bash setup.sh
```

Then edit `backend/.env` with your API keys and run:
```bash
npm run start:backend   # Terminal 1
npm run start:frontend  # Terminal 2
```

Open **http://localhost:3000** 🎉

---

## Option B — Docker (Easiest)
```bash
git clone https://github.com/Adarsh73111/agora.git
cd agora
cp backend/.env.example backend/.env
# Edit backend/.env with your keys
docker-compose up --build
```

Open **http://localhost:3000** 🎉

---

## Option C — Manual Setup

### Step 1 — Clone
```bash
git clone https://github.com/Adarsh73111/agora.git
cd agora
```

### Step 2 — Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm start
```

### Step 3 — Frontend (new terminal)
```bash
cd frontend
npm install
npm start
```

### Step 4 — Open
Visit **http://localhost:3000**

---

## Environment Variables

Create `backend/.env` with these values:
```env
GROQ_API_KEY=gsk_your_key_here
NEWS_API_KEY=your_newsapi_key_here
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_16_char_app_password
PORT=3001
```

### Getting API Keys

| Key | Where to get it | Cost |
|---|---|---|
| GROQ_API_KEY | [console.groq.com](https://console.groq.com) | Free |
| NEWS_API_KEY | [newsapi.org](https://newsapi.org) | Free |
| GMAIL_USER | Your Gmail address | Free |
| GMAIL_PASS | [Google App Passwords](https://myaccount.google.com/apppasswords) | Free |

---

## Troubleshooting

**Port already in use?**
```bash
# Kill process on port 3001
npx kill-port 3001
```

**API not connecting?**
- Make sure backend is running on port 3001
- Check your GROQ_API_KEY is valid

**Email not sending?**
- Enable 2-Step Verification on Gmail first
- Use App Password, not your regular Gmail password
