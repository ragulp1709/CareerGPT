from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "CareerGPT"
    APP_ENV: str = "development"
    SECRET_KEY: str = "change-me-in-production"
    DEBUG: bool = True

    OPENAI_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""

    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "careergpt"

    CHROMA_PERSIST_DIRECTORY: str = "./vector-db/chroma_db"
    CHROMA_COLLECTION_NAME: str = "careergpt_knowledge"

    CLERK_SECRET_KEY: str = ""
    CLERK_PUBLISHABLE_KEY: str = ""

    GITHUB_TOKEN: str = ""
    FRONTEND_URL: str = "http://localhost:3000"

    DEFAULT_LLM: str = "gemini"
    OPENAI_MODEL: str = "gpt-4o-mini"
    GEMINI_MODEL: str = "gemini-2.5-flash"
    EMBEDDING_MODEL: str = "text-embedding-3-small"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
