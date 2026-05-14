from langchain_core.messages import AIMessage
from services.ai_service import generate_structured_response
import json
import logging

logger = logging.getLogger(__name__)

RESUME_SYSTEM_PROMPT = """You are an expert resume reviewer and ATS optimization specialist.
Analyze the provided resume text and return JSON:
{
  "ats_score": 72.5,
  "extracted_skills": ["Python", "React", "SQL"],
  "missing_keywords": ["Docker", "Kubernetes", "CI/CD"],
  "improvement_suggestions": [
    "Add quantifiable achievements (e.g., 'Improved performance by 40%')",
    "Include more action verbs",
    "Add a professional summary section"
  ],
  "optimized_summary": "Experienced software engineer with 3+ years...",
  "section_scores": {
    "summary": 70,
    "experience": 80,
    "skills": 65,
    "education": 90,
    "formatting": 75
  },
  "overall_feedback": "Your resume is decent but needs improvement in...",
  "strengths": ["Clear structure", "Good education section"],
  "weaknesses": ["Lacks quantifiable results", "Missing modern tech skills"]
}"""


async def resume_agent_node(state: dict) -> dict:
    profile = state.get("user_profile", {})
    messages = state.get("messages", [])
    resume_text = messages[-1].content if messages else ""

    context = f"""
Resume Text:
{resume_text}

Target Career: {profile.get('preferred_domain', 'Software Engineering')}
Experience Level: {profile.get('experience_level', 'beginner')}
"""

    try:
        response_text = await generate_structured_response(RESUME_SYSTEM_PROMPT, context)
        clean = response_text.strip()
        if clean.startswith("```"):
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
        output = json.loads(clean)
    except Exception as e:
        logger.error(f"Resume agent error: {e}")
        output = {
            "ats_score": 0.0,
            "extracted_skills": [],
            "missing_keywords": [],
            "improvement_suggestions": ["Error analyzing resume. Please try again."],
            "optimized_summary": "",
            "section_scores": {},
            "overall_feedback": "Analysis failed.",
        }

    summary = f"Resume analyzed. ATS Score: {output.get('ats_score', 0)}%"
    return {
        **state,
        "messages": state["messages"] + [AIMessage(content=summary)],
        "agent_output": output,
    }
