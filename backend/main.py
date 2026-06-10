import os
import tempfile

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from llm import ask_llm
from whisper_transcribe import transcribe_audio

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Voice Assistant API Running"}


@app.post("/transcribe")
async def transcribe(audio: UploadFile = File(...)):
    """
    Accepts an audio file (webm/wav/mp3), transcribes it with Whisper,
    and returns the transcript text.
    """
    # Save the uploaded blob to a temp file so Whisper can read it
    suffix = os.path.splitext(audio.filename)[-1] or ".webm"

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await audio.read())
        tmp_path = tmp.name

    try:
        text = transcribe_audio(tmp_path)
    finally:
        os.remove(tmp_path)  # clean up temp file

    return {"text": text}


@app.get("/chat")
async def chat(q: str):
    """
    Accepts a question string, sends it to Qwen via Ollama,
    and returns the answer.
    """
    answer = ask_llm(q)
    return {"question": q, "answer": answer}










# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from llm import ask_llm

# app = FastAPI()

# origins = [
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins, # Allows all development domains to connect safely
#     allow_credentials=True,
#     allow_methods=["*"], # Allows all request types (GET, POST, OPTIONS)
#     allow_headers=["*"], # Allows all custom header metadata
    
# )

# @app.get("/")
# async def root():
#     return {"message": "Voice Assistant API Running"}

# @app.get("/chat")
# async def chat(q: str):

#     answer = ask_llm(q)

#     return {
#         "question": q,
#         "answer": answer
#     }