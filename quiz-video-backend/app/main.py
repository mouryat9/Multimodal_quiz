from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes_upload import router as upload_router
from app.api.routes_jobs import router as jobs_router
from app.api.routes_quiz import router as quiz_router
from app.storage.file_store import ensure_dirs

app = FastAPI(title="Quiz Video Backend")

app.include_router(upload_router, prefix="/api")
app.include_router(jobs_router, prefix="/api")
app.include_router(quiz_router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://10.80.32.200:3000",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.on_event("startup")
def _startup():
    ensure_dirs()

@app.get("/api/health")
def health():
    return {"ok": True}

