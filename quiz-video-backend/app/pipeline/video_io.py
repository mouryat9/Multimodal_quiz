import subprocess, os

def extract_audio(video_path: str, out_wav: str) -> None:
    os.makedirs(os.path.dirname(out_wav), exist_ok=True)
    # 16k mono WAV for ASR
    cmd = [
        "ffmpeg", "-y",
        "-i", video_path,
        "-vn",
        "-ac", "1",
        "-ar", "16000",
        "-f", "wav",
        out_wav
    ]
    subprocess.run(cmd, check=True, capture_output=True)
