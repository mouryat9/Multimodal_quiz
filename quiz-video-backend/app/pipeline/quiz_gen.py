import requests
from app.core.config import settings
from app.pipeline.embed_store import VectorStore

def ollama_chat(prompt: str) -> str:
    payload = {
        "model": settings.OLLAMA_MODEL,
        "messages": [
            {"role": "system", "content": "You generate quizzes from provided lecture content. Be concise and accurate."},
            {"role": "user", "content": prompt}
        ],
        "stream": False
    }
    r = requests.post(f"{settings.OLLAMA_URL}/api/chat", json=payload, timeout=120)
    r.raise_for_status()
    return r.json()["message"]["content"]

def generate_quiz(job_id: str, topic_hint: str | None = None) -> dict:
    vs = VectorStore(settings.EMBED_MODEL)
    query = topic_hint or "key concepts, definitions, examples, important points"
    ctx_chunks = vs.search(job_id, query=query, k=8)

    context = "\n\n".join(
        [f"[{c['start']:.1f}-{c['end']:.1f}] {c['text']}" for c in ctx_chunks]
    )

    prompt = f"""
You are given transcript snippets from a lecture with timestamps.

Context:
{context}

Task:
Create 10 quiz questions:
- 6 multiple choice (4 options each, indicate correct option)
- 2 short answer
- 2 higher-order questions (analysis/synthesis)
For each question, include a "citation" field with the most relevant timestamp range from the context.
Return JSON with fields: questions: [{{type, question, options?, answer, citation}}].
"""
    out = ollama_chat(prompt)

    # We return the raw model output (often JSON). Later we can enforce strict JSON parsing.
    return {"raw": out}
