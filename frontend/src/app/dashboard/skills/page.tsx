"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Loader2, AlertCircle, CheckCircle, TrendingUp, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { analyzeSkillGap } from "@/lib/api";
import type { SkillGapAnalysis } from "@/types";
import { toast } from "sonner";

export default function SkillGapPage() {
  const [loading, setLoading] = useState(false);
  const [targetCareer, setTargetCareer] = useState("");
  const [analysis, setAnalysis] = useState<SkillGapAnalysis | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await analyzeSkillGap(targetCareer || undefined);
      setAnalysis(res.data);
      toast.success("Skill gap analysis complete!");
    } catch {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Target className="w-6 h-6 text-cyan-400" />
          Skill Gap Analyzer
        </h1>
        <p className="text-muted-foreground mt-1">
          Compare your current skills against industry requirements and get a prioritized learning plan.
        </p>
      </div>

      {/* Input */}
      <Card className="glass">
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="career">Target Career (optional)</Label>
            <Input
              id="career"
              placeholder="e.g. Machine Learning Engineer, Full Stack Developer"
              value={targetCareer}
              onChange={(e) => setTargetCareer(e.target.value)}
              className="mt-1.5 bg-background/50"
            />
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-0 gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
            {loading ? "Analyzing Skills..." : "Analyze Skill Gap"}
          </Button>
        </CardContent>
      </Card>

      {analysis && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          {/* Readiness Score */}
          <Card className="glass border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Overall Readiness Score</h3>
                  <p className="text-sm text-muted-foreground">For {analysis.target_career}</p>
                </div>
                <div className="text-4xl font-bold gradient-text">{analysis.readiness_score?.toFixed(0)}%</div>
              </div>
              <Progress value={analysis.readiness_score} className="h-3" />
              {analysis.estimated_learning_time && (
                <p className="text-sm text-muted-foreground mt-2">
                  Estimated time to be job-ready: <span className="text-foreground font-medium">{analysis.estimated_learning_time}</span>
                </p>
              )}
            </CardContent>
          </Card>

          {/* Skill Categories */}
          {analysis.skill_categories && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: "strong",   label: "Strong Skills",   icon: CheckCircle,  color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
                { key: "moderate", label: "Moderate Skills", icon: TrendingUp,    color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
                { key: "missing",  label: "Missing Skills",  icon: AlertCircle,   color: "text-red-400",   bg: "bg-red-500/10",   border: "border-red-500/20"   },
              ].map(({ key, label, icon: Icon, color, bg, border }) => (
                <Card key={key} className={`glass ${border}`}>
                  <CardContent className="p-4">
                    <div className={`flex items-center gap-2 mb-3 ${color}`}>
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(analysis.skill_categories as any)[key]?.map((s: string) => (
                        <Badge key={s} variant="outline" className={`text-xs ${bg}`}>{s}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Missing Skills & Priorities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" /> Missing Skills
                </h3>
                <div className="space-y-2">
                  {analysis.missing_skills?.map((skill) => (
                    <div key={skill} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                      {skill}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" /> Learning Priorities
                </h3>
                <div className="space-y-2">
                  {analysis.learning_priorities?.map((priority, i) => (
                    <div key={i} className="text-sm p-2 glass rounded-lg">
                      {priority}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="glass">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3">Recommended Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.recommended_technologies?.map((tech) => (
                  <Badge key={tech} variant="outline" className="bg-primary/5 border-primary/20">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
