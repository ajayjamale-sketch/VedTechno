import { useState, useMemo } from "react";
import {
  Users, BookOpen, Award, BarChart3, TrendingUp, Plus, Eye,
  CheckCircle2, AlertTriangle, Download, X, Search, Edit, Trash2,
  Target, Filter, Mail, UploadCloud, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";
import { toast } from "sonner";
import type { User } from "@/types";

const skillProgressData = [
  { dept: "Engineering", completion: 78 }, { dept: "Data", completion: 65 }, { dept: "Design", completion: 82 },
  { dept: "DevOps", completion: 54 }, { dept: "Security", completion: 71 },
];
const trendData = [
  { month: "Jan", completion: 45 }, { month: "Feb", completion: 52 }, { month: "Mar", completion: 61 },
  { month: "Apr", completion: 68 }, { month: "May", completion: 74 }, { month: "Jun", completion: 81 },
];

const INIT_EMPLOYEES = [
  { id: 1, name: "John Smith", dept: "Engineering", path: "Full Stack Dev", progress: 82, certs: 2, status: "on-track", email: "john@globaltech.com" },
  { id: 2, name: "Anna Lee", dept: "Data", path: "Data Science", progress: 64, certs: 1, status: "on-track", email: "anna@globaltech.com" },
  { id: 3, name: "Mike Torres", dept: "DevOps", path: "Cloud Engineering", progress: 31, certs: 0, status: "at-risk", email: "mike@globaltech.com" },
  { id: 4, name: "Priya Singh", dept: "Security", path: "Cybersecurity", progress: 91, certs: 3, status: "completed", email: "priya@globaltech.com" },
  { id: 5, name: "David Kim", dept: "Design", path: "UI/UX Design", progress: 55, certs: 1, status: "on-track", email: "david@globaltech.com" },
];

const LEARNING_PATHS = [
  { id: 1, title: "Full Stack Development", assignedTo: 32, duration: "6 months", completion: 74, dept: "Engineering" },
  { id: 2, title: "Data Science", assignedTo: 18, duration: "5 months", completion: 61, dept: "Data" },
  { id: 3, title: "Cloud Engineering", assignedTo: 24, duration: "4 months", completion: 48, dept: "DevOps" },
  { id: 4, title: "Cybersecurity", assignedTo: 15, duration: "4 months", completion: 85, dept: "Security" },
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

export default function CorporateDashboard({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [employees, setEmployees] = useState(INIT_EMPLOYEES);
  const [empSearch, setEmpSearch] = useState("");
  const [empFilter, setEmpFilter] = useState("All");
  const [inviteModal, setInviteModal] = useState(false);
  const [viewEmpModal, setViewEmpModal] = useState<{ open: boolean; emp: typeof INIT_EMPLOYEES[0] | null }>({ open: false, emp: null });
  const [assignPathModal, setAssignPathModal] = useState<{ open: boolean; emp: string; skill?: string }>({ open: false, emp: "", skill: "" });
  const [createPathModal, setCreatePathModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", dept: "", path: "Full Stack Dev" });

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "team", label: "Team", icon: Users },
    { id: "paths", label: "Learning Paths", icon: BookOpen },
    { id: "certs", label: "Certifications", icon: Award },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "reports", label: "Reports", icon: Download },
  ];

  const filteredEmployees = useMemo(() => {
    return employees.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(empSearch.toLowerCase()) ||
        e.dept.toLowerCase().includes(empSearch.toLowerCase()) ||
        e.path.toLowerCase().includes(empSearch.toLowerCase());
      const matchFilter = empFilter === "All" || e.status === empFilter || e.dept === empFilter;
      return matchSearch && matchFilter;
    });
  }, [employees, empSearch, empFilter]);

  const handleInvite = () => {
    if (!inviteForm.email.trim()) { toast.error("Email is required"); return; }
    const emp = { id: Date.now(), name: inviteForm.name || inviteForm.email.split("@")[0], dept: inviteForm.dept || "General", path: inviteForm.path, progress: 0, certs: 0, status: "on-track", email: inviteForm.email };
    setEmployees(prev => [...prev, emp]);
    toast.success(`Invite sent to ${inviteForm.email}!`);
    setInviteModal(false);
    setInviteForm({ name: "", email: "", dept: "", path: "Full Stack Dev" });
  };

  const handleRemoveEmployee = (id: number, name: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    toast.success(`${name} removed from team`);
  };

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-6 pb-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={cn("flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeTab === id ? "bg-violet-600 text-white shadow-lg shadow-violet-600/25" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Enterprise Dashboard 🏢</h1>
              <p className="text-sm text-muted-foreground">GlobalTech Corp · Q2 2026 Learning Report</p>
            </div>
            <button onClick={() => setAssignPathModal({ open: true, emp: "All Employees" })} className="btn-primary text-sm bg-violet-600 hover:bg-violet-700 shadow-violet-600/25">
              Assign Training
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Enrolled Employees", value: String(employees.length), icon: Users, color: "text-violet-600 bg-violet-600/10", tab: "team", change: "+12 this month" },
              { label: "Avg Completion", value: "74%", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-600/10", tab: "analytics", change: "↑ 9% vs last Q" },
              { label: "Certs Issued", value: String(employees.reduce((a, e) => a + e.certs, 0)), icon: Award, color: "text-yellow-600 bg-yellow-600/10", tab: "certs", change: "This quarter" },
              { label: "Active Paths", value: String(LEARNING_PATHS.length), icon: BookOpen, color: "text-blue-600 bg-blue-600/10", tab: "paths", change: "Across 5 depts" },
            ].map(({ label, value, icon: Icon, color, tab, change }) => (
              <button key={label} onClick={() => setActiveTab(tab)}
                className="bg-card border border-border rounded-2xl p-4 hover:border-violet-600/30 transition-colors text-left">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", color)}><Icon className="w-4 h-4" /></div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">{change}</p>
              </button>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Completion by Department</h3>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillProgressData} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v: number) => [`${v}%`, "Completion"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                    <Bar dataKey="completion" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Org-Wide Completion Trend</h3>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v: number) => [`${v}%`, "Completion"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                    <Line type="monotone" dataKey="completion" stroke="#8B5CF6" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Skill Gap Alerts</h2>
              <button onClick={() => toast.info("Running full skill gap analysis...")} className="text-sm text-violet-600 hover:underline">Full Analysis</button>
            </div>
            <div className="space-y-3">
              {[
                { skill: "Kubernetes & Container Orchestration", dept: "DevOps", gap: 46, priority: "high" },
                { skill: "Advanced Python for Data Science", dept: "Data", gap: 35, priority: "medium" },
                { skill: "Security Best Practices (OWASP)", dept: "Engineering", gap: 29, priority: "medium" },
              ].map((g, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                  <AlertTriangle className={cn("w-5 h-5 flex-shrink-0", g.priority === "high" ? "text-red-500" : "text-yellow-500")} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{g.skill}</p>
                    <p className="text-xs text-muted-foreground">{g.dept} · {g.gap}% of team needs this skill</p>
                  </div>
                  <button onClick={() => { setAssignPathModal({ open: true, emp: `${g.dept} team`, skill: g.skill }); }}
                    className="px-3 py-1.5 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-violet-700 transition-colors flex-shrink-0">
                    Assign Path
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Team ── */}
      {activeTab === "team" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
            <div className="flex gap-2">
              <button onClick={() => toast.success("Team data exported!")} className="btn-secondary text-sm flex items-center gap-1.5"><Download className="w-4 h-4" />Export</button>
              <button onClick={() => setInviteModal(true)} className="btn-primary text-sm bg-violet-600 hover:bg-violet-700"><Plus className="w-4 h-4 mr-1.5" />Invite Employee</button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="input-field pl-9 py-2 text-sm" placeholder="Search by name, department, or path..."
                value={empSearch} onChange={e => setEmpSearch(e.target.value)} />
              {empSearch && <button onClick={() => setEmpSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
            </div>
            <select className="input-field py-2 text-sm w-auto" value={empFilter} onChange={e => setEmpFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="on-track">On Track</option>
              <option value="at-risk">At Risk</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-3 border-b border-border text-xs text-muted-foreground">{filteredEmployees.length} employees shown</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    {["Employee", "Department", "Learning Path", "Progress", "Certs", "Status", "Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">No employees match your search</td></tr>
                  ) : filteredEmployees.map((e) => (
                    <tr key={e.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground text-sm">{e.name}</p>
                        <p className="text-xs text-muted-foreground">{e.email}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{e.dept}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{e.path}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 bg-muted rounded-full w-16 flex-shrink-0">
                            <div className={cn("h-full rounded-full", e.progress > 70 ? "bg-emerald-500" : e.progress > 40 ? "bg-yellow-500" : "bg-red-500")} style={{ width: `${e.progress}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{e.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-center text-muted-foreground">{e.certs}</td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", {
                          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400": e.status === "on-track",
                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400": e.status === "at-risk",
                          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400": e.status === "completed",
                        })}>{e.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setViewEmpModal({ open: true, emp: e })} className="p-1.5 hover:bg-muted rounded transition-colors" title="View details"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                          <button onClick={() => setAssignPathModal({ open: true, emp: e.name })} className="p-1.5 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded transition-colors" title="Assign path">
                            <BookOpen className="w-3.5 h-3.5 text-violet-600" />
                          </button>
                          <button onClick={() => handleRemoveEmployee(e.id, e.name)} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" title="Remove">
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Learning Paths ── */}
      {activeTab === "paths" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">Learning Paths</h1>
            <button onClick={() => setCreatePathModal(true)} className="btn-primary text-sm bg-violet-600 hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-1.5" />Create Path
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {LEARNING_PATHS.map((path) => (
              <div key={path.id} className="bg-card border border-border rounded-2xl p-5 hover:border-violet-600/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{path.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{path.dept} · {path.duration}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400">{path.assignedTo} enrolled</span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Overall Completion</span>
                    <span className="font-medium text-foreground">{path.completion}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className={cn("h-full rounded-full", path.completion >= 70 ? "bg-emerald-500" : path.completion >= 40 ? "bg-violet-500" : "bg-red-500")} style={{ width: `${path.completion}%` }} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toast.info(`Viewing ${path.title} details...`)} className="flex-1 py-1.5 border border-border rounded-lg text-xs hover:bg-muted transition-colors text-foreground">View Details</button>
                  <button onClick={() => setAssignPathModal({ open: true, emp: "Selected Employees" })} className="flex-1 py-1.5 bg-violet-600 text-white rounded-lg text-xs hover:bg-violet-700 transition-colors">Assign</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Certifications ── */}
      {activeTab === "certs" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Team Certifications</h1>
            <button onClick={() => toast.success("Certification report downloaded!")} className="btn-secondary text-sm flex items-center gap-1.5"><Download className="w-4 h-4" />Export</button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Issued", value: String(employees.reduce((a, e) => a + e.certs, 0)), color: "text-yellow-600" },
              { label: "This Quarter", value: "23", color: "text-violet-600" },
              { label: "Cert Coverage", value: `${Math.round((employees.filter(e => e.certs > 0).length / employees.length) * 100)}%`, color: "text-emerald-600" },
              { label: "Pending Exams", value: "8", color: "text-orange-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-card border border-border rounded-2xl p-4 text-center">
                <p className={cn("text-2xl font-bold", color)}>{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground text-sm">Employee Certifications</h3>
              <button onClick={() => toast.info("Bulk cert assignment initiated...")} className="text-xs text-violet-600 hover:underline">Bulk Assign</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>{["Employee", "Department", "Certifications", "Latest Cert", "Actions"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {employees.map(e => (
                    <tr key={e.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground text-sm">{e.name}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{e.dept}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {[...Array(Math.min(e.certs, 5))].map((_, i) => <Award key={i} className="w-3.5 h-3.5 text-yellow-500" />)}
                          {e.certs === 0 && <span className="text-xs text-muted-foreground">None yet</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{e.certs > 0 ? "May 2026" : "—"}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => toast.info(`Assigning cert exam to ${e.name}...`)} className="px-2 py-1 bg-violet-600 text-white text-xs rounded-lg hover:bg-violet-700 transition-colors">Assign Exam</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Analytics ── */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Learning Analytics</h1>
            <button onClick={() => toast.success("Analytics exported!")} className="btn-secondary text-sm flex items-center gap-1.5"><Download className="w-4 h-4" />Export</button>
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Completion by Department</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={skillProgressData} layout="vertical">
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v: number) => [`${v}%`, "Completion"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                    <Bar dataKey="completion" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Completion Trend (6 months)</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v: number) => [`${v}%`, "Completion"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                    <Line type="monotone" dataKey="completion" stroke="#8B5CF6" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">Top Performers</h3>
            <div className="space-y-3">
              {employees.sort((a, b) => b.progress - a.progress).slice(0, 4).map(e => (
                <div key={e.id} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-violet-600/10 flex items-center justify-center text-violet-600 font-bold text-xs flex-shrink-0">
                    {e.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{e.name}</p>
                    <p className="text-xs text-muted-foreground">{e.dept}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 bg-muted rounded-full w-20">
                      <div className="h-full bg-violet-500 rounded-full" style={{ width: `${e.progress}%` }} />
                    </div>
                    <span className="text-xs font-medium text-foreground w-8">{e.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Reports ── */}
      {activeTab === "reports" && (
        <div className="space-y-5">
          <h1 className="text-2xl font-bold text-foreground">Reports & Exports</h1>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Team Progress Report", desc: "Individual and team-level learning progress", format: "PDF · Excel" },
              { title: "Certification Summary", desc: "All certifications issued this quarter", format: "PDF" },
              { title: "Skill Gap Analysis", desc: "Department-wise skill gap identification", format: "Excel" },
              { title: "Compliance Report", desc: "Mandatory training completion status", format: "PDF · CSV" },
              { title: "ROI Report", desc: "Training investment vs productivity gains", format: "PDF · Excel" },
              { title: "Learning Activity Log", desc: "Detailed daily activity per employee", format: "CSV" },
            ].map((r, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-600/10 flex items-center justify-center flex-shrink-0">
                  <Download className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                  <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5">{r.format}</p>
                </div>
                <button onClick={() => toast.success(`${r.title} is being generated...`)} className="px-3 py-1.5 bg-violet-600 text-white text-xs font-medium rounded-lg hover:bg-violet-700 transition-colors flex-shrink-0">
                  Generate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      <Modal open={inviteModal} onClose={() => setInviteModal(false)} title="Invite Employee">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
            <input className="input-field" placeholder="John Smith" value={inviteForm.name} onChange={e => setInviteForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email Address *</label>
            <input type="email" className="input-field" placeholder="john@company.com" value={inviteForm.email} onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Department</label>
              <select className="input-field" value={inviteForm.dept} onChange={e => setInviteForm(p => ({ ...p, dept: e.target.value }))}>
                <option value="">Select...</option>
                <option>Engineering</option><option>Data</option><option>DevOps</option><option>Design</option><option>Security</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Assign Learning Path</label>
              <select className="input-field" value={inviteForm.path} onChange={e => setInviteForm(p => ({ ...p, path: e.target.value }))}>
                {LEARNING_PATHS.map(p => <option key={p.id}>{p.title}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setInviteModal(false)} className="flex-1 btn-secondary text-sm">Cancel</button>
            <button onClick={handleInvite} className="flex-1 btn-primary text-sm bg-violet-600 hover:bg-violet-700">Send Invite</button>
          </div>
        </div>
      </Modal>

      <Modal open={viewEmpModal.open} onClose={() => setViewEmpModal({ open: false, emp: null })} title="Employee Details">
        {viewEmpModal.emp && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-violet-600/10 flex items-center justify-center text-violet-600 font-bold text-xl">
                {viewEmpModal.emp.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="font-bold text-foreground">{viewEmpModal.emp.name}</p>
                <p className="text-sm text-muted-foreground">{viewEmpModal.emp.dept} · {viewEmpModal.emp.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Learning Path", value: viewEmpModal.emp.path },
                { label: "Progress", value: `${viewEmpModal.emp.progress}%` },
                { label: "Certifications", value: String(viewEmpModal.emp.certs) },
                { label: "Status", value: viewEmpModal.emp.status },
              ].map(({ label, value }) => (
                <div key={label} className="bg-muted rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { toast.success(`Nudge sent to ${viewEmpModal.emp!.name}!`); setViewEmpModal({ open: false, emp: null }); }}
                className="flex-1 btn-primary text-sm bg-violet-600 hover:bg-violet-700">Send Nudge</button>
              <button onClick={() => { setAssignPathModal({ open: true, emp: viewEmpModal.emp!.name }); setViewEmpModal({ open: false, emp: null }); }}
                className="flex-1 btn-secondary text-sm">Reassign Path</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={assignPathModal.open} onClose={() => setAssignPathModal({ open: false, emp: "" })} title="Assign Learning Path">
        <div className="space-y-4">
          <div className="p-3 bg-violet-600/10 border border-violet-600/20 rounded-xl">
            <p className="text-sm text-violet-600 dark:text-violet-400">Assigning to: <strong>{assignPathModal.emp}</strong></p>
            {assignPathModal.skill && <p className="text-xs text-violet-500 mt-0.5">Addressing gap: {assignPathModal.skill}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Learning Path</label>
            <select className="input-field">
              {LEARNING_PATHS.map(p => <option key={p.id}>{p.title}</option>)}
              <option>Custom Path</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Priority</label>
            <select className="input-field">
              <option>Normal</option><option>High Priority</option><option>Mandatory</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Deadline</label>
            <input type="date" className="input-field" />
          </div>
          <button onClick={() => { toast.success(`Learning path assigned to ${assignPathModal.emp}!`); setAssignPathModal({ open: false, emp: "" }); }}
            className="btn-primary w-full text-sm bg-violet-600 hover:bg-violet-700">Assign Path</button>
        </div>
      </Modal>

      <Modal open={createPathModal} onClose={() => setCreatePathModal(false)} title="Create Learning Path">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Path Name</label>
            <input className="input-field" placeholder="e.g. Advanced Data Engineering" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Target Department</label>
            <select className="input-field">
              <option>Engineering</option><option>Data</option><option>DevOps</option><option>Design</option><option>Security</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Duration</label>
            <select className="input-field">
              <option>1 month</option><option>2 months</option><option>3 months</option><option>4 months</option><option>6 months</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
            <textarea className="input-field resize-none min-h-[80px]" placeholder="What skills will employees gain?" />
          </div>
          <button onClick={() => { toast.success("Learning path created!"); setCreatePathModal(false); }} className="btn-primary w-full text-sm bg-violet-600 hover:bg-violet-700">Create Path</button>
        </div>
      </Modal>
    </div>
  );
}
