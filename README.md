# Multimodal Quiz Generation (RAG-based)

An end-to-end system for generating quizzes from lecture videos using
Automatic Speech Recognition (ASR), Vector Search (RAG), and LLaMA 3.

This project supports:
- Uploading lecture videos (MP4)
- (Planned) YouTube URL ingestion
- Transcription using Whisper
- Vector indexing using FAISS
- Quiz generation using LLaMA 3 (via Ollama)
- A modern Next.js UI for monitoring jobs and viewing results

---

## Repository Structure

Multimodal_quiz/
- quiz-video-ui/        : Next.js frontend
- quiz-video-backend/   : FastAPI backend (RAG pipeline)
- quiz-dev-runner/      : Cross-platform dev runner
- .gitignore
- README.md

---

## Architecture Overview

Pipeline flow:
1. Video upload via UI
2. Backend job creation
3. Audio extraction (FFmpeg)
4. Transcription (Whisper)
5. Chunking + embedding
6. Vector indexing (FAISS)
7. Quiz generation (LLaMA 3)
8. Results displayed in UI

---

## Prerequisites

System-level requirements:
- Node.js 18+
- Python 3.12 (recommended)
- FFmpeg
- Git
- Ollama (for LLaMA 3)

---

## Installing FFmpeg

Windows:
winget install Gyan.FFmpeg

Verify:
ffmpeg -version

Linux (Ubuntu):
sudo apt update
sudo apt install ffmpeg -y

---

## Backend Setup (FastAPI)

Step 1: Create Python 3.12 virtual environment
cd quiz-video-backend
py -3.12 -m venv .venv
.\.venv\Scripts\activate

Verify:
python --version

---

Step 2: Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

requirements.txt was generated using:
pip freeze > requirements.txt

---

Step 3: Start Ollama and pull LLaMA 3
ollama pull llama3
ollama serve

Test:
ollama run llama3 "Say hello"

---

Step 4: Run backend
uvicorn app.main:app --reload --port 8000

Health check:
http://localhost:8000/api/health

Expected:
{ "ok": true }

---

## Frontend Setup (Next.js)

Step 1: Install dependencies
cd quiz-video-ui
npm install

---

Step 2: Configure backend API endpoint
Create quiz-video-ui/.env.local with:
NEXT_PUBLIC_API_BASE=http://localhost:8000/api

---

Step 3: Start frontend
npm run dev

Open:
http://localhost:3000

---

## Running UI + Backend Together

Using the dev runner:
cd quiz-dev-runner
npm run dev

This starts:
- Frontend at http://localhost:3000
- Backend at http://localhost:8000

---

## Backend API Endpoints

POST /api/upload              : Upload video or YouTube URL
POST /api/jobs/{id}/run       : Start processing pipeline
GET  /api/jobs                : List all jobs
GET  /api/jobs/{id}           : Job details and results
GET  /api/jobs/{id}/quiz      : Generated quiz

---

## Moving Project to Another Machine or Server

1. Clone repository
git clone git@github.com:mouryat9/Multimodal_quiz.git

2. Create environment
cd quiz-video-backend
python3.12 -m venv .venv
source .venv/bin/activate

3. Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

4. Install FFmpeg
sudo apt install ffmpeg -y

5. Run backend
uvicorn app.main:app --host 0.0.0.0 --port 8000

---

## Notes and Limitations

- YouTube ingestion is scaffolded but not fully implemented yet
- Multimodal frame understanding (OCR and image captioning) is planned
- Quiz output is currently raw LLM output
- Docker support is planned

---

## Author

Mourya Teja Kunuku
PhD Researcher – AI, RAG, Multimodal Learning Systems

---

## License

Research and academic use. License to be added.
