import os
from dotenv import load_dotenv
from langchain_elasticsearch import ElasticsearchStore

# Load environment variables
load_dotenv()
es_url = os.getenv("ELASTICSEARCH_URL", default="http://localhost:9200")
index_name = os.getenv("ELASTICSEARCH_INDEX_NAME", default="satua_index")


# Langchain Elasticsearch wrapper
store = ElasticsearchStore(
    es_url=es_url,
    index_name=index_name
)


# Retriever
class Retriever:
    def __init__(self, store, index_name):
        self.store = store
        self.index_name = index_name

    def invoke(self, query: str, top_k: int = 1):
        search_query = {
            "query": {
                "multi_match": {
                    "query": query,
                    "fields": ["title^2", "content", "translated_content^1.5"]
                },
            },
            "size": top_k,
        }

        result = self.store.client.search(
            index=self.index_name,
            body=search_query,
        )
        hits = result.get("hits", {}).get("hits", [])
        return [hit["_source"] for hit in hits if "_source" in hit]


# Initialize Retriever
retriever = Retriever(store=store, index_name=index_name)
