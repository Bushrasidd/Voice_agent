# Voice Agent

Voice Agent is a local AI-powered voice assistant that enables natural conversations through speech. The project combines speech recognition, large language models, and speech synthesis to create a complete speech-to-speech experience while remaining fully self-hosted and open source.

## Features

* AI-powered conversations using Qwen3
* Local inference through Ollama
* Modern Next.js frontend
* FastAPI backend services
* Speech-to-Text using Faster Whisper
* Text-to-Speech using Piper
* Real-time transcript display
* Docker-based deployment

## Tech Stack

### Frontend

* Next.js
* React
* Tailwind CSS

### Backend

* FastAPI
* Python

### AI Components

* Qwen3 8B
* Ollama
* Faster Whisper
* Piper TTS

## Project Status

### Completed

* Frontend setup and UI layout
* FastAPI backend setup
* Ollama integration
* Qwen3 integration
* Transcript panel
* Microphone recording
* Environment variable configuration

### In Progress

* Faster Whisper integration
* Audio transcription endpoint
* End-to-end voice pipeline
* Piper TTS integration

## Architecture

```text
User Speech
      ↓
Faster Whisper
      ↓
Transcribed Text
      ↓
Qwen3
      ↓
Generated Response
      ↓
Piper TTS
      ↓
Spoken Response
```

## Getting Started

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

## Vision

The goal of this project is to build a fully local, open-source voice assistant capable of real-time speech conversations without relying on proprietary cloud AI services.
