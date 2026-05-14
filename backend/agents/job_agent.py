from langchain_core.messages import AIMessage
from services.ai_service import generate_structured_response
import json
import logging

logger = logging.getLogger(__name__)

JOB_SYSTEM_PROMPT = """You are an expert job matching AI. Analyze user profile against job market.
Return JSON:
{
  "matches": [
    {
      "job_title": "Backend Engineer",
      "company_type": "Series B Startup",
      "match_percentage": 87.5,
      "missing_skills": ["Kubernetes", "Go"],
      "readiness_score": 78.0,
      "required_skills": ["Python", "FastAPI", "PostgreSQL", "Docker"],
      "salary_range": "$90k - $130k",
      "location": "Remote",
      "why_good_fit": "Strong Python skills align with backend requirements",
      "what_to_improve": ["Learn Docker basics", "Build a deployed project"],
      "job_search_keywords": ["Python developer", "Backend engineer", "API developer"]
    }
  ],
  "job_search_strategy": "Apply to 5-10 jobs per week focusing on startups",
  "resume_tips_for_jobs": ["Tailor resume for each application", "Highlight Python projects"],
  "networking_tips": ["Join Python community Discord", "Attend local tech meetups"],
  "application_checklist": ["Tailor resume", "Write custom cover letter", "Research company"]
}"""


async def job_agent_node(state: dict) -> dict:
    profile = state.get("user_profile", {})
    messages = state.get("messages", [])
    user_msg = messages[-1].content if messages else "Match me with jobs"

    context = f"""
User Profile:
- Skills: {', '.join(profile.get('skills', []))}
- Experience Level: {profile.get('experience_level', 'beginner')}
- Career Goals: {profile.get('career_goals', 'Software Engineer')}
- Domain: {profile.get('preferred_domain', 'Full Stack')}
- Education: {profile.get('education', 'Not specified')}

Request: {user_msg}

Find 4 job matches with detailed guidance.
"""

    try:
        response_text = await generate_structured_response(JOB_SYSTEM_PROMPT, context)
        clean = response_text.strip()
        if clean.startswith("```"):
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
        output = json.loads(clean)
    except Exception as e:
        logger.error(f"Job agent error: {e}")
        output = {"matches": [], "job_search_strategy": "", "resume_tips_for_jobs": []}

    count = len(output.get("matches", []))
    summary = f"Found {count} job matches based on your profile."
    return {
        **state,
        "messages": state["messages"] + [AIMessage(content=summary)],
        "agent_output": output,
    }
