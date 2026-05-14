from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from services.vector_store import add_documents, similarity_search
from services.ai_service import get_llm
from langchain_core.messages import HumanMessage, SystemMessage
from typing import Optional, List
import logging

logger = logging.getLogger(__name__)

SPLITTER = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

RAG_SYSTEM_PROMPT = """You are CareerGPT, an expert AI career counselor. 
Use the provided context to give accurate, personalized career advice.
Always be encouraging, specific, and actionable in your responses.
If the context doesn't fully answer the question, supplement with your knowledge.

Context from knowledge base:
{context}
"""


async def ingest_documents(texts: List[str], metadatas: Optional[List[dict]] = None) -> int:
    docs = [Document(page_content=t, metadata=m or {}) for t, m in zip(texts, metadatas or [{}] * len(texts))]
    chunks = SPLITTER.split_documents(docs)
    await add_documents(chunks)
    return len(chunks)


async def rag_query(query: str, k: int = 5) -> str:
    try:
        relevant_docs = await similarity_search(query, k=k)
        context = "\n\n".join(doc.page_content for doc in relevant_docs)
        llm = get_llm(temperature=0.5)
        messages = [
            SystemMessage(content=RAG_SYSTEM_PROMPT.format(context=context)),
            HumanMessage(content=query),
        ]
        response = await llm.ainvoke(messages)
        return response.content
    except Exception as e:
        logger.error(f"RAG query error: {e}")
        raise


async def seed_career_knowledge():
    """Seed the vector DB with foundational career knowledge."""
    career_docs = [
        "Software Engineering requires skills in algorithms, data structures, system design, and coding. "
        "Key technologies include Python, Java, JavaScript, cloud platforms (AWS, GCP, Azure), and databases. "
        "Average salary: $90,000–$180,000. High demand with 25% growth rate.",

        "Data Science career path requires Python, statistics, machine learning, SQL, and data visualization. "
        "Tools: TensorFlow, PyTorch, scikit-learn, Tableau. Salary: $95,000–$165,000. Very high demand.",

        "Full Stack Development involves frontend (React, Vue, Angular) and backend (Node.js, Django, FastAPI). "
        "Database knowledge (PostgreSQL, MongoDB) and cloud deployment are essential. Salary: $80,000–$160,000.",

        "Machine Learning Engineering bridges software engineering and data science. "
        "Requires MLOps, model deployment, LLM fine-tuning, and production ML systems. Salary: $110,000–$200,000.",

        "DevOps/Cloud Engineering covers CI/CD, Kubernetes, Docker, Terraform, and cloud infrastructure. "
        "Certifications: AWS, GCP, Azure. Salary: $95,000–$175,000. Growing 30% annually.",

        "Cybersecurity professionals need network security, ethical hacking, SIEM tools, and certifications like CISSP, CEH. "
        "Salary: $85,000–$170,000. Critical shortage of talent globally.",

        "Product Management requires understanding user needs, roadmap planning, stakeholder communication, "
        "data-driven decisions, and Agile methodologies. Salary: $100,000–$180,000.",

        "UX/UI Design demands proficiency in Figma, user research, design thinking, and frontend basics. "
        "Salary: $70,000–$140,000. Portfolio is critical for job applications.",

        "Blockchain Development involves Solidity, Ethereum, Web3.js, smart contracts, and DeFi protocols. "
        "Emerging field with salary $120,000–$200,000. High volatility in demand.",

        "AI/LLM Engineering is a cutting-edge field involving prompt engineering, RAG, fine-tuning, LangChain, "
        "LangGraph, vector databases, and deploying AI applications. Salary: $130,000–$220,000. Explosive growth.",
    ]
    metadatas = [{"category": "career_overview", "source": "seed_data"} for _ in career_docs]
    count = await ingest_documents(career_docs, metadatas)
    logger.info(f"Seeded {count} career knowledge chunks")
    return count
