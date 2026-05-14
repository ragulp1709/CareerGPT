"use client";

import { useUser } from "@clerk/nextjs";
import { UserContextProvider } from "@/contexts/user-context";

export function ClerkUserProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  return (
    <UserContextProvider
      value={{
        user: user
          ? {
              id: user.id,
              fullName: user.fullName,
              firstName: user.firstName,
              primaryEmailAddress: user.primaryEmailAddress
                ? { emailAddress: user.primaryEmailAddress.emailAddress }
                : null,
              imageUrl: user.imageUrl,
            }
          : user,
        isLoaded,
        isSignedIn: !!isSignedIn,
      }}
    >
      {children}
    </UserContextProvider>
  );
}
