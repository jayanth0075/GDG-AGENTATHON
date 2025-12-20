"""Pydantic schemas shared across API endpoints."""

from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: Literal["healthy", "degraded", "unhealthy"]
    ollama: Literal["connected", "disconnected"]
    timestamp: datetime


class BillItem(BaseModel):
    name: str
    amount: float
    due: str


class MonthlyRevenuePoint(BaseModel):
    month: str
    value: float


class AnalyticsResponse(BaseModel):
    executions: int
    active_users: int
    new_users: int
    total_mentors: int
    total_revenue: float
    revenue_growth: str
    community_growth: int
    screen_time: float
    crypto_fear_index: int
    bills_topup: List[BillItem]
    monthly_revenue: List[MonthlyRevenuePoint]


class WorkflowItem(BaseModel):
    name: str
    executions: int
    success_rate: float


class RecentWorkflowActivity(BaseModel):
    workflow: str
    timestamp: str
    status: Literal["success", "failed", "running"]


class WorkflowsResponse(BaseModel):
    total_executions: int
    workflows: List[WorkflowItem]
    recent_activity: List[RecentWorkflowActivity]


class ProjectItem(BaseModel):
    name: str
    status: Literal["in_progress", "completed", "blocked", "not_started"]
    team: List[str]


class ProjectsResponse(BaseModel):
    ongoing_projects: float
    compared_to_last_week: str
    projects: List[ProjectItem]


class OllamaModel(BaseModel):
    name: str
    size: str
    modified_at: Optional[str] = None


class OllamaModelsResponse(BaseModel):
    models: List[OllamaModel]


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    model: str = Field(default="llama2")
    stream: bool = False


class ChatResponse(BaseModel):
    response: str
    model: str
    created_at: datetime
