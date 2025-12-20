"""FastAPI application that powers the Synapse dashboard backend."""

from datetime import datetime
import logging

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .schemas import (
    AnalyticsResponse,
    ChatRequest,
    ChatResponse,
    HealthResponse,
    OllamaModelsResponse,
    ProjectsResponse,
    WorkflowsResponse,
)
from .services.data import DataProvider
from .services.ollama import OllamaService, OllamaServiceError

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.app_name)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allow_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    data_provider = DataProvider()
    ollama_service = OllamaService(settings.ollama_base_url)

    @app.get("/health", response_model=HealthResponse)
    async def health_endpoint() -> HealthResponse:
        ollama_online = await ollama_service.is_online()
        status = "healthy" if ollama_online else "degraded"
        return HealthResponse(
            status=status,
            ollama="connected" if ollama_online else "disconnected",
            timestamp=datetime.utcnow(),
        )

    @app.get("/analytics", response_model=AnalyticsResponse)
    async def analytics_endpoint() -> AnalyticsResponse:
        payload = data_provider.analytics()
        return AnalyticsResponse(**payload)

    @app.get("/workflows", response_model=WorkflowsResponse)
    async def workflows_endpoint() -> WorkflowsResponse:
        payload = data_provider.workflows()
        return WorkflowsResponse(**payload)

    @app.get("/projects", response_model=ProjectsResponse)
    async def projects_endpoint() -> ProjectsResponse:
        payload = data_provider.projects()
        return ProjectsResponse(**payload)

    @app.get("/ollama/models", response_model=OllamaModelsResponse)
    async def list_models_endpoint() -> OllamaModelsResponse:
        models = await ollama_service.list_models()
        return OllamaModelsResponse(models=models)

    @app.post("/chat", response_model=ChatResponse)
    async def chat_endpoint(payload: ChatRequest) -> ChatResponse:
        try:
            answer = await ollama_service.chat(payload.message, payload.model, payload.stream)
        except OllamaServiceError as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc
        return ChatResponse(response=answer, model=payload.model, created_at=datetime.utcnow())

    return app


app = create_app()
