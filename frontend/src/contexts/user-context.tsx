"use client";

import React, { createContext, useContext } from "react";

export interface AppUser {
  id: string;
  fullName: string | null;
  firstName: string | null;
  primaryEmailAddress: { emailAddress: string } | null;
  imageUrl: string;
}

interface UserContextType {
  user: AppUser | null | undefined;
  isLoaded: boolean;
  isSignedIn: boolean;
}

const UserContext = createContext<UserContextType>({
  user: undefined,
  isLoaded: false,
  isSignedIn: false,
});

export function useCurrentUser() {
  return useContext(UserContext);
}

export const UserContextProvider = UserContext.Provider;
