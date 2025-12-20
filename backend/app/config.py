"""Application configuration powered by Pydantic settings."""

from functools import lru_cache
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Centralized runtime configuration."""

    app_name: str = "Synapse Intelligence Backend"
    environment: str = Field(default="development", validation_alias="ENVIRONMENT")
    ollama_base_url: str = Field(default="http://127.0.0.1:11434", validation_alias="OLLAMA_BASE_URL")
    allow_origins: List[str] = Field(default_factory=lambda: ["*"])
    data_refresh_seconds: int = Field(default=60, validation_alias="DATA_REFRESH_SECONDS")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    """Return cached settings instance."""

    return Settings()
