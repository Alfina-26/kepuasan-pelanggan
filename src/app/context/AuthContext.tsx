import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "developer" | "customer" | null;

interface User {
  username: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string): boolean => {
    // Mock authentication
    const validUsers: { [key: string]: { password: string; role: UserRole } } = {
      admin: { password: "admin123", role: "admin" },
      developer: { password: "developer123", role: "developer" },
      customer: { password: "customer123", role: "customer" },
    };

    const userCredentials = validUsers[username];

    if (userCredentials && userCredentials.password === password) {
      setUser({ username, role: userCredentials.role });
      return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
