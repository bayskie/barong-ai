import os
from dotenv import load_dotenv
import json
from elasticsearch import Elasticsearch

# Load environment variables
load_dotenv()
es_url = os.getenv("ELASTICSEARCH_URL", default="http://localhost:9200")
index_name = os.getenv("ELASTICSEARCH_INDEX_NAME", default="satua_index")


# Function to index documents
def index_documents():
    # Load JSON data
    with open(os.path.join(os.path.dirname(__file__), '../data/satua.json'), 'r') as f:
        data = json.load(f)

    # Prepare documents
    docs = []
    for i, entry in enumerate(data):
        docs.append({
            "id": str(i + 1),
            "title": entry["title"],
            "content": entry["content"],
            "translated_content": entry["translated_content"],
        })

    # Connect to Elasticsearch
    es = Elasticsearch(es_url)

    # Create index if it doesn't exist
    if not es.indices.exists(index=index_name):
        es.indices.create(index=index_name)

    # Index documents
    for doc in docs:
        es.index(index=index_name, id=doc["id"], document=doc)


if __name__ == "__main__":
    index_documents()
