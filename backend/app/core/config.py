from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Company Research Assistant"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    OPENAI_API_KEY: str | None = None
    TAVILY_API_KEY: str | None = None
    FIRECRAWL_API_KEY: str | None = None
    DATABASE_URL: str | None = None

    class Config:
        env_file = ".env"

settings = Settings()
