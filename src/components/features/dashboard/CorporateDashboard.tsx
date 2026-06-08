import { useState, useMemo, useEffect } from "react";
import {
  Users, BookOpen, Award, BarChart3, TrendingUp, Plus, Eye,
  CheckCircle2, AlertTriangle, Download, X, Search, Edit, Trash2,
  Target, Filter, Mail, UploadCloud, ChevronDown, Calendar, Clock, FileText
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
  { id: 1, name: "John Smith", dept: "Engineering", path: "Full Stack Development", progress: 82, certs: 2, status: "on-track", email: "john@globaltech.com" },
  { id: 2, name: "Anna Lee", dept: "Data", path: "Data Science", progress: 64, certs: 1, status: "on-track", email: "anna@globaltech.com" },
  { id: 3, name: "Mike Torres", dept: "DevOps", path: "Cloud Engineering", progress: 31, certs: 0, status: "at-risk", email: "mike@globaltech.com" },
  { id: 4, name: "Priya Singh", dept: "Security", path: "Cybersecurity", progress: 91, certs: 3, status: "completed", email: "priya@globaltech.com" },
  { id: 5, name: "David Kim", dept: "Design", path: "UI/UX Design", progress: 55, certs: 1, status: "on-track", email: "david@globaltech.com" },
];

const INIT_LEARNING_PATHS = [
  { id: 1, title: "Full Stack Development", assignedTo: 32, duration: "6 months", completion: 74, dept: "Engineering", description: "Master frontend, backend, and databases." },
  { id: 2, title: "Data Science", assignedTo: 18, duration: "5 months", completion: 61, dept: "Data", description: "Python, ML, SQL, and data visualization." },
  { id: 3, title: "Cloud Engineering", assignedTo: 24, duration: "4 months", completion: 48, dept: "DevOps", description: "AWS, Kubernetes, CI/CD pipelines." },
  { id: 4, title: "Cybersecurity", assignedTo: 15, duration: "4 months", completion: 85, dept: "Security", description: "Network security, penetration testing." },
  { id: 5, title: "UI/UX Design", assignedTo: 10, duration: "3 months", completion: 55, dept: "Design", description: "Figma, user research, prototyping." },
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

export default function CorporateDashboard({ user, initialTab }: { user: User; initialTab?: string }) {
  const [activeTab, setActiveTab] = useState(initialTab || "overview");
  const [employees, setEmployees] = useState(INIT_EMPLOYEES);
  const [learningPaths, setLearningPaths] = useState(INIT_LEARNING_PATHS);
  const [empSearch, setEmpSearch] = useState("");
  const [empFilter, setEmpFilter] = useState("All");
  const [inviteModal, setInviteModal] = useState(false);
  const [viewEmpModal, setViewEmpModal] = useState<{ open: boolean; emp: typeof INIT_EMPLOYEES[0] | null }>({ open: false, emp: null });
  const [assignPathModal, setAssignPathModal] = useState<{ open: boolean; empName: string; empId?: number; skill?: string }>({ open: false, empName: "", skill: "" });
  const [createPathModal, setCreatePathModal] = useState(false);
  const [viewPathModal, setViewPathModal] = useState<{ open: boolean; path: typeof INIT_LEARNING_PATHS[0] | null }>({ open: false, path: null });
  const [analysisModal, setAnalysisModal] = useState(false);
  const [bulkAssignModal, setBulkAssignModal] = useState(false);
  const [assignExamModal, setAssignExamModal] = useState<{ open: boolean; empName: string; empId: number }>({ open: false, empName: "", empId: 0 });
  const [inviteForm, setInviteForm] = useState({ name: "", email: "", dept: "", pathId: "" });
  const [newPathForm, setNewPathForm] = useState({ title: "", dept: "", duration: "", description: "" });
  const [assignPathForm, setAssignPathForm] = useState({ pathId: "", priority: "", deadline: "" });
  const [bulkAssignForm, setBulkAssignForm] = useState({ certName: "", dept: "All", examDate: "" });

  // Persist learning paths
  useEffect(() => {
    localStorage.setItem("corporate_paths", JSON.stringify(learningPaths));
  }, [learningPaths]);

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

  // Invite employee
  const handleInvite = () => {
    if (!inviteForm.email.trim()) { toast.error("Email is required"); return; }
    const selectedPath = learningPaths.find(p => p.id.toString() === inviteForm.pathId);
    const newEmp = {
      id: Date.now(),
      name: inviteForm.name || inviteForm.email.split("@")[0],
      dept: inviteForm.dept || "General",
      path: selectedPath?.title || "Not assigned",
      progress: 0,
      certs: 0,
      status: "on-track",
      email: inviteForm.email,
    };
    setEmployees(prev => [...prev, newEmp]);
    toast.success(`Invite sent to ${inviteForm.email}! ${newEmp.name} has been added to the team.`);
    setInviteModal(false);
    setInviteForm({ name: "", email: "", dept: "", pathId: "" });
  };

  // Remove employee
  const handleRemoveEmployee = (id: number, name: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    toast.success(`${name} removed from team`);
  };

  // Assign learning path to a specific employee
  const handleAssignPath = () => {
    if (!assignPathModal.empId && assignPathModal.empName !== "All Employees") {
      toast.error("No employee selected");
      return;
    }
    const selectedPath = learningPaths.find(p => p.id.toString() === assignPathForm.pathId);
    if (!selectedPath) { toast.error("Please select a learning path"); return; }

    if (assignPathModal.empId) {
      // Assign to single employee
      setEmployees(prev => prev.map(emp =>
        emp.id === assignPathModal.empId
          ? { ...emp, path: selectedPath.title, progress: emp.progress > 0 ? emp.progress : 0 }
          : emp
      ));
      toast.success(`"${selectedPath.title}" assigned to ${assignPathModal.empName}`);
    } else if (assignPathModal.empName === "All Employees") {
      // Assign to all employees (bulk) – just toast for demo
      toast.success(`"${selectedPath.title}" assigned to all employees! (Simulated)`);
    } else if (assignPathModal.skill) {
      // Assign to department/skill gap – toast
      toast.success(`"${selectedPath.title}" assigned to team addressing "${assignPathModal.skill}"`);
    }
    setAssignPathModal({ open: false, empName: "", skill: "" });
    setAssignPathForm({ pathId: "", priority: "", deadline: "" });
  };

  // Create new learning path
  const handleCreatePath = () => {
    if (!newPathForm.title.trim()) { toast.error("Path name is required"); return; }
    const newPath = {
      id: Date.now(),
      title: newPathForm.title,
      dept: newPathForm.dept || "General",
      duration: newPathForm.duration || "3 months",
      completion: 0,
      assignedTo: 0,
      description: newPathForm.description || "No description provided",
    };
    setLearningPaths(prev => [...prev, newPath]);
    toast.success(`Learning path "${newPathForm.title}" created!`);
    setCreatePathModal(false);
    setNewPathForm({ title: "", dept: "", duration: "", description: "" });
  };

  // Export team data as CSV
  const exportTeamCSV = () => {
    const headers = ["Name", "Department", "Learning Path", "Progress %", "Certifications", "Status", "Email"];
    const rows = filteredEmployees.map(e => [e.name, e.dept, e.path, e.progress, e.certs, e.status, e.email]);
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "team_report.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Team data exported as CSV");
  };

  const exportCertCSV = () => {
    const headers = ["Employee", "Department", "Certifications Count", "Latest Cert"];
    const rows = employees.map(e => [e.name, e.dept, e.certs, e.certs > 0 ? "May 2026" : "—"]);
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "certifications_report.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Certification report exported");
  };

  const exportAnalyticsCSV = () => {
    const headers = ["Department", "Completion %"];
    const rows = skillProgressData.map(d => [d.dept, d.completion]);
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analytics_report.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Analytics exported");
  };

  // Send nudge (simulated email)
  const sendNudge = (empName: string) => {
    toast.success(`Nudge sent to ${empName}! A reminder email has been dispatched.`);
  };

  // Assign exam (simulated)
  const assignExam = () => {
    toast.success(`Certification exam assigned to ${assignExamModal.empName}. They will receive an email with details.`);
    setAssignExamModal({ open: false, empName: "", empId: 0 });
  };

  // Bulk assign certifications (simulated)
  const handleBulkAssign = () => {
    toast.success(`Bulk certification "${bulkAssignForm.certName}" assigned to ${bulkAssignForm.dept === "All" ? "all departments" : bulkAssignForm.dept} (Exam date: ${bulkAssignForm.examDate || "TBD"}).`);
    setBulkAssignModal(false);
    setBulkAssignForm({ certName: "", dept: "All", examDate: "" });
  };

  // Generate report (simulated download)
  const generateReport = (title: string) => {
    toast.success(`${title} is being generated. Download will start shortly.`);
    // Simulate file download
    setTimeout(() => {
      const blob = new Blob(["Dummy report content"], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s/g, "_")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    }, 1000);
  };

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-6 pb-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={cn("flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeTab === id ? "bg-primary text-white shadow-lg shadow-violet-600/25" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Enterprise Dashboard </h1>
              <p className="text-sm text-muted-foreground">GlobalTech Corp · Q2 2026 Learning Report</p>
            </div>
            <button onClick={() => setAssignPathModal({ open: true, empName: "All Employees" })} className="btn-primary text-sm bg-primary hover:bg-violet-700 shadow-violet-600/25">
              Assign Training
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Enrolled Employees", value: String(employees.length), icon: Users, color: "text-violet-600 bg-primary/10", tab: "team", change: "+12 this month" },
              { label: "Avg Completion", value: "74%", icon: CheckCircle2, color: "text-accent bg-accent/10", tab: "analytics", change: "↑ 9% vs last Q" },
              { label: "Certs Issued", value: String(employees.reduce((a, e) => a + e.certs, 0)), icon: Award, color: "text-yellow-600 bg-yellow-600/10", tab: "certs", change: "This quarter" },
              { label: "Active Paths", value: String(learningPaths.length), icon: BookOpen, color: "text-primary bg-primary/10", tab: "paths", change: "Across 5 depts" },
            ].map(({ label, value, icon: Icon, color, tab, change }) => (
              <button key={label} onClick={() => setActiveTab(tab)}
                className="bg-card border border-border rounded-2xl p-4 hover:border-violet-600/30 transition-colors text-left">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", color)}><Icon className="w-4 h-4" /></div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xs text-accent dark:text-emerald-400 mt-1 font-medium">{change}</p>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="font-semibold text-foreground">Skill Gap Alerts</h2>
              <button onClick={() => setAnalysisModal(true)} className="text-sm text-violet-600 hover:underline">Full Analysis</button>
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
                  <button onClick={() => setAssignPathModal({ open: true, empName: `${g.dept} team`, skill: g.skill })} className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-violet-700 transition-colors flex-shrink-0">
                    Assign Path
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Team Tab */}
      {activeTab === "team" && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h1 className="text-2xl font-bold text-foreground">Team Management</h1>
            <div className="flex gap-2">
              <button onClick={exportTeamCSV} className="btn-secondary text-sm flex items-center gap-1.5"><Download className="w-4 h-4" />Export</button>
              <button onClick={() => setInviteModal(true)} className="btn-primary text-sm bg-primary hover:bg-violet-700"><Plus className="w-4 h-4 mr-1.5" />Invite Employee</button>
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
                            <div className={cn("h-full rounded-full", e.progress > 70 ? "bg-accent" : e.progress > 40 ? "bg-yellow-500" : "bg-red-500")} style={{ width: `${e.progress}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{e.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-center text-muted-foreground">{e.certs}</td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", {
                          "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400": e.status === "on-track",
                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400": e.status === "at-risk",
                          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-primary/80": e.status === "completed",
                        })}>{e.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setViewEmpModal({ open: true, emp: e })} className="p-1.5 hover:bg-muted rounded transition-colors" title="View details"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                          <button onClick={() => setAssignPathModal({ open: true, empName: e.name, empId: e.id })} className="p-1.5 hover:bg-violet-50 dark:hover:bg-violet-900/20 rounded transition-colors" title="Assign path">
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

      {/* Learning Paths Tab */}
      {activeTab === "paths" && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h1 className="text-2xl font-bold text-foreground">Learning Paths</h1>
            <button onClick={() => setCreatePathModal(true)} className="btn-primary text-sm bg-primary hover:bg-violet-700">
              <Plus className="w-4 h-4 mr-1.5" />Create Path
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {learningPaths.map((path) => (
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
                    <div className={cn("h-full rounded-full", path.completion >= 70 ? "bg-accent" : path.completion >= 40 ? "bg-violet-500" : "bg-red-500")} style={{ width: `${path.completion}%` }} />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setViewPathModal({ open: true, path })} className="flex-1 py-1.5 border border-border rounded-lg text-xs hover:bg-muted transition-colors text-foreground">View Details</button>
                  <button onClick={() => setAssignPathModal({ open: true, empName: "Selected Employees" })} className="flex-1 py-1.5 bg-primary text-white rounded-lg text-xs hover:bg-violet-700 transition-colors">Assign</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications Tab */}
      {activeTab === "certs" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-foreground">Team Certifications</h1>
            <button onClick={exportCertCSV} className="btn-secondary text-sm flex items-center gap-1.5"><Download className="w-4 h-4" />Export</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Issued", value: String(employees.reduce((a, e) => a + e.certs, 0)), color: "text-yellow-600" },
              { label: "This Quarter", value: "23", color: "text-violet-600" },
              { label: "Cert Coverage", value: `${Math.round((employees.filter(e => e.certs > 0).length / employees.length) * 100)}%`, color: "text-accent" },
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
              <button onClick={() => setBulkAssignModal(true)} className="text-xs text-violet-600 hover:underline">Bulk Assign</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>{["Employee", "Department", "Certifications", "Latest Cert", "Actions"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>)}</tr></thead>
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
                        <button onClick={() => setAssignExamModal({ open: true, empName: e.name, empId: e.id })} className="px-2 py-1 bg-primary text-white text-xs rounded-lg hover:bg-violet-700 transition-colors">Assign Exam</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-foreground">Learning Analytics</h1>
            <button onClick={exportAnalyticsCSV} className="btn-secondary text-sm flex items-center gap-1.5"><Download className="w-4 h-4" />Export</button>
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
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-violet-600 font-bold text-xs flex-shrink-0">
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

      {/* Reports Tab */}
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
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Download className="w-5 h-5 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">{r.title}</p>
                  <p className="text-xs text-muted-foreground">{r.desc}</p>
                  <p className="text-xs text-violet-600 dark:text-violet-400 mt-0.5">{r.format}</p>
                </div>
                <button onClick={() => generateReport(r.title)} className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-violet-700 transition-colors flex-shrink-0">
                  Generate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------- MODALS ---------- */}

      {/* Invite Employee Modal */}
      <Modal open={inviteModal} onClose={() => setInviteModal(false)} title="Invite Employee">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label><input className="input-field" placeholder="John Smith" value={inviteForm.name} onChange={e => setInviteForm(p => ({ ...p, name: e.target.value }))} /></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Email Address *</label><input type="email" className="input-field" placeholder="john@company.com" value={inviteForm.email} onChange={e => setInviteForm(p => ({ ...p, email: e.target.value }))} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Department</label><select className="input-field" value={inviteForm.dept} onChange={e => setInviteForm(p => ({ ...p, dept: e.target.value }))}><option value="">Select...</option><option>Engineering</option><option>Data</option><option>DevOps</option><option>Design</option><option>Security</option></select></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Assign Learning Path</label><select className="input-field" value={inviteForm.pathId} onChange={e => setInviteForm(p => ({ ...p, pathId: e.target.value }))}><option value="">None</option>{learningPaths.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select></div>
          </div>
          <div className="flex gap-3"><button onClick={() => setInviteModal(false)} className="flex-1 btn-secondary text-sm">Cancel</button><button onClick={handleInvite} className="flex-1 btn-primary text-sm bg-primary hover:bg-violet-700">Send Invite</button></div>
        </div>
      </Modal>

      {/* View Employee Modal */}
      <Modal open={viewEmpModal.open} onClose={() => setViewEmpModal({ open: false, emp: null })} title="Employee Details">
        {viewEmpModal.emp && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-violet-600 font-bold text-xl">
                {viewEmpModal.emp.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div><p className="font-bold text-foreground">{viewEmpModal.emp.name}</p><p className="text-sm text-muted-foreground">{viewEmpModal.emp.dept} · {viewEmpModal.emp.email}</p></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-muted rounded-xl p-3"><p className="text-xs text-muted-foreground">Learning Path</p><p className="text-sm font-medium text-foreground mt-0.5">{viewEmpModal.emp.path}</p></div>
              <div className="bg-muted rounded-xl p-3"><p className="text-xs text-muted-foreground">Progress</p><p className="text-sm font-bold text-foreground mt-0.5">{viewEmpModal.emp.progress}%</p></div>
              <div className="bg-muted rounded-xl p-3"><p className="text-xs text-muted-foreground">Certifications</p><p className="text-sm font-medium text-foreground mt-0.5">{viewEmpModal.emp.certs}</p></div>
              <div className="bg-muted rounded-xl p-3"><p className="text-xs text-muted-foreground">Status</p><p className="text-sm font-medium text-foreground mt-0.5 capitalize">{viewEmpModal.emp.status}</p></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { sendNudge(viewEmpModal.emp!.name); setViewEmpModal({ open: false, emp: null }); }} className="flex-1 btn-primary text-sm bg-primary hover:bg-violet-700">Send Nudge</button>
              <button onClick={() => { setAssignPathModal({ open: true, empName: viewEmpModal.emp!.name, empId: viewEmpModal.emp!.id }); setViewEmpModal({ open: false, emp: null }); }} className="flex-1 btn-secondary text-sm">Reassign Path</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Assign Path Modal */}
      <Modal open={assignPathModal.open} onClose={() => setAssignPathModal({ open: false, empName: "", skill: "" })} title="Assign Learning Path">
        <div className="space-y-4">
          <div className="p-3 bg-primary/10 border border-violet-600/20 rounded-xl">
            <p className="text-sm text-violet-600 dark:text-violet-400">Assigning to: <strong>{assignPathModal.empName}</strong></p>
            {assignPathModal.skill && <p className="text-xs text-violet-500 mt-0.5">Addressing gap: {assignPathModal.skill}</p>}
          </div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Learning Path</label><select className="input-field" value={assignPathForm.pathId} onChange={e => setAssignPathForm({ ...assignPathForm, pathId: e.target.value })}><option value="">Select a path</option>{learningPaths.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Priority</label><select className="input-field" value={assignPathForm.priority} onChange={e => setAssignPathForm({ ...assignPathForm, priority: e.target.value })}><option>Normal</option><option>High Priority</option><option>Mandatory</option></select></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Deadline</label><input type="date" className="input-field" value={assignPathForm.deadline} onChange={e => setAssignPathForm({ ...assignPathForm, deadline: e.target.value })} /></div>
          <button onClick={handleAssignPath} className="btn-primary w-full text-sm bg-primary hover:bg-violet-700">Assign Path</button>
        </div>
      </Modal>

      {/* Create Learning Path Modal */}
      <Modal open={createPathModal} onClose={() => setCreatePathModal(false)} title="Create Learning Path">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Path Name *</label><input className="input-field" placeholder="e.g. Advanced Data Engineering" value={newPathForm.title} onChange={e => setNewPathForm(p => ({ ...p, title: e.target.value }))} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label className="block text-sm font-medium text-foreground mb-1.5">Target Department</label><select className="input-field" value={newPathForm.dept} onChange={e => setNewPathForm(p => ({ ...p, dept: e.target.value }))}><option>Engineering</option><option>Data</option><option>DevOps</option><option>Design</option><option>Security</option></select></div><div><label className="block text-sm font-medium text-foreground mb-1.5">Duration</label><select className="input-field" value={newPathForm.duration} onChange={e => setNewPathForm(p => ({ ...p, duration: e.target.value }))}><option>1 month</option><option>2 months</option><option>3 months</option><option>4 months</option><option>6 months</option></select></div></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Description</label><textarea className="input-field resize-none min-h-[80px]" placeholder="What skills will employees gain?" value={newPathForm.description} onChange={e => setNewPathForm(p => ({ ...p, description: e.target.value }))} /></div>
          <button onClick={handleCreatePath} className="btn-primary w-full text-sm bg-primary hover:bg-violet-700">Create Path</button>
        </div>
      </Modal>

      {/* View Path Details Modal */}
      <Modal open={viewPathModal.open} onClose={() => setViewPathModal({ open: false, path: null })} title="Path Details">
        {viewPathModal.path && (
          <div className="space-y-4">
            <div><h3 className="text-xl font-bold text-foreground">{viewPathModal.path.title}</h3><p className="text-sm text-muted-foreground">{viewPathModal.path.dept} · {viewPathModal.path.duration}</p></div>
            <p className="text-sm text-foreground">{viewPathModal.path.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-muted rounded-xl p-3"><p className="text-xs text-muted-foreground">Enrolled</p><p className="text-lg font-bold text-foreground">{viewPathModal.path.assignedTo}</p></div>
              <div className="bg-muted rounded-xl p-3"><p className="text-xs text-muted-foreground">Completion Rate</p><p className="text-lg font-bold text-foreground">{viewPathModal.path.completion}%</p></div>
            </div>
            <button onClick={() => setAssignPathModal({ open: true, empName: "Selected Employees" })} className="btn-primary w-full text-sm bg-primary hover:bg-violet-700">Assign to Employees</button>
          </div>
        )}
      </Modal>

      {/* Full Analysis Modal */}
      <Modal open={analysisModal} onClose={() => setAnalysisModal(false)} title="Detailed Skill Gap Analysis">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Based on latest assessment data, the following department-level gaps were identified:</p>
          <div className="space-y-2">
            <div className="p-3 border border-red-200 rounded-xl"><p className="font-medium">DevOps: Kubernetes & Container Orchestration</p><p className="text-xs text-muted-foreground">46% proficiency gap · 12 employees affected</p></div>
            <div className="p-3 border border-yellow-200 rounded-xl"><p className="font-medium">Data: Advanced Python for Data Science</p><p className="text-xs text-muted-foreground">35% proficiency gap · 8 employees affected</p></div>
            <div className="p-3 border border-yellow-200 rounded-xl"><p className="font-medium">Engineering: Security Best Practices (OWASP)</p><p className="text-xs text-muted-foreground">29% proficiency gap · 15 employees affected</p></div>
          </div>
          <button onClick={() => setAnalysisModal(false)} className="btn-secondary w-full text-sm">Close</button>
        </div>
      </Modal>

      {/* Bulk Assign Certifications Modal */}
      <Modal open={bulkAssignModal} onClose={() => setBulkAssignModal(false)} title="Bulk Assign Certifications">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Certification Name</label><input className="input-field" placeholder="e.g., AWS Certified Developer" value={bulkAssignForm.certName} onChange={e => setBulkAssignForm(p => ({ ...p, certName: e.target.value }))} /></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Target Department</label><select className="input-field" value={bulkAssignForm.dept} onChange={e => setBulkAssignForm(p => ({ ...p, dept: e.target.value }))}><option value="All">All Departments</option><option>Engineering</option><option>Data</option><option>DevOps</option><option>Design</option><option>Security</option></select></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Exam Date</label><input type="date" className="input-field" value={bulkAssignForm.examDate} onChange={e => setBulkAssignForm(p => ({ ...p, examDate: e.target.value }))} /></div>
          <button onClick={handleBulkAssign} className="btn-primary w-full text-sm bg-primary hover:bg-violet-700">Assign to {bulkAssignForm.dept === "All" ? "All Employees" : bulkAssignForm.dept}</button>
        </div>
      </Modal>

      {/* Assign Exam Modal */}
      <Modal open={assignExamModal.open} onClose={() => setAssignExamModal({ open: false, empName: "", empId: 0 })} title="Assign Certification Exam">
        <div className="space-y-4">
          <div className="p-3 bg-primary/10 rounded-xl"><p className="text-sm"><strong>Employee:</strong> {assignExamModal.empName}</p></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Certification</label><select className="input-field"><option>AWS Solutions Architect</option><option>Certified Kubernetes Administrator</option><option>Google Professional Data Engineer</option><option>CompTIA Security+</option></select></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Exam Date</label><input type="date" className="input-field" /></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Notes</label><textarea className="input-field resize-none" placeholder="Any special instructions..." /></div>
          <button onClick={assignExam} className="btn-primary w-full text-sm bg-primary hover:bg-violet-700">Assign Exam</button>
        </div>
      </Modal>
    </div>
  );
}