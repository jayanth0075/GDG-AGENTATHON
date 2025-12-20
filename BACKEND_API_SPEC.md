# Backend API Specification

Your backend (running on another laptop) must implement these endpoints for the frontend to work properly.

## Base URL
Configure in `frontend/.env`:
```env
VITE_API_URL=http://your-backend-url:8000
```

---

## 🔌 Required API Endpoints

### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "ollama": "connected",
  "timestamp": "2025-12-20T10:30:00"
}
```

**Purpose:** Check if backend and Ollama are running

---

### 2. Get Analytics Data
```http
GET /analytics
```

**Response:**
```json
{
  "executions": 340,
  "active_users": 16815,
  "new_users": 1457,
  "total_mentors": 2023,
  "total_revenue": 23902,
  "revenue_growth": "+17.3%",
  "community_growth": 65,
  "screen_time": 5.7,
  "crypto_fear_index": 70,
  "bills_topup": [
    {
      "name": "Electricity",
      "amount": 97,
      "due": "Oct 25"
    }
  ],
  "monthly_revenue": [
    {
      "month": "Jan",
      "value": 4000
    },
    {
      "month": "Feb",
      "value": 3500
    }
  ]
}
```

**Purpose:** Main dashboard metrics and charts data

---

### 3. Get Workflow Data
```http
GET /workflows
```

**Response:**
```json
{
  "total_executions": 340,
  "workflows": [
    {
      "name": "Data Processing",
      "executions": 120,
      "success_rate": 98
    },
    {
      "name": "Email Automation",
      "executions": 85,
      "success_rate": 100
    }
  ],
  "recent_activity": [
    {
      "workflow": "Data Processing",
      "timestamp": "2 mins ago",
      "status": "success"
    },
    {
      "workflow": "Email Automation",
      "timestamp": "15 mins ago",
      "status": "success"
    }
  ]
}
```

**Purpose:** Workflow performance and activity feed

---

### 4. Get Projects
```http
GET /projects
```

**Response:**
```json
{
  "ongoing_projects": 68.5,
  "compared_to_last_week": "+2.3%",
  "projects": [
    {
      "name": "Design Refresh",
      "status": "in_progress",
      "team": ["user1", "user2"]
    },
    {
      "name": "Mobile view",
      "status": "completed",
      "team": ["user3"]
    }
  ]
}
```

**Purpose:** Project management data

---

### 5. List Ollama Models
```http
GET /ollama/models
```

**Response:**
```json
{
  "models": [
    {
      "name": "llama2",
      "size": "7B",
      "modified_at": "2025-12-01T10:00:00"
    },
    {
      "name": "codellama",
      "size": "7B",
      "modified_at": "2025-12-10T15:30:00"
    }
  ]
}
```

**Purpose:** Get available AI models for chat

---

### 6. Send Chat Message to AI
```http
POST /chat
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "Hello, how are you?",
  "model": "llama2",
  "stream": false
}
```

**Response:**
```json
{
  "response": "I'm doing well, thank you for asking! How can I help you today?",
  "model": "llama2",
  "created_at": "2025-12-20T10:30:00"
}
```

**Purpose:** Chat with Ollama AI

---

## 🔒 CORS Configuration

Your backend MUST enable CORS to allow the frontend to connect:

### Python (FastAPI):
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Node.js (Express):
```javascript
const cors = require('cors');
app.use(cors());
```

---

## 🌐 Exposing Your Backend

If your backend is on another laptop, you need to make it accessible:

### Option 1: Same Network
```bash
# On backend laptop, find IP address:
ipconfig  # Windows
ifconfig  # Linux/Mac

# Start backend on 0.0.0.0 (all interfaces):
uvicorn main:app --host 0.0.0.0 --port 8000

# On frontend laptop, set in .env:
VITE_API_URL=http://192.168.1.XXX:8000
```

### Option 2: Tunnel (Recommended)
```bash
# On backend laptop:
ngrok http 8000
# Copy the https URL

# On frontend laptop, set in .env:
VITE_API_URL=https://abc123.ngrok.io
```

---

## 🧪 Testing Your Backend

### Test Health Endpoint:
```bash
curl http://your-backend-url:8000/health
```

### Test Chat Endpoint:
```bash
curl -X POST http://your-backend-url:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "model": "llama2"}'
```

### Test from Browser:
Open in browser:
```
http://your-backend-url:8000/health
http://your-backend-url:8000/analytics
```

---

## 📊 Response Status Codes

- `200 OK` - Success
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Endpoint doesn't exist
- `500 Internal Server Error` - Backend error
- `503 Service Unavailable` - Ollama not connected

---

## 🔄 Frontend API Service

The frontend calls your backend through `src/services/api.js`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Get analytics
export const getAnalytics = async () => {
  const response = await api.get('/analytics');
  return response.data;
};

// Send chat message
export const sendChatMessage = async (message, model = 'llama2') => {
  const response = await api.post('/chat', { message, model });
  return response.data;
};
```

---

## ✅ Checklist for Your Backend

- [ ] All 6 endpoints implemented
- [ ] CORS enabled
- [ ] Backend running on 0.0.0.0 (accessible from network)
- [ ] Ollama running and connected
- [ ] At least one Ollama model installed
- [ ] Backend accessible via IP or tunnel
- [ ] Frontend `.env` configured with backend URL
- [ ] Tested all endpoints with curl or browser

---

**Once your backend implements these endpoints, the frontend will work perfectly! 🚀**
