import os, json
import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from app.core.config import settings

class VectorStore:
    def __init__(self, embed_model: str):
        self.model = SentenceTransformer(embed_model)

    def build_and_save(self, job_id: str, chunks: list[dict]) -> str:
        texts = [c["text"] for c in chunks]
        embs = self.model.encode(texts, normalize_embeddings=True)
        embs = np.array(embs).astype("float32")

        index = faiss.IndexFlatIP(embs.shape[1])  # cosine via normalized inner product
        index.add(embs)

        job_dir = os.path.join(settings.VECTOR_DIR, job_id)
        os.makedirs(job_dir, exist_ok=True)
        faiss.write_index(index, os.path.join(job_dir, "index.faiss"))

        with open(os.path.join(job_dir, "chunks.json"), "w", encoding="utf-8") as f:
            json.dump(chunks, f, ensure_ascii=False, indent=2)

        return job_dir

    def search(self, job_id: str, query: str, k: int = 6) -> list[dict]:
        job_dir = os.path.join(settings.VECTOR_DIR, job_id)
        index_path = os.path.join(job_dir, "index.faiss")
        chunks_path = os.path.join(job_dir, "chunks.json")

        index = faiss.read_index(index_path)
        with open(chunks_path, "r", encoding="utf-8") as f:
            chunks = json.load(f)

        q = self.model.encode([query], normalize_embeddings=True).astype("float32")
        D, I = index.search(q, k)
        results = []
        for idx in I[0]:
            if idx < 0:
                continue
            results.append(chunks[int(idx)])
        return results
