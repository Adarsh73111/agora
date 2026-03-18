#!/bin/bash

echo "🏛️  AGORA — Setup Script"
echo "========================"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js v18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install
cd ..

# Create .env file
if [ ! -f backend/.env ]; then
    echo "⚙️  Creating .env file..."
    cat > backend/.env << 'ENVEOF'
GROQ_API_KEY=your_groq_api_key_here
NEWS_API_KEY=your_news_api_key_here
GMAIL_USER=your_gmail@gmail.com
GMAIL_PASS=your_gmail_app_password
PORT=3001
ENVEOF
    echo "⚠️  Please edit backend/.env with your API keys!"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your API keys"
echo "2. Run: npm run start:backend"
echo "3. Run: npm run start:frontend"
echo "4. Open: http://localhost:3000"
echo ""
echo "🏛️  Agora is ready!"
