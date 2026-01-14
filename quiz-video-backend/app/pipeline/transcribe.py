from faster_whisper import WhisperModel

class Transcriber:
    def __init__(self, model_name: str):
        # CPU default; if you have GPU later, set device="cuda"
        self.model = WhisperModel(model_name, device="cpu", compute_type="int8")

    def transcribe(self, wav_path: str) -> list[dict]:
        segments, info = self.model.transcribe(wav_path, vad_filter=True)
        out = []
        for seg in segments:
            out.append({
                "start": float(seg.start),
                "end": float(seg.end),
                "text": seg.text.strip()
            })
        return out
