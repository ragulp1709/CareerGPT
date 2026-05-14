"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Map, Loader2, Calendar, BookOpen, Code, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateRoadmap } from "@/lib/api";
import type { LearningRoadmap } from "@/types";
import { toast } from "sonner";

const monthColors = [
  "from-violet-500 to-purple-500",
  "from-cyan-500 to-blue-500",
  "from-pink-500 to-rose-500",
  "from-green-500 to-emerald-500",
  "from-orange-500 to-amber-500",
  "from-red-500 to-orange-500",
];

export default function RoadmapPage() {
  const [loading, setLoading] = useState(false);
  const [careerPath, setCareerPath] = useState("");
  const [roadmap, setRoadmap] = useState<LearningRoadmap | null>(null);
  const [expanded, setExpanded] = useState<string | null>("month_1");

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await generateRoadmap(careerPath || undefined);
      setRoadmap(res.data);
      toast.success("Roadmap generated!");
    } catch {
      toast.error("Failed to generate roadmap.");
    } finally {
      setLoading(false);
    }
  };

  const months = roadmap ? Object.entries(roadmap.monthly_goals) : [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Map className="w-6 h-6 text-blue-400" />
          AI Learning Roadmap
        </h1>
        <p className="text-muted-foreground mt-1">
          Get a personalized month-by-month learning plan with curated resources.
        </p>
      </div>

      <Card className="glass">
        <CardContent className="p-6 flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="path">Target Career Path (optional)</Label>
            <Input
              id="path"
              placeholder="e.g. Machine Learning Engineer, DevOps, Full Stack"
              value={careerPath}
              onChange={(e) => setCareerPath(e.target.value)}
              className="mt-1.5 bg-background/50"
            />
          </div>
          <Button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-violet-600 text-white border-0 gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Map className="w-4 h-4" />}
            {loading ? "Generating..." : "Generate Roadmap"}
          </Button>
        </CardContent>
      </Card>

      {roadmap && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Header */}
          <div className="glass rounded-xl p-5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold gradient-text">{roadmap.career_path}</h2>
                <p className="text-sm text-muted-foreground">{roadmap.duration_months}-Month Personalized Roadmap</p>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/30 text-sm px-4 py-1">
                {roadmap.duration_months} Months
              </Badge>
            </div>
            {roadmap.milestones?.length > 0 && (
              <div className="mt-4">
                <p className="text-xs text-muted-foreground mb-2">Key Milestones</p>
                <div className="flex flex-wrap gap-2">
                  {roadmap.milestones.map((m, i) => (
                    <Badge key={i} variant="outline" className="text-xs border-border/50">{m}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Month Cards */}
          <div className="space-y-3">
            {months.map(([key, goal], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Card className="glass overflow-hidden">
                  <div
                    className="flex items-center justify-between p-5 cursor-pointer hover:bg-accent/30 transition-colors"
                    onClick={() => setExpanded(expanded === key ? null : key)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${monthColors[i % monthColors.length]} flex items-center justify-center text-white font-bold text-sm`}>
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-semibold">Month {i + 1}</div>
                        <div className="text-sm text-muted-foreground">{goal.theme}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="hidden md:flex gap-1.5">
                        {goal.topics?.slice(0, 3).map((t) => (
                          <Badge key={t} variant="outline" className="text-xs border-border/50">{t}</Badge>
                        ))}
                      </div>
                      {expanded === key ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>

                  {expanded === key && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="border-t border-border/50 p-5 grid grid-cols-1 md:grid-cols-3 gap-5"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                          <BookOpen className="w-4 h-4 text-blue-400" /> Topics
                        </div>
                        <ul className="space-y-1">
                          {goal.topics?.map((t) => (
                            <li key={t} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                              {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                          <Code className="w-4 h-4 text-green-400" /> Projects
                        </div>
                        <ul className="space-y-1">
                          {goal.projects?.map((p) => (
                            <li key={p} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2 text-sm font-medium">
                          <Calendar className="w-4 h-4 text-violet-400" /> Courses
                        </div>
                        <ul className="space-y-1">
                          {goal.courses?.map((c) => (
                            <li key={c} className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Resources */}
          {roadmap.resources && (
            <Card className="glass">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-4">Learning Resources</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-green-400 mb-2">Free Resources</p>
                    <div className="flex flex-wrap gap-1.5">
                      {roadmap.resources.free?.map((r) => (
                        <Badge key={r} variant="outline" className="text-xs bg-green-500/5 border-green-500/20">{r}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-400 mb-2">Paid Resources</p>
                    <div className="flex flex-wrap gap-1.5">
                      {roadmap.resources.paid?.map((r) => (
                        <Badge key={r} variant="outline" className="text-xs bg-amber-500/5 border-amber-500/20">{r}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
