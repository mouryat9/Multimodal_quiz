from fastapi import APIRouter, HTTPException
from app.storage.file_store import load_job

router = APIRouter()

@router.get("/jobs/{job_id}/quiz")
def get_quiz(job_id: str):
    job = load_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Not found")
    if not job.get("result") or not job["result"].get("quiz"):
        raise HTTPException(status_code=404, detail="Quiz not ready")
    return job["result"]["quiz"]
