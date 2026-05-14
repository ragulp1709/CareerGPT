"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Loader2, CheckCircle, AlertCircle, TrendingUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { analyzeResume } from "@/lib/api";
import type { ResumeAnalysis } from "@/types";
import { toast } from "sonner";

const SCORE_COLOR = (s: number) =>
  s >= 80 ? "text-green-400" : s >= 60 ? "text-amber-400" : "text-red-400";

export default function ResumeAnalyzerPage() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.name.endsWith(".pdf")) {
      toast.error("Only PDF files are supported");
      return;
    }
    setFileName(file.name);
    setLoading(true);
    try {
      const res = await analyzeResume(file);
      setAnalysis(res.data);
      toast.success("Resume analyzed successfully!");
    } catch {
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sectionScores = analysis?.section_scores
    ? Object.entries(analysis.section_scores)
    : [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="w-6 h-6 text-green-400" />
          Resume Analyzer
        </h1>
        <p className="text-muted-foreground mt-1">
          Upload your PDF resume for AI-powered ATS analysis and improvement suggestions.
        </p>
      </div>

      {/* Upload Area */}
      <Card className="glass">
        <CardContent className="p-8">
          <div
            className="border-2 border-dashed border-border/60 rounded-xl p-10 text-center hover:border-primary/40 transition-colors cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={handleFile} />
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Analyzing {fileName}…</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-green-400" />
                </div>
                <div>
                  <p className="font-medium">{fileName || "Drop your resume here"}</p>
                  <p className="text-sm text-muted-foreground mt-1">PDF format · Max 5MB</p>
                </div>
                <Button variant="outline" size="sm" className="mt-2 border-border/60">
                  Choose File
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          {/* ATS Score */}
          <Card className="glass border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg">ATS Score</h3>
                  <p className="text-sm text-muted-foreground">Applicant Tracking System compatibility</p>
                </div>
                <div className={`text-5xl font-extrabold ${SCORE_COLOR(analysis.ats_score)}`}>
                  {analysis.ats_score?.toFixed(0)}
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
              </div>
              <Progress value={analysis.ats_score} className="h-3" />
            </CardContent>
          </Card>

          {/* Section Scores */}
          {sectionScores.length > 0 && (
            <Card className="glass">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-4">Section Scores</h3>
                <div className="space-y-3">
                  {sectionScores.map(([section, score]) => (
                    <div key={section}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{section}</span>
                        <span className={`font-medium ${SCORE_COLOR(Number(score))}`}>{score}%</span>
                      </div>
                      <Progress value={Number(score)} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Extracted Skills & Missing Keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" /> Detected Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.extracted_skills?.map((s) => (
                    <Badge key={s} variant="outline" className="text-xs bg-green-500/5 border-green-500/20">{s}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" /> Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missing_keywords?.map((k) => (
                    <Badge key={k} variant="outline" className="text-xs bg-red-500/5 border-red-500/20">{k}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Optimized Summary */}
          {analysis.optimized_summary && (
            <Card className="glass border-primary/20">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" /> AI-Optimized Summary
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{analysis.optimized_summary}</p>
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          <Card className="glass">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-cyan-400" /> Improvement Suggestions
              </h3>
              <div className="space-y-2">
                {analysis.improvement_suggestions?.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-cyan-400">{i + 1}</span>
                    </div>
                    {s}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Overall Feedback */}
          <Card className="glass">
            <CardContent className="p-5">
              <h3 className="font-semibold mb-2">Overall Feedback</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{analysis.overall_feedback}</p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
