import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen, Award, Clock, Flame, Code2, ChevronRight, Play, Star, Zap,
  Target, TrendingUp, CheckCircle2, BarChart3, Lock, Brain, ArrowRight,
  Users, Search, X, Download, Share2, Plus, Filter
} from "lucide-react";
import { MOCK_COURSES } from "@/lib/constants";
import { cn, formatNumber } from "@/lib/utils";
import { BarChart, Bar, ResponsiveContainer, XAxis, CartesianGrid, Tooltip, AreaChart, Area } from "recharts";
import { toast } from "sonner";
import type { User } from "@/types";

const weekData = [
  { day: "Mon", hours: 2.5 }, { day: "Tue", hours: 1.8 }, { day: "Wed", hours: 3.2 },
  { day: "Thu", hours: 2.0 }, { day: "Fri", hours: 4.1 }, { day: "Sat", hours: 1.5 }, { day: "Sun", hours: 2.8 },
];
const monthData = [
  { week: "W1", score: 62 }, { week: "W2", score: 68 }, { week: "W3", score: 74 }, { week: "W4", score: 82 },
];
const upcomingTasks = [
  { title: "Complete React Hooks module", course: "Full Stack Dev", due: "Today", priority: "high" },
  { title: "Submit ML project", course: "Machine Learning", due: "Tomorrow", priority: "medium" },
  { title: "Take Python assessment", course: "Data Science", due: "In 3 days", priority: "low" },
];
const INITIAL_CERTIFICATES = [
  { name: "JavaScript Fundamentals", issuer: "VedTechno", date: "Apr 2026", status: "earned" },
  { name: "React Developer", issuer: "VedTechno", date: "May 2026", status: "earned" },
  { name: "Python Advanced", issuer: "VedTechno", date: "—", status: "in-progress", pct: 72 },
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
  const [activeTab, setActiveTab] = useState(initialTab || "overview");
  const [codeRunning, setCodeRunning] = useState(false);
  const [code, setCode] = useState(`# VedTechno Coding Lab - Python\n\ndef fibonacci(n):\n    """Generate Fibonacci sequence"""\n    a, b = 0, 1\n    sequence = []\n    for _ in range(n):\n        sequence.append(a)\n        a, b = b, a + b\n    return sequence\n\nprint(fibonacci(10))`);
  const [codeOutput, setCodeOutput] = useState("[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]");
  const [selectedLang, setSelectedLang] = useState("Python");
  const [courseSearch, setCourseSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [certModal, setCertModal] = useState<{ open: boolean; cert: typeof INITIAL_CERTIFICATES[0] | null }>({ open: false, cert: null });
  const [taskModal, setTaskModal] = useState(false);
  const [discussionModal, setDiscussionModal] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: "", tag: "React", body: "" });
  const [certificates] = useState(INITIAL_CERTIFICATES);

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
    return MOCK_COURSES.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
        c.instructor.toLowerCase().includes(courseSearch.toLowerCase());
      const matchesFilter = courseFilter === "All" || c.level === courseFilter || c.category === courseFilter;
      return matchesSearch && matchesFilter;
    });
  }, [courseSearch, courseFilter]);

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

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-6 pb-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={cn("flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeTab === id ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Good morning, {user.name.split(" ")[0]}! 👋</h1>
              <p className="text-muted-foreground text-sm mt-0.5">You're on a <strong className="text-foreground">{user.streakDays}-day streak</strong>. Keep it up!</p>
            </div>
            <button onClick={() => { toast.success("Redirecting to Pro upgrade page!"); }} className="btn-primary text-sm self-start sm:self-center">
              <Zap className="w-4 h-4 mr-1.5" />Upgrade to Pro
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Courses Active", value: "7", icon: BookOpen, color: "text-blue-600 bg-blue-600/10", change: "+2 this week", tab: "courses" },
              { label: "Hours Learned", value: "156", icon: Clock, color: "text-emerald-600 bg-emerald-600/10", change: "+8.5 hrs", tab: "analytics" },
              { label: "Certificates", value: String(user.certificatesEarned), icon: Award, color: "text-yellow-600 bg-yellow-600/10", change: "1 in progress", tab: "certs" },
              { label: "Streak Days", value: String(user.streakDays), icon: Flame, color: "text-orange-600 bg-orange-600/10", change: "Personal best!", tab: "analytics" },
            ].map(({ label, value, icon: Icon, color, change, tab }) => (
              <button key={label} onClick={() => setActiveTab(tab)}
                className="bg-card border border-border rounded-2xl p-4 hover:border-blue-600/30 transition-colors text-left">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", color)}><Icon className="w-4 h-4" /></div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">{change}</p>
              </button>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Weekly Learning Activity</h3>
                  <p className="text-xs text-muted-foreground">Hours per day this week</p>
                </div>
                <span className="badge-accent text-xs">18h total</span>
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
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground text-sm">Career Readiness Score</h3>
                  <p className="text-xs text-muted-foreground">Monthly improvement</p>
                </div>
                <span className="text-2xl font-bold text-foreground">82<span className="text-sm text-muted-foreground">/100</span></span>
              </div>
              <div className="h-20 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthData}>
                    <defs>
                      <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                    <Area type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} fill="url(#greenGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2">
                {[{ skill: "Technical Skills", pct: 85 }, { skill: "Project Portfolio", pct: 70 }, { skill: "Certifications", pct: 60 }].map((s) => (
                  <div key={s.skill}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{s.skill}</span>
                      <span className="font-medium text-foreground">{s.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.pct}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Continue Learning</h2>
                <button onClick={() => setActiveTab("courses")} className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {MOCK_COURSES.slice(0, 2).filter(c => c.progress).map((course) => (
                  <div key={course.id} className="feature-card">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-28 object-cover rounded-xl mb-3" />
                    <h4 className="text-sm font-semibold text-foreground line-clamp-2 mb-2">{course.title}</h4>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Progress</span><span className="font-medium text-foreground">{course.progress}%</span></div>
                      <div className="h-1.5 bg-muted rounded-full"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${course.progress}%` }} /></div>
                    </div>
                    <button onClick={() => { setActiveTab("courses"); toast.info(`Opening ${course.title}...`); }} className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-medium">
                      <Play className="w-3 h-3 fill-current" />Continue
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Upcoming Tasks</h2>
                <button onClick={() => setTaskModal(true)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" />Add
                </button>
              </div>
              <div className="space-y-3">
                {upcomingTasks.map((task, i) => (
                  <button key={i} onClick={() => toast.success(`Task marked: ${task.title}`)} className="w-full p-3 bg-card border border-border rounded-xl text-left hover:border-blue-600/30 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-medium text-foreground line-clamp-2">{task.title}</p>
                      <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium flex-shrink-0", {
                        "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400": task.priority === "high",
                        "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400": task.priority === "medium",
                        "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400": task.priority === "low",
                      })}>{task.due}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{task.course}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── My Courses ── */}
      {activeTab === "courses" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">My Courses</h1>
            <button onClick={() => toast.info("Opening course catalog...")} className="btn-primary text-sm">Browse More</button>
          </div>
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="input-field pl-9 py-2 text-sm" placeholder="Search courses or instructors..."
                value={courseSearch} onChange={e => setCourseSearch(e.target.value)} />
              {courseSearch && <button onClick={() => setCourseSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
              {["All", "Beginner", "Intermediate", "Advanced"].map(f => (
                <button key={f} onClick={() => setCourseFilter(f)}
                  className={cn("px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border", courseFilter === f ? "bg-blue-600 text-white border-blue-600" : "border-border text-muted-foreground hover:bg-muted")}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          {filteredCourses.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-muted-foreground">No courses found for "{courseSearch}"</p>
              <button onClick={() => { setCourseSearch(""); setCourseFilter("All"); }} className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course) => (
                <div key={course.id} className="feature-card">
                  <img src={course.thumbnail} alt={course.title} className="w-full h-36 object-cover rounded-xl mb-4" />
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-foreground text-sm line-clamp-2 flex-1">{course.title}</h4>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0", {
                      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400": course.level === "Beginner",
                      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400": course.level === "Intermediate",
                      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400": course.level === "Advanced",
                    })}>{course.level}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{course.instructor} · {course.duration}</p>
                  <div className="flex items-center gap-1 mb-3">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                    <span className="text-xs font-medium text-foreground">{course.rating}</span>
                    <span className="text-xs text-muted-foreground">({formatNumber(course.reviews)})</span>
                  </div>
                  {course.progress !== undefined ? (
                    <div>
                      <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Progress</span><span className="font-medium text-foreground">{course.progress}%</span></div>
                      <div className="h-1.5 bg-muted rounded-full"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${course.progress}%` }} /></div>
                      <button onClick={() => toast.info(`Continuing ${course.title}...`)} className="mt-2 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
                        <Play className="w-3 h-3 fill-current" />Continue
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => toast.success(`Enrolled in ${course.title}!`)} className="btn-primary w-full text-xs py-2 mt-1">Enroll Now</button>
                  )}
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-4">{filteredCourses.length} of {MOCK_COURSES.length} courses shown</p>
        </div>
      )}

      {/* ── Coding Lab ── */}
      {activeTab === "lab" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Interactive Coding Lab</h1>
            <select className="input-field py-1.5 text-sm w-auto" value={selectedLang}
              onChange={(e) => { setSelectedLang(e.target.value); toast.info(`Switched to ${e.target.value}`); }}>
              {["Python", "JavaScript", "Go", "Java", "C++", "Rust"].map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="bg-gray-950 rounded-2xl overflow-hidden border border-gray-800 shadow-xl">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-white/40 text-xs font-mono">solution.{selectedLang.toLowerCase() === "javascript" ? "js" : selectedLang.toLowerCase() === "python" ? "py" : selectedLang.toLowerCase()}</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setCode("# Start fresh\n\n"); setCodeOutput(""); toast.info("Editor cleared"); }}
                  className="px-3 py-1 border border-gray-700 text-gray-400 text-xs rounded-lg hover:border-gray-500 transition-colors">Clear</button>
                <button onClick={runCode} disabled={codeRunning}
                  className="px-4 py-1 bg-emerald-600 text-white text-xs rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-1.5 disabled:opacity-50">
                  {codeRunning ? <><div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />Running...</> : <>▶ Run Code</>}
                </button>
              </div>
            </div>
            <textarea value={code} onChange={(e) => setCode(e.target.value)}
              className="w-full bg-gray-950 text-green-400 font-mono text-sm p-6 outline-none resize-none min-h-[320px] scrollbar-hide"
              spellCheck={false} />
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
              <button key={ch.title} onClick={() => {
                setCode(`# Challenge: ${ch.title}\n# Difficulty: ${ch.desc}\n\ndef solve():\n    # Write your solution here\n    pass\n`);
                toast.info(`Challenge loaded: ${ch.title}`);
              }} className="feature-card text-left">
                <Code2 className="w-5 h-5 text-blue-600 mb-2" />
                <p className="text-sm font-medium text-foreground">{ch.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{ch.desc}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-1">+{ch.pts} pts</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Certificates ── */}
      {activeTab === "certs" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">My Certificates</h1>
            <button onClick={() => toast.info("Opening available assessments...")} className="btn-primary text-sm">Take Assessment</button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((cert, i) => (
              <div key={i} className="feature-card">
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4", cert.status === "earned" ? "bg-yellow-500/10" : "bg-blue-500/10")}>
                  {cert.status === "earned" ? <Award className="w-6 h-6 text-yellow-500" /> : <Lock className="w-6 h-6 text-blue-600" />}
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{cert.name}</h3>
                <p className="text-xs text-muted-foreground mb-3">{cert.issuer} · {cert.date}</p>
                {cert.status === "earned" ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" />Verified Certificate</div>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        setCertModal({ open: true, cert });
                      }} className="flex-1 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                        <Download className="w-3 h-3" />Download
                      </button>
                      <button onClick={() => {
                        toast.success(`"${cert.name}" shared to LinkedIn!`);
                      }} className="flex-1 py-1.5 border border-border text-xs font-medium rounded-lg hover:bg-muted transition-colors text-foreground flex items-center justify-center gap-1">
                        <Share2 className="w-3 h-3" />Share
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-xs mb-1"><span className="text-muted-foreground">Progress</span><span className="font-medium text-foreground">{cert.pct}%</span></div>
                    <div className="h-1.5 bg-muted rounded-full"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${cert.pct}%` }} /></div>
                    <button onClick={() => { setActiveTab("courses"); toast.info("Navigating to courses..."); }} className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">Continue course →</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Career Hub ── */}
      {activeTab === "career" && (
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-6">Career Hub</h1>
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <Target className="w-6 h-6 text-blue-600 mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Career Readiness</h3>
              <div className="text-4xl font-bold text-foreground mb-4">82<span className="text-lg text-muted-foreground">/100</span></div>
              <button onClick={() => toast.info("Opening personalized career roadmap...")} className="btn-primary w-full text-sm">View Roadmap</button>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <TrendingUp className="w-6 h-6 text-emerald-600 mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Resume Builder</h3>
              <p className="text-sm text-muted-foreground mb-4">AI-powered resume tailored to your target role.</p>
              <button onClick={() => toast.info("Opening AI resume builder...")} className="btn-secondary w-full text-sm">Build Resume</button>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <Brain className="w-6 h-6 text-orange-600 mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Mock Interviews</h3>
              <p className="text-sm text-muted-foreground mb-4">AI-driven technical & behavioral interview practice.</p>
              <button onClick={() => toast.info("Starting AI mock interview session...")} className="btn-primary w-full text-sm">Practice Now</button>
            </div>
          </div>
          <div className="mt-5">
            <h2 className="font-semibold text-foreground mb-4">Recommended Jobs</h2>
            <div className="space-y-3">
              {[
                { title: "Junior React Developer", company: "TechCorp", location: "Remote", salary: "$75K–$95K", match: 94 },
                { title: "Full Stack Engineer", company: "StartupXYZ", location: "San Francisco, CA", salary: "$90K–$120K", match: 88 },
                { title: "Frontend Developer", company: "DesignAgency", location: "New York, NY", salary: "$80K–$100K", match: 82 },
              ].map((job, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground text-sm">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.company} · {job.location}</p>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">{job.salary}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{job.match}% match</span>
                    <button onClick={() => toast.success(`Applied to ${job.title} at ${job.company}!`)} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">Apply</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Community ── */}
      {activeTab === "community" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">Developer Community</h1>
            <button onClick={() => setDiscussionModal(true)} className="btn-primary text-sm">
              <Plus className="w-4 h-4 mr-1.5" />New Discussion
            </button>
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div>
              <h2 className="font-semibold text-foreground mb-3">Active Discussions</h2>
              <div className="space-y-3">
                {[
                  { title: "Best practices for React state management in 2026", replies: 24, views: 1230, tag: "React" },
                  { title: "How to optimize Python ML model inference time?", replies: 18, views: 890, tag: "ML" },
                  { title: "Cloud vs on-premise: What's best for startups?", replies: 31, views: 2100, tag: "Cloud" },
                ].map((post, i) => (
                  <button key={i} onClick={() => toast.info(`Opening: ${post.title}`)} className="w-full bg-card border border-border rounded-xl p-4 text-left hover:border-blue-600/30 transition-colors">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600/10 text-blue-600 dark:text-blue-400 font-medium">{post.tag}</span>
                    <p className="text-sm font-medium text-foreground mt-2 line-clamp-2">{post.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{post.replies} replies · {post.views} views</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h2 className="font-semibold text-foreground mb-3">Upcoming Events</h2>
              <div className="space-y-3">
                {[
                  { title: "Weekly Hackathon: Build an AI Tool", date: "Saturday, Jun 7", participants: 142, prize: "$500" },
                  { title: "React Live Workshop with @maya", date: "Tuesday, Jun 10", participants: 89, prize: "Free" },
                  { title: "ML Competition: Image Classification", date: "Saturday, Jun 14", participants: 210, prize: "$1,000" },
                ].map((event, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4">
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{event.date} · {event.participants} participants</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Prize: {event.prize}</span>
                      <button onClick={() => toast.success(`Registered for ${event.title}!`)} className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors">Register</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Analytics ── */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-foreground">Learning Analytics</h1>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Hours", value: "156h", color: "text-blue-600" },
              { label: "Avg Daily", value: "2.4h", color: "text-emerald-600" },
              { label: "Completion Rate", value: "73%", color: "text-yellow-600" },
              { label: "Best Streak", value: "24 days", color: "text-orange-600" },
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
                { skill: "React & Frontend", pct: 85, color: "bg-blue-500" },
                { skill: "Python & ML", pct: 70, color: "bg-emerald-500" },
                { skill: "Node.js & APIs", pct: 60, color: "bg-indigo-500" },
                { skill: "Databases", pct: 45, color: "bg-orange-500" },
                { skill: "DevOps & Cloud", pct: 30, color: "bg-pink-500" },
              ].map(s => (
                <div key={s.skill}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground font-medium">{s.skill}</span>
                    <span className="text-muted-foreground">{s.pct}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full"><div className={cn("h-full rounded-full transition-all", s.color)} style={{ width: `${s.pct}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      <Modal open={certModal.open} onClose={() => setCertModal({ open: false, cert: null })} title="Certificate Details">
        {certModal.cert && (
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-2xl bg-yellow-500/10 flex items-center justify-center mx-auto">
              <Award className="w-10 h-10 text-yellow-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">{certModal.cert.name}</h3>
              <p className="text-sm text-muted-foreground">{certModal.cert.issuer} · {certModal.cert.date}</p>
            </div>
            <div className="p-4 bg-muted rounded-xl text-left">
              <p className="text-xs text-muted-foreground">Certificate ID: <span className="font-mono text-foreground">VT-2026-{Math.random().toString(36).substring(2, 9).toUpperCase()}</span></p>
              <p className="text-xs text-muted-foreground mt-1">Issued to: <span className="font-medium text-foreground">{user.name}</span></p>
              <p className="text-xs text-muted-foreground mt-1">Valid: Lifetime</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { toast.success("Certificate PDF downloaded!"); setCertModal({ open: false, cert: null }); }}
                className="flex-1 btn-primary text-sm">Download PDF</button>
              <button onClick={() => { toast.success("Copied share link!"); setCertModal({ open: false, cert: null }); }}
                className="flex-1 btn-secondary text-sm">Share Link</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={taskModal} onClose={() => setTaskModal(false)} title="Add New Task">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Task Title</label>
            <input className="input-field" placeholder="e.g. Complete React module" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Course</label>
            <select className="input-field">
              {MOCK_COURSES.map(c => <option key={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Due Date</label>
              <input type="date" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Priority</label>
              <select className="input-field">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
          <button onClick={() => { toast.success("Task added!"); setTaskModal(false); }} className="btn-primary w-full">Add Task</button>
        </div>
      </Modal>

      <Modal open={discussionModal} onClose={() => setDiscussionModal(false)} title="Start New Discussion">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
            <input className="input-field" placeholder="Ask your question or share knowledge..."
              value={newDiscussion.title} onChange={e => setNewDiscussion(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Tag</label>
            <select className="input-field" value={newDiscussion.tag}
              onChange={e => setNewDiscussion(p => ({ ...p, tag: e.target.value }))}>
              {["React", "Python", "ML", "Cloud", "DevOps", "Security", "General"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
            <textarea className="input-field min-h-[100px] resize-none" placeholder="Describe your question in detail..."
              value={newDiscussion.body} onChange={e => setNewDiscussion(p => ({ ...p, body: e.target.value }))} />
          </div>
          <button onClick={() => {
            if (!newDiscussion.title.trim()) { toast.error("Please enter a title"); return; }
            toast.success("Discussion posted successfully!");
            setDiscussionModal(false);
            setNewDiscussion({ title: "", tag: "React", body: "" });
          }} className="btn-primary w-full">Post Discussion</button>
        </div>
      </Modal>
    </div>
  );
}
