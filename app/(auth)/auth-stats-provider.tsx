"use client";

import { createContext, useContext } from "react";

interface AuthStats {
  moduleCount: number;
  questionCount: number;
}

const AuthStatsContext = createContext<AuthStats | null>(null);

export function AuthStatsProvider({
  moduleCount,
  questionCount,
  children,
}: AuthStats & { children: React.ReactNode }) {
  return (
    <AuthStatsContext.Provider value={{ moduleCount, questionCount }}>{children}</AuthStatsContext.Provider>
  );
}

export function useAuthStats() {
  const ctx = useContext(AuthStatsContext);
  if (!ctx) {
    throw new Error("useAuthStats must be used within an AuthStatsProvider");
  }
  return ctx;
}
