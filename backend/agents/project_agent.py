from langchain_core.messages import AIMessage
from services.ai_service import generate_structured_response
import json
import logging

logger = logging.getLogger(__name__)

PROJECT_SYSTEM_PROMPT = """You are an expert software project advisor. Recommend portfolio projects 
that will maximize career impact. Return JSON:
{
  "projects": [
    {
      "title": "AI-Powered Resume Builder",
      "description": "Build a web app that uses GPT to generate tailored resumes",
      "tech_stack": ["Next.js", "FastAPI", "OpenAI API", "MongoDB"],
      "difficulty": "intermediate",
      "estimated_duration": "3-4 weeks",
      "learning_outcomes": ["RAG pipelines", "Full-stack development", "API integration"],
      "relevance_score": 95.0,
      "github_ideas": [
        "Use LangChain for document processing",
        "Add PDF export with ReportLab"
      ],
      "impact_statement": "Demonstrates AI integration skills highly valued by employers",
      "deployment": "Deploy on Vercel + Railway"
    }
  ],
  "portfolio_strategy": "Focus on 3 high-impact projects rather than many small ones",
  "github_tips": ["Write detailed READMEs", "Add live demos", "Include architecture diagrams"]
}"""


async def project_agent_node(state: dict) -> dict:
    profile = state.get("user_profile", {})
    messages = state.get("messages", [])
    user_msg = messages[-1].content if messages else "Suggest portfolio projects"

    context = f"""
Career Path: {profile.get('preferred_domain', profile.get('career_goals', 'Software Engineering'))}
Current Skills: {', '.join(profile.get('skills', []))}
Experience Level: {profile.get('experience_level', 'beginner')}
Interests: {', '.join(profile.get('interests', []))}
Request: {user_msg}

Suggest 4 impactful portfolio projects.
"""

    try:
        response_text = await generate_structured_response(PROJECT_SYSTEM_PROMPT, context)
        clean = response_text.strip()
        if clean.startswith("```"):
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
        output = json.loads(clean)
    except Exception as e:
        logger.error(f"Project agent error: {e}")
        output = {"projects": [], "portfolio_strategy": "", "github_tips": []}

    count = len(output.get("projects", []))
    summary = f"Recommended {count} portfolio projects tailored to your profile."
    return {
        **state,
        "messages": state["messages"] + [AIMessage(content=summary)],
        "agent_output": output,
    }
