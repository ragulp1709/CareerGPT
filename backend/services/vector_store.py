import chromadb
from chromadb.config import Settings as ChromaSettings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from services.ai_service import get_embeddings
from config import settings
import logging

logger = logging.getLogger(__name__)

_chroma_client = None
_vector_store = None


def get_chroma_client():
    global _chroma_client
    if _chroma_client is None:
        _chroma_client = chromadb.PersistentClient(
            path=settings.CHROMA_PERSIST_DIRECTORY,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
    return _chroma_client


def get_vector_store() -> Chroma:
    global _vector_store
    if _vector_store is None:
        _vector_store = Chroma(
            client=get_chroma_client(),
            collection_name=settings.CHROMA_COLLECTION_NAME,
            embedding_function=get_embeddings(),
        )
    return _vector_store


async def add_documents(documents: list[Document]):
    store = get_vector_store()
    store.add_documents(documents)
    logger.info(f"Added {len(documents)} documents to vector store")


async def similarity_search(query: str, k: int = 5) -> list[Document]:
    store = get_vector_store()
    return store.similarity_search(query, k=k)


async def similarity_search_with_score(query: str, k: int = 5) -> list[tuple[Document, float]]:
    store = get_vector_store()
    return store.similarity_search_with_relevance_scores(query, k=k)
