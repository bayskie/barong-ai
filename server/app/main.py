from fastapi import FastAPI, HTTPException, Query, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn
from typing import List, Optional

from app.schema import (
    Satua,
    SearchQuery,
    SearchResult,
    ChatRequest,
    ChatResponse,
    # TTSRequest
)
from app.elastic import ElasticSearchClient
from app.chat import ChatEngine
# from tts import TTSEngine

from contextlib import asynccontextmanager


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create Elasticsearch index and load data
    es_client.create_index()

    # Load data from JSON
    data_path = os.path.join("data", "satua.json")
    if os.path.exists(data_path):
        es_client.load_from_json(data_path)

    yield

    # Shutdown: Perform any cleanup if needed
    # No cleanup required in this case, but we could add it here

# Initialize application
app = FastAPI(
    title="Barong AI",
    description="Retrieval Augmented Generation API for Balinese Stories",
    version="1.0.0",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
es_client = ElasticSearchClient(host="http://localhost:9200")
chat_engine = ChatEngine(
    elasticsearch_host="http://localhost:9200",
    ollama_host="http://localhost:11434"
)
# tts_engine = TTSEngine(output_dir="./audio_outputs")


# Background task to initialize Elasticsearch index and load data
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create Elasticsearch index and load data
    es_client.create_index()

    # Load data from JSON
    data_path = os.path.join("data", "satua.json")
    if os.path.exists(data_path):
        es_client.load_from_json(data_path)

    yield

    # Shutdown: Perform any cleanup if needed
    # No cleanup required in this case, but we could add it here

# Update FastAPI app to use lifespan
app = FastAPI(
    title="Barong AI",
    description="Balinese RAG on Next-Gen AI",
    version="1.0.0",
    lifespan=lifespan
)


# API Routes
@app.get("/")
async def root():
    return {"message": "Selamat datang di Barong AI!"}


@app.post("/search", response_model=List[SearchResult])
async def search_satua(query: SearchQuery):
    """Search for Balinese stories"""
    results = es_client.search_satua(
        query=query.query,
        language=query.language,
        top_k=query.top_k
    )
    return results


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat with the Barong system"""
    response = chat_engine.chat(request)
    return response


# @app.post("/tts")
# async def text_to_speech(request: TTSRequest, background_tasks: BackgroundTasks):
#     """Convert text to speech"""
#     output_path = tts_engine.text_to_speech(request)

#     if output_path.startswith("Error"):
#         raise HTTPException(status_code=500, detail=output_path)

#     # Check if file exists
#     if not os.path.exists(output_path):
#         raise HTTPException(status_code=404, detail="Audio file not found")

#     # Add background task to delete the file after it's served
#     def cleanup_file(file_path: str):
#         if os.path.exists(file_path):
#             try:
#                 os.remove(file_path)
#             except Exception as e:
#                 print(f"Error deleting file {file_path}: {str(e)}")

#     # Uncomment to enable automatic cleanup
#     # background_tasks.add_task(cleanup_file, output_path)

#     return FileResponse(
#         output_path,
#         media_type="audio/mpeg",
#         filename=os.path.basename(output_path)
#     )


@app.get("/satua/{satua_id}", response_model=Satua)
async def get_satua_by_id(satua_id: int):
    """Get a specific Balinese story by ID"""
    try:
        doc = es_client.es.get(index=es_client.index_name, id=satua_id)
        return doc["_source"]
    except Exception as e:
        raise HTTPException(
            status_code=404, detail=f"Satua not found: {str(e)}")


@app.post("/satua", response_model=dict)
async def add_satua(satua: Satua):
    """Add a new Balinese story"""
    try:
        response = es_client.index_satua(satua)
        return {"message": "Satua added successfully", "result": response}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error adding satua: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
