from langchain_core.messages import AIMessage
from services.ai_service import generate_structured_response
import json
import logging

logger = logging.getLogger(__name__)

INTERVIEW_SYSTEM_PROMPT = """You are an expert technical interview coach. Generate targeted interview 
questions with detailed guidance. Return JSON:
{
  "job_role": "Software Engineer",
  "questions": [
    {
      "id": 1,
      "question": "Explain the difference between REST and GraphQL",
      "category": "technical",
      "difficulty": "medium",
      "expected_answer_points": [
        "REST uses fixed endpoints, GraphQL uses single endpoint",
        "GraphQL allows clients to request specific data",
        "REST is simpler, GraphQL reduces over-fetching"
      ],
      "follow_up_questions": ["When would you choose GraphQL over REST?"],
      "time_limit_minutes": 5
    }
  ],
  "hr_questions": [
    {
      "question": "Tell me about yourself",
      "tips": ["Start with professional background", "Highlight key achievements", "End with why this role"],
      "sample_answer_structure": "Present role > Past experience > Future goals"
    }
  ],
  "preparation_tips": ["Practice coding on whiteboard", "Review system design basics"],
  "common_mistakes": ["Not clarifying requirements", "Jumping to code without planning"]
}"""


async def interview_agent_node(state: dict) -> dict:
    profile = state.get("user_profile", {})
    messages = state.get("messages", [])
    user_msg = messages[-1].content if messages else "Generate interview questions"

    context = f"""
Target Role: {profile.get('preferred_domain', profile.get('career_goals', 'Software Engineer'))}
Skills: {', '.join(profile.get('skills', []))}
Experience Level: {profile.get('experience_level', 'beginner')}
Request: {user_msg}

Generate 5 technical questions and 3 HR questions with detailed guidance.
"""

    try:
        response_text = await generate_structured_response(INTERVIEW_SYSTEM_PROMPT, context)
        clean = response_text.strip()
        if clean.startswith("```"):
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
        output = json.loads(clean)
    except Exception as e:
        logger.error(f"Interview agent error: {e}")
        output = {"job_role": "Software Engineer", "questions": [], "hr_questions": [], "preparation_tips": []}

    q_count = len(output.get("questions", []))
    summary = f"Generated {q_count} interview questions for {output.get('job_role', 'your target role')}."
    return {
        **state,
        "messages": state["messages"] + [AIMessage(content=summary)],
        "agent_output": output,
    }
