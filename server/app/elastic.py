from elasticsearch import Elasticsearch
import json
from typing import List, Dict, Any, Optional
import os
from app.schema import Satua, SearchResult


class ElasticSearchClient:
    def __init__(self, host: str = "http://localhost:9200"):
        """Initialize Elasticsearch client"""
        self.es = Elasticsearch(
            host,
            basic_auth=("elastic", "NKUD4qRYwQmayck6=F-t"),
            verify_certs=False
        )
        self.index_name = "satua_bali"

    def create_index(self) -> None:
        """Create index for Balinese stories if it doesn't exist"""
        if not self.es.indices.exists(index=self.index_name):
            # Define mappings with specific analyzer for Balinese language
            mappings = {
                "mappings": {
                    "properties": {
                        "id": {"type": "integer"},
                        "title": {
                            "type": "text",
                            "analyzer": "standard",
                            "fields": {"keyword": {"type": "keyword"}}
                        },
                        "content": {
                            "type": "text",
                            "analyzer": "standard"
                        },
                        "translated_content": {
                            "type": "text",
                            "analyzer": "standard"
                        }
                    }
                }
            }
            self.es.indices.create(index=self.index_name, body=mappings)
            print(f"Created index: {self.index_name}")

    def index_satua(self, satua: Satua) -> Dict[str, Any]:
        """Index a single Balinese story"""
        doc = {
            "id": satua.id,
            "title": satua.title,
            "content": satua.content,
            "translated_content": satua.translated_content
        }
        response = self.es.index(
            index=self.index_name, id=satua.id, document=doc)
        return response

    def bulk_index_satua(self, satua_list: List[Satua]) -> None:
        """Bulk index multiple Balinese stories"""
        operations = []
        for satua in satua_list:
            operations.append(
                {"index": {"_index": self.index_name, "_id": satua.id}})
            operations.append({
                "id": satua.id,
                "title": satua.title,
                "content": satua.content,
                "translated_content": satua.translated_content
            })

        if operations:
            self.es.bulk(operations=operations, refresh=True)
            print(f"Bulk indexed {len(satua_list)} satua documents")

    def search_satua(self, query: str, top_k: int = 3) -> List[SearchResult]:
        """
        Search for Balinese stories

        Args:
            query: Search query
            top_k: Number of results to return

        Returns:
            List of search results
        """
        # Determine which field to search
        content_field = "translated_content"

        search_query = {
            "query": {
                "multi_match": {
                    "query": query,
                    "fields": ["title^2", content_field],
                    "fuzziness": "AUTO"
                }
            },
            "size": top_k
        }

        response = self.es.search(index=self.index_name, body=search_query)

        results = []
        for hit in response["hits"]["hits"]:
            source = hit["_source"]
            results.append(
                SearchResult(
                    id=source["id"],
                    title=source["title"],
                    score=hit["_score"],
                    content=source["content"],
                    translated_content=source.get("translated_content")
                )
            )

        return results

    def load_from_json(self, json_path: str) -> None:
        """Load Balinese stories from JSON file and index them"""
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)

            satua_list = []
            for item in data:
                satua_list.append(
                    Satua(
                        id=item["id"],
                        title=item["title"],
                        content=item["content"],
                        translated_content=item.get("translated_content")
                    )
                )

            self.bulk_index_satua(satua_list)
            print(
                f"Successfully loaded {len(satua_list)} stories from {json_path}")

        except Exception as e:
            print(f"Error loading data from {json_path}: {str(e)}")
