"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: number;
  username: string;
  email: string;
};

type Session = {
  user: User;
};

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  refreshSession: () => void;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  signIn: async () => { },
  signOut: async () => { },
  register: async () => { },
  refreshSession: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Load session on first load
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setSession({ user: JSON.parse(storedUser) });
    }
    setLoading(false);
  }, []);

  const refreshSession = () => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setSession({ user: JSON.parse(storedUser) });
    } else {
      setSession(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to sign in");
      }

      const { data } = await response.json();
      sessionStorage.setItem("accessToken", data.accessToken);
      sessionStorage.setItem("refreshToken", data.refreshToken);
      sessionStorage.setItem("user", JSON.stringify({
        id: data.id,
        username: data.username,
        email: data.email
      }));
      setSession({ user: { id: data.id, username: data.username, email: data.email } });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
    setSession(null);
  };

  const register = async (username: string, email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to register");
      }

      const { data } = await response.json();
      sessionStorage.setItem("accessToken", data.accessToken);
      sessionStorage.setItem("refreshToken", data.refreshToken);
      sessionStorage.setItem("user", JSON.stringify({
        id: data.id,
        username: data.username,
        email: data.email
      }));
      setSession({ user: { id: data.id, username: data.username, email: data.email } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, loading, signIn, signOut, register, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useSession = () => useContext(AuthContext);
