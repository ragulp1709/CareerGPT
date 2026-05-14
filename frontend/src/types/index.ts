export interface UserProfile {
  clerk_id: string;
  email: string;
  name: string;
  avatar_url?: string;
  education?: string;
  skills: string[];
  interests: string[];
  career_goals?: string;
  experience_level?: "beginner" | "intermediate" | "senior";
  preferred_domain?: string;
  github_url?: string;
  linkedin_url?: string;
  resume_url?: string;
}

export interface CareerRecommendation {
  title: string;
  description: string;
  confidence_score: number;
  future_demand: string;
  salary_range: string;
  required_skills: string[];
  match_percentage: number;
  growth_rate: string;
  why_recommended?: string;
}

export interface CareerResponse {
  careers: CareerRecommendation[];
  summary: string;
  top_recommendation: string;
}

export interface SkillGapAnalysis {
  target_career: string;
  current_skills: string[];
  missing_skills: string[];
  recommended_technologies: string[];
  learning_priorities: string[];
  improvement_suggestions: string[];
  readiness_score: number;
  estimated_learning_time?: string;
  skill_categories?: {
    strong: string[];
    moderate: string[];
    missing: string[];
  };
}

export interface MonthGoal {
  theme: string;
  topics: string[];
  projects: string[];
  courses: string[];
  weekly_goals?: Record<string, string[]>;
}

export interface LearningRoadmap {
  career_path: string;
  duration_months: number;
  monthly_goals: Record<string, MonthGoal>;
  milestones: string[];
  resources?: {
    free: string[];
    paid: string[];
  };
}

export interface ResumeAnalysis {
  ats_score: number;
  extracted_skills: string[];
  missing_keywords: string[];
  improvement_suggestions: string[];
  optimized_summary: string;
  section_scores: Record<string, number>;
  overall_feedback: string;
  strengths?: string[];
  weaknesses?: string[];
}

export interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  expected_answer_points: string[];
  follow_up_questions: string[];
  time_limit_minutes?: number;
}

export interface InterviewResponse {
  job_role: string;
  questions: InterviewQuestion[];
  hr_questions: Array<{
    question: string;
    tips: string[];
    sample_answer_structure: string;
  }>;
  preparation_tips: string[];
  common_mistakes: string[];
}

export interface JobMatch {
  job_title: string;
  company_type: string;
  match_percentage: number;
  missing_skills: string[];
  readiness_score: number;
  required_skills: string[];
  salary_range?: string;
  location?: string;
  why_good_fit?: string;
  what_to_improve?: string[];
}

export interface JobMatchResponse {
  matches: JobMatch[];
  job_search_strategy: string;
  resume_tips_for_jobs: string[];
  networking_tips: string[];
}

export interface ProjectRecommendation {
  title: string;
  description: string;
  tech_stack: string[];
  difficulty: string;
  estimated_duration: string;
  learning_outcomes: string[];
  relevance_score: number;
  github_ideas: string[];
  impact_statement?: string;
  deployment?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface GitHubAnalysis {
  username: string;
  total_repos: number;
  languages_used: string[];
  top_repos: Array<{
    name: string;
    description: string;
    stars: number;
    language: string;
    url: string;
  }>;
  contribution_score: number;
  missing_portfolio_projects: string[];
  overall_score: number;
  recommendations: string[];
}
