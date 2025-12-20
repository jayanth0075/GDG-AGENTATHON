# Cloudflare Tunnel Setup Guide

This guide shows you how to expose your backend using Cloudflare Tunnel so your frontend can connect to it.

## 🚀 Quick Start

### On Your Backend Laptop:

#### 1. Install Cloudflared
**Windows:**
```powershell
# Download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation/
# Or use winget:
winget install --id Cloudflare.cloudflared
```

**Linux/Mac:**
```bash
# Linux
curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared.deb

# Mac
brew install cloudflared
```

#### 2. Start Your Backend
Make sure your backend is running on port 8000:
```bash
# Your backend should be running on localhost:8000
# Make sure Ollama is also running
```

#### 3. Create Tunnel (Quick Method)
```bash
# This creates a temporary tunnel (no login required)
cloudflared tunnel --url http://localhost:8000
```

You'll see output like:
```
2025-12-20 10:30:00 INF +--------------------------------------------------------------------------------------------+
2025-12-20 10:30:00 INF |  Your quick Tunnel has been created! Visit it at:                                         |
2025-12-20 10:30:00 INF |  https://abc-123-def.trycloudflare.com                                                   |
2025-12-20 10:30:00 INF +--------------------------------------------------------------------------------------------+
```

**Copy that URL!** ☝️

#### 4. Optional: Create Named Tunnel (Persistent)

If you want a persistent tunnel that doesn't change:

```bash
# Login to Cloudflare
cloudflared tunnel login

# Create a named tunnel
cloudflared tunnel create synapse-backend

# Route traffic
cloudflared tunnel route dns synapse-backend api.yourdomain.com

# Run the tunnel
cloudflared tunnel run synapse-backend
```

---

### On Your Frontend Laptop:

#### 1. Update Frontend Configuration

Edit `frontend/.env`:
```env
VITE_API_URL=https://abc-123-def.trycloudflare.com
```

Replace `abc-123-def.trycloudflare.com` with YOUR tunnel URL from step 3 above.

#### 2. Restart Frontend
```bash
cd frontend
npm run dev
```

---

## 🔄 Complete Workflow

### Backend Laptop:
```bash
# 1. Start Ollama
ollama serve

# 2. Start your backend
python main.py  # or however you start your backend

# 3. Start Cloudflare tunnel (in a new terminal)
cloudflared tunnel --url http://localhost:8000

# 4. Copy the tunnel URL
```

### Frontend Laptop:
```bash
# 1. Update .env with tunnel URL
# Edit frontend/.env

# 2. Start frontend
cd frontend
npm run dev

# 3. Open http://localhost:3000
```

---

## 🎯 Testing Connection

### 1. Test Backend Directly
Open the tunnel URL in your browser:
```
https://your-tunnel.trycloudflare.com/health
```

You should see backend health status.

### 2. Test from Frontend
```bash
# From frontend directory
curl https://your-tunnel.trycloudflare.com/health
```

### 3. Test AI Chat
```bash
curl -X POST https://your-tunnel.trycloudflare.com/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "model": "llama2"}'
```

---

## 🔒 Backend CORS Configuration

Your backend MUST allow CORS for the tunnel URL.

### Python (FastAPI):
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local frontend
        "https://*.trycloudflare.com",  # Cloudflare tunnels
        "https://your-frontend-domain.com"  # If frontend is deployed
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Or allow all (for development):
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🛠️ Automation Scripts

### Backend Startup Script (Windows)

Create `start-backend-with-tunnel.bat` on backend laptop:
```batch
@echo off
echo Starting Backend with Cloudflare Tunnel...
echo.

REM Start Ollama
start "Ollama" cmd /k "ollama serve"
timeout /t 3 /nobreak >nul

REM Start Backend
start "Backend" cmd /k "python main.py"
timeout /t 5 /nobreak >nul

REM Start Cloudflare Tunnel
echo.
echo Starting Cloudflare Tunnel...
echo Copy the tunnel URL and paste it in your frontend .env file
echo.
cloudflared tunnel --url http://localhost:8000

pause
```

### Backend Startup Script (Linux/Mac)

Create `start-backend-with-tunnel.sh`:
```bash
#!/bin/bash

echo "Starting Backend with Cloudflare Tunnel..."
echo ""

# Start Ollama
ollama serve &
sleep 3

# Start Backend
python main.py &
sleep 5

# Start Cloudflare Tunnel
echo ""
echo "Starting Cloudflare Tunnel..."
echo "Copy the tunnel URL and paste it in your frontend .env file"
echo ""
cloudflared tunnel --url http://localhost:8000
```

Make it executable:
```bash
chmod +x start-backend-with-tunnel.sh
./start-backend-with-tunnel.sh
```

---

## 🔧 Troubleshooting

### Tunnel URL Changes Every Time
**Problem:** Quick tunnels generate random URLs
**Solution:** Create a named tunnel (see step 4 above)

### CORS Errors
**Problem:** Frontend can't connect due to CORS
**Solution:** Update backend CORS configuration to allow tunnel domain

### Connection Refused
**Problem:** Backend not reachable through tunnel
**Solution:** 
- Make sure backend is running on localhost:8000
- Check backend logs for errors
- Test backend locally first: `curl http://localhost:8000/health`

### Tunnel Won't Start
**Problem:** Cloudflared command not found
**Solution:** 
- Reinstall cloudflared
- Add to PATH
- Use full path to executable

### Slow Response
**Problem:** API calls are slow through tunnel
**Solution:** 
- Cloudflare tunnels add ~100-200ms latency
- This is normal for tunneled connections
- For better performance, consider same-network connection

---

## 📊 Architecture

```
┌─────────────────────┐
│  Frontend Laptop    │
│                     │
│  http://localhost:  │
│       3000          │
└──────────┬──────────┘
           │
           │ HTTPS
           │
           ▼
  ┌────────────────────┐
  │  Cloudflare Edge   │
  │  (Global Network)  │
  └────────┬───────────┘
           │
           │ Secure Tunnel
           │
           ▼
┌──────────────────────┐
│  Backend Laptop      │
│                      │
│  ┌────────────────┐  │
│  │ Your Backend   │  │
│  │ Port 8000      │  │
│  └────────────────┘  │
│                      │
│  ┌────────────────┐  │
│  │ Ollama         │  │
│  │ Port 11434     │  │
│  └────────────────┘  │
└──────────────────────┘
```

---

## ⚡ Benefits of Cloudflare Tunnel

✅ **No Port Forwarding** - No router configuration needed
✅ **Encrypted** - All traffic through Cloudflare is HTTPS
✅ **No Firewall Issues** - Works behind NAT and firewalls
✅ **Global CDN** - Fast access from anywhere
✅ **DDoS Protection** - Built-in Cloudflare protection
✅ **Free Tier Available** - No cost for basic usage

---

## 🎉 You're All Set!

Your frontend can now communicate with your backend through Cloudflare Tunnel, no matter where your backend laptop is located!

**Pro Tip:** Keep the tunnel terminal window open. If you close it, the tunnel stops and your frontend won't be able to connect.
