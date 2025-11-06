#!/bin/bash

# Meeting Insights AI - Quick Setup Script
# This script sets up both backend and frontend

set -e  # Exit on error

echo "🚀 Setting up Meeting Insights AI..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo "${BLUE}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo "${RED}❌ Node.js is not installed. Please install Node.js 18+${NC}"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "${RED}❌ Docker is not installed. Please install Docker${NC}"
    exit 1
fi

echo "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

# Setup Backend
echo "${BLUE}Setting up Backend...${NC}"
cd backend

# Install dependencies
echo "📦 Installing backend dependencies..."
npm install

# Check for .env file
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo ""
    echo "${RED}⚠️  IMPORTANT: Please edit backend/.env and add your OPENAI_API_KEY${NC}"
    echo "   Get your key from: https://platform.openai.com/api-keys"
    echo ""
    read -p "Press Enter when you've added your OpenAI API key..."
fi

# Start PostgreSQL
echo "🐘 Starting PostgreSQL..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Initialize database
echo "🗄️  Initializing database..."
npm run db:generate
npm run db:push

echo "${GREEN}✅ Backend setup complete!${NC}"
cd ..
echo ""

# Setup Frontend
echo "${BLUE}Setting up Frontend...${NC}"
cd frontend

# Install dependencies
echo "📦 Installing frontend dependencies..."
npm install

echo "${GREEN}✅ Frontend setup complete!${NC}"
cd ..
echo ""

# Success message
echo "${GREEN}🎉 Setup complete!${NC}"
echo ""
echo "To start the application:"
echo ""
echo "${BLUE}Terminal 1 (Backend):${NC}"
echo "  cd backend && npm run dev"
echo ""
echo "${BLUE}Terminal 2 (Frontend):${NC}"
echo "  cd frontend && npm run dev"
echo ""
echo "Then open: ${BLUE}http://localhost:5173${NC}"
echo ""
echo "Enjoy! 🚀"
