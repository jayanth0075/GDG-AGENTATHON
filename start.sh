#!/bin/bash

echo "========================================"
echo "  Starting Synapse AI Dashboard"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python3 is not installed"
    echo "Please install Python from https://python.org"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "[WARNING] Ollama not found"
    echo "Please install Ollama from https://ollama.ai"
    echo ""
fi

echo "[1/4] Setting up Backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
source venv/bin/activate
pip install -r requirements.txt --quiet

echo ""
echo "[2/4] Setting up Frontend..."
cd ../frontend

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing Node modules..."
    npm install
fi

echo ""
echo "[3/4] Starting Ollama..."
if command -v ollama &> /dev/null; then
    ollama serve &
    sleep 3
fi

echo ""
echo "[4/4] Starting Services..."
echo ""

# Start Backend
cd ../backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!

sleep 3

# Start Frontend
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "  Synapse AI Dashboard Started!"
echo "========================================"
echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "Ollama:   http://localhost:11434"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for user interrupt
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
