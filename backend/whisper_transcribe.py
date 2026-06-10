import os
import requests

WHISPER_URL = os.getenv("WHISPER_URL", "http://localhost:9000/asr")


def transcribe_audio(file_path: str) -> str:
    with open(file_path, "rb") as f:
        response = requests.post(
            WHISPER_URL,
            params={"encode": "true", "task": "transcribe", "language": "en", "output": "txt"},
            files={"audio_file": f},
        )
    response.raise_for_status()
    return response.text.strip()