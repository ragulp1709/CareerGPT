"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sword, Loader2, MessageSquare, Send, ChevronDown, ChevronUp, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getInterviewQuestions, getAnswerFeedback } from "@/lib/api";
import type { InterviewResponse, InterviewQuestion } from "@/types";
import { toast } from "sonner";

const difficultyColor = (d: string) =>
  d === "easy" ? "text-green-400 bg-green-500/10 border-green-500/30"
  : d === "medium" ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
  : "text-red-400 bg-red-500/10 border-red-500/30";

export default function InterviewPage() {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [data, setData] = useState<InterviewResponse | null>(null);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [selectedQ, setSelectedQ] = useState<InterviewQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await getInterviewQuestions(role || undefined);
      setData(res.data);
      toast.success("Interview questions ready!");
    } catch {
      toast.error("Failed to generate questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async () => {
    if (!selectedQ || !userAnswer.trim()) return;
    setFeedbackLoading(true);
    try {
      const res = await getAnswerFeedback(selectedQ.question, userAnswer);
      setFeedback(res.data.feedback);
    } catch {
      toast.error("Feedback failed.");
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sword className="w-6 h-6 text-red-400" />
          Interview Arena
        </h1>
        <p className="text-muted-foreground mt-1">Practice with AI-generated questions and get instant feedback.</p>
      </div>

      <Card className="glass">
        <CardContent className="p-6 flex gap-4 items-end">
          <div className="flex-1">
            <Label>Target Role (optional)</Label>
            <Input placeholder="e.g. Software Engineer, Data Scientist" value={role}
              onChange={(e) => setRole(e.target.value)} className="mt-1.5 bg-background/50" />
          </div>
          <Button onClick={handleGenerate} disabled={loading}
            className="bg-gradient-to-r from-red-600 to-orange-600 text-white border-0 gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sword className="w-4 h-4" />}
            {loading ? "Generating..." : "Generate Questions"}
          </Button>
        </CardContent>
      </Card>

      {data && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Tabs defaultValue="technical">
            <TabsList className="glass mb-4">
              <TabsTrigger value="technical">Technical ({data.questions?.length || 0})</TabsTrigger>
              <TabsTrigger value="hr">HR / Behavioral ({data.hr_questions?.length || 0})</TabsTrigger>
              <TabsTrigger value="practice">Practice Mode</TabsTrigger>
            </TabsList>

            <TabsContent value="technical" className="space-y-3">
              {data.questions?.map((q, i) => (
                <Card key={q.id || i} className="glass">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between cursor-pointer"
                      onClick={() => setExpanded(expanded === i ? null : i)}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground font-mono">Q{i + 1}</span>
                          <Badge variant="outline" className={`text-xs ${difficultyColor(q.difficulty)}`}>
                            {q.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-border/50">{q.category}</Badge>
                        </div>
                        <p className="font-medium text-sm">{q.question}</p>
                      </div>
                      {expanded === i ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" /> : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />}
                    </div>
                    {expanded === i && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3 border-t border-border/50 pt-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-2">Expected Answer Points</p>
                          <ul className="space-y-1">
                            {q.expected_answer_points?.map((p, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="w-3.5 h-3.5 text-green-400 flex-shrink-0 mt-0.5" />{p}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {q.follow_up_questions?.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-2">Follow-up Questions</p>
                            <div className="flex flex-wrap gap-2">
                              {q.follow_up_questions.map((fq, j) => (
                                <Badge key={j} variant="outline" className="text-xs border-border/50">{fq}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <Button size="sm" variant="outline" className="border-border/60 gap-2" onClick={() => { setSelectedQ(q); setFeedback(""); setUserAnswer(""); }}>
                          <MessageSquare className="w-3.5 h-3.5" /> Practice This Question
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="hr" className="space-y-3">
              {data.hr_questions?.map((q, i) => (
                <Card key={i} className="glass">
                  <CardContent className="p-5">
                    <p className="font-medium mb-3">{q.question}</p>
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground">Tips:</p>
                      <ul className="space-y-1">
                        {q.tips?.map((tip, j) => (
                          <li key={j} className="text-sm flex items-start gap-2">
                            <Star className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />{tip}
                          </li>
                        ))}
                      </ul>
                      {q.sample_answer_structure && (
                        <div className="glass rounded-lg p-3 mt-2">
                          <p className="text-xs text-muted-foreground">Structure: <span className="text-foreground">{q.sample_answer_structure}</span></p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="practice">
              {selectedQ ? (
                <div className="space-y-4">
                  <Card className="glass border-primary/20">
                    <CardContent className="p-5">
                      <p className="text-sm text-muted-foreground mb-1">Practice Question</p>
                      <p className="font-medium">{selectedQ.question}</p>
                    </CardContent>
                  </Card>
                  <div>
                    <Label className="mb-2 block">Your Answer</Label>
                    <Textarea rows={5} value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your answer here…" className="bg-background/50 border-border/60" />
                  </div>
                  <Button onClick={handleFeedback} disabled={feedbackLoading || !userAnswer.trim()}
                    className="gap-2 bg-gradient-to-r from-red-600 to-orange-600 text-white border-0">
                    {feedbackLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Get AI Feedback
                  </Button>
                  {feedback && (
                    <Card className="glass border-green-500/20">
                      <CardContent className="p-5">
                        <p className="text-sm font-medium mb-2 text-green-400">AI Feedback</p>
                        <p className="text-sm whitespace-pre-wrap">{feedback}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <div className="glass rounded-xl p-12 text-center">
                  <Sword className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Select a technical question from the Technical tab and click "Practice This Question"</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </div>
  );
}
