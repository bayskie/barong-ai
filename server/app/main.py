import re
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from app.internal.store import retriever
from app.internal.prompt import chain

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.DEBUG,  # Minimum level of severity to capture
    format='%(asctime)s - %(levelname)s - %(message)s',  # Log format
    handlers=[
        logging.StreamHandler(),  # Output to console
        logging.FileHandler("app.log")  # Output to a log file
    ]
)


class Satua(BaseModel):
    title: str
    content: str
    translated_content: str


class PromptRequest(BaseModel):
    question: str


class PromptResponse(BaseModel):
    answer: str
    relevant_docs: List[Satua]


@app.post("/prompt", response_model=PromptResponse)
async def prompt_handler(req: PromptRequest):
    logging.info(f"Received question: {req.question}")

    # Retrieve relevant documents based on the question
    docs = retriever.invoke(req.question)

    # Combine translated content to feed into the prompt
    satua = "\n\n".join([
        doc["translated_content"]
        for doc in docs
        if "translated_content" in doc
    ])

    # Invoke the LLM chain with retrieved content and the question
    # result = chain.invoke({"satua": satua, "question": req.question})
    # result = re.sub(r'<think>.*?</think>', '', result, flags=re.DOTALL).strip()

    # Return both the answer and the original documents
    return PromptResponse(
        answer="Berhasil dari API",
        relevant_docs=[
            Satua(
                title=doc.get("title", ""),
                content=doc.get("content", ""),
                translated_content=doc.get("translated_content", "")
            ) for doc in docs
        ]
    )
