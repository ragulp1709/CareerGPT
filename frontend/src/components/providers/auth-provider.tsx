import { ClerkProvider } from "@clerk/nextjs";
import { ClerkUserProvider } from "./clerk-user-provider";
import { DevUserProvider } from "./dev-user-provider";

const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (bypassAuth) {
    return <DevUserProvider>{children}</DevUserProvider>;
  }
  return (
    <ClerkProvider>
      <ClerkUserProvider>{children}</ClerkUserProvider>
    </ClerkProvider>
  );
}
