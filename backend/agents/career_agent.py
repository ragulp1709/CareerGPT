from langchain_core.messages import AIMessage
from services.ai_service import generate_structured_response
import json
import logging

logger = logging.getLogger(__name__)

CAREER_SYSTEM_PROMPT = """You are an expert career counselor AI. Analyze the user's profile and provide 
comprehensive career recommendations. Return a JSON object with:
{
  "careers": [
    {
      "title": "Career Title",
      "description": "Brief description",
      "confidence_score": 0.95,
      "future_demand": "Very High",
      "salary_range": "$90k - $150k",
      "required_skills": ["skill1", "skill2"],
      "match_percentage": 85.0,
      "growth_rate": "25% annually",
      "why_recommended": "Reason based on user profile"
    }
  ],
  "summary": "Overall career guidance message",
  "top_recommendation": "Career Title"
}"""


async def career_agent_node(state: dict) -> dict:
    profile = state.get("user_profile", {})
    messages = state.get("messages", [])
    user_msg = messages[-1].content if messages else "Recommend careers for me"

    profile_context = f"""
User Profile:
- Skills: {', '.join(profile.get('skills', []))}
- Interests: {', '.join(profile.get('interests', []))}
- Education: {profile.get('education', 'Not specified')}
- Experience Level: {profile.get('experience_level', 'beginner')}
- Career Goals: {profile.get('career_goals', 'Not specified')}
- Preferred Domain: {profile.get('preferred_domain', 'Not specified')}

User Request: {user_msg}
"""

    try:
        response_text = await generate_structured_response(CAREER_SYSTEM_PROMPT, profile_context)
        # Strip markdown fences if present
        clean = response_text.strip()
        if clean.startswith("```"):
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
        output = json.loads(clean)
    except Exception as e:
        logger.error(f"Career agent error: {e}")
        output = {
            "careers": [],
            "summary": "Unable to generate recommendations at this time. Please try again.",
            "top_recommendation": "",
        }

    return {
        **state,
        "messages": state["messages"] + [AIMessage(content=output.get("summary", ""))],
        "agent_output": output,
    }
