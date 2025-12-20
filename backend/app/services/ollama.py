"""Helpers for interacting with a local Ollama instance."""

from __future__ import annotations

import logging
from datetime import datetime
from typing import Any, Dict, List

import httpx

logger = logging.getLogger(__name__)


class OllamaServiceError(RuntimeError):
    """Raised when Ollama cannot fulfill a request."""


class OllamaService:
    def __init__(self, base_url: str, timeout: float = 30.0) -> None:
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    async def _request(self, method: str, path: str, **kwargs) -> httpx.Response:
        url = f"{self.base_url}{path}"
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.request(method, url, **kwargs)
        response.raise_for_status()
        return response

    async def is_online(self) -> bool:
        try:
            await self._request("GET", "/api/tags")
            return True
        except httpx.HTTPError as exc:
            logger.debug("Ollama health check failed: %s", exc)
            return False

    async def list_models(self) -> List[Dict[str, Any]]:
        try:
            response = await self._request("GET", "/api/tags")
            payload = response.json()
            models = payload.get("models", [])
            if not isinstance(models, list):
                raise ValueError("Unexpected Ollama tag payload")
            return [
                {
                    "name": model.get("name", "unknown"),
                    "size": self._humanize_size(model.get("size", 0)),
                    "modified_at": model.get("modified_at"),
                }
                for model in models
            ]
        except (httpx.HTTPError, ValueError) as exc:
            logger.warning("Falling back to sample Ollama models: %s", exc)
            return [
                {"name": "llama2", "size": "7B", "modified_at": "2025-12-01T10:00:00"},
                {"name": "codellama", "size": "7B", "modified_at": "2025-12-10T15:30:00"},
            ]

    async def chat(self, message: str, model: str, stream: bool = False) -> str:
        payload = {
            "model": model,
            "messages": [
                {"role": "user", "content": message},
            ],
            "stream": stream,
        }
        try:
            response = await self._request("POST", "/api/chat", json=payload)
            data = response.json()
            content = data.get("message", {}).get("content") or data.get("response")
            if not content:
                raise OllamaServiceError("Ollama response did not include content")
            return content.strip()
        except httpx.HTTPError as exc:
            logger.error("Ollama chat error: %s", exc)
            raise OllamaServiceError("Unable to reach Ollama. Is it running?") from exc

    @staticmethod
    def _humanize_size(value: Any) -> str:
        try:
            size = float(value)
        except (TypeError, ValueError):
            return str(value)
        if size <= 0:
            return "0B"
        suffixes = ["B", "KB", "MB", "GB", "TB"]
        idx = 0
        while size >= 1024 and idx < len(suffixes) - 1:
            size /= 1024
            idx += 1
        if suffixes[idx] == "B":
            return f"{int(size)}B"
        return f"{size:.1f}{suffixes[idx]}"
