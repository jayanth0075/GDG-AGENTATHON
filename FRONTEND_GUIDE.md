# Synapse AI Dashboard - Frontend Setup

## 🎨 Features Implemented

Your frontend includes ALL the features from the reference images:

### ✅ Core Dashboard Components
- **Metric Cards** - Displaying executions, users, revenue with trend indicators
- **Interactive Charts** - Area charts, bar charts, line charts with Recharts
- **Calendar Widget** - Full-featured calendar with date selection and navigation
- **Todo List** - Add, complete, and delete tasks with timestamps
- **Crypto/Wallet Widget** - Display wallet balance and crypto prices with trends
- **Team Management** - Show team progress, members, and tasks
- **Fear & Greed Index** - Circular progress indicator with color coding
- **Media Library** - Display file counts for images, videos, documents, audio
- **Recent Activity** - Live feed of workflow executions and updates

### ✅ AI Integration
- **Ollama Connection** - Direct integration with your local Ollama AI
- **AI Chat Interface** - Full-featured chat with model selection
- **Real-time Status** - Connection indicator for backend and Ollama

### ✅ Design Features
- **Dark Theme** - Beautiful dark mode with glassmorphic effects
- **Smooth Animations** - Fade-in effects, hover states, transitions
- **Responsive Grid** - Adapts to different screen sizes
- **Modern Icons** - Using Lucide React icons throughout
- **Gradient Accents** - Blue-to-purple gradients matching the reference images
- **Card-based Layout** - Consistent card design with blur effects

## 🔌 Connecting to Your Backend

### Backend API Configuration

The frontend is configured to connect to your backend via the `.env` file:

```env
VITE_API_URL=http://localhost:8000
```

### API Service (`src/services/api.js`)

The frontend uses these endpoints from your backend:

```javascript
// Health Check
GET /health

// Analytics Data
GET /analytics

// Workflow Data
GET /workflows

// Project Data
GET /projects

// Ollama Models
GET /ollama/models

// AI Chat
POST /chat
{
  "message": "Your message here",
  "model": "llama2"
}
```

### Your Backend Must Implement These Endpoints:

1. **`GET /health`** - Return backend and Ollama status
   ```json
   {
     "status": "healthy",
     "ollama": "connected",
     "timestamp": "2025-12-20T10:30:00"
   }
   ```

2. **`GET /analytics`** - Return dashboard metrics
   ```json
   {
     "executions": 340,
     "active_users": 16815,
     "new_users": 1457,
     "total_mentors": 2023,
     "total_revenue": 23902,
     "revenue_growth": "+17.3%",
     "monthly_revenue": [
       {"month": "Jan", "value": 4000},
       {"month": "Feb", "value": 3500}
     ]
   }
   ```

3. **`GET /workflows`** - Return workflow data
   ```json
   {
     "total_executions": 340,
     "workflows": [
       {
         "name": "Data Processing",
         "executions": 120,
         "success_rate": 98
       }
     ],
     "recent_activity": [
       {
         "workflow": "Data Processing",
         "timestamp": "2 mins ago",
         "status": "success"
       }
     ]
   }
   ```

4. **`GET /ollama/models`** - List available Ollama models
   ```json
   {
     "models": [
       {"name": "llama2", "size": "7B"},
       {"name": "codellama", "size": "7B"}
     ]
   }
   ```

5. **`POST /chat`** - Send message to Ollama
   ```json
   // Request
   {
     "message": "Hello, how are you?",
     "model": "llama2"
   }
   
   // Response
   {
     "response": "I'm doing well, thank you!",
     "model": "llama2",
     "created_at": "2025-12-20T10:30:00"
   }
   ```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Backend URL
Edit `frontend/.env`:
```env
# For local development
VITE_API_URL=http://localhost:8000

# For tunneled access (ngrok, cloudflare, etc.)
VITE_API_URL=https://your-tunnel-url.com
```

### 3. Start Development Server
```bash
npm run dev
```

Frontend will be available at: `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

Production files will be in `frontend/dist/`

## 🌐 Using with Tunnels

### With ngrok:
```bash
# Tunnel your backend
ngrok http 8000

# Update .env
VITE_API_URL=https://abc123.ngrok.io

# Restart frontend
npm run dev
```

### With Cloudflare Tunnel:
```bash
# Tunnel backend
cloudflared tunnel --url http://localhost:8000

# Update .env with the cloudflare URL
VITE_API_URL=https://your-tunnel.trycloudflare.com

# Restart frontend
npm run dev
```

### With LocalTunnel:
```bash
# Tunnel backend
lt --port 8000 --subdomain mysynapse

# Update .env
VITE_API_URL=https://mysynapse.loca.lt

# Restart frontend
npm run dev
```

## 📁 Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── AIChat.jsx          # AI chat interface with Ollama
│   │   ├── Dashboard.jsx       # Main dashboard layout
│   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   ├── MetricCard.jsx      # Reusable metric card
│   │   ├── CalendarWidget.jsx  # Interactive calendar
│   │   ├── TodoWidget.jsx      # Todo list manager
│   │   ├── CryptoWidget.jsx    # Wallet/crypto display
│   │   ├── TeamWidget.jsx      # Team progress display
│   │   ├── FearGreedIndex.jsx  # Circular progress gauge
│   │   └── MediaWidget.jsx     # Media file statistics
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles
├── .env                        # Environment variables
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
└── tailwind.config.js          # Tailwind CSS config
```

## 🎨 Customization

### Change Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  dark: {
    100: '#1a1a1a',  // Your custom dark colors
    200: '#2d2d2d',
  },
}
```

### Add New Widgets
1. Create component in `src/components/`
2. Import in `Dashboard.jsx`
3. Add to grid layout

### Update API Endpoints
Edit `src/services/api.js` to match your backend routes

## 🐛 Troubleshooting

### Backend Connection Failed
- Check if backend is running on port 8000
- Verify VITE_API_URL in `.env`
- Check browser console for CORS errors

### Ollama Not Connected
- Ensure Ollama is running: `ollama serve`
- Check if models are installed: `ollama list`
- Test Ollama: `ollama run llama2 "Hello"`

### Charts Not Rendering
- Clear browser cache
- Check if data format matches expected structure
- Verify Recharts is installed: `npm list recharts`

## 📊 Data Flow

```
User Action → Frontend Component → API Service → Your Backend → Ollama
                                                      ↓
                                                   Database
                                                      ↓
User sees result ← Frontend Component ← Response ← Your Backend
```

## 🔒 Production Deployment

### Environment Variables for Production:
```env
VITE_API_URL=https://your-production-backend.com
```

### Build & Deploy:
```bash
npm run build
# Deploy contents of dist/ folder to your hosting service
```

### Hosting Options:
- **Vercel**: `vercel deploy`
- **Netlify**: `netlify deploy`
- **Cloudflare Pages**: Push to GitHub
- **Static Server**: Serve `dist/` folder

## 🎯 Next Steps

1. **Connect to Real Data**: Update your backend endpoints to return actual data
2. **Add Authentication**: Implement user login and protected routes
3. **Real-time Updates**: Add WebSocket for live data updates
4. **More Widgets**: Create custom widgets for your specific needs
5. **Mobile App**: Consider React Native for mobile version

---

**Your frontend is ready! Just make sure your backend implements the required API endpoints and you're good to go! 🚀**
