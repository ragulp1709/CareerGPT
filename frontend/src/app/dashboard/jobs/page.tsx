"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Loader2, TrendingUp, AlertCircle, Code, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { matchJobs } from "@/lib/api";
import type { JobMatchResponse } from "@/types";
import { toast } from "sonner";

export default function JobMatchingPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<JobMatchResponse | null>(null);

  const handleMatch = async () => {
    setLoading(true);
    try {
      const res = await matchJobs();
      setData(res.data);
      toast.success("Job matches found!");
    } catch {
      toast.error("Job matching failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-amber-400" />
            Job Matching
          </h1>
          <p className="text-muted-foreground mt-1">AI matches your profile to real job requirements.</p>
        </div>
        <Button onClick={handleMatch} disabled={loading}
          className="bg-gradient-to-r from-amber-600 to-orange-600 text-white border-0 gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Briefcase className="w-4 h-4" />}
          {loading ? "Matching..." : "Find Job Matches"}
        </Button>
      </div>

      {!data && !loading && (
        <div className="glass rounded-2xl p-16 text-center">
          <Briefcase className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Ready to Find Your Dream Job?</h3>
          <p className="text-sm text-muted-foreground">Click "Find Job Matches" to see roles that match your profile.</p>
        </div>
      )}

      {data && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          {/* Job Cards */}
          {data.matches?.map((job, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className="glass hover:border-primary/30 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold">{job.job_title}</h3>
                      <p className="text-sm text-muted-foreground">{job.company_type}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold gradient-text">{job.match_percentage?.toFixed(0)}%</div>
                      <div className="text-xs text-muted-foreground">Match</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Match Score</span><span>{job.match_percentage?.toFixed(0)}%</span>
                      </div>
                      <Progress value={job.match_percentage} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Readiness</span><span>{job.readiness_score?.toFixed(0)}%</span>
                      </div>
                      <Progress value={job.readiness_score} className="h-2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {job.salary_range && (
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span>{job.salary_range}</span>
                      </div>
                    )}
                    {job.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        <span>{job.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1.5">Required Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {job.required_skills?.map((s) => (
                          <Badge key={s} variant="outline" className="text-xs bg-primary/5 border-primary/20">{s}</Badge>
                        ))}
                      </div>
                    </div>
                    {job.missing_skills?.length > 0 && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-red-400" /> Missing Skills
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {job.missing_skills.map((s) => (
                            <Badge key={s} variant="outline" className="text-xs bg-red-500/5 border-red-500/20">{s}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {job.why_good_fit && (
                      <div className="glass rounded-lg p-3 text-sm text-muted-foreground">
                        <span className="text-foreground font-medium">Why you fit: </span>{job.why_good_fit}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Strategy */}
          {data.job_search_strategy && (
            <Card className="glass border-amber-500/20">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-400" /> Job Search Strategy
                </h3>
                <p className="text-sm text-muted-foreground">{data.job_search_strategy}</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
