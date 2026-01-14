from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATA_DIR: str = "data"
    UPLOAD_DIR: str = "data/uploads"
    JOB_DIR: str = "data/jobs"
    VECTOR_DIR: str = "data/vectorstore"

    # Whisper model size: tiny/base/small/medium/large-v3 (CPU friendly: base/small)
    WHISPER_MODEL: str = "small"

    # Embedding model (good default)
    EMBED_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"

    # Llama 3 via Ollama (recommended for local)
    OLLAMA_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3"

settings = Settings()
