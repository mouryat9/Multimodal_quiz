from pydantic import BaseModel
from typing import Literal, Optional, List, Dict

JobStatus = Literal["QUEUED", "RUNNING", "SUCCEEDED", "FAILED"]

class JobInput(BaseModel):
    type: Literal["file", "youtube"]
    filename: Optional[str] = None
    youtubeUrl: Optional[str] = None

class JobResult(BaseModel):
    transcript: str
    chunks: List[Dict]
    quiz: Optional[Dict] = None

class Job(BaseModel):
    id: str
    status: JobStatus
    progress: int
    message: Optional[str] = None
    input: JobInput
    result: Optional[JobResult] = None
