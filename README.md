<div align="center">

# 🏛️ AGORA
### AI Debate Platform

*Five minds. One truth. Zero compromise.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Amplify-gold?style=for-the-badge&logo=amazonaws)](https://production.d2tepp2rv2pa5m.amplifyapp.com)
[![GitHub](https://img.shields.io/badge/GitHub-Private-black?style=for-the-badge&logo=github)](https://github.com/Adarsh73111/agora)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org)
[![AWS](https://img.shields.io/badge/AWS-Lambda%20%2B%20Amplify-orange?style=for-the-badge&logo=amazonaws)](https://aws.amazon.com)

</div>

---

## 🎯 What is Agora?

Agora is an AI-powered debate platform where **5 distinct AI personalities** automatically debate any topic you throw at them — in real time, with unique perspectives, building on each other's arguments.

Every morning at **8AM IST**, Agora scans today's top news, picks the most debatable topics, runs autonomous debates, generates verdicts, and emails subscribers a daily digest.

---

## ✨ Features

- 🤖 **5 Unique AI Personas** — Philosopher, Scientist, Devil's Advocate, Historian, Futurist
- ⚡ **Real-time debates** — Watch arguments appear live with typewriter effects
- 📰 **Autonomous daily debates** — Fetches news automatically every morning
- 📧 **Email digest** — Daily verdict summary delivered to your inbox
- 🎨 **Stunning UI** — Gold particle interface with cinematic animations
- 🔄 **1-3 debate rounds** — Control the depth of each debate
- 📋 **Debate history** — All past debates saved locally
- ☁️ **Serverless** — Runs 24/7 on AWS Lambda + Amplify

---

## 🤖 Meet The Panel

| Bot | Role | Personality |
|---|---|---|
| 🏛️ **Aristotle** | The Philosopher | Calm, logical, virtue-driven |
| 🔬 **Dr. Nova** | The Scientist | Sharp, data-driven, evidence-based |
| 😈 **Maverick** | Devil's Advocate | Bold, provocative, contrarian |
| 📜 **Professor Huxley** | The Historian | Wise, contextual, historically-grounded |
| 🚀 **Zara 2050** | The Futurist | Visionary, fearless, forward-thinking |

---

## 🚀 Quick Start
```bash
git clone https://github.com/Adarsh73111/agora.git
cd agora
bash setup.sh
```

See [SETUP.md](./SETUP.md) for detailed instructions.

---

## 🏗️ Architecture
```
Frontend (React)          Backend (Node.js)         AI Layer
─────────────────         ─────────────────         ─────────
Particle UI          ──►  Express API          ──►  Groq API
Gold animations           Bot Engine                (Llama 3.1)
Typewriter effects        Debate Orchestrator
Debate history            News Fetcher (NewsAPI)
                          Email Sender (Gmail)
                          Daily Cron (8AM IST)

Hosting                   Deployment
────────                  ──────────
AWS Amplify          ◄──  GitHub
AWS Lambda                Codespaces
```

---

## 📸 Screenshots

### Home Screen
> *The landing page with particle constellation background and gold shimmer title*

![Agora Home](./screenshots/home.png)

### Live Debate in Progress
> *5 bots debating with typewriter animation and sound wave indicators*

![Agora Debate](./screenshots/debate.png)

### Session Complete
> *Debate verdict card showing arguments count and session summary*

![Agora Complete](./screenshots/complete.png)

### Daily Email Digest
> *Automated email with debate verdicts delivered every morning*

![Agora Email](./screenshots/email.png)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, CSS animations, Cinzel font |
| Backend | Node.js, Express.js |
| AI | Groq API (Llama 3.1 8B) |
| News | NewsAPI |
| Email | Nodemailer + Gmail |
| Scheduling | node-cron |
| Hosting | AWS Amplify (frontend) |
| Serverless | AWS Lambda (backend) |
| CI/CD | GitHub |

---

## 📁 Project Structure
```
agora/
├── frontend/              React app
│   ├── src/App.js         Main UI component
│   └── public/            Static assets
├── backend/
│   ├── api/server.js      Express API server
│   ├── bot-engine/        Debate orchestration
│   ├── personas/          5 bot personalities
│   └── autonomous/        News + email automation
├── Dockerfile             Docker setup
├── docker-compose.yml     Full stack Docker
├── setup.sh               Auto setup script
├── SETUP.md               Local setup guide
└── README.md              This file
```

---

## 🌍 Deployment

Agora is deployed on AWS:
- **Frontend** → AWS Amplify
- **Backend** → AWS Lambda
- **Schedule** → AWS EventBridge (8AM IST daily)

See [SETUP.md](./SETUP.md) for local development setup.

---

## 💡 Roadmap

- [ ] User accounts and profiles
- [ ] Custom bot persona creator
- [ ] Bot persona marketplace
- [ ] Voting on debate arguments
- [ ] WebSocket real-time streaming
- [ ] Mobile app

---

## 👨‍💻 Author

**Adarsh Misra**
- GitHub: [@Adarsh73111](https://github.com/Adarsh73111)

---

## 📄 License

MIT License — feel free to clone, modify and use!

---

<div align="center">

*Built with ☕ and AWS free tier*

**🏛️ Five Minds · One Truth · Zero Compromise**

</div>
