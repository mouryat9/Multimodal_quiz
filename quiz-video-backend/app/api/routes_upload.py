import os
import aiofiles
from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from app.storage.file_store import ensure_dirs, new_job_id, save_job
from app.core.config import settings

router = APIRouter()

class YoutubeBody(BaseModel):
    youtubeUrl: str

@router.post("/upload")
async def upload_video(file: UploadFile = File(None), body: YoutubeBody | None = None):
    ensure_dirs()
    job_id = new_job_id()

    if file is not None:
        job_input = {"type": "file", "filename": file.filename}
        video_path = os.path.join(settings.UPLOAD_DIR, f"{job_id}_{file.filename}")
        async with aiofiles.open(video_path, "wb") as f:
            content = await file.read()
            await f.write(content)
    else:
        if body is None or not body.youtubeUrl:
            raise HTTPException(status_code=400, detail="Provide file or youtubeUrl")
        # Phase 1: we accept the URL but do NOT download yet.
        # Later you can add yt-dlp downloading into uploads/.
        job_input = {"type": "youtube", "youtubeUrl": body.youtubeUrl}
        video_path = None

    job = {
        "id": job_id,
        "status": "QUEUED",
        "progress": 0,
        "message": "Queued",
        "input": job_input,
        "result": None,
        "artifacts": {"video_path": video_path}
    }
    save_job(job)
    return job
