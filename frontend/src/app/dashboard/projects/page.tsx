"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code, Loader2, ExternalLink, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getProjectSuggestions } from "@/lib/api";
import type { ProjectRecommendation } from "@/types";
import { toast } from "sonner";

const difficultyColor = (d: string) =>
  d === "beginner" ? "text-green-400 bg-green-500/10 border-green-500/30"
  : d === "intermediate" ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
  : "text-red-400 bg-red-500/10 border-red-500/30";

export default function ProjectsPage() {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<ProjectRecommendation[]>([]);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const res = await getProjectSuggestions();
      setProjects(res.data.projects || []);
      toast.success("Project ideas generated!");
    } catch {
      toast.error("Failed to get project suggestions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Code className="w-6 h-6 text-orange-400" />
            Project Recommender
          </h1>
          <p className="text-muted-foreground mt-1">AI-curated portfolio projects that will impress recruiters.</p>
        </div>
        <Button onClick={handleFetch} disabled={loading}
          className="bg-gradient-to-r from-orange-600 to-amber-600 text-white border-0 gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Code className="w-4 h-4" />}
          {loading ? "Generating..." : "Get Project Ideas"}
        </Button>
      </div>

      {projects.length === 0 && !loading && (
        <div className="glass rounded-2xl p-16 text-center">
          <Code className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No Projects Yet</h3>
          <p className="text-sm text-muted-foreground">Click "Get Project Ideas" to get AI-curated portfolio projects.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((project, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="glass hover:border-primary/30 transition-all h-full">
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold">{project.title}</h3>
                  <div className="text-lg font-bold text-orange-400 ml-2">{project.relevance_score?.toFixed(0)}%</div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{project.description}</p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <Badge variant="outline" className={`text-xs ${difficultyColor(project.difficulty)}`}>
                      {project.difficulty}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />{project.estimated_duration}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Tech Stack</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech_stack?.map((t) => (
                        <Badge key={t} variant="outline" className="text-xs bg-primary/5">{t}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">Learning Outcomes</p>
                    <ul className="space-y-0.5">
                      {project.learning_outcomes?.slice(0, 3).map((l, j) => (
                        <li key={j} className="text-xs flex items-start gap-1.5">
                          <Star className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />{l}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {project.impact_statement && (
                    <div className="glass rounded-lg p-2.5 text-xs text-muted-foreground">
                      {project.impact_statement}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
