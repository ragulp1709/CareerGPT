from langchain_core.messages import AIMessage
from services.ai_service import generate_structured_response
import json
import logging

logger = logging.getLogger(__name__)

LEARNING_SYSTEM_PROMPT = """You are an expert learning path designer and career coach.
Create a detailed, personalized learning roadmap. Return JSON:
{
  "career_path": "Data Science",
  "duration_months": 6,
  "monthly_goals": {
    "month_1": {
      "theme": "Foundations",
      "topics": ["Python Basics", "Git", "Linux"],
      "projects": ["Calculator App", "File Organizer Script"],
      "courses": ["Python for Everybody (Coursera)", "CS50 (Harvard)"],
      "weekly_goals": {
        "week_1": ["Python syntax", "Variables", "Functions"],
        "week_2": ["OOP", "File handling", "APIs"],
        "week_3": ["Git basics", "GitHub", "Branching"],
        "week_4": ["Linux CLI", "Shell scripting", "Mini project"]
      }
    },
    "month_2": {
      "theme": "Core Skills",
      "topics": ["SQL", "Statistics", "Data Analysis"],
      "projects": ["Data Analysis Dashboard", "SQL Database Design"],
      "courses": ["SQL for Data Science", "Statistics with Python"]
    }
  },
  "milestones": [
    "Month 1: Build first Python project",
    "Month 3: Deploy a web application",
    "Month 6: Complete capstone project"
  ],
  "resources": {
    "free": ["freeCodeCamp", "Kaggle", "CS50"],
    "paid": ["Udemy", "Coursera", "Pluralsight"]
  },
  "success_metrics": ["Complete all projects", "Build portfolio", "Apply to 5 jobs"]
}"""


async def learning_agent_node(state: dict) -> dict:
    profile = state.get("user_profile", {})
    messages = state.get("messages", [])
    user_msg = messages[-1].content if messages else "Create a learning roadmap for me"

    context = f"""
User Profile:
- Current Skills: {', '.join(profile.get('skills', []))}
- Career Goals: {profile.get('career_goals', 'Software Engineer')}
- Experience Level: {profile.get('experience_level', 'beginner')}
- Preferred Domain: {profile.get('preferred_domain', 'Full Stack Development')}
- Interests: {', '.join(profile.get('interests', []))}

Request: {user_msg}

Create a 6-month personalized roadmap tailored to this person's background.
"""

    try:
        response_text = await generate_structured_response(LEARNING_SYSTEM_PROMPT, context)
        clean = response_text.strip()
        if clean.startswith("```"):
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
        output = json.loads(clean)
    except Exception as e:
        logger.error(f"Learning agent error: {e}")
        output = {
            "career_path": profile.get("preferred_domain", "Software Engineering"),
            "duration_months": 6,
            "monthly_goals": {},
            "milestones": [],
        }

    summary = f"Personalized {output.get('duration_months', 6)}-month roadmap generated for {output.get('career_path', 'your career')}."
    return {
        **state,
        "messages": state["messages"] + [AIMessage(content=summary)],
        "agent_output": output,
    }
