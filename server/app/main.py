import re
import os
import logging
import asyncio
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.internal.store import retriever
from app.internal.prompt import chain
from app.internal.speech import synthesize_speech

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("app.log")
    ]
)


class Satua(BaseModel):
    title: str
    content: str
    translated_content: str


class PromptRequest(BaseModel):
    model: Optional[str]
    question: str


class PromptResponse(BaseModel):
    answer: str
    relevant_docs: List[Satua]


class SpeechRequest(BaseModel):
    text: str
    filename: Optional[str] = None


@app.post("/prompt", response_model=PromptResponse)
async def prompt_handler(req: PromptRequest):
    logging.debug(f"Received question: {req.question}")

    docs = retriever.invoke(req.question)

    satua = "\n\n".join([
        doc["translated_content"]
        for doc in docs
        if "translated_content" in doc
    ])

    model_name = req.model if req.model else "llama3.2"

    result = chain(req.model if req.model else "llama3.2").invoke(
        {"satua": satua, "question": req.question})

    if model_name == "gemini-2.0-flash":
        result = result.content

    result = re.sub(r'<think>.*?</think>', '', result, flags=re.DOTALL).strip()

    response = PromptResponse(
        answer=result,
        relevant_docs=[
            Satua(
                title=doc.get("title", ""),
                content=doc.get("content", ""),
                translated_content=doc.get("translated_content", "")
            ) for doc in docs
        ]
    )

    return response


@app.post("/speech")
async def speech_handler(req: SpeechRequest, background_tasks: BackgroundTasks):
    logging.debug(f"Received text: {req.text}")
    filename = req.filename or f"speech_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

    if not filename.endswith(".wav"):
        filename += ".wav"

    output_path = filename

    await asyncio.to_thread(synthesize_speech, req.text, output_path)

    response = FileResponse(
        output_path, media_type="audio/wav", filename=filename)

    background_tasks.add_task(os.remove, output_path)

    return response
