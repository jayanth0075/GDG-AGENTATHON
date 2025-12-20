# Synapse AI Dashboard - Frontend

A modern, AI-powered dashboard frontend that connects to your backend via **Cloudflare Tunnel**.

## 🚀 Features

- **Beautiful Dark UI** - Modern, glassmorphic design with smooth animations
- **AI Integration** - Connect to your Ollama-powered backend  
- **Real-time Analytics** - Track executions, users, revenue, and more
- **Workflow Management** - Monitor and manage your automation workflows
- **Interactive Charts** - Visualize your data with beautiful charts
- **Cloudflare Tunnel Ready** - Secure connection to remote backend

## 📋 Prerequisites

1. **Node.js 18+** and npm installed
2. **Your Backend** running on another laptop with Cloudflare Tunnel

## 🚀 Quick Start

### 1. On Backend Laptop:

```bash
# Install Cloudflared
winget install --id Cloudflare.cloudflared

# Start your backend
python main.py

# Start Cloudflare Tunnel (in new terminal)
cloudflared tunnel --url http://localhost:8000

# Copy the tunnel URL (e.g., https://abc-123.trycloudflare.com)
```

### 2. On Frontend Laptop:

```bash
# Clone/navigate to project
cd AGENTATHON/frontend

# Install dependencies
npm install

# Configure backend URL
# Edit frontend/.env and paste your tunnel URL:
VITE_API_URL=https://abc-123.trycloudflare.com

# Start frontend
npm run dev
```

**Frontend**: http://localhost:3000

## 🛠️ Configuration

### Edit `frontend/.env`:

```env
# Your Cloudflare Tunnel URL (from backend laptop)
VITE_API_URL=https://your-tunnel.trycloudflare.com

# Or custom domain
# VITE_API_URL=https://api.yourdomain.com
```

## 📖 Documentation

- **[CLOUDFLARE_TUNNEL_GUIDE.md](CLOUDFLARE_TUNNEL_GUIDE.md)** - Complete Cloudflare Tunnel setup
- **[BACKEND_API_SPEC.md](BACKEND_API_SPEC.md)** - Required backend API endpoints
- **[FRONTEND_GUIDE.md](FRONTEND_GUIDE.md)** - Frontend features and customization

## 📁 Project Structure

```
AGENTATHON/
├── frontend/
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Dashboard.jsx    # Main dashboard layout
│   │   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   │   ├── MetricCard.jsx   # Metric display cards
│   │   │   ├── AIChat.jsx       # AI chat interface
│   │   │   ├── CalendarWidget.jsx
│   │   │   ├── TodoWidget.jsx
│   │   │   ├── CryptoWidget.jsx
│   │   │   ├── TeamWidget.jsx
│   │   │   ├── FearGreedIndex.jsx
│   │   │   └── MediaWidget.jsx
│   │   ├── services/            # API services
│   │   │   └── api.js           # Backend API calls
│   │   ├── App.jsx              # Main app
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── .env                     # Backend URL config
│   ├── package.json             # Dependencies
│   ├── vite.config.js           # Vite config
│   └── tailwind.config.js       # Tailwind config
├── start.bat                    # Windows startup
├── CLOUDFLARE_TUNNEL_GUIDE.md   # Tunnel setup guide
├── BACKEND_API_SPEC.md          # API documentation
└── README.md
```

## 🎯 Usage

1. **Start Backend** (on other laptop)
   - Ensure Ollama is running
   - Start your backend server
   - Start Cloudflare tunnel

2. **Configure Frontend**
   - Update `frontend/.env` with tunnel URL
   
3. **Start Frontend**
   ```bash
   npm run dev
   ```
   Or use: `start.bat`

4. **Access Dashboard**
   - Open http://localhost:3000
   - Click "AI Assistant" to chat with Ollama

## 📊 Backend API Requirements

Your backend must implement these endpoints:

- `GET /health` - Backend & Ollama status
- `GET /analytics` - Dashboard metrics
- `GET /workflows` - Workflow data
- `GET /projects` - Project data
- `GET /ollama/models` - Available AI models
- `POST /chat` - Send messages to Ollama

See [BACKEND_API_SPEC.md](BACKEND_API_SPEC.md) for details.

## 🐛 Troubleshooting

### Cannot Connect to Backend

1. **Verify Tunnel URL**
   ```bash
   # Test in browser
   https://your-tunnel.trycloudflare.com/health
   ```

2. **Check .env file**
   ```env
   VITE_API_URL=https://your-tunnel.trycloudflare.com
   ```

3. **Restart frontend**
   ```bash
   npm run dev
   ```

### CORS Errors

Your backend must allow CORS:
```python
# Python/FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Tunnel Connection Issues

- Ensure Cloudflared is running on backend laptop
- Check backend is running on localhost:8000
- Verify Ollama is running: `ollama serve`

## 🎨 Customization

### Change Colors
Edit `frontend/tailwind.config.js`

### Add Widgets
1. Create component in `src/components/`
2. Import in `Dashboard.jsx`
3. Add to grid layout

### Update Data
Connect to your real data sources in backend

## 📦 Build for Production

```bash
cd frontend
npm run build

# Deploy dist/ folder to:
# - Vercel
# - Netlify  
# - Cloudflare Pages
# - Any static hosting
```

## 🌐 Architecture

```
┌─────────────────────┐
│  Frontend Laptop    │
│                     │
│  http://localhost:  │
│       3000          │
└──────────┬──────────┘
           │ HTTPS
           ▼
  ┌────────────────────┐
  │  Cloudflare Edge   │
  └────────┬───────────┘
           │ Secure Tunnel
           ▼
┌──────────────────────┐
│  Backend Laptop      │
│  ┌────────────────┐  │
│  │ Backend:8000   │  │
│  │ Ollama:11434   │  │
│  └────────────────┘  │
└──────────────────────┘
```

## ⚡ Features Implemented

✅ **Metric Cards** - Executions, users, revenue with trends  
✅ **Interactive Charts** - Area, bar, line charts with Recharts  
✅ **Calendar Widget** - Full-featured calendar  
✅ **Todo List** - Task management  
✅ **Crypto Widget** - Wallet balance tracking  
✅ **Team Management** - Progress bars, avatars  
✅ **Fear & Greed Index** - Circular gauge  
✅ **Media Library** - File statistics  
✅ **Activity Feed** - Real-time updates  
✅ **AI Chat** - Ollama integration  

## 📝 License

MIT License - free to use for your projects

---

**Built with** ❤️ **using React, Vite, Tailwind CSS, and Cloudflare Tunnel**

🔗 **Need Help?** Check the guides:
- [CLOUDFLARE_TUNNEL_GUIDE.md](CLOUDFLARE_TUNNEL_GUIDE.md) 
- [BACKEND_API_SPEC.md](BACKEND_API_SPEC.md)
- [FRONTEND_GUIDE.md](FRONTEND_GUIDE.md)
