import { useState, useMemo } from "react";
import {
  Users, Briefcase, Search, Award, MessageSquare, BarChart3, Plus, Eye,
  CheckCircle2, TrendingUp, ArrowRight, Mail, X, Edit, Trash2,
  Download, Filter, Star, MapPin, DollarSign, Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { toast } from "sonner";
import type { User } from "@/types";

const pipelineData = [
  { stage: "Applied", count: 48 }, { stage: "Screened", count: 32 }, { stage: "Interview", count: 18 },
  { stage: "Offer", count: 7 }, { stage: "Hired", count: 4 },
];
const hiresTrend = [
  { month: "Jan", hires: 1 }, { month: "Feb", hires: 0 }, { month: "Mar", hires: 2 },
  { month: "Apr", hires: 1 }, { month: "May", hires: 3 }, { month: "Jun", hires: 4 },
];

const ALL_CANDIDATES = [
  { id: 1, name: "Alex Johnson", role: "Full Stack Developer", skills: ["React", "Node.js", "TypeScript"], certs: 3, match: 95, status: "interview", location: "San Francisco", salary: "$90K", availability: "2 weeks" },
  { id: 2, name: "Maya Patel", role: "ML Engineer", skills: ["Python", "TensorFlow", "AWS"], certs: 5, match: 91, status: "offer", location: "Remote", salary: "$120K", availability: "1 month" },
  { id: 3, name: "Daniel Kim", role: "Frontend Developer", skills: ["Vue.js", "CSS", "JavaScript"], certs: 2, match: 84, status: "screened", location: "New York", salary: "$75K", availability: "Immediately" },
  { id: 4, name: "Priya Sharma", role: "Data Scientist", skills: ["Python", "SQL", "Tableau"], certs: 4, match: 88, status: "applied", location: "Boston", salary: "$95K", availability: "3 weeks" },
  { id: 5, name: "Marcus Chen", role: "DevOps Engineer", skills: ["Kubernetes", "Docker", "AWS"], certs: 3, match: 79, status: "applied", location: "Seattle", salary: "$105K", availability: "1 month" },
];

const INIT_JOBS = [
  { id: 1, title: "Senior React Developer", dept: "Engineering", location: "Remote", applicants: 34, status: "active", posted: "3 days ago", type: "Full-time" },
  { id: 2, title: "ML Engineer", dept: "AI/Data", location: "San Francisco", applicants: 28, status: "active", posted: "5 days ago", type: "Full-time" },
  { id: 3, title: "DevOps Engineer", dept: "Infrastructure", location: "New York", applicants: 19, status: "active", posted: "1 week ago", type: "Contract" },
  { id: 4, title: "Product Designer", dept: "Design", location: "Remote", applicants: 0, status: "draft", posted: "—", type: "Full-time" },
];

const INTERVIEWS = [
  { candidate: "Alex Johnson", role: "Senior React Developer", date: "Jun 7, 2026", time: "2:00 PM", type: "Technical", status: "scheduled" },
  { candidate: "Maya Patel", role: "ML Engineer", date: "Jun 8, 2026", time: "10:00 AM", type: "Final Round", status: "scheduled" },
  { candidate: "Daniel Kim", role: "Frontend Developer", date: "Jun 5, 2026", time: "3:30 PM", type: "Initial Screen", status: "completed" },
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

export default function RecruiterDashboard({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [jobs, setJobs] = useState(INIT_JOBS);
  const [candidateSearch, setCandidateSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewCandidateModal, setViewCandidateModal] = useState<{ open: boolean; candidate: typeof ALL_CANDIDATES[0] | null }>({ open: false, candidate: null });
  const [postJobModal, setPostJobModal] = useState(false);
  const [editJobModal, setEditJobModal] = useState<{ open: boolean; job: typeof INIT_JOBS[0] | null }>({ open: false, job: null });
  const [newJob, setNewJob] = useState({ title: "", dept: "", location: "", type: "Full-time" });
  const [scheduleModal, setScheduleModal] = useState<{ open: boolean; candidate: string }>({ open: false, candidate: "" });

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "jobs", label: "Job Postings", icon: Briefcase },
    { id: "interviews", label: "Interviews", icon: MessageSquare },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ];

  const filteredCandidates = useMemo(() => {
    return ALL_CANDIDATES.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(candidateSearch.toLowerCase()) ||
        c.role.toLowerCase().includes(candidateSearch.toLowerCase()) ||
        c.skills.some(s => s.toLowerCase().includes(candidateSearch.toLowerCase()));
      const matchSkill = skillFilter === "All" || c.skills.includes(skillFilter);
      const matchStatus = statusFilter === "All" || c.status === statusFilter;
      return matchSearch && matchSkill && matchStatus;
    });
  }, [candidateSearch, skillFilter, statusFilter]);

  const handlePostJob = () => {
    if (!newJob.title.trim()) { toast.error("Job title is required"); return; }
    const job = { id: Date.now(), title: newJob.title, dept: newJob.dept || "General", location: newJob.location || "Remote", applicants: 0, status: "active", posted: "Just now", type: newJob.type };
    setJobs(prev => [job, ...prev]);
    toast.success("Job posting is live!");
    setPostJobModal(false);
    setNewJob({ title: "", dept: "", location: "", type: "Full-time" });
    setActiveTab("jobs");
  };

  const handleDeleteJob = (id: number, title: string) => {
    setJobs(prev => prev.filter(j => j.id !== id));
    toast.success(`"${title}" removed`);
  };

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-6 pb-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={cn("flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeTab === id ? "bg-orange-600 text-white shadow-lg shadow-orange-600/25" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Recruiter Hub 👥</h1>
              <p className="text-sm text-muted-foreground">Find verified, certified tech talent ready to hire.</p>
            </div>
            <button onClick={() => setPostJobModal(true)} className="btn-primary text-sm bg-orange-600 hover:bg-orange-700 shadow-orange-600/25">
              <Plus className="w-4 h-4 mr-1.5" />Post Job
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Active Jobs", value: String(jobs.filter(j => j.status === "active").length), icon: Briefcase, color: "text-orange-600 bg-orange-600/10", tab: "jobs" },
              { label: "Total Applicants", value: String(jobs.reduce((a, j) => a + j.applicants, 0)), icon: Users, color: "text-blue-600 bg-blue-600/10", tab: "candidates" },
              { label: "Interviews Scheduled", value: String(INTERVIEWS.filter(i => i.status === "scheduled").length), icon: MessageSquare, color: "text-emerald-600 bg-emerald-600/10", tab: "interviews" },
              { label: "Hires This Month", value: "4", icon: CheckCircle2, color: "text-yellow-600 bg-yellow-600/10", tab: "analytics" },
            ].map(({ label, value, icon: Icon, color, tab }) => (
              <button key={label} onClick={() => setActiveTab(tab)}
                className="bg-card border border-border rounded-2xl p-4 hover:border-orange-600/30 transition-colors text-left">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", color)}><Icon className="w-4 h-4" /></div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </button>
            ))}
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">Hiring Pipeline</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="stage" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                  <Bar dataKey="count" fill="#EA580C" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Top Matched Candidates</h2>
              <button onClick={() => setActiveTab("candidates")} className="text-sm text-orange-600 hover:underline flex items-center gap-1">
                Search all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              {ALL_CANDIDATES.slice(0, 3).map((c) => (
                <div key={c.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-600/20 flex items-center justify-center text-orange-600 font-bold text-sm flex-shrink-0">
                    {c.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.role}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {c.skills.map(s => <span key={s} className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground">{s}</span>)}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{c.match}% match</p>
                    <p className="text-xs text-muted-foreground">{c.certs} certs</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setViewCandidateModal({ open: true, candidate: c })} className="p-2 hover:bg-muted rounded-lg transition-colors"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                    <button onClick={() => { setScheduleModal({ open: true, candidate: c.name }); }} className="px-3 py-1.5 bg-orange-600 text-white text-xs font-medium rounded-lg hover:bg-orange-700 transition-colors">Invite</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Candidates ── */}
      {activeTab === "candidates" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Candidate Search</h1>
            <span className="text-sm text-muted-foreground">{filteredCandidates.length} candidates</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="input-field pl-9 py-2 text-sm" placeholder="Search by name, role, or skill..."
                value={candidateSearch} onChange={e => setCandidateSearch(e.target.value)} />
              {candidateSearch && <button onClick={() => setCandidateSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
            </div>
            <select className="input-field py-2 text-sm w-auto" value={skillFilter} onChange={e => setSkillFilter(e.target.value)}>
              <option value="All">All Skills</option>
              <option>React</option><option>Python</option><option>AWS</option><option>TypeScript</option>
            </select>
            <select className="input-field py-2 text-sm w-auto" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="applied">Applied</option>
              <option value="screened">Screened</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
            </select>
          </div>
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-2xl">
              <Search className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-40" />
              <p className="text-muted-foreground">No candidates match your search</p>
              <button onClick={() => { setCandidateSearch(""); setSkillFilter("All"); setStatusFilter("All"); }} className="mt-2 text-sm text-orange-600 hover:underline">Reset filters</button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCandidates.map((c) => (
                <div key={c.id} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-600/20 flex items-center justify-center text-orange-600 font-bold flex-shrink-0">
                      {c.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{c.name}</h3>
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", {
                          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400": c.status === "applied",
                          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400": c.status === "screened",
                          "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400": c.status === "interview",
                          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400": c.status === "offer",
                        })}>{c.status}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{c.role}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{c.location}</span>
                        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{c.salary}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{c.availability}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {c.skills.map(s => <span key={s} className="text-xs px-2 py-0.5 bg-muted rounded-md text-muted-foreground">{s}</span>)}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{c.match}%</p>
                      <p className="text-xs text-muted-foreground">match · {c.certs} certs</p>
                      <div className="flex gap-1.5 mt-2">
                        <button onClick={() => setViewCandidateModal({ open: true, candidate: c })} className="p-1.5 border border-border rounded-lg hover:bg-muted transition-colors"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button onClick={() => toast.success(`Message sent to ${c.name}!`)} className="p-1.5 border border-border rounded-lg hover:bg-muted transition-colors"><Mail className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button onClick={() => setScheduleModal({ open: true, candidate: c.name })} className="px-3 py-1.5 bg-orange-600 text-white text-xs font-medium rounded-lg hover:bg-orange-700 transition-colors">Schedule</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Jobs ── */}
      {activeTab === "jobs" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">Job Postings</h1>
            <button onClick={() => setPostJobModal(true)} className="btn-primary text-sm bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-1.5" />Post New Job
            </button>
          </div>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-semibold text-foreground">{job.title}</h3>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", job.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400")}>{job.status}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{job.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{job.dept} · {job.location} · Posted {job.posted}</p>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mt-1">{job.applicants} applicants</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => toast.info(`Viewing ${job.applicants} applications for ${job.title}...`)} className="px-3 py-1.5 border border-border text-xs font-medium rounded-lg hover:bg-muted transition-colors text-foreground">View Apps</button>
                  <button onClick={() => setEditJobModal({ open: true, job })} className="px-3 py-1.5 bg-orange-600 text-white text-xs font-medium rounded-lg hover:bg-orange-700 transition-colors">Edit</button>
                  <button onClick={() => handleDeleteJob(job.id, job.title)} className="p-1.5 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Interviews ── */}
      {activeTab === "interviews" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">Interview Schedule</h1>
            <button onClick={() => setScheduleModal({ open: true, candidate: "" })} className="btn-primary text-sm bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-1.5" />Schedule Interview
            </button>
          </div>
          <div className="space-y-4">
            {INTERVIEWS.map((interview, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", interview.status === "scheduled" ? "bg-orange-600/10" : "bg-emerald-600/10")}>
                      <MessageSquare className={cn("w-5 h-5", interview.status === "scheduled" ? "text-orange-600" : "text-emerald-600")} />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{interview.candidate}</p>
                      <p className="text-xs text-muted-foreground">{interview.role} · {interview.type}</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{interview.date} at {interview.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={cn("text-xs px-2 py-1 rounded-full font-medium", interview.status === "scheduled" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400")}>{interview.status}</span>
                    {interview.status === "scheduled" ? (
                      <div className="flex gap-2">
                        <button onClick={() => toast.success("Interview link sent!")} className="px-3 py-1.5 border border-border text-xs rounded-lg hover:bg-muted transition-colors text-foreground">Send Link</button>
                        <button onClick={() => toast.info("Interview rescheduled!")} className="px-3 py-1.5 bg-orange-600 text-white text-xs rounded-lg hover:bg-orange-700 transition-colors">Reschedule</button>
                      </div>
                    ) : (
                      <button onClick={() => toast.info("Opening feedback form...")} className="px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 transition-colors">Add Feedback</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Analytics ── */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Hiring Analytics</h1>
            <button onClick={() => toast.success("Analytics report downloaded!")} className="btn-secondary text-sm flex items-center gap-1.5">
              <Download className="w-4 h-4" />Export Report
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Time to Hire", value: "18 days", color: "text-orange-600" },
              { label: "Offer Accept Rate", value: "78%", color: "text-emerald-600" },
              { label: "Qualified Rate", value: "42%", color: "text-blue-600" },
              { label: "Cost per Hire", value: "$1,240", color: "text-violet-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-card border border-border rounded-2xl p-4 text-center">
                <p className={cn("text-2xl font-bold", color)}>{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Hiring Pipeline</h3>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pipelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="stage" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                    <Bar dataKey="count" fill="#EA580C" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Monthly Hires</h3>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hiresTrend}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                    <Line type="monotone" dataKey="hires" stroke="#EA580C" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      <Modal open={viewCandidateModal.open} onClose={() => setViewCandidateModal({ open: false, candidate: null })} title="Candidate Profile">
        {viewCandidateModal.candidate && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-orange-600/20 flex items-center justify-center text-orange-600 font-bold text-2xl">
                {viewCandidateModal.candidate.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="font-bold text-foreground text-lg">{viewCandidateModal.candidate.name}</p>
                <p className="text-sm text-muted-foreground">{viewCandidateModal.candidate.role}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">{viewCandidateModal.candidate.match}% match</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Location", value: viewCandidateModal.candidate.location },
                { label: "Exp. Salary", value: viewCandidateModal.candidate.salary },
                { label: "Availability", value: viewCandidateModal.candidate.availability },
                { label: "Certifications", value: `${viewCandidateModal.candidate.certs} verified` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-muted rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Technical Skills</p>
              <div className="flex flex-wrap gap-2">
                {viewCandidateModal.candidate.skills.map(s => <span key={s} className="text-xs px-2 py-1 bg-orange-600/10 text-orange-600 dark:text-orange-400 rounded-lg font-medium">{s}</span>)}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { toast.success(`Invite sent to ${viewCandidateModal.candidate!.name}!`); setViewCandidateModal({ open: false, candidate: null }); }} className="flex-1 btn-primary text-sm bg-orange-600 hover:bg-orange-700">Invite to Interview</button>
              <button onClick={() => { toast.success("Message sent!"); setViewCandidateModal({ open: false, candidate: null }); }} className="flex-1 btn-secondary text-sm">Send Message</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={postJobModal} onClose={() => setPostJobModal(false)} title="Post New Job">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Job Title *</label>
            <input className="input-field" placeholder="e.g. Senior React Developer"
              value={newJob.title} onChange={e => setNewJob(p => ({ ...p, title: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Department</label>
              <input className="input-field" placeholder="Engineering"
                value={newJob.dept} onChange={e => setNewJob(p => ({ ...p, dept: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Location</label>
              <input className="input-field" placeholder="Remote / City"
                value={newJob.location} onChange={e => setNewJob(p => ({ ...p, location: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Employment Type</label>
            <select className="input-field" value={newJob.type} onChange={e => setNewJob(p => ({ ...p, type: e.target.value }))}>
              <option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Job Description</label>
            <textarea className="input-field resize-none min-h-[80px]" placeholder="Describe responsibilities, requirements..." />
          </div>
          <div className="flex gap-3">
            <button onClick={() => setPostJobModal(false)} className="flex-1 btn-secondary text-sm">Cancel</button>
            <button onClick={handlePostJob} className="flex-1 btn-primary text-sm bg-orange-600 hover:bg-orange-700">Post Job</button>
          </div>
        </div>
      </Modal>

      <Modal open={editJobModal.open} onClose={() => setEditJobModal({ open: false, job: null })} title="Edit Job Posting">
        {editJobModal.job && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Job Title</label>
              <input className="input-field" defaultValue={editJobModal.job.title} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Department</label>
                <input className="input-field" defaultValue={editJobModal.job.dept} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Location</label>
                <input className="input-field" defaultValue={editJobModal.job.location} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Status</label>
              <select className="input-field" defaultValue={editJobModal.job.status}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditJobModal({ open: false, job: null })} className="flex-1 btn-secondary text-sm">Cancel</button>
              <button onClick={() => { toast.success("Job posting updated!"); setEditJobModal({ open: false, job: null }); }} className="flex-1 btn-primary text-sm bg-orange-600 hover:bg-orange-700">Save Changes</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={scheduleModal.open} onClose={() => setScheduleModal({ open: false, candidate: "" })} title="Schedule Interview">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Candidate</label>
            <input className="input-field" placeholder="Candidate name" defaultValue={scheduleModal.candidate} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Date</label>
              <input type="date" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Time</label>
              <input type="time" className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Interview Type</label>
            <select className="input-field">
              <option>Initial Screen</option><option>Technical Round</option><option>System Design</option><option>Final Round</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Meeting Link (optional)</label>
            <input className="input-field" placeholder="https://meet.google.com/..." />
          </div>
          <button onClick={() => { toast.success("Interview scheduled & invite sent!"); setScheduleModal({ open: false, candidate: "" }); }} className="btn-primary w-full text-sm bg-orange-600 hover:bg-orange-700">Schedule & Send Invite</button>
        </div>
      </Modal>
    </div>
  );
}
