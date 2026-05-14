from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class UserProfile(BaseModel):
    clerk_id: str
    email: str
    name: str
    password_hash: Optional[str] = None
    avatar_url: Optional[str] = None
    education: Optional[str] = None
    skills: List[str] = []
    interests: List[str] = []
    career_goals: Optional[str] = None
    experience_level: Optional[str] = "beginner"  # beginner, intermediate, senior
    preferred_domain: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    resume_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    education: Optional[str] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    career_goals: Optional[str] = None
    experience_level: Optional[str] = None
    preferred_domain: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None


class CareerRecommendation(BaseModel):
    title: str
    description: str
    confidence_score: float
    future_demand: str
    salary_range: str
    required_skills: List[str]
    match_percentage: float
    growth_rate: str


class SkillGapAnalysis(BaseModel):
    target_career: str
    current_skills: List[str]
    missing_skills: List[str]
    recommended_technologies: List[str]
    learning_priorities: List[str]
    improvement_suggestions: List[str]
    readiness_score: float


class LearningRoadmap(BaseModel):
    career_path: str
    duration_months: int
    monthly_goals: dict  # {"month_1": {"topics": [...], "projects": [...], "courses": [...]}}
    weekly_breakdown: Optional[dict] = None
    milestones: List[str] = []


class ResumeAnalysis(BaseModel):
    ats_score: float
    extracted_skills: List[str]
    missing_keywords: List[str]
    improvement_suggestions: List[str]
    optimized_summary: str
    section_scores: dict
    overall_feedback: str


class InterviewQuestion(BaseModel):
    question: str
    category: str  # technical, hr, behavioral
    difficulty: str  # easy, medium, hard
    expected_answer_points: List[str]
    follow_up_questions: List[str]


class ChatMessage(BaseModel):
    role: str  # user or assistant
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ChatSession(BaseModel):
    session_id: str
    clerk_id: str
    messages: List[ChatMessage] = []
    context: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class JobMatch(BaseModel):
    job_title: str
    company: str
    match_percentage: float
    missing_skills: List[str]
    readiness_score: float
    job_description: str
    required_skills: List[str]
    salary_range: Optional[str] = None
    location: Optional[str] = None


class ProjectRecommendation(BaseModel):
    title: str
    description: str
    tech_stack: List[str]
    difficulty: str
    estimated_duration: str
    learning_outcomes: List[str]
    relevance_score: float
    github_ideas: List[str]


class GitHubAnalysis(BaseModel):
    username: str
    total_repos: int
    languages_used: List[str]
    top_repos: List[dict]
    contribution_score: int
    missing_portfolio_projects: List[str]
    overall_score: float
    recommendations: List[str]
