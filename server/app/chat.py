from typing import List, Dict, Any
import requests
from app.schema import ChatRequest, ChatResponse, SearchResult
from app.elastic import ElasticSearchClient


class ChatEngine:
    def __init__(
        self,
        elasticsearch_host: str = "http://localhost:9200",
        ollama_host: str = "http://localhost:11434"
    ):
        """Initialize Chat Engine with Elasticsearch and Ollama"""
        self.es_client = ElasticSearchClient(host=elasticsearch_host)
        self.ollama_host = ollama_host
        # You can change this to any model available in your Ollama instance
        self.model = "llama3"

    def generate_prompt(self, query: str, results: List[SearchResult]) -> str:
        """Generate prompt for the language model using retrieved context"""
        # Choose the appropriate content field
        content_field = "translated_content"

        # Create context from retrieved results
        context = "\n\n".join([
            f"Title: {result.title}\n{getattr(result, content_field)}"
            for result in results
        ])

        # Create instruction
        instruction = (
            "Berperan sebagai ahli cerita Bali (satua). "
            "Berdasarkan konteks di bawah ini, berikan jawaban dalam Bahasa Indonesia. "
            "Jika tidak ada cerita yang cocok, jangan membuat cerita baru, "
            "tetapi akui bahwa kamu tidak tahu jawabannya."
        )

        # Complete prompt template
        prompt = f"""
{instruction}

KONTEKS:
{context}

PERTANYAAN:
{query}

JAWABAN:
"""
        return prompt

    def query_ollama(self, prompt: str) -> str:
        """Query Ollama API"""
        try:
            response = requests.post(
                f"{self.ollama_host}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False
                }
            )

            if response.status_code == 200:
                return response.json().get("response", "")
            else:
                return f"Error querying Ollama: {response.status_code}"

        except Exception as e:
            return f"Error connecting to Ollama: {str(e)}"

    def chat(self, request: ChatRequest) -> ChatResponse:
        """Process chat request"""
        # Search for relevant satua based on query
        results = self.es_client.search_satua(
            query=request.query,
            top_k=3
        )

        if not results:
            # No relevant stories found
            answer = "Maaf, saya tidak menemukan cerita yang relevan dengan pertanyaan ini."

            return ChatResponse(answer=answer, sources=[])

        # Generate prompt with retrieved context
        prompt = self.generate_prompt(
            query=request.query,
            results=results,
        )

        # Get response from Ollama
        answer = self.query_ollama(prompt)

        # Return response with sources
        return ChatResponse(
            answer=answer,
            sources=results
        )
