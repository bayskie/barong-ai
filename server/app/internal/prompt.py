import os
from dotenv import load_dotenv
from langchain_ollama.llms import OllamaLLM
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

template = """
Anda adalah seorang ahli cerita rakyat Bali (Satua Bali) yang menjawab pertanyaan hanya berdasarkan isi cerita yang tersedia.

Berikut ini adalah satu atau lebih cerita rakyat Bali yang perlu Anda baca terlebih dahulu:
{satua}

Kemudian, jawablah pertanyaan berikut:
{question}

**Instruksi Penting**:
- Jawaban harus didasarkan sepenuhnya pada cerita yang ada.
- Jika informasi tidak tersedia dalam cerita, jawab dengan sopan bahwa informasi tersebut tidak disebutkan atau tidak diketahui.
- Jangan membuat asumsi atau penjelasan tambahan yang tidak ada dalam cerita.

Mulailah menjawab berdasarkan cerita yang diberikan.
"""

# Prompt + model chain
prompt = ChatPromptTemplate.from_template(template)


def chain(model="llama3.2"):
    if model == "deepseek-r1:8b":
        model = OllamaLLM(model="deepseek-r1:8b", temperature=0.1)
    elif model == "llama3.1":
        model = OllamaLLM(model="llama3.1", temperature=0.1)
    elif model == "llama3.2":
        model = OllamaLLM(model="llama3.2", temperature=0.1)
    elif model == "gemini-2.0-flash":
        model = ChatGoogleGenerativeAI(
            api_key=GEMINI_API_KEY,
            model="gemini-2.0-flash",
            temperature=0.1
        )
    else:
        model = OllamaLLM(model="llama3.2", temperature=0.1)

    return prompt | model
