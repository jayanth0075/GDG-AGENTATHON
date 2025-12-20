# Synapse Intelligence Backend

FastAPI service that implements every endpoint required by the dashboard. It ships with
real Ollama integrations (when available) and dynamic mock data so the frontend always has
healthy responses.

## 📦 Tech Stack

- FastAPI + Uvicorn
- httpx async client for Ollama
- Pydantic v2 + pydantic-settings for configuration

## 🚀 Getting Started

```bash
cd backend
python -m venv .venv
.venv\\Scripts\\activate   # Windows
pip install -r requirements.txt

# optional: copy settings
cp .env.example .env

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Visit http://localhost:8000/docs to explore the OpenAPI docs.

## ⚙️ Configuration

All settings are managed through environment variables (see `app/config.py`). Create an
`.env` file in the backend directory to override defaults:

```
OLLAMA_BASE_URL=http://127.0.0.1:11434
ENVIRONMENT=production
DATA_REFRESH_SECONDS=60
ALLOW_ORIGINS=http://localhost:3000
```

`ALLOW_ORIGINS` accepts a comma-separated list. When left unset it defaults to `*` so the
frontend can talk to it immediately.

## 🔌 Ollama Integration

- `/ollama/models` queries `GET /api/tags` on your Ollama host.
- `/chat` forwards to `POST /api/chat` with the provided model name.
- If Ollama is offline, the API falls back to curated sample data and returns an HTTP 503
  for chat requests so the frontend can display an error toast.

Ensure `ollama serve` (or the desktop app) is running and that the models you request are
pulled locally.

## 🧪 Endpoint Summary

| Method | Path             | Description                       |
| ------ | ---------------- | --------------------------------- |
| GET    | `/health`        | Backend + Ollama heartbeat        |
| GET    | `/analytics`     | Dashboard KPI payload             |
| GET    | `/workflows`     | Workflow metrics + activity feed  |
| GET    | `/projects`      | Project portfolio stats           |
| GET    | `/ollama/models` | Available Ollama models           |
| POST   | `/chat`          | Send a prompt to Ollama           |

All contracts mirror `BACKEND_API_SPEC.md` so the frontend can consume them without any
diff.

## 🌐 Exposing the Backend

Once the service is running locally you can tunnel it with Cloudflare or Ngrok and set the
resulting URL in `frontend/.env` as `VITE_API_URL`.

## ✅ Next Steps

- Wire the backend into your production data sources inside `app/services/data.py`.
- Deploy the FastAPI app to Fly.io, Render, Railway, or any VM and keep the `OLLAMA_BASE_URL`
  pointing to your secure Ollama instance.
