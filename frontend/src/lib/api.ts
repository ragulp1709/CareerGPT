import apiClient from "./api-client";
import type {
  UserProfile,
  CareerResponse,
  SkillGapAnalysis,
  LearningRoadmap,
  ResumeAnalysis,
  InterviewResponse,
  JobMatchResponse,
  ChatMessage,
  GitHubAnalysis,
} from "@/types";

// --- User ---
export const getMyProfile = () => apiClient.get<UserProfile>("/users/me");
export const upsertProfile = (data: UserProfile) => apiClient.post<UserProfile>("/users/me", data);
export const updateProfile = (data: Partial<UserProfile>) => apiClient.patch<UserProfile>("/users/me", data);

// --- Career ---
export const getCareerRecommendations = (message?: string) =>
  apiClient.post<CareerResponse>("/career/recommend", { message: message || "Recommend careers for me" });

// --- Skills ---
export const analyzeSkillGap = (targetCareer?: string) =>
  apiClient.post<SkillGapAnalysis>("/skills/gap-analysis", {
    message: "Analyze my skill gaps",
    target_career: targetCareer,
  });

// --- Resume ---
export const analyzeResume = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  return apiClient.post<ResumeAnalysis>("/resume/analyze", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const getLatestResume = () => apiClient.get<ResumeAnalysis>("/resume/latest");

// --- Roadmap ---
export const generateRoadmap = (careerPath?: string) =>
  apiClient.post<LearningRoadmap>("/roadmap/generate", {
    message: "Create a personalized learning roadmap",
    career_path: careerPath,
  });
export const getMyRoadmap = () => apiClient.get<LearningRoadmap>("/roadmap/me");

// --- Interview ---
export const getInterviewQuestions = (role?: string, category?: string) =>
  apiClient.post<InterviewResponse>("/interview/questions", {
    message: "Generate interview questions",
    role,
    category: category || "all",
  });
export const getAnswerFeedback = (question: string, userAnswer: string) =>
  apiClient.post("/interview/feedback", { question, user_answer: userAnswer });

// --- Chat ---
export const sendChatMessage = (message: string, useRag = true) =>
  apiClient.post<{ response: string; sources_used: boolean }>("/chat/message", {
    message,
    use_rag: useRag,
  });
export const getChatHistory = (limit = 50) => apiClient.get<ChatMessage[]>(`/chat/history?limit=${limit}`);
export const clearChatHistory = () => apiClient.delete("/chat/history");

// --- Jobs ---
export const matchJobs = () => apiClient.post<JobMatchResponse>("/jobs/match", { message: "Find jobs matching my profile" });
export const getProjectSuggestions = () =>
  apiClient.post("/jobs/projects", { message: "Suggest portfolio projects" });

// --- GitHub ---
export const analyzeGitHub = (username: string) => apiClient.get<GitHubAnalysis>(`/github/analyze/${username}`);
export const analyzeMyGitHub = () => apiClient.get<GitHubAnalysis>("/github/me");

// --- Admin ---
export const getAnalytics = () => apiClient.get("/admin/analytics");
export const seedKnowledge = () => apiClient.post("/admin/seed-knowledge");
