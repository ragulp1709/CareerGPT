from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.embeddings import Embeddings
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from config import settings
from typing import List
import logging

logger = logging.getLogger(__name__)


class GeminiEmbeddings(Embeddings):
    """Custom LangChain embeddings using the new google-genai SDK."""

    def __init__(self, api_key: str, model: str = "models/gemini-embedding-001"):
        from google import genai
        self._client = genai.Client(api_key=api_key)
        self._model = model

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        result = self._client.models.embed_content(model=self._model, contents=texts)
        return [e.values for e in result.embeddings]

    def embed_query(self, text: str) -> List[float]:
        result = self._client.models.embed_content(model=self._model, contents=[text])
        return result.embeddings[0].values


def get_llm(temperature: float = 0.7):
    if settings.DEFAULT_LLM == "gemini" and settings.GOOGLE_API_KEY:
        return ChatGoogleGenerativeAI(
            model=settings.GEMINI_MODEL,
            temperature=temperature,
            google_api_key=settings.GOOGLE_API_KEY,
        )
    return ChatOpenAI(
        model=settings.OPENAI_MODEL,
        temperature=temperature,
        api_key=settings.OPENAI_API_KEY,
    )


def get_embeddings():
    if settings.DEFAULT_LLM == "gemini" and settings.GOOGLE_API_KEY:
        return GeminiEmbeddings(api_key=settings.GOOGLE_API_KEY)
    return OpenAIEmbeddings(
        model=settings.EMBEDDING_MODEL,
        api_key=settings.OPENAI_API_KEY,
    )


async def generate_response(system_prompt: str, user_message: str, temperature: float = 0.7) -> str:
    llm = get_llm(temperature)
    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=user_message),
    ]
    try:
        response = await llm.ainvoke(messages)
        return response.content
    except Exception as e:
        logger.error(f"LLM error: {e}")
        raise


async def generate_structured_response(system_prompt: str, user_message: str) -> str:
    """Generate a JSON-structured response."""
    llm = get_llm(temperature=0.3)
    messages = [
        SystemMessage(content=system_prompt + "\n\nIMPORTANT: Respond ONLY with valid JSON."),
        HumanMessage(content=user_message),
    ]
    try:
        response = await llm.ainvoke(messages)
        return response.content
    except Exception as e:
        logger.error(f"LLM structured error: {e}")
        raise
