def segments_to_text(segments: list[dict]) -> str:
    return "\n".join([s["text"] for s in segments if s["text"]])

def chunk_segments(segments: list[dict], max_chars: int = 900, overlap_chars: int = 150) -> list[dict]:
    # Simple text chunking while preserving timestamps
    chunks = []
    buf = ""
    start = None
    end = None

    def flush():
        nonlocal buf, start, end
        if buf.strip():
            chunks.append({"start": start, "end": end, "text": buf.strip()})
        buf = ""
        start = None
        end = None

    for s in segments:
        t = s["text"].strip()
        if not t:
            continue
        if start is None:
            start = s["start"]
        end = s["end"]

        candidate = (buf + " " + t).strip()
        if len(candidate) > max_chars and buf:
            # overlap
            tail = buf[-overlap_chars:] if overlap_chars < len(buf) else buf
            flush()
            buf = tail + " " + t
            start = s["start"]
            end = s["end"]
        else:
            buf = candidate

    flush()
    return chunks
