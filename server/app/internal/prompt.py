from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate

# Model initialization
model = OllamaLLM(model="deepseek-r1:8b")

# Prompt template
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
chain = prompt | model
