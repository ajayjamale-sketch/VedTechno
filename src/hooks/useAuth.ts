import { useState, useEffect } from "react";
import type { User, RegisterData } from "@/types";
import { sleep, MOCK_DELAY } from "@/lib/utils";

export const DEMO_USERS: Record<string, User> = {
  student: {
    id: "user-student",
    name: "Alex Johnson",
    email: "student@vedtechno.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    role: "student",
    bio: "Passionate developer learning full-stack development and AI/ML.",
    skills: ["JavaScript", "React", "Python", "Node.js"],
    location: "San Francisco, CA",
    website: "https://alexjohnson.dev",
    joinedAt: "2025-01-15",
    coursesCompleted: 7,
    certificatesEarned: 3,
    streakDays: 24,
    points: 3450,
  },
  developer: {
    id: "user-developer",
    name: "Maya Patel",
    email: "developer@vedtechno.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    role: "developer",
    bio: "Senior developer specializing in cloud architecture and open source.",
    skills: ["Go", "Rust", "Kubernetes", "AWS", "GraphQL"],
    location: "Austin, TX",
    website: "https://mayapatel.dev",
    joinedAt: "2024-08-10",
    coursesCompleted: 15,
    certificatesEarned: 6,
    streakDays: 47,
    points: 8920,
  },
  trainer: {
    id: "user-trainer",
    name: "Dr. Ravi Kumar",
    email: "trainer@vedtechno.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    role: "trainer",
    bio: "10+ years in tech education. Courses in AI, Cloud & Full Stack.",
    skills: ["Machine Learning", "Python", "TensorFlow", "Teaching"],
    location: "Bangalore, India",
    website: "https://ravikumar.edu",
    joinedAt: "2024-03-01",
    coursesCompleted: 0,
    certificatesEarned: 0,
    streakDays: 0,
    points: 14500,
  },
  recruiter: {
    id: "user-recruiter",
    name: "Sarah Mitchell",
    email: "recruiter@vedtechno.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    role: "recruiter",
    bio: "Tech recruiter at top-tier SaaS companies. Hiring full-stack & AI talent.",
    skills: ["Recruiting", "Technical Screening", "Talent Sourcing"],
    location: "New York, NY",
    website: "https://sarah-recruits.com",
    joinedAt: "2025-02-20",
    coursesCompleted: 0,
    certificatesEarned: 0,
    streakDays: 0,
    points: 2100,
  },
  corporate: {
    id: "user-corporate",
    name: "James Anderson",
    email: "corporate@vedtechno.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    role: "corporate",
    bio: "L&D Manager at GlobalTech Corp. Managing enterprise upskilling initiatives.",
    skills: ["L&D", "Team Management", "Workforce Planning"],
    location: "Chicago, IL",
    website: "https://globaltech.com",
    joinedAt: "2024-11-01",
    coursesCompleted: 0,
    certificatesEarned: 0,
    streakDays: 0,
    points: 5400,
  },
  startup: {
    id: "user-startup",
    name: "Zara Khan",
    email: "startup@vedtechno.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    role: "startup" as any,
    bio: "Founder of NeuralEdge — building AI-powered productivity tools.",
    skills: ["Product Management", "Python", "React", "AI/ML"],
    location: "Seattle, WA",
    website: "https://neuraledge.io",
    joinedAt: "2025-03-15",
    coursesCompleted: 4,
    certificatesEarned: 2,
    streakDays: 18,
    points: 4200,
  },
  admin: {
    id: "user-admin",
    name: "Admin User",
    email: "admin@vedtechno.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
    role: "admin",
    bio: "Platform administrator. Full access to all VedTechno systems.",
    skills: ["Platform Administration", "Analytics", "User Management"],
    location: "San Francisco, CA",
    website: "https://vedtechno.com",
    joinedAt: "2024-01-01",
    coursesCompleted: 0,
    certificatesEarned: 0,
    streakDays: 0,
    points: 99999,
  },
};

export function useAuth() {
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
      // Check if matches a demo user by email
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

  return { user, isLoading, login, demoLogin, register, logout, updateProfile };
}
