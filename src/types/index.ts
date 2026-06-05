export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'developer' | 'trainer' | 'recruiter' | 'corporate' | 'startup' | 'admin';
  bio?: string;
  skills?: string[];
  location?: string;
  website?: string;
  joinedAt: string;
  coursesCompleted: number;
  certificatesEarned: number;
  streakDays: number;
  points: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  students: number;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  tags: string[];
  progress?: number;
  isFree?: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: { monthly: number; annual: number };
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readTime: string;
  thumbnail: string;
  views: number;
  likes: number;
}

export interface DashboardStats {
  coursesEnrolled: number;
  coursesCompleted: number;
  certificatesEarned: number;
  totalHoursLearned: number;
  currentStreak: number;
  skillsLearned: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  demoLogin: (role: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: User['role'];
}
