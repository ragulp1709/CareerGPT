"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserContextProvider } from "@/contexts/user-context";

const getDevUserId = () => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )dev_session=([^;]*)/);
  const val = match ? decodeURIComponent(match[1]) : null;
  // reject stale "true" cookie from old implementation
  return val && val !== "true" ? val : null;
};

const clearSession = () => {
  document.cookie = "dev_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
};

export function DevUserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userId = getDevUserId();
    if (!userId) {
      clearSession();
      setIsLoaded(true);
      return;
    }
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
    fetch(`${apiBase}/users/me`, {
      headers: { "x-clerk-user-id": userId },
    })
      .then((r) => {
        if (r.status === 404) {
          clearSession();
          router.replace("/sign-in");
          return null;
        }
        return r.ok ? r.json() : null;
      })
      .then((data) => {
        if (data) {
          setUser({
            id: data.clerk_id,
            fullName: data.name,
            firstName: data.name?.split(" ")[0] ?? "User",
            primaryEmailAddress: { emailAddress: data.email },
            imageUrl: data.avatar_url || "",
          });
        }
        setIsLoaded(true);
      })
      .catch(() => setIsLoaded(true));
  }, []);

  return (
    <UserContextProvider value={{ user, isLoaded, isSignedIn: !!user }}>
      {children}
    </UserContextProvider>
  );
}
