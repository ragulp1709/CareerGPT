from langchain_core.messages import AIMessage
from services.ai_service import generate_structured_response
import json
import logging

logger = logging.getLogger(__name__)

SKILL_SYSTEM_PROMPT = """You are an expert skill gap analysis AI. Compare the user's current skills 
against the target career requirements. Return JSON:
{
  "target_career": "Career Name",
  "current_skills": ["skill1"],
  "missing_skills": ["skill1", "skill2"],
  "recommended_technologies": ["tech1", "tech2"],
  "learning_priorities": ["High Priority: skill1 - reason", "Medium: skill2 - reason"],
  "improvement_suggestions": ["suggestion1", "suggestion2"],
  "readiness_score": 65.0,
  "estimated_learning_time": "3-6 months",
  "skill_categories": {
    "strong": ["skill1"],
    "moderate": ["skill2"],
    "missing": ["skill3"]
  }
}"""


async def skill_agent_node(state: dict) -> dict:
    profile = state.get("user_profile", {})
    messages = state.get("messages", [])
    user_msg = messages[-1].content if messages else "Analyze my skill gaps"

    context = f"""
Current Skills: {', '.join(profile.get('skills', []))}
Target Career/Domain: {profile.get('preferred_domain', profile.get('career_goals', 'Software Engineering'))}
Experience Level: {profile.get('experience_level', 'beginner')}
Interests: {', '.join(profile.get('interests', []))}
User Request: {user_msg}
"""

    try:
        response_text = await generate_structured_response(SKILL_SYSTEM_PROMPT, context)
        clean = response_text.strip()
        if clean.startswith("```"):
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
        output = json.loads(clean)
    except Exception as e:
        logger.error(f"Skill agent error: {e}")
        output = {
            "target_career": "Software Engineering",
            "current_skills": profile.get("skills", []),
            "missing_skills": [],
            "recommended_technologies": [],
            "learning_priorities": [],
            "improvement_suggestions": ["Please try again"],
            "readiness_score": 0.0,
        }

    summary = f"Skill gap analysis complete. Readiness: {output.get('readiness_score', 0)}%"
    return {
        **state,
        "messages": state["messages"] + [AIMessage(content=summary)],
        "agent_output": output,
    }
