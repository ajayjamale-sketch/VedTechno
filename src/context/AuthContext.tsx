import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User, RegisterData } from "@/types";
import { sleep, MOCK_DELAY } from "@/lib/utils";
import { DEMO_USERS } from "@/hooks/useAuth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  demoLogin: (role: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("vedtechno-user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("vedtechno-user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    await sleep(MOCK_DELAY);
    setIsLoading(false);

    if (email && password.length >= 6) {
      const demoUser = Object.values(DEMO_USERS).find((u) => u.email === email);
      const loggedUser = demoUser ? demoUser : { ...DEMO_USERS.student, email };
      setUser(loggedUser);
      localStorage.setItem("vedtechno-user", JSON.stringify(loggedUser));
      return true;
    }
    return false;
  };

  const demoLogin = async (role: string): Promise<boolean> => {
    setIsLoading(true);
    await sleep(600);
    setIsLoading(false);
    const demoUser = DEMO_USERS[role] || DEMO_USERS.student;
    setUser(demoUser);
    localStorage.setItem("vedtechno-user", JSON.stringify(demoUser));
    return true;
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    await sleep(MOCK_DELAY);
    setIsLoading(false);

    const newUser: User = {
      ...(DEMO_USERS.student),
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      joinedAt: new Date().toISOString(),
      coursesCompleted: 0,
      certificatesEarned: 0,
      streakDays: 0,
      points: 0,
    };
    setUser(newUser);
    localStorage.setItem("vedtechno-user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("vedtechno-user");
  };

  const updateProfile = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem("vedtechno-user", JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, demoLogin, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
