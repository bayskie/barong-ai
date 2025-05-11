from pydantic import BaseModel, Field
from typing import Optional, List


class Satua(BaseModel):
    """Schema for Balinese story (satua) data"""
    id: int
    title: str
    content: str
    translated_content: Optional[str] = None


class SearchQuery(BaseModel):
    """Schema for search query"""
    query: str
    top_k: int = 3


class SearchResult(BaseModel):
    """Schema for search result"""
    id: int
    title: str
    score: float
    content: str
    translated_content: Optional[str] = None


class ChatRequest(BaseModel):
    """Schema for chat request"""
    query: str
    history: List[dict] = Field(default_factory=list)


class ChatResponse(BaseModel):
    """Schema for chat response"""
    answer: str
    sources: List[SearchResult] = Field(default_factory=list)


class TTSRequest(BaseModel):
    """Schema for text-to-speech request"""
    text: str
