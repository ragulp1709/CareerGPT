"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Brain, Rocket, Target, FileText, MessageSquare, Map,
  Briefcase, Code, ChevronRight, Sparkles, TrendingUp,
  Zap, Star, GitBranch, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const features = [
  { icon: Brain,        title: "AI Career Recommendations", description: "Multi-agent AI analyzes your skills and goals to recommend the perfect career paths with confidence scores.",     color: "text-violet-400", bg: "bg-violet-500/10" },
  { icon: Target,       title: "Skill Gap Analyzer",         description: "Identify exactly what skills you're missing to land your dream role, with prioritized learning plans.",           color: "text-cyan-400",   bg: "bg-cyan-500/10"   },
  { icon: Map,          title: "Learning Roadmaps",          description: "Personalized month-by-month roadmaps with curated courses, projects, and milestones.",                            color: "text-blue-400",   bg: "bg-blue-500/10"   },
  { icon: FileText,     title: "Resume Intelligence",        description: "AI-powered resume analysis with ATS scoring, keyword optimization, and improvement suggestions.",                 color: "text-green-400",  bg: "bg-green-500/10"  },
  { icon: MessageSquare,title: "AI Chat Mentor",             description: "Your 24/7 AI career mentor with long-term memory, RAG-powered insights, and personalized advice.",                color: "text-pink-400",   bg: "bg-pink-500/10"   },
  { icon: Briefcase,    title: "Job Matching",               description: "Match your profile to real job requirements with readiness scores and actionable improvement steps.",             color: "text-amber-400",  bg: "bg-amber-500/10"  },
  { icon: Code,         title: "Project Recommender",        description: "AI suggests portfolio projects tailored to your career path that will impress recruiters.",                      color: "text-orange-400", bg: "bg-orange-500/10" },
  { icon: Rocket,       title: "Interview Arena",            description: "Mock interviews with AI-powered feedback, technical and HR questions, and communication scoring.",               color: "text-red-400",    bg: "bg-red-500/10"    },
];

const stats = [
  { value: "10+",  label: "AI Agents",         icon: Brain  },
  { value: "RAG",  label: "Knowledge Pipeline", icon: Zap   },
  { value: "14",   label: "Career Modules",     icon: Target },
  { value: "100%", label: "Personalized",       icon: Star  },
];

const techStack = [
  "Next.js 15","FastAPI","LangGraph","LangChain",
  "OpenAI GPT-4o","ChromaDB","MongoDB","Clerk Auth",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg gradient-text">CareerGPT</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#tech"     className="hover:text-foreground transition-colors">Tech Stack</a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/sign-in"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link href="/sign-up">
              <Button size="sm" className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-0">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute top-20 left-1/4  w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-cyan-500/15  rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.5 }}>
            <Badge className="mb-6 bg-violet-500/10 text-violet-400 border-violet-500/30 px-4 py-1.5 text-sm">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Multi-Agent AI · RAG Pipeline · LangGraph
            </Badge>
          </motion.div>
          <motion.h1 initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6,delay:0.1 }}
            className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
            Your AI-Powered<br />
            <span className="gradient-text">Career Guidance</span><br />
            Platform
          </motion.h1>
          <motion.p initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6,delay:0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Harness autonomous AI agents, RAG pipelines, and generative AI to discover your ideal career,
            close skill gaps, and land your dream job — faster than ever.
          </motion.p>
          <motion.div initial={{ opacity:0,y:20 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6,delay:0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-0 px-8 h-12 text-base font-semibold ai-glow">
                Start for Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="px-8 h-12 text-base font-semibold border-border/60">
                View Dashboard <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
          <motion.div initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:0.6,delay:0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {stats.map((s) => (
              <div key={s.label} className="glass rounded-2xl p-6 text-center">
                <s.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold gradient-text">{s.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
              <TrendingUp className="w-3.5 h-3.5 mr-1.5" />14 Powerful Modules
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need to <span className="gradient-text">Accelerate Your Career</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity:0,y:30 }} whileInView={{ opacity:1,y:0 }}
                transition={{ duration:0.5, delay:i*0.05 }} viewport={{ once:true }}
                className="glass rounded-2xl p-6 hover:border-primary/30 transition-all group">
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech */}
      <section id="tech" className="py-24 px-6 bg-muted/20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Built with <span className="gradient-text">Cutting-Edge Tech</span></h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {techStack.map((t) => (
              <Badge key={t} variant="outline" className="px-4 py-2 text-sm border-border/60 bg-card hover:bg-primary/10 transition-colors">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12 ai-glow">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mx-auto mb-6">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4">Ready to <span className="gradient-text">Transform Your Career?</span></h2>
            <p className="text-muted-foreground text-lg mb-8">Join thousands using CareerGPT to navigate their career journey with AI.</p>
            <Link href="/sign-up">
              <Button size="lg" className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-0 px-10 h-12 text-base font-semibold">
                Get Started Free <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm">CareerGPT</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2025 CareerGPT · AI-Powered Career Guidance Platform</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors flex items-center gap-1"><GitBranch className="w-4 h-4" /> GitHub</a>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
