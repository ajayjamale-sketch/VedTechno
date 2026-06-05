import { useState, useMemo } from "react";
import {
  Code2, GitBranch, Trophy, Briefcase, Users, TrendingUp, Star, Zap,
  BarChart3, Award, Clock, Target, CheckCircle2, ArrowRight, Brain,
  Search, X, Plus, Eye, Edit, Trash2, ExternalLink, Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, RadarChart, Radar, PolarGrid, PolarAngleAxis } from "recharts";
import { toast } from "sonner";
import type { User } from "@/types";

const activityData = [
  { day: "Mon", commits: 4 }, { day: "Tue", commits: 7 }, { day: "Wed", commits: 3 },
  { day: "Thu", commits: 9 }, { day: "Fri", commits: 6 }, { day: "Sat", commits: 11 }, { day: "Sun", commits: 5 },
];
const skillData = [
  { subject: "React", A: 90 }, { subject: "Node.js", A: 75 }, { subject: "Python", A: 80 },
  { subject: "AWS", A: 65 }, { subject: "Docker", A: 70 }, { subject: "GraphQL", A: 55 },
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

const INITIAL_PROJECTS = [
  { id: 1, title: "AI Chat Application", tech: ["React", "OpenAI", "Node.js"], stars: 47, forks: 12, desc: "Full-stack AI chat with context awareness", status: "live", url: "https://github.com" },
  { id: 2, title: "E-Commerce Platform", tech: ["Next.js", "Stripe", "Postgres"], stars: 23, forks: 8, desc: "Full-featured store with payments", status: "live", url: "https://github.com" },
  { id: 3, title: "ML Price Predictor", tech: ["Python", "TensorFlow", "FastAPI"], stars: 31, forks: 15, desc: "Real estate price prediction model", status: "live", url: "https://github.com" },
];

export default function DeveloperDashboard({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [challengeFilter, setChallengeFilter] = useState("All");
  const [challengeSearch, setChallengeSearch] = useState("");
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [addProjectModal, setAddProjectModal] = useState(false);
  const [editProjectModal, setEditProjectModal] = useState<{ open: boolean; project: typeof INITIAL_PROJECTS[0] | null }>({ open: false, project: null });
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: number; title: string }>({ open: false, id: 0, title: "" });
  const [newProject, setNewProject] = useState({ title: "", desc: "", tech: "", url: "" });

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "challenges", label: "Challenges", icon: Code2 },
    { id: "hackathons", label: "Hackathons", icon: Trophy },
    { id: "portfolio", label: "Portfolio", icon: Briefcase },
    { id: "community", label: "Community", icon: Users },
    { id: "career", label: "Career", icon: TrendingUp },
  ];

  const allChallenges = [
    { title: "Two Sum", difficulty: "Easy", solved: true, attempts: 1, points: 10, tags: ["Array", "Hash"] },
    { title: "Longest Palindromic Substring", difficulty: "Medium", solved: true, attempts: 3, points: 25, tags: ["DP", "String"] },
    { title: "Median of Two Sorted Arrays", difficulty: "Hard", solved: false, attempts: 0, points: 50, tags: ["Binary Search"] },
    { title: "Binary Tree Level Order", difficulty: "Medium", solved: true, attempts: 2, points: 25, tags: ["Tree", "BFS"] },
    { title: "Merge K Sorted Lists", difficulty: "Hard", solved: false, attempts: 1, points: 50, tags: ["Heap", "Linked List"] },
    { title: "Container With Most Water", difficulty: "Medium", solved: false, attempts: 0, points: 25, tags: ["Two Pointers"] },
    { title: "Valid Parentheses", difficulty: "Easy", solved: true, attempts: 1, points: 10, tags: ["Stack", "String"] },
    { title: "Climbing Stairs", difficulty: "Easy", solved: false, attempts: 0, points: 10, tags: ["DP"] },
  ];

  const filteredChallenges = useMemo(() => {
    return allChallenges.filter(ch => {
      const matchDiff = challengeFilter === "All" || ch.difficulty === challengeFilter || (challengeFilter === "Solved" && ch.solved) || (challengeFilter === "Unsolved" && !ch.solved);
      const matchSearch = ch.title.toLowerCase().includes(challengeSearch.toLowerCase()) ||
        ch.tags.some(t => t.toLowerCase().includes(challengeSearch.toLowerCase()));
      return matchDiff && matchSearch;
    });
  }, [challengeFilter, challengeSearch]);

  const handleAddProject = () => {
    if (!newProject.title.trim()) { toast.error("Title is required"); return; }
    const proj = {
      id: Date.now(),
      title: newProject.title,
      desc: newProject.desc || "No description",
      tech: newProject.tech.split(",").map(t => t.trim()).filter(Boolean),
      stars: 0,
      forks: 0,
      status: "live",
      url: newProject.url || "#",
    };
    setProjects(p => [...p, proj]);
    toast.success("Project added to portfolio!");
    setAddProjectModal(false);
    setNewProject({ title: "", desc: "", tech: "", url: "" });
  };

  const handleDeleteProject = () => {
    setProjects(p => p.filter(pr => pr.id !== deleteConfirm.id));
    toast.success(`"${deleteConfirm.title}" removed from portfolio`);
    setDeleteConfirm({ open: false, id: 0, title: "" });
  };

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-6 pb-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={cn("flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeTab === id ? "bg-indigo-600 text-white shadow-lg" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Developer Hub 🚀</h1>
              <p className="text-muted-foreground text-sm">Rank: <strong className="text-foreground">#{user.points > 5000 ? "42" : "128"} on leaderboard</strong></p>
            </div>
            <button onClick={() => toast.info("Opening AI code assistant...")} className="btn-primary text-sm bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25">
              <Brain className="w-4 h-4 mr-1.5" />AI Assistant
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Problems Solved", value: "247", icon: CheckCircle2, color: "text-indigo-600 bg-indigo-600/10", tab: "challenges" },
              { label: "Streak Days", value: String(user.streakDays), icon: Zap, color: "text-yellow-600 bg-yellow-600/10", tab: null },
              { label: "Skill Points", value: String(user.points), icon: Star, color: "text-emerald-600 bg-emerald-600/10", tab: null },
              { label: "Hours Coded", value: "312", icon: Clock, color: "text-blue-600 bg-blue-600/10", tab: null },
            ].map(({ label, value, icon: Icon, color, tab }) => (
              <button key={label} onClick={() => tab ? setActiveTab(tab) : undefined}
                className={cn("bg-card border border-border rounded-2xl p-4 hover:border-indigo-600/30 transition-colors text-left", !tab && "cursor-default")}>
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", color)}><Icon className="w-4 h-4" /></div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </button>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Coding Activity (This Week)</h3>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                    <Area type="monotone" dataKey="commits" stroke="#6366F1" strokeWidth={2} fill="url(#indigoGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-2">Skill Proficiency</h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={skillData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <Radar name="Skills" dataKey="A" stroke="#6366F1" fill="#6366F1" fillOpacity={0.2} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Recent Activity</h2>
              <button onClick={() => setActiveTab("challenges")} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">View challenges <ArrowRight className="w-3.5 h-3.5" /></button>
            </div>
            <div className="space-y-2">
              {[
                { action: "Solved", item: "LeetCode Hard: Median of Two Sorted Arrays", time: "2h ago", icon: "✅" },
                { action: "Contributed to", item: "open-source/react-query-devtools", time: "Yesterday", icon: "🔀" },
                { action: "Earned badge:", item: "500 Problems Streak Master", time: "2 days ago", icon: "🏅" },
                { action: "Joined hackathon:", item: "AI Build Weekend Challenge", time: "3 days ago", icon: "🏆" },
              ].map((a, i) => (
                <button key={i} onClick={() => toast.info(a.item)} className="w-full flex items-center gap-3 p-3 bg-card border border-border rounded-xl text-left hover:border-indigo-600/30 transition-colors">
                  <span className="text-xl">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-muted-foreground">{a.action} </span>
                    <span className="text-xs font-medium text-foreground">{a.item}</span>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{a.time}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Challenges ── */}
      {activeTab === "challenges" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Coding Challenges</h1>
            <span className="text-sm text-muted-foreground">{filteredChallenges.filter(c => c.solved).length} / {filteredChallenges.length} solved</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="input-field pl-9 py-2 text-sm" placeholder="Search by name or tag..."
                value={challengeSearch} onChange={e => setChallengeSearch(e.target.value)} />
              {challengeSearch && <button onClick={() => setChallengeSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {["All", "Easy", "Medium", "Hard", "Solved", "Unsolved"].map(f => (
                <button key={f} onClick={() => setChallengeFilter(f)}
                  className={cn("px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border", challengeFilter === f ? "bg-indigo-600 text-white border-indigo-600" : "border-border text-muted-foreground hover:bg-muted")}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          {filteredChallenges.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No challenges match your filter</p>
              <button onClick={() => { setChallengeFilter("All"); setChallengeSearch(""); }} className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">Reset filters</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChallenges.map((ch, i) => (
                <button key={i} onClick={() => toast.info(`Opening challenge: ${ch.title}`)}
                  className="feature-card text-left hover:border-indigo-600/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", {
                      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400": ch.difficulty === "Easy",
                      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400": ch.difficulty === "Medium",
                      "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400": ch.difficulty === "Hard",
                    })}>{ch.difficulty}</span>
                    {ch.solved && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-2">{ch.title}</h3>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {ch.tags.map(t => <span key={t} className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground">{t}</span>)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{ch.attempts} attempts</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">+{ch.points} pts</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Hackathons ── */}
      {activeTab === "hackathons" && (
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-6">Hackathons & Competitions</h1>
          <div className="grid lg:grid-cols-2 gap-5">
            {[
              { title: "AI Build Weekend", dates: "Jun 7–9, 2026", status: "open", prize: "$1,500", participants: 342, theme: "AI-powered productivity tools", team: false },
              { title: "Blockchain Builders", dates: "Jun 14–16, 2026", status: "upcoming", prize: "$2,000", participants: 189, theme: "Decentralized finance solutions", team: false },
              { title: "Green Tech Challenge", dates: "May 24–26, 2026", status: "ended", prize: "$3,000", participants: 512, theme: "Sustainable technology solutions", team: true },
              { title: "EdTech Sprint", dates: "Jul 5–7, 2026", status: "upcoming", prize: "$1,000", participants: 95, theme: "Next-gen learning tools", team: false },
            ].map((h, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">{h.title}</h3>
                  <span className={cn("text-xs px-2 py-1 rounded-full font-medium", {
                    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400": h.status === "open",
                    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400": h.status === "upcoming",
                    "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400": h.status === "ended",
                  })}>{h.status}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{h.dates}</p>
                <p className="text-sm text-muted-foreground mb-4">Theme: {h.theme}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-foreground">{h.prize}</p>
                    <p className="text-xs text-muted-foreground">{h.participants} participants</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toast.info(`Viewing details for ${h.title}...`)} className="px-3 py-2 border border-border text-xs font-medium rounded-xl hover:bg-muted transition-colors text-muted-foreground">
                      Details
                    </button>
                    {h.status !== "ended" ? (
                      <button onClick={() => toast.success(`${h.team ? "Already registered!" : `Registered for ${h.title}!`}`)}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors">
                        {h.status === "open" ? "Join Now" : "Register"}
                      </button>
                    ) : (
                      <button onClick={() => toast.info("Viewing results...")} className="px-4 py-2 border border-border text-sm font-medium rounded-xl hover:bg-muted transition-colors text-muted-foreground">
                        Results
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Portfolio ── */}
      {activeTab === "portfolio" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">My Portfolio</h1>
            <button onClick={() => setAddProjectModal(true)} className="btn-primary text-sm bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/25">
              <Plus className="w-4 h-4 mr-1.5" />Add Project
            </button>
          </div>
          {projects.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-muted-foreground mb-3">No projects yet</p>
              <button onClick={() => setAddProjectModal(true)} className="btn-primary text-sm">Add Your First Project</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((proj) => (
                <div key={proj.id} className="feature-card">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-foreground text-sm">{proj.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">{proj.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{proj.desc}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {proj.tech.map(t => <span key={t} className="text-xs px-2 py-0.5 bg-muted rounded-md text-muted-foreground">{t}</span>)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Star className="w-3 h-3" />{proj.stars}</span>
                      <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" />{proj.forks}</span>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => window.open(proj.url, "_blank")} className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Open in GitHub">
                        <ExternalLink className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                      </button>
                      <button onClick={() => setEditProjectModal({ open: true, project: proj })} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                        <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button onClick={() => setDeleteConfirm({ open: true, id: proj.id, title: proj.title })} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Community ── */}
      {activeTab === "community" && (
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-6">Developer Community</h1>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[
              { title: "Open Source Contributors", members: "12K+", icon: GitBranch, color: "text-indigo-600 bg-indigo-600/10" },
              { title: "React Developers", members: "45K+", icon: Code2, color: "text-blue-600 bg-blue-600/10" },
              { title: "ML Engineers", members: "28K+", icon: Brain, color: "text-emerald-600 bg-emerald-600/10" },
            ].map((g, i) => (
              <button key={i} onClick={() => toast.success(`Joined ${g.title}!`)} className="feature-card text-left hover:border-indigo-600/30">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", g.color)}>
                  <g.icon className="w-5 h-5" />
                </div>
                <p className="font-semibold text-foreground text-sm">{g.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{g.members} members</p>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-2 block">Join Group →</span>
              </button>
            ))}
          </div>
          <h2 className="font-semibold text-foreground mb-3">Hot Discussions</h2>
          <div className="space-y-3">
            {[
              { title: "Best practices for React state management in 2026", replies: 24, views: 1230, tag: "React" },
              { title: "Rust vs Go for backend services — which should you learn?", replies: 41, views: 3200, tag: "Backend" },
              { title: "How I landed a $150K remote job with VedTechno certs", replies: 78, views: 8900, tag: "Career" },
            ].map((post, i) => (
              <button key={i} onClick={() => toast.info(`Opening: ${post.title}`)} className="w-full bg-card border border-border rounded-xl p-4 text-left hover:border-indigo-600/30 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-medium">{post.tag}</span>
                    <p className="text-sm font-medium text-foreground mt-2">{post.title}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{post.replies} replies · {post.views} views</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Career ── */}
      {activeTab === "career" && (
        <div className="space-y-5">
          <h1 className="text-2xl font-bold text-foreground">Career Growth</h1>
          <div className="grid lg:grid-cols-3 gap-4">
            {[
              { label: "Current Level", value: "Senior", color: "text-indigo-600", desc: "Based on skills & activity" },
              { label: "Market Rate", value: "$130K", color: "text-emerald-600", desc: "Avg for your skill set" },
              { label: "Job Matches", value: "47", color: "text-blue-600", desc: "Active openings" },
            ].map(({ label, value, color, desc }) => (
              <div key={label} className="bg-card border border-border rounded-2xl p-5 text-center">
                <p className={cn("text-3xl font-bold", color)}>{value}</p>
                <p className="text-sm font-medium text-foreground mt-1">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Top Job Matches</h2>
              <button onClick={() => toast.info("Opening full job board...")} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">View all</button>
            </div>
            <div className="space-y-3">
              {[
                { title: "Senior React Developer", company: "Stripe", location: "Remote", salary: "$120K–$150K", match: 96 },
                { title: "Full Stack Engineer", company: "Vercel", location: "Remote", salary: "$130K–$160K", match: 92 },
                { title: "Software Engineer II", company: "Notion", location: "San Francisco", salary: "$140K–$170K", match: 87 },
              ].map((job, i) => (
                <div key={i} className="flex items-center gap-4 p-3 border border-border rounded-xl hover:border-indigo-600/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.company} · {job.location}</p>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">{job.salary}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{job.match}%</span>
                    <button onClick={() => toast.success(`Applied to ${job.title}!`)} className="px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition-colors">Apply</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      <Modal open={addProjectModal} onClose={() => setAddProjectModal(false)} title="Add New Project">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Project Title *</label>
            <input className="input-field" placeholder="My Awesome Project"
              value={newProject.title} onChange={e => setNewProject(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
            <textarea className="input-field resize-none min-h-[80px]" placeholder="What does this project do?"
              value={newProject.desc} onChange={e => setNewProject(p => ({ ...p, desc: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Technologies (comma-separated)</label>
            <input className="input-field" placeholder="React, Node.js, MongoDB"
              value={newProject.tech} onChange={e => setNewProject(p => ({ ...p, tech: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">GitHub / Live URL</label>
            <input className="input-field" placeholder="https://github.com/..."
              value={newProject.url} onChange={e => setNewProject(p => ({ ...p, url: e.target.value }))} />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setAddProjectModal(false)} className="flex-1 btn-secondary text-sm">Cancel</button>
            <button onClick={handleAddProject} className="flex-1 btn-primary text-sm bg-indigo-600 hover:bg-indigo-700">Add Project</button>
          </div>
        </div>
      </Modal>

      <Modal open={editProjectModal.open} onClose={() => setEditProjectModal({ open: false, project: null })} title="Edit Project">
        {editProjectModal.project && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Project Title</label>
              <input className="input-field" defaultValue={editProjectModal.project.title} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
              <textarea className="input-field resize-none min-h-[80px]" defaultValue={editProjectModal.project.desc} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Status</label>
              <select className="input-field">
                <option value="live">Live</option>
                <option value="in-progress">In Progress</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditProjectModal({ open: false, project: null })} className="flex-1 btn-secondary text-sm">Cancel</button>
              <button onClick={() => { toast.success("Project updated!"); setEditProjectModal({ open: false, project: null }); }} className="flex-1 btn-primary text-sm bg-indigo-600 hover:bg-indigo-700">Save Changes</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={deleteConfirm.open} onClose={() => setDeleteConfirm({ open: false, id: 0, title: "" })} title="Delete Project">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Remove "{deleteConfirm.title}"?</p>
            <p className="text-sm text-muted-foreground mt-1">This will remove the project from your portfolio. This action cannot be undone.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setDeleteConfirm({ open: false, id: 0, title: "" })} className="flex-1 btn-secondary text-sm">Cancel</button>
            <button onClick={handleDeleteProject} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
