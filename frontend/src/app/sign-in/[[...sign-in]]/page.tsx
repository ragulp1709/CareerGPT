"use client";

import { SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Brain } from "lucide-react";

const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";

function DevSignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    try {
      const res = await fetch(`${apiBase}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Sign in failed.");
        setLoading(false);
        return;
      }
      document.cookie = `dev_session=${data.clerk_id}; path=/; max-age=86400`;
      router.push("/dashboard");
    } catch {
      setError("Could not connect to server. Make sure the backend is running.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="relative w-full max-w-sm">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 bg-card border border-border/50 shadow-2xl backdrop-blur-md rounded-2xl p-8">
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">CareerGPT</h1>
            <p className="text-sm text-muted-foreground text-center">Sign in to your AI career platform</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-white font-medium text-sm transition-all disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
          <p className="text-xs text-center text-muted-foreground mt-6">
            Don&apos;t have an account?{" "}
            <a href="/sign-up" className="text-primary hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  if (bypassAuth) return <DevSignInPage />;
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <SignIn
          appearance={{
            elements: {
              rootBox: "relative z-10",
              card: "bg-card border border-border/50 shadow-2xl backdrop-blur-md",
              headerTitle: "gradient-text",
              formButtonPrimary: "bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700",
            },
          }}
          fallbackRedirectUrl="/dashboard"
        />
      </div>
    </div>
  );
}
