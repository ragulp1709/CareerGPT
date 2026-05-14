# CareerGPT — AI-Powered Career Guidance Platform

A full-stack, production-grade Generative AI platform built with multi-agent orchestration, RAG pipelines, and autonomous AI agents to help students and job seekers navigate their careers.

## 🏗 Tech Stack

| Layer        | Technology                                               |
|--------------|----------------------------------------------------------|
| Frontend     | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| Backend      | FastAPI, Python 3.11                                     |
| AI / Agents  | LangGraph, LangChain, OpenAI GPT-4o / Gemini            |
| RAG          | ChromaDB, Embeddings, Semantic Search                    |
| Database     | MongoDB (Motor async)                                    |
| Auth         | Clerk                                                    |
| Deployment   | Vercel (frontend), Railway/Render (backend)              |

## 📁 Project Structure

```
CareerGPT/
├── frontend/               # Next.js 15 App Router
│   ├── src/
│   │   ├── app/            # Pages & layouts
│   │   │   ├── page.tsx    # Landing page
│   │   │   ├── dashboard/  # All dashboard pages
│   │   │   ├── sign-in/    # Clerk auth
│   │   │   └── sign-up/
│   │   ├── components/     # UI components
│   │   ├── lib/            # API client & utilities
│   │   └── types/          # TypeScript types
│   └── .env.local.example
│
└── backend/                # FastAPI Python backend
    ├── main.py             # FastAPI app entry point
    ├── config.py           # Settings (pydantic-settings)
    ├── database.py         # MongoDB connection
    ├── agents/             # LangGraph multi-agent system
    │   ├── orchestrator.py # Main agent router
    │   ├── career_agent.py
    │   ├── skill_agent.py
    │   ├── resume_agent.py
    │   ├── learning_agent.py
    │   ├── interview_agent.py
    │   ├── project_agent.py
    │   └── job_agent.py
    ├── rag/
    │   └── pipeline.py     # RAG ingestion & retrieval
    ├── api/                # FastAPI route handlers
    │   ├── users.py
    │   ├── career.py
    │   ├── skills.py
    │   ├── resume.py
    │   ├── chat.py
    │   ├── roadmap.py
    │   ├── interview.py
    │   ├── jobs.py
    │   ├── github.py
    │   └── admin.py
    ├── models/
    │   └── schemas.py      # Pydantic models
    ├── services/
    │   ├── ai_service.py   # LLM wrapper
    │   ├── mongodb_service.py
    │   ├── vector_store.py # ChromaDB
    │   └── github_service.py
    ├── vector-db/          # ChromaDB persistence
    ├── datasets/           # Career knowledge datasets
    └── requirements.txt
```

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy and fill in your environment variables
cp .env.example .env
# Edit .env with your API keys

# Start the backend
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
cd frontend
npm install

# Copy and configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your Clerk keys

# Start the frontend
npm run dev
```

### 3. Seed the Knowledge Base

After starting the backend:
```bash
curl -X POST http://localhost:8000/api/v1/admin/seed-knowledge
```

### 4. Open the App

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🔑 Required API Keys

| Service | Where to Get | Used For |
|---------|-------------|----------|
| OpenAI  | platform.openai.com | GPT-4o responses + embeddings |
| Google Gemini | makersuite.google.com | Alternative LLM |
| Clerk | dashboard.clerk.com | Authentication |
| GitHub | github.com/settings/tokens | GitHub profile analysis |
| MongoDB | mongodb.com/atlas | Database (or local) |

## 🤖 AI Agents

| Agent | Purpose |
|-------|---------|
| Career Agent | Recommends career paths with confidence scores |
| Skill Agent | Analyzes skill gaps vs industry requirements |
| Resume Agent | ATS scoring and resume optimization |
| Learning Agent | Generates personalized learning roadmaps |
| Interview Agent | Creates mock interview questions + feedback |
| Project Agent | Suggests portfolio projects |
| Job Agent | Matches user profile to job descriptions |

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/career/recommend` | POST | AI career recommendations |
| `/api/v1/skills/gap-analysis` | POST | Skill gap analysis |
| `/api/v1/resume/analyze` | POST | Resume PDF analysis |
| `/api/v1/chat/message` | POST | AI mentor chat |
| `/api/v1/roadmap/generate` | POST | Generate learning roadmap |
| `/api/v1/interview/questions` | POST | Mock interview questions |
| `/api/v1/jobs/match` | POST | Job matching |
| `/api/v1/jobs/projects` | POST | Project suggestions |
| `/api/v1/github/analyze/{username}` | GET | GitHub profile analysis |
| `/api/v1/admin/seed-knowledge` | POST | Seed RAG knowledge base |

## 🌐 Deployment

### Frontend → Vercel
```bash
cd frontend
vercel --prod
```

### Backend → Railway
```bash
# Connect your GitHub repo to Railway
# Set environment variables in Railway dashboard
# Railway auto-detects Python and uses uvicorn
```

## 📄 License

MIT License — Built for educational/portfolio purposes.
