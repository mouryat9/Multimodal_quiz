from fastapi import APIRouter, HTTPException, BackgroundTasks
from app.storage.file_store import list_jobs, load_job, save_job
from app.pipeline_runner import run_pipeline

router = APIRouter()

@router.get("/jobs")
def get_jobs():
    return list_jobs()

@router.get("/jobs/{job_id}")
def get_job(job_id: str):
    job = load_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Not found")
    return job

@router.post("/jobs/{job_id}/run")
def run_job(job_id: str, bg: BackgroundTasks):
    job = load_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Not found")

    # kick off pipeline async
    bg.add_task(run_pipeline, job_id)
    job["status"] = "RUNNING"
    job["progress"] = 5
    job["message"] = "Started pipeline…"
    save_job(job)
    return job
