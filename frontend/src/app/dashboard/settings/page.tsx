"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Save, Loader2, Plus, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrentUser } from "@/contexts/user-context";
import { upsertProfile } from "@/lib/api";
import { toast } from "sonner";

const domains = [
  "Full Stack Development", "Frontend Development", "Backend Development",
  "Data Science", "Machine Learning / AI", "DevOps / Cloud", "Mobile Development",
  "Cybersecurity", "Blockchain", "Game Development", "UI/UX Design", "Product Management",
];

const experienceLevels = [
  { value: "beginner", label: "Beginner (0-1 years)" },
  { value: "intermediate", label: "Intermediate (2-4 years)" },
  { value: "senior", label: "Senior (5+ years)" },
];

export default function SettingsPage() {
  const { user } = useCurrentUser();
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");

  const [form, setForm] = useState({
    name: "", email: "", education: "", career_goals: "",
    experience_level: "beginner", preferred_domain: "",
    github_url: "", linkedin_url: "", skills: [] as string[], interests: [] as string[],
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("clerk_user_id", user.id);
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      fetch(`${apiBase}/users/me`, {
        headers: { "x-clerk-user-id": user.id },
      })
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data) {
            setForm({
              name: data.name ?? "",
              email: data.email ?? "",
              education: data.education ?? "",
              career_goals: data.career_goals ?? "",
              experience_level: data.experience_level ?? "beginner",
              preferred_domain: data.preferred_domain ?? "",
              github_url: data.github_url ?? "",
              linkedin_url: data.linkedin_url ?? "",
              skills: data.skills ?? [],
              interests: data.interests ?? [],
            });
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !form.skills.includes(s)) {
      setForm((f) => ({ ...f, skills: [...f.skills, s] }));
    }
    setSkillInput("");
  };

  const removeSkill = (s: string) => setForm((f) => ({ ...f, skills: f.skills.filter((x) => x !== s) }));

  const addInterest = () => {
    const s = interestInput.trim();
    if (s && !form.interests.includes(s)) {
      setForm((f) => ({ ...f, interests: [...f.interests, s] }));
    }
    setInterestInput("");
  };

  const removeInterest = (s: string) => setForm((f) => ({ ...f, interests: f.interests.filter((x) => x !== s) }));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await upsertProfile({
        clerk_id: user.id,
        email: form.email,
        name: form.name,
        education: form.education,
        career_goals: form.career_goals,
        experience_level: form.experience_level as any,
        preferred_domain: form.preferred_domain,
        github_url: form.github_url,
        linkedin_url: form.linkedin_url,
        skills: form.skills,
        interests: form.interests,
      });
      toast.success("Profile saved successfully!");
    } catch {
      toast.error("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-400" />
          Settings & Profile
        </h1>
        <p className="text-muted-foreground mt-1">
          Complete your profile to get accurate AI recommendations.
        </p>
      </div>

      {/* Basic Info */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4 text-primary" /> Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Full Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1.5 bg-background/50" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email} disabled className="mt-1.5 bg-background/30 opacity-60" />
            </div>
          </div>
          <div>
            <Label>Education</Label>
            <Input value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })}
              placeholder="e.g. B.Tech Computer Science, MIT" className="mt-1.5 bg-background/50" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Experience Level</Label>
              <Select value={form.experience_level} onValueChange={(v) => setForm({ ...form, experience_level: v ?? "beginner" })}>
                <SelectTrigger className="mt-1.5 bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((l) => (
                    <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Preferred Domain</Label>
              <Select value={form.preferred_domain} onValueChange={(v) => setForm({ ...form, preferred_domain: v ?? "" })}>
                <SelectTrigger className="mt-1.5 bg-background/50">
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  {domains.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Career Goals</Label>
            <Textarea value={form.career_goals} onChange={(e) => setForm({ ...form, career_goals: e.target.value })}
              placeholder="Describe your career aspirations…" rows={3}
              className="mt-1.5 bg-background/50 resize-none" />
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Add a skill (e.g. Python, React)" className="bg-background/50"
              onKeyDown={(e) => e.key === "Enter" && addSkill()} />
            <Button variant="outline" size="icon" onClick={addSkill} className="border-border/60">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.skills.map((s) => (
              <Badge key={s} variant="outline" className="gap-1.5 pl-3 pr-2 py-1 bg-primary/5">
                {s}
                <button onClick={() => removeSkill(s)} className="hover:text-destructive transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {form.skills.length === 0 && (
              <p className="text-sm text-muted-foreground">No skills added yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Interests */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Interests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input value={interestInput} onChange={(e) => setInterestInput(e.target.value)}
              placeholder="Add an interest (e.g. AI, Gaming, Finance)" className="bg-background/50"
              onKeyDown={(e) => e.key === "Enter" && addInterest()} />
            <Button variant="outline" size="icon" onClick={addInterest} className="border-border/60">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.interests.map((s) => (
              <Badge key={s} variant="outline" className="gap-1.5 pl-3 pr-2 py-1 bg-cyan-500/5">
                {s}
                <button onClick={() => removeInterest(s)} className="hover:text-destructive transition-colors">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="glass">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Social Profiles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>GitHub URL</Label>
            <Input value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })}
              placeholder="https://github.com/username" className="mt-1.5 bg-background/50" />
          </div>
          <div>
            <Label>LinkedIn URL</Label>
            <Input value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })}
              placeholder="https://linkedin.com/in/username" className="mt-1.5 bg-background/50" />
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}
          className="bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-0 gap-2 px-8">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}
