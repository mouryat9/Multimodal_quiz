import os, json, uuid
from app.core.config import settings

def ensure_dirs():
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(settings.JOB_DIR, exist_ok=True)
    os.makedirs(settings.VECTOR_DIR, exist_ok=True)

def new_job_id() -> str:
    return uuid.uuid4().hex[:10]

def job_path(job_id: str) -> str:
    return os.path.join(settings.JOB_DIR, f"{job_id}.json")

def save_job(job: dict):
    with open(job_path(job["id"]), "w", encoding="utf-8") as f:
        json.dump(job, f, ensure_ascii=False, indent=2)

def load_job(job_id: str) -> dict | None:
    p = job_path(job_id)
    if not os.path.exists(p):
        return None
    with open(p, "r", encoding="utf-8") as f:
        return json.load(f)

def list_jobs() -> list[dict]:
    if not os.path.exists(settings.JOB_DIR):
        return []
    items = []
    for fn in os.listdir(settings.JOB_DIR):
        if fn.endswith(".json"):
            with open(os.path.join(settings.JOB_DIR, fn), "r", encoding="utf-8") as f:
                items.append(json.load(f))
    items.sort(key=lambda x: x.get("id", ""), reverse=True)
    return items
