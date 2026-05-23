"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  MOCK_USER,
  WORKSPACES,
  clearSessionCookie,
  setSessionCookie,
  type MockUser,
} from "@/lib/auth";

type AuthContextValue = {
  user: MockUser | null;
  workspaceId: string;
  setWorkspaceId: (id: string) => void;
  workspaces: typeof WORKSPACES;
  signIn: (email?: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [workspaceId, setWorkspaceId] = useState(WORKSPACES[0].id);

  const signIn = useCallback((email?: string) => {
    setSessionCookie();
    setUser({
      ...MOCK_USER,
      email: email?.trim() || MOCK_USER.email,
    });
  }, []);

  const signOut = useCallback(() => {
    clearSessionCookie();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      workspaceId,
      setWorkspaceId,
      workspaces: WORKSPACES,
      signIn,
      signOut,
    }),
    [user, workspaceId, signIn, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
