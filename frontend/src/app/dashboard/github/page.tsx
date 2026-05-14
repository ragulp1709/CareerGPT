"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Loader2, Star, ExternalLink, Code, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { analyzeGitHub } from "@/lib/api";
import type { GitHubAnalysis } from "@/types";
import { toast } from "sonner";

export default function GitHubAnalyzerPage() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [data, setData] = useState<GitHubAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!username.trim()) { toast.error("Enter a GitHub username"); return; }
    setLoading(true);
    try {
      const res = await analyzeGitHub(username.trim());
      setData(res.data);
      toast.success("GitHub profile analyzed!");
    } catch {
      toast.error("Could not analyze. Check the username.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <GitBranch className="w-6 h-6" />
          GitHub Analyzer
        </h1>
        <p className="text-muted-foreground mt-1">AI analysis of any GitHub profile — quality, stack, and portfolio gaps.</p>
      </div>

      <Card className="glass">
        <CardContent className="p-6 flex gap-4 items-end">
          <div className="flex-1">
            <Label>GitHub Username</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. torvalds" className="mt-1.5 bg-background/50"
              onKeyDown={(e) => e.key === "Enter" && handleAnalyze()} />
          </div>
          <Button onClick={handleAnalyze} disabled={loading}
            className="bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-white text-white dark:text-slate-900 border-0 gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitBranch className="w-4 h-4" />}
            Analyze
          </Button>
        </CardContent>
      </Card>

      {data && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          {/* Score Card */}
          <Card className="glass border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold">@{data.username}</h2>
                  <p className="text-sm text-muted-foreground">{data.total_repos} public repositories</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold gradient-text">{data.overall_score}/10</div>
                  <div className="text-xs text-muted-foreground">Overall Score</div>
                </div>
              </div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Overall Score</span><span>{data.overall_score}/10</span>
              </div>
              <Progress value={(data.overall_score / 10) * 100} className="h-3" />
            </CardContent>
          </Card>

          {/* Languages & Repos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Card className="glass">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-400" /> Languages Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.languages_used?.map((l, i) => (
                    <Badge key={l} variant="outline" className={`text-xs ${i === 0 ? "bg-primary/10 border-primary/30" : "border-border/50"}`}>
                      {l}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" /> Contribution Score
                </h3>
                <div className="text-3xl font-bold text-green-400 mb-1">{data.contribution_score}</div>
                <Progress value={Math.min(data.contribution_score, 100)} className="h-2" />
              </CardContent>
            </Card>
          </div>

          {/* Top Repos */}
          <Card className="glass">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-4">Top Repositories</h3>
              <div className="space-y-3">
                {data.top_repos?.map((repo) => (
                  <a key={repo.name} href={repo.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 glass rounded-lg hover:border-primary/30 transition-all">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{repo.name}</span>
                        {repo.language && <Badge variant="outline" className="text-xs border-border/50">{repo.language}</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{repo.description || "No description"}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                      <span className="flex items-center gap-1 text-xs text-amber-400">
                        <Star className="w-3 h-3" />{repo.stars}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="glass">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3">AI Recommendations</h3>
              <ul className="space-y-2">
                {data.recommendations?.map((r, i) => (
                  <li key={i} className="text-sm flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-primary">{i + 1}</span>
                    </div>
                    {r}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
