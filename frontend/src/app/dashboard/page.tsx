"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp, Target, Map, FileText, MessageSquare,
  Sword, Briefcase, Code, GitBranch, ArrowRight, Brain,
  Sparkles, Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/contexts/user-context";

const quickActions = [
  { href: "/dashboard/career",   icon: TrendingUp,   title: "Career Insights",  description: "Discover best-fit careers",   color: "text-violet-400", bg: "bg-violet-500/10", badge: "AI Powered"  },
  { href: "/dashboard/skills",   icon: Target,       title: "Skill Gap",        description: "Find missing skills",          color: "text-cyan-400",   bg: "bg-cyan-500/10",   badge: "Analysis"    },
  { href: "/dashboard/roadmap",  icon: Map,          title: "Roadmap",          description: "6-month learning plan",        color: "text-blue-400",   bg: "bg-blue-500/10",   badge: "Personalized"},
  { href: "/dashboard/resume",   icon: FileText,     title: "Resume Analyzer",  description: "ATS score & improvements",     color: "text-green-400",  bg: "bg-green-500/10",  badge: "PDF Upload"  },
  { href: "/dashboard/chat",     icon: MessageSquare,title: "AI Chat Mentor",   description: "24/7 career guidance",         color: "text-pink-400",   bg: "bg-pink-500/10",   badge: "RAG"         },
  { href: "/dashboard/interview",icon: Sword,        title: "Interview Arena",  description: "Mock interview prep",          color: "text-red-400",    bg: "bg-red-500/10",    badge: "Practice"    },
  { href: "/dashboard/jobs",     icon: Briefcase,    title: "Job Matching",     description: "Match with job openings",      color: "text-amber-400",  bg: "bg-amber-500/10",  badge: "Matching"    },
  { href: "/dashboard/projects", icon: Code,         title: "Project Ideas",    description: "Portfolio project suggestions",color: "text-orange-400", bg: "bg-orange-500/10", badge: "Recommend"   },
  { href: "/dashboard/github",   icon: GitBranch,    title: "GitHub Analyzer",  description: "Analyze your GitHub profile",  color: "text-slate-400",  bg: "bg-slate-500/10",  badge: "Analytics"   },
];

const agentCards = [
  { name: "Profile Agent",   status: "Ready", color: "bg-green-500" },
  { name: "Career Agent",    status: "Ready", color: "bg-violet-500" },
  { name: "Skill Agent",     status: "Ready", color: "bg-cyan-500"   },
  { name: "Resume Agent",    status: "Ready", color: "bg-blue-500"   },
  { name: "Learning Agent",  status: "Ready", color: "bg-pink-500"   },
  { name: "Interview Agent", status: "Ready", color: "bg-red-500"    },
  { name: "Project Agent",   status: "Ready", color: "bg-orange-500" },
  { name: "Job Agent",       status: "Ready", color: "bg-amber-500"  },
];

export default function DashboardPage() {
  const { user } = useCurrentUser();

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-violet-600/20 via-cyan-600/10 to-blue-600/20 border border-border/50"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            <span className="text-sm text-muted-foreground">Welcome back</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Hello, <span className="gradient-text">{user?.firstName || "Explorer"}</span> 👋
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Your AI career guidance platform is ready. Choose a module below to get personalized
            AI-powered insights and recommendations.
          </p>
          <div className="flex gap-3 mt-6">
            <Link href="/dashboard/career">
              <Button className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-0 gap-2">
                <Brain className="w-4 h-4" /> Start Career Analysis
              </Button>
            </Link>
            <Link href="/dashboard/chat">
              <Button variant="outline" className="gap-2 border-border/60">
                <MessageSquare className="w-4 h-4" /> Chat with AI Mentor
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Active Agents */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-primary" />
          <h2 className="text-lg font-semibold">Active AI Agents</h2>
          <Badge className="bg-green-500/10 text-green-400 border-green-500/30 text-xs">
            {agentCards.length} Online
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {agentCards.map((agent) => (
            <div key={agent.name} className="flex items-center gap-2 px-3 py-1.5 rounded-full glass text-sm">
              <div className={`w-2 h-2 rounded-full ${agent.color} animate-pulse`} />
              {agent.name}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Platform Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, i) => (
            <motion.div
              key={action.href}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={action.href}>
                <Card className="glass hover:border-primary/30 transition-all cursor-pointer group h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <action.icon className={`w-5 h-5 ${action.color}`} />
                      </div>
                      <Badge variant="outline" className="text-xs border-border/40">
                        {action.badge}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                    <div className="flex items-center gap-1 mt-3 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Open <ArrowRight className="w-3 h-3" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
