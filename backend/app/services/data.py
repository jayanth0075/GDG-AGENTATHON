"""Utility helpers for synthesizing dashboard-friendly data."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta
import random
from typing import Dict, List


@dataclass
class DataProvider:
    """Generate semi-realistic analytics payloads for the dashboard."""

    seed_offset_hours: int = 0
    _random: random.Random = field(init=False, repr=False)

    def __post_init__(self) -> None:
        self._random = self._build_rng()

    def _build_rng(self) -> random.Random:
        timestamp = datetime.utcnow() - timedelta(hours=self.seed_offset_hours)
        seed = int(timestamp.strftime("%Y%m%d%H"))
        return random.Random(seed)

    def refresh(self) -> None:
        """Rebuild the RNG seed so values drift over time."""

        self._random = self._build_rng()

    def _trend(self, base: float, variance: float = 0.1, digits: int = 2) -> float:
        delta = 1 + self._random.uniform(-variance, variance)
        return round(base * delta, digits)

    def health(self) -> Dict[str, str]:
        status = "healthy"
        return {
            "status": status,
            "ollama": "connected",
            "timestamp": datetime.utcnow().isoformat()
        }

    def analytics(self) -> Dict:
        self.refresh()
        executions = int(self._trend(360, 0.12, 0))
        active_users = int(self._trend(16800, 0.08, 0))
        new_users = int(self._trend(1500, 0.18, 0))
        total_mentors = int(self._trend(2025, 0.03, 0))
        total_revenue = round(self._trend(24000, 0.2), 2)
        community_growth = int(self._trend(65, 0.2, 0))
        screen_time = self._trend(5.7, 0.05)
        crypto_index = min(100, max(0, int(self._trend(72, 0.25, 0))))

        monthly_revenue = [
            {"month": month, "value": self._trend(value, 0.18, 0)}
            for month, value in [
                ("Jan", 4000),
                ("Feb", 3500),
                ("Mar", 4800),
                ("Apr", 5200),
                ("May", 6100),
                ("Jun", 7200),
            ]
        ]

        bills = [
            {"name": "Electricity", "amount": 97, "due": "Oct 25"},
            {"name": "Cloud", "amount": 312, "due": "Oct 26"},
        ]

        return {
            "executions": executions,
            "active_users": active_users,
            "new_users": new_users,
            "total_mentors": total_mentors,
            "total_revenue": total_revenue,
            "revenue_growth": "+17.3%",
            "community_growth": community_growth,
            "screen_time": screen_time,
            "crypto_fear_index": crypto_index,
            "bills_topup": bills,
            "monthly_revenue": monthly_revenue,
        }

    def workflows(self) -> Dict:
        workflows = [
            {
                "name": "Data Processing",
                "executions": int(self._trend(120, 0.15, 0)),
                "success_rate": round(self._trend(98, 0.01), 1),
            },
            {
                "name": "Email Automation",
                "executions": int(self._trend(85, 0.18, 0)),
                "success_rate": 100,
            },
            {
                "name": "Customer Support",
                "executions": int(self._trend(65, 0.12, 0)),
                "success_rate": round(self._trend(96, 0.02), 1),
            },
        ]
        total_executions = sum(item["executions"] for item in workflows)

        recent_activity: List[Dict[str, str]] = []
        for workflow in workflows:
            recent_activity.append({
                "workflow": workflow["name"],
                "timestamp": "2 mins ago",
                "status": "success",
            })
        recent_activity.append({
            "workflow": "Data Processing",
            "timestamp": "15 mins ago",
            "status": "success",
        })

        return {
            "total_executions": total_executions,
            "workflows": workflows,
            "recent_activity": recent_activity,
        }

    def projects(self) -> Dict:
        projects = [
            {"name": "Design Refresh", "status": "in_progress", "team": ["alice", "sarah", "nora"]},
            {"name": "Mobile View", "status": "completed", "team": ["lee"]},
            {"name": "Workflow AI", "status": "in_progress", "team": ["sam", "bruno"]},
        ]
        return {
            "ongoing_projects": round(self._trend(68.5, 0.04), 1),
            "compared_to_last_week": "+2.3%",
            "projects": projects,
        }
