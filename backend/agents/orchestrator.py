"""
CareerGPT Multi-Agent Orchestrator using LangGraph.
Manages routing between specialized AI agents.
"""
from langgraph.graph import StateGraph, END
from langchain_core.messages import HumanMessage, AIMessage
from typing import TypedDict, Annotated, List, Optional
import operator
import logging

logger = logging.getLogger(__name__)


class AgentState(TypedDict):
    messages: Annotated[List, operator.add]
    user_profile: dict
    intent: Optional[str]
    agent_output: Optional[dict]
    next_agent: Optional[str]


def detect_intent(state: AgentState) -> AgentState:
    """Route user request to the appropriate specialized agent."""
    last_message = state["messages"][-1].content.lower() if state["messages"] else ""

    intent_keywords = {
        "career": ["career", "job role", "profession", "field", "industry"],
        "skill": ["skill", "gap", "missing", "learn", "technology"],
        "resume": ["resume", "cv", "ats", "pdf", "upload"],
        "roadmap": ["roadmap", "plan", "month", "learning path", "schedule"],
        "interview": ["interview", "question", "mock", "prepare", "hr"],
        "project": ["project", "portfolio", "build", "create", "develop"],
        "job": ["job", "hiring", "company", "apply", "opening"],
        "github": ["github", "repo", "repository", "code", "contribution"],
    }

    detected = "career"  # default
    for agent, keywords in intent_keywords.items():
        if any(kw in last_message for kw in keywords):
            detected = agent
            break

    return {**state, "intent": detected, "next_agent": detected}


def route_agent(state: AgentState) -> str:
    return state.get("next_agent", "career")


# Build the graph
def build_orchestrator():
    from agents.career_agent import career_agent_node
    from agents.skill_agent import skill_agent_node
    from agents.resume_agent import resume_agent_node
    from agents.learning_agent import learning_agent_node
    from agents.interview_agent import interview_agent_node
    from agents.project_agent import project_agent_node
    from agents.job_agent import job_agent_node

    workflow = StateGraph(AgentState)

    workflow.add_node("router", detect_intent)
    workflow.add_node("career", career_agent_node)
    workflow.add_node("skill", skill_agent_node)
    workflow.add_node("resume", resume_agent_node)
    workflow.add_node("roadmap", learning_agent_node)
    workflow.add_node("interview", interview_agent_node)
    workflow.add_node("project", project_agent_node)
    workflow.add_node("job", job_agent_node)

    workflow.set_entry_point("router")

    workflow.add_conditional_edges(
        "router",
        route_agent,
        {
            "career": "career",
            "skill": "skill",
            "resume": "resume",
            "roadmap": "roadmap",
            "interview": "interview",
            "project": "project",
            "job": "job",
            "github": "career",
        },
    )

    for node in ["career", "skill", "resume", "roadmap", "interview", "project", "job"]:
        workflow.add_edge(node, END)

    return workflow.compile()


orchestrator = None


def get_orchestrator():
    global orchestrator
    if orchestrator is None:
        orchestrator = build_orchestrator()
    return orchestrator


async def run_agent(user_message: str, user_profile: dict) -> dict:
    graph = get_orchestrator()
    state = {
        "messages": [HumanMessage(content=user_message)],
        "user_profile": user_profile,
        "intent": None,
        "agent_output": None,
        "next_agent": None,
    }
    result = await graph.ainvoke(state)
    return {
        "intent": result.get("intent"),
        "output": result.get("agent_output", {}),
        "response": result["messages"][-1].content if result["messages"] else "",
    }
