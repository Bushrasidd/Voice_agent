from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from llm import ask_llm

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Allows all development domains to connect safely
    allow_credentials=True,
    allow_methods=["*"], # Allows all request types (GET, POST, OPTIONS)
    allow_headers=["*"], # Allows all custom header metadata
    
)

@app.get("/")
async def root():
    return {"message": "Voice Assistant API Running"}

@app.get("/chat")
async def chat(q: str):

    answer = ask_llm(q)

    return {
        "question": q,
        "answer": answer
    }