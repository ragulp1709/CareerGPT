"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Loader2, TrendingUp, DollarSign, Zap, Star, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getCareerRecommendations } from "@/lib/api";
import type { CareerRecommendation } from "@/types";
import { toast } from "sonner";

export default function CareerInsightsPage() {
  const [loading, setLoading] = useState(false);
  const [careers, setCareers] = useState<CareerRecommendation[]>([]);
  const [summary, setSummary] = useState("");
  const [expanded, setExpanded] = useState<number | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await getCareerRecommendations();
      setCareers(res.data.careers || []);
      setSummary(res.data.summary || "");
      toast.success("Career recommendations generated!");
    } catch {
      toast.error("Failed to generate recommendations. Check your profile and API keys.");
    } finally {
      setLoading(false);
    }
  };

  const demandColor = (d: string) => {
    if (d?.toLowerCase().includes("very high")) return "text-green-400 bg-green-500/10 border-green-500/30";
    if (d?.toLowerCase().includes("high")) return "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";
    return "text-amber-400 bg-amber-500/10 border-amber-500/30";
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-violet-400" />
            AI Career Recommendations
          </h1>
          <p className="text-muted-foreground mt-1">
            Our Career Agent analyzes your profile to suggest personalized career paths.
          </p>
        </div>
        <Button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-0 gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
          {loading ? "Analyzing..." : "Generate Recommendations"}
        </Button>
      </div>

      {/* Summary */}
      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-5 border-primary/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">AI Analysis Summary</span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">{summary}</p>
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && careers.length === 0 && (
        <div className="glass rounded-2xl p-16 text-center">
          <Brain className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">No Recommendations Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Complete your profile first, then click "Generate Recommendations"
          </p>
          <Button variant="outline" onClick={handleGenerate} className="gap-2">
            <Brain className="w-4 h-4" /> Analyze My Profile
          </Button>
        </div>
      )}

      {/* Career Cards */}
      <div className="space-y-4">
        {careers.map((career, i) => (
          <motion.div
            key={career.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className="glass hover:border-primary/30 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-bold">{career.title}</h3>
                      {i === 0 && (
                        <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/30 text-xs">
                          <Star className="w-3 h-3 mr-1" /> Top Match
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{career.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setExpanded(expanded === i ? null : i)}
                  >
                    {expanded === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Match Score</div>
                    <Progress value={career.match_percentage} className="h-2 mb-1" />
                    <div className="text-sm font-semibold">{career.match_percentage?.toFixed(0)}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Confidence</div>
                    <Progress value={(career.confidence_score || 0) * 100} className="h-2 mb-1" />
                    <div className="text-sm font-semibold">{((career.confidence_score || 0) * 100).toFixed(0)}%</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">Salary</div>
                      <div className="text-sm font-semibold">{career.salary_range}</div>
                    </div>
                  </div>
                  <div>
                    <Badge variant="outline" className={`text-xs ${demandColor(career.future_demand)}`}>
                      {career.future_demand} Demand
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">{career.growth_rate}</div>
                  </div>
                </div>

                {/* Expanded */}
                {expanded === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="border-t border-border/50 pt-4 space-y-3"
                  >
                    <div>
                      <div className="text-sm font-medium mb-2">Required Skills</div>
                      <div className="flex flex-wrap gap-2">
                        {career.required_skills?.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs bg-primary/5">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {(career as any).why_recommended && (
                      <div className="glass rounded-lg p-3">
                        <div className="text-xs text-muted-foreground mb-1">Why This Career?</div>
                        <p className="text-sm">{(career as any).why_recommended}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
