import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Award, Clock, Flame, Code2, ChevronRight, Play, Star, Zap,
  Target, TrendingUp, CheckCircle2, BarChart3, Lock, Brain, ArrowRight,
  Users, Search, X, Download, Share2, Plus, Filter, Trash2, Edit2, Calendar as CalendarIcon
} from "lucide-react";
import { MOCK_COURSES } from "@/lib/constants";
import { cn, formatNumber } from "@/lib/utils";
import { BarChart, Bar, ResponsiveContainer, XAxis, CartesianGrid, Tooltip, AreaChart, Area } from "recharts";
import { toast } from "sonner";
import type { User } from "@/types";

// Types
interface EnrolledCourse {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  level: string;
  duration: string;
  rating: number;
  reviews: number;
  progress: number;
  category: string;
}

interface Task {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
  dueDate: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}

interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  status: "earned" | "in-progress";
  progress?: number;
  earnedDate?: string;
}

interface Discussion {
  id: string;
  title: string;
  tag: string;
  body: string;
  author: string;
  replies: number;
  views: number;
  createdAt: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  participants: number;
  prize: string;
  registered: boolean;
}

interface JobApplication {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  match: number;
  applied: boolean;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const weekData = [
  { day: "Mon", hours: 2.5 }, { day: "Tue", hours: 1.8 }, { day: "Wed", hours: 3.2 },
  { day: "Thu", hours: 2.0 }, { day: "Fri", hours: 4.1 }, { day: "Sat", hours: 1.5 }, { day: "Sun", hours: 2.8 },
];
const monthData = [
  { week: "W1", score: 62 }, { week: "W2", score: 68 }, { week: "W3", score: 74 }, { week: "W4", score: 82 },
];

const initialTasks: Task[] = [
  { id: "t1", title: "Complete React Hooks module", courseId: "1", courseTitle: "Full Stack Dev", dueDate: new Date().toISOString().split("T")[0], priority: "high", completed: false },
  { id: "t2", title: "Submit ML project", courseId: "2", courseTitle: "Machine Learning", dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0], priority: "medium", completed: false },
  { id: "t3", title: "Take Python assessment", courseId: "3", courseTitle: "Data Science", dueDate: new Date(Date.now() + 259200000).toISOString().split("T")[0], priority: "low", completed: false },
];

const initialCertificates: Certificate[] = [
  { id: "c1", name: "JavaScript Fundamentals", issuer: "VedTechno", date: "Apr 2026", status: "earned", earnedDate: "2026-04-15" },
  { id: "c2", name: "React Developer", issuer: "VedTechno", date: "May 2026", status: "earned", earnedDate: "2026-05-20" },
  { id: "c3", name: "Python Advanced", issuer: "VedTechno", date: "—", status: "in-progress", progress: 72 },
];

const initialDiscussions: Discussion[] = [
  { id: "d1", title: "Best practices for React state management in 2026", tag: "React", body: "I've been using Context API...", author: "Alex", replies: 24, views: 1230, createdAt: "2026-05-28" },
  { id: "d2", title: "How to optimize Python ML model inference time?", tag: "ML", body: "My model takes 2s per inference...", author: "Sam", replies: 18, views: 890, createdAt: "2026-05-29" },
  { id: "d3", title: "Cloud vs on-premise: What's best for startups?", tag: "Cloud", body: "We're bootstrapping...", author: "Jordan", replies: 31, views: 2100, createdAt: "2026-05-27" },
];

const initialEvents: Event[] = [
  { id: "e1", title: "Weekly Hackathon: Build an AI Tool", date: "Saturday, Jun 7", participants: 142, prize: "$500", registered: false },
  { id: "e2", title: "React Live Workshop with @maya", date: "Tuesday, Jun 10", participants: 89, prize: "Free", registered: false },
  { id: "e3", title: "ML Competition: Image Classification", date: "Saturday, Jun 14", participants: 210, prize: "$1,000", registered: false },
];

const initialJobs: JobApplication[] = [
  { id: "j1", title: "Junior React Developer", company: "TechCorp", location: "Remote", salary: "$75K–$95K", match: 94, applied: false },
  { id: "j2", title: "Full Stack Engineer", company: "StartupXYZ", location: "San Francisco, CA", salary: "$90K–$120K", match: 88, applied: false },
  { id: "j3", title: "Frontend Developer", company: "DesignAgency", location: "New York, NY", salary: "$80K–$100K", match: 82, applied: false },
];

interface ModalProps { open: boolean; onClose: () => void; children: React.ReactNode; title: string; }
function Modal({ open, onClose, children, title }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default function StudentDashboard({ user, initialTab }: { user: User; initialTab?: string }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab || "overview");
  
  // User-specific state with localStorage persistence
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>(() => {
    const saved = localStorage.getItem(`student_${user.id}_courses`);
    if (saved) return JSON.parse(saved);
    // Default: first two MOCK_COURSES with progress
    return MOCK_COURSES.slice(0, 2).map(c => ({ ...c, progress: c.progress || 35 })) as EnrolledCourse[];
  });
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem(`student_${user.id}_tasks`);
    return saved ? JSON.parse(saved) : initialTasks;
  });
  
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem(`student_${user.id}_certificates`);
    return saved ? JSON.parse(saved) : initialCertificates;
  });
  
  const [discussions, setDiscussions] = useState<Discussion[]>(() => {
    const saved = localStorage.getItem(`student_${user.id}_discussions`);
    return saved ? JSON.parse(saved) : initialDiscussions;
  });
  
  const [events, setEvents] = useState<Event[]>(() => {
    const saved = localStorage.getItem(`student_${user.id}_events`);
    return saved ? JSON.parse(saved) : initialEvents;
  });
  
  const [jobs, setJobs] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem(`student_${user.id}_jobs`);
    return saved ? JSON.parse(saved) : initialJobs;
  });

  // Coding lab state
  const [codeRunning, setCodeRunning] = useState(false);
  const [code, setCode] = useState(`# VedTechno Coding Lab - Python\n\ndef fibonacci(n):\n    """Generate Fibonacci sequence"""\n    a, b = 0, 1\n    sequence = []\n    for _ in range(n):\n        sequence.append(a)\n        a, b = b, a + b\n    return sequence\n\nprint(fibonacci(10))`);
  const [codeOutput, setCodeOutput] = useState("[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]");
  const [selectedLang, setSelectedLang] = useState("Python");

  // UI states
  const [courseSearch, setCourseSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [certModal, setCertModal] = useState<{ open: boolean; cert: Certificate | null }>({ open: false, cert: null });
  const [taskModal, setTaskModal] = useState(false);
  const [discussionModal, setDiscussionModal] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: "", tag: "React", body: "" });
  const [newTask, setNewTask] = useState({ title: "", courseId: "", dueDate: "", priority: "medium" as Task["priority"] });
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [coursePlayerModal, setCoursePlayerModal] = useState<EnrolledCourse | null>(null);
  const [roadmapModal, setRoadmapModal] = useState(false);
  const [resumeModal, setResumeModal] = useState(false);
  const [interviewModal, setInterviewModal] = useState(false);
  const [discussionViewModal, setDiscussionViewModal] = useState<Discussion | null>(null);
  const [browseCoursesModal, setBrowseCoursesModal] = useState(false);

  // Persist state changes
  useEffect(() => {
    localStorage.setItem(`student_${user.id}_courses`, JSON.stringify(enrolledCourses));
  }, [enrolledCourses, user.id]);
  useEffect(() => {
    localStorage.setItem(`student_${user.id}_tasks`, JSON.stringify(tasks));
  }, [tasks, user.id]);
  useEffect(() => {
    localStorage.setItem(`student_${user.id}_certificates`, JSON.stringify(certificates));
  }, [certificates, user.id]);
  useEffect(() => {
    localStorage.setItem(`student_${user.id}_discussions`, JSON.stringify(discussions));
  }, [discussions, user.id]);
  useEffect(() => {
    localStorage.setItem(`student_${user.id}_events`, JSON.stringify(events));
  }, [events, user.id]);
  useEffect(() => {
    localStorage.setItem(`student_${user.id}_jobs`, JSON.stringify(jobs));
  }, [jobs, user.id]);

  // Computed values
  const totalHours = enrolledCourses.reduce((acc, c) => acc + (c.progress / 100) * 40, 0);
  const avgDaily = (totalHours / 7).toFixed(1);
  const completionRate = enrolledCourses.length ? Math.round(enrolledCourses.reduce((a, c) => a + c.progress, 0) / enrolledCourses.length) : 0;
  const streakDays = user.streakDays;
  const certificatesEarned = certificates.filter(c => c.status === "earned").length;

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "lab", label: "Coding Lab", icon: Code2 },
    { id: "certs", label: "Certificates", icon: Award },
    { id: "career", label: "Career Hub", icon: Target },
    { id: "community", label: "Community", icon: Users },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ];

  const filteredCourses = useMemo(() => {
    return enrolledCourses.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
        c.instructor.toLowerCase().includes(courseSearch.toLowerCase());
      const matchesFilter = courseFilter === "All" || c.level === courseFilter || c.category === courseFilter;
      return matchesSearch && matchesFilter;
    });
  }, [enrolledCourses, courseSearch, courseFilter]);

  const availableCourses = MOCK_COURSES.filter(mc => !enrolledCourses.some(ec => ec.id === mc.id));

  // Course enrollment
  const handleEnrollNewCourse = (course: typeof MOCK_COURSES[0]) => {
    const newCourse: EnrolledCourse = { ...course, progress: 0 };
    setEnrolledCourses(prev => [...prev, newCourse]);
    toast.success(`Enrolled in ${course.title}!`);
    setBrowseCoursesModal(false);
  };

  // Task management
  const addTask = () => {
    if (!newTask.title.trim() || !newTask.courseId) {
      toast.error("Please fill all fields");
      return;
    }
    const course = enrolledCourses.find(c => c.id === newTask.courseId);
    if (!course) return;
    const task: Task = {
      id: generateId(),
      title: newTask.title,
      courseId: newTask.courseId,
      courseTitle: course.title,
      dueDate: newTask.dueDate,
      priority: newTask.priority,
      completed: false,
    };
    setTasks(prev => [...prev, task]);
    toast.success("Task added");
    setTaskModal(false);
    setNewTask({ title: "", courseId: "", dueDate: "", priority: "medium" });
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    toast.success("Task status updated");
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    toast.success("Task deleted");
  };

  // Certificate actions - FIXED share button with fallback
  const downloadCertificate = (cert: Certificate) => {
    toast.success(`Downloaded "${cert.name}" certificate (PDF)`);
  };
  const shareCertificate = async (cert: Certificate) => {
    const shareUrl = `${window.location.origin}/certificate/${cert.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Certificate share link copied to clipboard!");
    } catch (err) {
      // Fallback for browsers that block clipboard API
      prompt("Copy this link manually:", shareUrl);
      toast.info("Link ready – copy it from the prompt");
    }
  };

  // Coding lab
  const runCode = () => {
    setCodeRunning(true);
    const outputs: Record<string, string> = {
      Python: "[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]",
      JavaScript: "Array(10) [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]",
      Go: "[0 1 1 2 3 5 8 13 21 34]",
      Java: "[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]",
    };
    setTimeout(() => {
      setCodeRunning(false);
      setCodeOutput(outputs[selectedLang] || outputs.Python);
      toast.success(`Code executed in ${selectedLang}!`);
    }, 1200);
  };

  const loadChallenge = (title: string, desc: string) => {
    setCode(`# Challenge: ${title}\n# Difficulty: ${desc}\n\ndef solve():\n    # Write your solution here\n    pass\n`);
    toast.info(`Loaded challenge: ${title}`);
  };

  // Community - post discussion
  const postDiscussion = () => {
    if (!newDiscussion.title.trim() || !newDiscussion.body.trim()) {
      toast.error("Please enter title and description");
      return;
    }
    const discussion: Discussion = {
      id: generateId(),
      title: newDiscussion.title,
      tag: newDiscussion.tag,
      body: newDiscussion.body,
      author: user.name,
      replies: 0,
      views: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setDiscussions(prev => [discussion, ...prev]);
    toast.success("Discussion posted!");
    setDiscussionModal(false);
    setNewDiscussion({ title: "", tag: "React", body: "" });
  };

  // Course progress update
  const updateCourseProgress = (courseId: string, newProgress: number) => {
    setEnrolledCourses(prev => prev.map(c => c.id === courseId ? { ...c, progress: newProgress } : c));
    toast.success("Progress updated!");
  };

  const upcomingTasks = tasks.filter(t => !t.completed).slice(0, 3);

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-6 pb-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={cn("flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeTab === id ? "bg-primary text-white shadow-lg shadow-primary/25" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Good morning, {user.name.split(" ")[0]}! 👋</h1>
              <p className="text-muted-foreground text-sm mt-0.5">You're on a <strong className="text-foreground">{streakDays}-day streak</strong>. Keep it up!</p>
            </div>
            <button onClick={() => navigate('/pricing')} className="btn-primary text-sm self-start sm:self-center">
              <Zap className="w-4 h-4 mr-1.5" />Upgrade to Pro
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Courses Active", value: enrolledCourses.length.toString(), icon: BookOpen, color: "text-primary bg-primary/10", change: "+2 this week", tab: "courses" },
              { label: "Hours Learned", value: Math.round(totalHours).toString(), icon: Clock, color: "text-accent bg-accent/10", change: "+8.5 hrs", tab: "analytics" },
              { label: "Certificates", value: certificatesEarned.toString(), icon: Award, color: "text-yellow-600 bg-yellow-600/10", change: `${certificates.filter(c => c.status === "in-progress").length} in progress`, tab: "certs" },
              { label: "Streak Days", value: streakDays.toString(), icon: Flame, color: "text-orange-600 bg-accent/10", change: "Personal best!", tab: "analytics" },
            ].map(({ label, value, icon: Icon, color, change, tab }) => (
              <button key={label} onClick={() => setActiveTab(tab)}
                className="bg-card border border-border rounded-2xl p-4 hover:border-primary/30 transition-colors text-left">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", color)}><Icon className="w-4 h-4" /></div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xs text-accent dark:text-emerald-400 mt-1 font-medium">{change}</p>
              </button>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div><h3 className="font-semibold text-foreground text-sm">Weekly Learning Activity</h3><p className="text-xs text-muted-foreground">Hours per day this week</p></div>
                <span className="badge-accent text-xs">{totalHours.toFixed(0)}h total</span>
              </div>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                    <Bar dataKey="hours" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div><h3 className="font-semibold text-foreground text-sm">Career Readiness Score</h3><p className="text-xs text-muted-foreground">Monthly improvement</p></div>
                <span className="text-2xl font-bold text-foreground">{Math.round(completionRate * 0.8 + 20)}<span className="text-sm text-muted-foreground">/100</span></span>
              </div>
              <div className="h-20 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthData}>
                    <defs><linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient></defs>
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                    <Area type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} fill="url(#greenGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {[
                  { skill: "Technical Skills", pct: Math.min(85, completionRate + 10) },
                  { skill: "Project Portfolio", pct: Math.min(70, completionRate - 5) },
                  { skill: "Certifications", pct: Math.min(60, certificatesEarned * 20) },
                ].map((s) => (
                  <div key={s.skill}>
                    <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">{s.skill}</span><span className="font-medium text-foreground">{s.pct}%</span></div>
                    <div className="h-1.5 bg-muted rounded-full"><div className="h-full bg-accent rounded-full" style={{ width: `${s.pct}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h2 className="font-semibold text-foreground">Continue Learning</h2>
                <button onClick={() => setActiveTab("courses")} className="text-sm text-primary dark:text-primary/80 hover:underline flex items-center gap-1">View all <ChevronRight className="w-3.5 h-3.5" /></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {enrolledCourses.slice(0, 2).filter(c => c.progress > 0).map((course) => (
                  <div key={course.id} className="feature-card">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-28 object-cover rounded-xl mb-3" />
                    <h4 className="text-sm font-semibold text-foreground line-clamp-2 mb-2">{course.title}</h4>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Progress</span><span className="font-medium text-foreground">{course.progress}%</span></div>
                      <div className="h-1.5 bg-muted rounded-full"><div className="h-full bg-primary rounded-full" style={{ width: `${course.progress}%` }} /></div>
                    </div>
                    <button onClick={() => setCoursePlayerModal(course)} className="flex items-center gap-1.5 text-primary dark:text-primary/80 text-xs font-medium"><Play className="w-3 h-3 fill-current" />Continue</button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h2 className="font-semibold text-foreground">Upcoming Tasks</h2>
                <button onClick={() => setTaskModal(true)} className="text-xs text-primary dark:text-primary/80 hover:underline flex items-center gap-1"><Plus className="w-3 h-3" />Add</button>
              </div>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="p-3 bg-card border border-border rounded-xl text-left">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-foreground line-clamp-2">{task.title}</p>
                      <div className="flex gap-1">
                        <button onClick={() => toggleTaskComplete(task.id)} className="text-green-600 hover:text-green-700"><CheckCircle2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => deleteTask(task.id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{task.courseTitle} · Due {task.dueDate}</p>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", {
                      "bg-red-100 text-red-600": task.priority === "high",
                      "bg-yellow-100 text-yellow-600": task.priority === "medium",
                      "bg-green-100 text-green-600": task.priority === "low",
                    })}>{task.priority}</span>
                  </div>
                ))}
                {upcomingTasks.length === 0 && <p className="text-xs text-muted-foreground text-center">No pending tasks 🎉</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* My Courses Tab */}
      {activeTab === "courses" && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h1 className="text-2xl font-bold text-foreground">My Courses</h1>
            <button onClick={() => setBrowseCoursesModal(true)} className="btn-primary text-sm">Browse More</button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="input-field pl-9 py-2 text-sm" placeholder="Search my courses..." value={courseSearch} onChange={e => setCourseSearch(e.target.value)} />
              {courseSearch && <button onClick={() => setCourseSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {["All", "Beginner", "Intermediate", "Advanced"].map(f => (
                <button key={f} onClick={() => setCourseFilter(f)} className={cn("px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border", courseFilter === f ? "bg-primary text-white border-primary" : "border-border text-muted-foreground hover:bg-muted")}>{f}</button>
              ))}
            </div>
          </div>
          {filteredCourses.length === 0 ? (
            <div className="text-center py-16"><Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" /><p className="text-muted-foreground">No courses found</p><button onClick={() => { setCourseSearch(""); setCourseFilter("All"); }} className="mt-3 text-sm text-primary dark:text-primary/80 hover:underline">Clear filters</button></div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course) => (
                <div key={course.id} className="feature-card">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-36 object-cover rounded-xl mb-4" />
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-foreground text-sm line-clamp-2 flex-1">{course.title}</h4>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0", {
                      "bg-green-100 text-green-700": course.level === "Beginner",
                      "bg-blue-100 text-blue-700": course.level === "Intermediate",
                      "bg-orange-100 text-orange-700": course.level === "Advanced",
                    })}>{course.level}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{course.instructor} · {course.duration}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                    <span className="text-xs font-medium text-foreground">{course.rating}</span>
                    <span className="text-xs text-muted-foreground">({formatNumber(course.reviews)})</span>
                  </div>
                  {course.progress > 0 ? (
                    <div>
                      <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Progress</span><span className="font-medium text-foreground">{course.progress}%</span></div>
                      <div className="h-1.5 bg-muted rounded-full"><div className="h-full bg-primary rounded-full" style={{ width: `${course.progress}%` }} /></div>
                      <button onClick={() => setCoursePlayerModal(course)} className="mt-2 flex items-center gap-1 text-xs text-primary dark:text-primary/80 font-medium"><Play className="w-3 h-3 fill-current" />Continue</button>
                    </div>
                  ) : (
                    <button onClick={() => updateCourseProgress(course.id, 10)} className="btn-primary w-full text-xs py-2 mt-1">Start Course</button>
                  )}
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-4">{filteredCourses.length} of {enrolledCourses.length} courses shown</p>
        </div>
      )}

      {/* Coding Lab Tab */}
      {activeTab === "lab" && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h1 className="text-2xl font-bold text-foreground">Interactive Coding Lab</h1>
            <select className="input-field py-1.5 text-sm w-auto" value={selectedLang} onChange={(e) => { setSelectedLang(e.target.value); toast.info(`Switched to ${e.target.value}`); }}>
              {["Python", "JavaScript", "Go", "Java", "C++", "Rust"].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="bg-gray-950 rounded-2xl overflow-hidden border border-gray-800 shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/80" /><div className="w-3 h-3 rounded-full bg-yellow-500/80" /><div className="w-3 h-3 rounded-full bg-green-500/80" /></div>
                <span className="text-white/40 text-xs font-mono">solution.{selectedLang.toLowerCase() === "javascript" ? "js" : selectedLang.toLowerCase() === "python" ? "py" : selectedLang.toLowerCase()}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setCode("# Start fresh\n\n"); setCodeOutput(""); toast.info("Editor cleared"); }} className="px-3 py-1 border border-gray-700 text-gray-400 text-xs rounded-lg hover:border-gray-500">Clear</button>
                <button onClick={runCode} disabled={codeRunning} className="px-4 py-1 bg-accent text-white text-xs rounded-lg font-medium hover:bg-accent/90 disabled:opacity-50 flex items-center gap-1.5">
                  {codeRunning ? <><div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />Running...</> : <>▶ Run Code</>}
                </button>
              </div>
            </div>
            <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full bg-gray-950 text-green-400 font-mono text-sm p-6 outline-none resize-none min-h-[320px] scrollbar-hide" spellCheck={false} />
            <div className="border-t border-gray-800 px-4 py-3 bg-gray-900">
              <p className="text-xs text-gray-500 mb-2 font-mono">Output:</p>
              <p className="text-emerald-400 font-mono text-xs">{codeRunning ? "Running..." : (codeOutput || "Run your code to see output")}</p>
            </div>
          </div>
          <div className="mt-4 grid sm:grid-cols-3 gap-3">
            {[
              { title: "Two Sum Problem", desc: "Easy · Array · Hash Map", pts: 10 },
              { title: "Binary Tree Traversal", desc: "Medium · Tree · BFS/DFS", pts: 25 },
              { title: "Dynamic Programming", desc: "Hard · DP · Memoization", pts: 50 },
            ].map((ch) => (
              <button key={ch.title} onClick={() => loadChallenge(ch.title, ch.desc)} className="feature-card text-left">
                <Code2 className="w-5 h-5 text-primary mb-2" />
                <p className="text-sm font-medium text-foreground">{ch.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{ch.desc}</p>
                <p className="text-xs text-primary dark:text-primary/80 font-medium mt-1">+{ch.pts} pts</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Certificates Tab - SHARE BUTTON FIXED */}
      {activeTab === "certs" && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h1 className="text-2xl font-bold text-foreground">My Certificates</h1>
            <button onClick={() => setBrowseCoursesModal(true)} className="btn-primary text-sm">Browse Courses</button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="feature-card">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", cert.status === "earned" ? "bg-yellow-500/10" : "bg-blue-500/10")}>
                  {cert.status === "earned" ? <Award className="w-6 h-6 text-yellow-500" /> : <Lock className="w-6 h-6 text-primary" />}
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{cert.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{cert.issuer} · {cert.date}</p>
                {cert.status === "earned" ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-accent dark:text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" />Verified Certificate</div>
                    <div className="flex gap-2">
                      <button onClick={() => downloadCertificate(cert)} className="flex-1 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary/90 flex items-center justify-center gap-1">
                        <Download className="w-3 h-3" />Download
                      </button>
                      <button onClick={() => shareCertificate(cert)} className="flex-1 py-1.5 border border-border text-xs font-medium rounded-lg hover:bg-muted text-foreground flex items-center justify-center gap-1">
                        <Share2 className="w-3 h-3" />Share
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Progress</span><span className="font-medium text-foreground">{cert.progress}%</span></div>
                    <div className="h-1.5 bg-muted rounded-full"><div className="h-full bg-primary rounded-full" style={{ width: `${cert.progress}%` }} /></div>
                    <button onClick={() => { setActiveTab("courses"); }} className="mt-2 text-xs text-primary dark:text-primary/80 font-medium">Continue course →</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Career Hub Tab */}
      {activeTab === "career" && (
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-6">Career Hub</h1>
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <Target className="w-6 h-6 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Career Readiness</h3>
              <div className="text-4xl font-bold text-foreground mb-4">82<span className="text-lg text-muted-foreground">/100</span></div>
              <button onClick={() => setRoadmapModal(true)} className="btn-primary w-full text-sm">View Roadmap</button>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <TrendingUp className="w-6 h-6 text-accent mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Resume Builder</h3>
              <p className="text-sm text-muted-foreground mb-4">AI-powered resume tailored to your target role.</p>
              <button onClick={() => setResumeModal(true)} className="btn-secondary w-full text-sm">Build Resume</button>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <Brain className="w-6 h-6 text-orange-600 mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Mock Interviews</h3>
              <p className="text-sm text-muted-foreground mb-4">AI-driven technical & behavioral interview practice.</p>
              <button onClick={() => setInterviewModal(true)} className="btn-primary w-full text-sm">Practice Now</button>
            </div>
          </div>
          <div className="mt-5">
            <h2 className="font-semibold text-foreground mb-4">Recommended Jobs</h2>
            <div className="space-y-3">
              {jobs.map((job) => (
                <div key={job.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground text-sm">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.company} · {job.location}</p>
                    <p className="text-xs text-primary dark:text-primary/80 font-medium mt-0.5">{job.salary}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs font-bold text-accent dark:text-emerald-400">{job.match}% match</span>
                    <button 
                      onClick={() => {
                        if (!appliedJobs.includes(job.id)) {
                          setAppliedJobs([...appliedJobs, job.id]);
                          setJobs(prev => prev.map(j => j.id === job.id ? { ...j, applied: true } : j));
                          toast.success(`Applied to ${job.title} at ${job.company}!`);
                        }
                      }} 
                      disabled={job.applied}
                      className={cn("px-3 py-1.5 text-xs font-medium rounded-lg transition-colors", job.applied ? "bg-green-600 text-white opacity-80 cursor-default" : "bg-primary text-white hover:bg-primary/90")}>
                      {job.applied ? "Applied ✓" : "Apply"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Community Tab */}
      {activeTab === "community" && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h1 className="text-2xl font-bold text-foreground">Developer Community</h1>
            <button onClick={() => setDiscussionModal(true)} className="btn-primary text-sm"><Plus className="w-4 h-4 mr-1.5" />New Discussion</button>
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div>
              <h2 className="font-semibold text-foreground mb-3">Active Discussions</h2>
              <div className="space-y-3">
                {discussions.map((post) => (
                  <button key={post.id} onClick={() => setDiscussionViewModal(post)} className="w-full bg-card border border-border rounded-xl p-4 text-left hover:border-primary/30 transition-colors">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:text-primary/80 font-medium">{post.tag}</span>
                    <p className="text-sm font-medium text-foreground mt-2 line-clamp-2">{post.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{post.replies} replies · {post.views} views</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-foreground mb-3">Upcoming Events</h2>
              <div className="space-y-3">
                {events.map((event) => (
                  <div key={event.id} className="bg-card border border-border rounded-xl p-4">
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{event.date} · {event.participants} participants</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs font-bold text-accent dark:text-emerald-400">Prize: {event.prize}</span>
                      <button 
                        onClick={() => {
                          if (!registeredEvents.includes(event.id)) {
                            setRegisteredEvents([...registeredEvents, event.id]);
                            setEvents(prev => prev.map(e => e.id === event.id ? { ...e, registered: true } : e));
                            toast.success(`Registered for ${event.title}!`);
                          }
                        }}
                        disabled={event.registered}
                        className={cn("px-3 py-1.5 text-xs font-medium rounded-lg transition-colors", event.registered ? "bg-green-600 text-white opacity-80 cursor-default" : "bg-primary text-white hover:bg-primary/90")}>
                        {event.registered ? "Registered ✓" : "Register"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-foreground">Learning Analytics</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Hours", value: Math.round(totalHours) + "h", color: "text-primary" },
              { label: "Avg Daily", value: avgDaily + "h", color: "text-accent" },
              { label: "Completion Rate", value: completionRate + "%", color: "text-yellow-600" },
              { label: "Best Streak", value: streakDays + " days", color: "text-orange-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-card border border-border rounded-2xl p-4 text-center">
                <p className={cn("text-3xl font-bold", color)}>{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">Daily Learning Hours (This Week)</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weekData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                  <Bar dataKey="hours" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">Skill Progress</h3>
            <div className="space-y-3">
              {[
                { skill: "React & Frontend", pct: Math.min(85, completionRate + 5), color: "bg-blue-500" },
                { skill: "Python & ML", pct: Math.min(70, completionRate - 10), color: "bg-accent" },
                { skill: "Node.js & APIs", pct: Math.min(60, completionRate - 15), color: "bg-indigo-500" },
                { skill: "Databases", pct: Math.min(45, completionRate - 20), color: "bg-orange-500" },
                { skill: "DevOps & Cloud", pct: Math.min(30, completionRate - 30), color: "bg-pink-500" },
              ].map(s => (
                <div key={s.skill}>
                  <div className="flex justify-between text-sm mb-1"><span className="text-foreground font-medium">{s.skill}</span><span className="text-muted-foreground">{s.pct}%</span></div>
                  <div className="h-2 bg-muted rounded-full"><div className={cn("h-full rounded-full transition-all", s.color)} style={{ width: `${s.pct}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}

      <Modal open={browseCoursesModal} onClose={() => setBrowseCoursesModal(false)} title="Discover New Courses">
        <div className="space-y-4">
          {availableCourses.length === 0 ? (
            <p className="text-center text-muted-foreground">You're enrolled in all available courses! 🎉</p>
          ) : (
            availableCourses.map(course => (
              <div key={course.id} className="flex gap-3 p-3 border border-border rounded-xl">
                <img src={course.thumbnail} alt={course.title} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground text-sm">{course.title}</h4>
                  <p className="text-xs text-muted-foreground">{course.instructor} · {course.duration}</p>
                  <div className="flex items-center gap-1 mt-1"><Star className="w-3 h-3 text-yellow-400 fill-current" /><span className="text-xs">{course.rating}</span></div>
                  <button onClick={() => handleEnrollNewCourse(course)} className="mt-2 btn-primary text-xs py-1 px-3">Enroll Now</button>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

      <Modal open={certModal.open} onClose={() => setCertModal({ open: false, cert: null })} title="Certificate Details">
        {certModal.cert && (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-yellow-500/10 flex items-center justify-center mx-auto"><Award className="w-10 h-10 text-yellow-500" /></div>
            <div><h3 className="text-lg font-bold text-foreground">{certModal.cert.name}</h3><p className="text-sm text-muted-foreground">{certModal.cert.issuer} · {certModal.cert.date}</p></div>
            <div className="p-4 bg-muted rounded-xl text-left"><p className="text-xs text-muted-foreground">Certificate ID: <span className="font-mono text-foreground">VT-2026-{Math.random().toString(36).substring(2, 9).toUpperCase()}</span></p><p className="text-xs text-muted-foreground mt-1">Issued to: <span className="font-medium text-foreground">{user.name}</span></p><p className="text-xs text-muted-foreground mt-1">Valid: Lifetime</p></div>
            <div className="flex gap-3"><button onClick={() => { downloadCertificate(certModal.cert!); setCertModal({ open: false, cert: null }); }} className="flex-1 btn-primary text-sm">Download PDF</button><button onClick={() => { shareCertificate(certModal.cert!); setCertModal({ open: false, cert: null }); }} className="flex-1 btn-secondary text-sm">Share Link</button></div>
          </div>
        )}
      </Modal>

      <Modal open={taskModal} onClose={() => setTaskModal(false)} title="Add New Task">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Task Title</label><input className="input-field" placeholder="e.g. Complete React module" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} /></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Course</label><select className="input-field" value={newTask.courseId} onChange={e => setNewTask({ ...newTask, courseId: e.target.value })}><option value="">Select course</option>{enrolledCourses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}</select></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label className="block text-sm font-medium text-foreground mb-1.5">Due Date</label><input type="date" className="input-field" value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} /></div><div><label className="block text-sm font-medium text-foreground mb-1.5">Priority</label><select className="input-field" value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value as Task["priority"] })}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></div></div>
          <button onClick={addTask} className="btn-primary w-full">Add Task</button>
        </div>
      </Modal>

      <Modal open={discussionModal} onClose={() => setDiscussionModal(false)} title="Start New Discussion">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Title</label><input className="input-field" placeholder="Ask your question..." value={newDiscussion.title} onChange={e => setNewDiscussion(p => ({ ...p, title: e.target.value }))} /></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Tag</label><select className="input-field" value={newDiscussion.tag} onChange={e => setNewDiscussion(p => ({ ...p, tag: e.target.value }))}>{["React", "Python", "ML", "Cloud", "DevOps", "Security", "General"].map(t => <option key={t}>{t}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Description</label><textarea className="input-field min-h-[100px] resize-none" placeholder="Describe your question..." value={newDiscussion.body} onChange={e => setNewDiscussion(p => ({ ...p, body: e.target.value }))} /></div>
          <button onClick={postDiscussion} className="btn-primary w-full">Post Discussion</button>
        </div>
      </Modal>

      <Modal open={!!coursePlayerModal} onClose={() => setCoursePlayerModal(null)} title={coursePlayerModal?.title || "Course Player"}>
        <div className="space-y-4">
          <div className="w-full aspect-video bg-black rounded-xl overflow-hidden relative flex items-center justify-center group">
            <img src={coursePlayerModal?.thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />
            <div className="z-10 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-white fill-current ml-1" onClick={() => toast.info("Video playing...")} />
            </div>
            <div className="absolute bottom-4 left-4 right-4 h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-1/3" />
            </div>
          </div>
          <div><h3 className="font-semibold text-foreground">{coursePlayerModal?.title}</h3><p className="text-sm text-muted-foreground mt-1">Module 3: Advanced Concepts</p></div>
          <div className="flex gap-2">
            <button onClick={() => toast.success("Notes saved!")} className="flex-1 btn-secondary text-sm">Take Notes</button>
            <button onClick={() => { 
              if (coursePlayerModal) updateCourseProgress(coursePlayerModal.id, Math.min(coursePlayerModal.progress + 20, 100));
              setCoursePlayerModal(null);
            }} className="flex-1 btn-primary text-sm">Mark Complete</button>
          </div>
        </div>
      </Modal>

      <Modal open={roadmapModal} onClose={() => setRoadmapModal(false)} title="Your Career Roadmap">
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">Path to: <strong className="text-foreground">Senior Full Stack Engineer</strong></p>
          <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-border">
            {[
              { title: "Master React & Context API", status: "completed", date: "April 2026" },
              { title: "Complete System Design Basics", status: "current", date: "Currently working on" },
              { title: "Build 3 Full-Stack Projects", status: "upcoming", date: "Target: July 2026" },
              { title: "Advanced AWS Certification", status: "upcoming", date: "Target: Sept 2026" },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className={cn("absolute -left-[30px] w-4 h-4 rounded-full border-2 border-card flex items-center justify-center", 
                  step.status === "completed" ? "bg-green-500" : step.status === "current" ? "bg-blue-500 ring-4 ring-blue-500/20" : "bg-muted-foreground"
                )}>
                  {step.status === "completed" && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                </div>
                <h4 className="text-sm font-semibold text-foreground">{step.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{step.date}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setRoadmapModal(false)} className="btn-secondary w-full text-sm">Close</button>
        </div>
      </Modal>

      <Modal open={resumeModal} onClose={() => setResumeModal(false)} title="AI Resume Builder">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-2"><Brain className="w-8 h-8 text-primary" /></div>
          <h3 className="font-semibold text-foreground">Analyzing your profile...</h3>
          <p className="text-sm text-muted-foreground">Our AI is drafting a custom resume based on your completed courses, projects, and target role.</p>
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mt-4"><div className="h-full bg-blue-500 w-2/3 animate-pulse" /></div>
          <div className="pt-4 flex gap-2">
            <button onClick={() => setResumeModal(false)} className="flex-1 btn-secondary text-sm">Cancel</button>
            <button onClick={() => { toast.success("Resume downloaded!"); setResumeModal(false); }} className="flex-1 btn-primary text-sm flex items-center justify-center gap-2"><Download className="w-4 h-4" /> Download PDF</button>
          </div>
        </div>
      </Modal>

      <Modal open={interviewModal} onClose={() => setInterviewModal(false)} title="AI Mock Interview">
        <div className="space-y-4">
          <div className="bg-card border border-border p-4 rounded-xl flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0"><Brain className="w-5 h-5 text-white" /></div>
            <div><p className="text-sm text-foreground">"Hi there! Let's start with a technical question. Can you explain the difference between client-side rendering and server-side rendering in React applications?"</p></div>
          </div>
          <div className="bg-muted p-4 rounded-xl text-right"><p className="text-sm text-muted-foreground italic">Waiting for your response...</p></div>
          <div className="flex gap-2">
            <button className="btn-secondary p-3 rounded-xl border border-border bg-card hover:bg-muted transition-colors"><div className="w-5 h-5 rounded-full bg-red-500 animate-pulse" /></button>
            <input type="text" className="input-field flex-1" placeholder="Type your answer here..." />
            <button onClick={() => toast.success("Answer submitted to AI!")} className="btn-primary px-4 rounded-xl text-sm">Send</button>
          </div>
        </div>
      </Modal>

      <Modal open={!!discussionViewModal} onClose={() => setDiscussionViewModal(null)} title="Discussion">
        {discussionViewModal && (
          <div className="space-y-6">
            <div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{discussionViewModal.tag}</span>
              <h2 className="text-lg font-bold text-foreground mt-2">{discussionViewModal.title}</h2>
              <p className="text-sm text-muted-foreground mt-2">Posted by <strong className="text-foreground">{discussionViewModal.author}</strong> · {discussionViewModal.createdAt}</p>
              <div className="p-4 bg-muted/50 rounded-xl mt-4 text-sm text-foreground">{discussionViewModal.body}</div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground text-sm border-b border-border pb-2">Replies ({discussionViewModal.replies})</h3>
              <div className="space-y-3">
                <div className="p-3 bg-card border border-border rounded-xl"><p className="text-xs font-medium text-foreground mb-1">Sarah JS <span className="text-muted-foreground font-normal">· 1 hr ago</span></p><p className="text-sm text-foreground">Zustand is fantastic right now. Very minimal boilerplate compared to Redux.</p></div>
                <div className="p-3 bg-card border border-border rounded-xl"><p className="text-xs font-medium text-foreground mb-1">DevMike <span className="text-muted-foreground font-normal">· 45 mins ago</span></p><p className="text-sm text-foreground">Context is fine for theme/auth, but for high-frequency updates, use Zustand or Jotai.</p></div>
              </div>
            </div>
            <div className="flex gap-2">
              <input type="text" className="input-field flex-1" placeholder="Write a reply..." />
              <button onClick={() => { toast.success("Reply posted!"); setDiscussionViewModal(null); }} className="btn-primary text-sm">Post</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}