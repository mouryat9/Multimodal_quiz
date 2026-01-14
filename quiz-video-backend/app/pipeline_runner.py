import os
from app.storage.file_store import load_job, save_job
from app.core.config import settings
from app.pipeline.video_io import extract_audio
from app.pipeline.transcribe import Transcriber
from app.pipeline.chunking import chunk_segments, segments_to_text
from app.pipeline.embed_store import VectorStore
from app.pipeline.quiz_gen import generate_quiz

def run_pipeline(job_id: str):
    job = load_job(job_id)
    if not job:
        return

    try:
        job["status"] = "RUNNING"
        job["progress"] = 10
        job["message"] = "Preparing…"
        save_job(job)

        video_path = job.get("artifacts", {}).get("video_path")
        if not video_path:
            # youtube not implemented yet
            job["status"] = "FAILED"
            job["progress"] = 100
            job["message"] = "YouTube download not implemented yet (Phase 1). Upload a file for now."
            save_job(job)
            return

        job_dir = os.path.join(settings.DATA_DIR, "jobs", job_id)
        os.makedirs(job_dir, exist_ok=True)
        wav_path = os.path.join(job_dir, "audio.wav")

        job["progress"] = 20
        job["message"] = "Extracting audio…"
        save_job(job)
        extract_audio(video_path, wav_path)

        job["progress"] = 40
        job["message"] = "Transcribing…"
        save_job(job)
        transcriber = Transcriber(settings.WHISPER_MODEL)
        segments = transcriber.transcribe(wav_path)

        job["progress"] = 60
        job["message"] = "Chunking transcript…"
        save_job(job)
        chunks = chunk_segments(segments)

        transcript = segments_to_text(segments)

        job["progress"] = 75
        job["message"] = "Building vector index…"
        save_job(job)
        store = VectorStore(settings.EMBED_MODEL)
        store.build_and_save(job_id, chunks)

        job["progress"] = 90
        job["message"] = "Generating quiz (Llama 3)…"
        save_job(job)
        quiz = generate_quiz(job_id)

        job["status"] = "SUCCEEDED"
        job["progress"] = 100
        job["message"] = "Done"
        job["result"] = {"transcript": transcript, "chunks": chunks, "quiz": quiz}
        save_job(job)

    except Exception as e:
        job["status"] = "FAILED"
        job["progress"] = 100
        job["message"] = f"Pipeline failed: {type(e).__name__}: {e}"
        save_job(job)
