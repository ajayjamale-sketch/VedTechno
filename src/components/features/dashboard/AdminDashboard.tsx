import { useState, useMemo } from "react";
import {
  Users, BookOpen, Award, BarChart3, Settings, Shield, TrendingUp, DollarSign,
  MessageSquare, AlertTriangle, CheckCircle2, Eye, Edit, Trash2, Plus,
  Flag, Clock, Server, ArrowUp, Download, Search, X, Filter, Ban, Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, CartesianGrid, LineChart, Line, AreaChart, Area } from "recharts";
import { toast } from "sonner";
import type { User } from "@/types";

const revenueData = [
  { month: "Jan", revenue: 48000 }, { month: "Feb", revenue: 52000 }, { month: "Mar", revenue: 61000 },
  { month: "Apr", revenue: 74000 }, { month: "May", revenue: 89000 }, { month: "Jun", revenue: 104000 },
];
const userGrowthData = [
  { month: "Jan", users: 18000 }, { month: "Feb", users: 21000 }, { month: "Mar", users: 25000 },
  { month: "Apr", users: 29000 }, { month: "May", users: 234000 }, { month: "Jun", users: 250000 },
];

const INIT_USERS = [
  { id: 1, name: "Alex Johnson", email: "alex@example.com", role: "student", joined: "Jan 2025", courses: 7, status: "active" },
  { id: 2, name: "Dr. Ravi Kumar", email: "ravi@example.com", role: "trainer", joined: "Mar 2024", courses: 3, status: "active" },
  { id: 3, name: "Sarah Mitchell", email: "sarah@example.com", role: "recruiter", joined: "Feb 2025", courses: 0, status: "active" },
  { id: 4, name: "James Anderson", email: "james@corp.com", role: "corporate", joined: "Nov 2024", courses: 0, status: "active" },
  { id: 5, name: "spam_user_99", email: "spam@fake.com", role: "student", joined: "Jun 2026", courses: 0, status: "banned" },
  { id: 6, name: "Zara Khan", email: "zara@neuraledge.io", role: "startup", joined: "Mar 2025", courses: 4, status: "active" },
];

const MODERATION_ITEMS = [
  { id: 1, type: "Course", title: "Advanced React Patterns", author: "Maya Patel", reported: "Plagiarism suspected", time: "2h ago", severity: "high" },
  { id: 2, type: "Comment", title: "Forum post in React community", author: "unknown_user", reported: "Spam/promotional", time: "5h ago", severity: "medium" },
  { id: 3, type: "Course", title: "Python for Beginners 2026", author: "New Instructor", reported: "Incomplete content", time: "1 day ago", severity: "low" },
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

export default function AdminDashboard({ user }: { user: User }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState(INIT_USERS);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("All");
  const [viewUserModal, setViewUserModal] = useState<{ open: boolean; user: typeof INIT_USERS[0] | null }>({ open: false, user: null });
  const [editUserModal, setEditUserModal] = useState<{ open: boolean; user: typeof INIT_USERS[0] | null }>({ open: false, user: null });
  const [deleteUserConfirm, setDeleteUserConfirm] = useState<{ open: boolean; id: number; name: string }>({ open: false, id: 0, name: "" });
  const [inviteUserModal, setInviteUserModal] = useState(false);
  const [platformSettingsModal, setPlatformSettingsModal] = useState(false);
  const [moderationItems, setModerationItems] = useState(MODERATION_ITEMS);
  const [courseFilter, setCourseFilter] = useState("All");

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "revenue", label: "Revenue", icon: DollarSign },
    { id: "moderation", label: "Moderation", icon: Flag },
    { id: "platform", label: "Platform", icon: Server },
  ];

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchRole = userRoleFilter === "All" || u.role === userRoleFilter || (userRoleFilter === "banned" && u.status === "banned");
      return matchSearch && matchRole;
    });
  }, [users, userSearch, userRoleFilter]);

  const handleToggleBan = (id: number, name: string, currentStatus: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: currentStatus === "banned" ? "active" : "banned" } : u));
    toast.success(currentStatus === "banned" ? `${name} has been unbanned` : `${name} has been banned`);
  };

  const handleDeleteUser = () => {
    setUsers(prev => prev.filter(u => u.id !== deleteUserConfirm.id));
    toast.success(`${deleteUserConfirm.name} deleted from platform`);
    setDeleteUserConfirm({ open: false, id: 0, name: "" });
  };

  const handleApproveCourse = (title: string) => {
    toast.success(`"${title}" approved and published!`);
  };

  const handleRejectModItem = (id: number, title: string) => {
    setModerationItems(prev => prev.filter(m => m.id !== id));
    toast.success(`"${title}" dismissed`);
  };

  const ADMIN_COURSES = [
    { id: 1, title: "Full Stack Web Development Bootcamp", instructor: "Alex Johnson", students: 12450, status: "published", revenue: 124500, rating: 4.9 },
    { id: 2, title: "Machine Learning with Python", instructor: "Dr. Sarah Chen", students: 8920, status: "published", revenue: 89200, rating: 4.8 },
    { id: 3, title: "Cybersecurity Fundamentals", instructor: "Emma Wilson", students: 9450, status: "published", revenue: 55755, rating: 4.8 },
    { id: 4, title: "Advanced React Patterns", instructor: "Maya Patel", students: 0, status: "under-review", revenue: 0, rating: 0 },
    { id: 5, title: "Python for Beginners 2026", instructor: "New Instructor", students: 0, status: "under-review", revenue: 0, rating: 0 },
  ];

  const filteredCourses = useMemo(() => {
    if (courseFilter === "All") return ADMIN_COURSES;
    return ADMIN_COURSES.filter(c => c.status === courseFilter);
  }, [courseFilter]);

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-6 pb-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={cn("flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeTab === id ? "bg-red-600 text-white shadow-lg shadow-red-600/25" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
            <Icon className="w-3.5 h-3.5" />{label}
            {id === "moderation" && moderationItems.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center ml-0.5">{moderationItems.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Control Panel ⚙️</h1>
              <p className="text-sm text-muted-foreground">Platform health: <span className="text-emerald-600 font-medium">All systems operational</span></p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toast.success("Platform report downloaded!")} className="btn-secondary text-sm flex items-center gap-1.5"><Download className="w-4 h-4" />Export Report</button>
              <button onClick={() => setPlatformSettingsModal(true)} className="btn-primary text-sm bg-red-600 hover:bg-red-700 shadow-red-600/25">
                <Settings className="w-4 h-4 mr-1.5" />Settings
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Users", value: String(users.length > 6 ? `${users.length - 6 + 250421}` : "250,421"), icon: Users, color: "text-red-600 bg-red-600/10", change: "+1,240 today", up: true, tab: "users" },
              { label: "Active Courses", value: "1,247", icon: BookOpen, color: "text-blue-600 bg-blue-600/10", change: "+8 this week", up: true, tab: "courses" },
              { label: "Monthly Revenue", value: "$104K", icon: DollarSign, color: "text-emerald-600 bg-emerald-600/10", change: "+17% vs last mo", up: true, tab: "revenue" },
              { label: "Pending Reviews", value: String(moderationItems.length), icon: Flag, color: "text-orange-600 bg-orange-600/10", change: moderationItems.length > 0 ? "Needs attention" : "All clear", up: moderationItems.length === 0, tab: "moderation" },
            ].map(({ label, value, icon: Icon, color, change, up, tab }) => (
              <button key={label} onClick={() => setActiveTab(tab)}
                className="bg-card border border-border rounded-2xl p-4 hover:border-red-600/30 transition-colors text-left">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", color)}><Icon className="w-4 h-4" /></div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={cn("text-xs mt-1 font-medium flex items-center gap-0.5", up ? "text-emerald-600 dark:text-emerald-400" : "text-orange-600 dark:text-orange-400")}>
                  {up ? <ArrowUp className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}{change}
                </p>
              </button>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Monthly Revenue</h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v: number) => [`$${(v / 1000).toFixed(0)}K`, "Revenue"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                    <Bar dataKey="revenue" fill="#DC2626" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">User Growth</h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowthData}>
                    <defs>
                      <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#DC2626" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                    <Area type="monotone" dataKey="users" stroke="#DC2626" strokeWidth={2} fill="url(#redGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground text-sm">Platform Status</h3>
                <span className="text-xs text-emerald-600 font-medium">All OK</span>
              </div>
              <div className="space-y-3">
                {[
                  { service: "Learning API", latency: "42ms" },
                  { service: "Coding Lab", latency: "89ms" },
                  { service: "Auth Service", latency: "21ms" },
                  { service: "Storage CDN", latency: "134ms" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{s.service}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{s.latency}</span>
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground text-sm">Recent Admin Actions</h3>
                <button onClick={() => toast.info("Loading full audit log...")} className="text-xs text-red-600 hover:underline">View Audit Log</button>
              </div>
              <div className="space-y-2">
                {[
                  { action: "Approved course", target: "Advanced Kubernetes — by Dr. Ravi", time: "5m ago", type: "success" },
                  { action: "Banned user", target: "spam_account_123 (TOS violation)", time: "1h ago", type: "danger" },
                  { action: "Published blog", target: "10 Skills Developers Need in 2026", time: "3h ago", type: "info" },
                  { action: "Updated pricing", target: "Enterprise plan: $99 → $89/mo", time: "Yesterday", type: "warning" },
                ].map((a, i) => (
                  <button key={i} onClick={() => toast.info(a.target)} className="w-full flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors text-left">
                    <div className={cn("w-2 h-2 rounded-full flex-shrink-0", { "bg-emerald-500": a.type === "success", "bg-red-500": a.type === "danger", "bg-blue-500": a.type === "info", "bg-yellow-500": a.type === "warning" })} />
                    <span className="text-xs text-muted-foreground">{a.action}: </span>
                    <span className="text-xs text-foreground font-medium flex-1 truncate">{a.target}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{a.time}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Users ── */}
      {activeTab === "users" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">User Management</h1>
            <div className="flex gap-2">
              <button onClick={() => toast.success("User data exported!")} className="btn-secondary text-sm flex items-center gap-1.5"><Download className="w-4 h-4" />Export</button>
              <button onClick={() => setInviteUserModal(true)} className="btn-primary text-sm bg-red-600 hover:bg-red-700"><Plus className="w-4 h-4 mr-1.5" />Invite User</button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="input-field pl-9 py-2 text-sm" placeholder="Search by name or email..."
                value={userSearch} onChange={e => setUserSearch(e.target.value)} />
              {userSearch && <button onClick={() => setUserSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
            </div>
            <select className="input-field py-2 text-sm w-auto" value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)}>
              <option value="All">All Roles</option>
              <option value="student">Student</option>
              <option value="trainer">Trainer</option>
              <option value="recruiter">Recruiter</option>
              <option value="corporate">Corporate</option>
              <option value="startup">Startup</option>
              <option value="admin">Admin</option>
              <option value="banned">Banned</option>
            </select>
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-3 border-b border-border text-xs text-muted-foreground">{filteredUsers.length} users shown</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>{["User", "Role", "Joined", "Courses", "Status", "Actions"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No users match your search</td></tr>
                  ) : filteredUsers.map((u) => (
                    <tr key={u.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground text-sm">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </td>
                      <td className="px-4 py-3"><span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 capitalize">{u.role}</span></td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{u.joined}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground text-center">{u.courses}</td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", u.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400")}>{u.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setViewUserModal({ open: true, user: u })} className="p-1.5 hover:bg-muted rounded transition-colors" title="View"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                          <button onClick={() => setEditUserModal({ open: true, user: u })} className="p-1.5 hover:bg-muted rounded transition-colors" title="Edit"><Edit className="w-3.5 h-3.5 text-muted-foreground" /></button>
                          <button onClick={() => handleToggleBan(u.id, u.name, u.status)} className={cn("p-1.5 rounded transition-colors", u.status === "banned" ? "hover:bg-emerald-50 dark:hover:bg-emerald-900/20" : "hover:bg-orange-50 dark:hover:bg-orange-900/20")} title={u.status === "banned" ? "Unban" : "Ban"}>
                            <Ban className={cn("w-3.5 h-3.5", u.status === "banned" ? "text-emerald-500" : "text-orange-500")} />
                          </button>
                          <button onClick={() => setDeleteUserConfirm({ open: true, id: u.id, name: u.name })} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" title="Delete">
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

      {/* ── Courses ── */}
      {activeTab === "courses" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Course Management</h1>
            <div className="flex gap-2">
              {["All", "published", "under-review"].map(f => (
                <button key={f} onClick={() => setCourseFilter(f)}
                  className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all", courseFilter === f ? "bg-red-600 text-white border-red-600" : "border-border text-muted-foreground hover:bg-muted")}>
                  {f === "All" ? "All" : f === "published" ? "Published" : "Under Review"}
                  {f === "under-review" && <span className="ml-1 px-1.5 bg-orange-500 text-white rounded-full text-xs">{ADMIN_COURSES.filter(c => c.status === "under-review").length}</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {filteredCourses.map((c) => (
              <div key={c.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-medium text-foreground text-sm">{c.title}</p>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", {
                      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400": c.status === "published",
                      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400": c.status === "under-review",
                    })}>{c.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">By {c.instructor} · {c.students.toLocaleString()} students {c.rating > 0 ? `· ★ ${c.rating}` : ""}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">{c.revenue > 0 ? `$${c.revenue.toLocaleString()} total revenue` : "Pending review"}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {c.status === "under-review" && (
                    <button onClick={() => handleApproveCourse(c.title)} className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors">Approve</button>
                  )}
                  <button onClick={() => toast.info(`Viewing ${c.title}`)} className="px-3 py-1.5 border border-border text-xs font-medium rounded-lg hover:bg-muted transition-colors text-foreground">View</button>
                  <button onClick={() => toast.error(`${c.title} flagged for review`)} className="p-1.5 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"><Flag className="w-3.5 h-3.5 text-red-500" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Revenue ── */}
      {activeTab === "revenue" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Revenue Analytics</h1>
            <button onClick={() => toast.success("Revenue report downloaded!")} className="btn-secondary text-sm flex items-center gap-1.5"><Download className="w-4 h-4" />Download Report</button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Monthly Revenue", value: "$104K", color: "text-red-600" },
              { label: "Annual Run Rate", value: "$1.2M", color: "text-emerald-600" },
              { label: "Avg Order Value", value: "$29.50", color: "text-blue-600" },
              { label: "Churn Rate", value: "2.8%", color: "text-orange-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-card border border-border rounded-2xl p-4 text-center">
                <p className={cn("text-2xl font-bold", color)}>{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Monthly Revenue</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v: number) => [`$${(v / 1000).toFixed(0)}K`, "Revenue"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                    <Bar dataKey="revenue" fill="#DC2626" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Revenue Breakdown</h3>
              <div className="space-y-3">
                {[
                  { plan: "Pro Plan", revenue: "$62,400", pct: 60, color: "bg-red-500" },
                  { plan: "Enterprise", revenue: "$31,200", pct: 30, color: "bg-orange-500" },
                  { plan: "Course Sales", revenue: "$10,400", pct: 10, color: "bg-yellow-500" },
                ].map(r => (
                  <div key={r.plan}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground font-medium">{r.plan}</span>
                      <span className="text-muted-foreground">{r.revenue}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full"><div className={cn("h-full rounded-full", r.color)} style={{ width: `${r.pct}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Moderation ── */}
      {activeTab === "moderation" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">Content Moderation</h1>
            <span className={cn("text-sm font-medium px-3 py-1.5 rounded-xl", moderationItems.length > 0 ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400")}>
              {moderationItems.length} pending {moderationItems.length === 1 ? "item" : "items"}
            </span>
          </div>
          {moderationItems.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
              <p className="font-semibold text-foreground">All clear!</p>
              <p className="text-muted-foreground text-sm">No items pending moderation review.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {moderationItems.map((item) => (
                <div key={item.id} className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className={cn("w-5 h-5 flex-shrink-0 mt-0.5", { "text-red-500": item.severity === "high", "text-yellow-500": item.severity === "medium", "text-blue-500": item.severity === "low" })} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{item.type}</span>
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", {
                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400": item.severity === "high",
                          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400": item.severity === "medium",
                          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400": item.severity === "low",
                        })}>{item.severity} priority</span>
                      </div>
                      <p className="font-semibold text-foreground text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground">By {item.author} · {item.time}</p>
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Reported: {item.reported}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => toast.info(`Reviewing: ${item.title}`)} className="px-3 py-1.5 border border-border text-xs font-medium rounded-lg hover:bg-muted transition-colors text-foreground">Review</button>
                      <button onClick={() => { handleRejectModItem(item.id, item.title); }} className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-medium rounded-lg hover:bg-emerald-700 transition-colors">Approve</button>
                      <button onClick={() => { handleRejectModItem(item.id, item.title); toast.error(`Content removed: ${item.title}`); }} className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Platform ── */}
      {activeTab === "platform" && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-foreground">Platform Settings</h1>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { title: "Feature Flags", desc: "Enable or disable platform features", action: "Configure" },
              { title: "Email Templates", desc: "Customize system email notifications", action: "Edit Templates" },
              { title: "API Keys", desc: "Manage integrations and API access", action: "Manage Keys" },
              { title: "Webhooks", desc: "Configure event-based webhooks", action: "View Webhooks" },
              { title: "Maintenance Mode", desc: "Put platform in maintenance mode", action: "Toggle" },
              { title: "Backup & Restore", desc: "Manage data backups and restoration", action: "View Backups" },
            ].map((s, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center flex-shrink-0">
                  <Settings className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
                <button onClick={() => toast.info(`Opening ${s.title}...`)} className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors flex-shrink-0">{s.action}</button>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">System Health</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { service: "Learning API", status: "operational", latency: "42ms", uptime: "99.98%" },
                { service: "Coding Lab", status: "operational", latency: "89ms", uptime: "99.95%" },
                { service: "Auth Service", status: "operational", latency: "21ms", uptime: "100%" },
                { service: "Storage CDN", status: "operational", latency: "134ms", uptime: "99.99%" },
                { service: "WebSocket Service", status: "operational", latency: "56ms", uptime: "99.97%" },
                { service: "AI Engine", status: "operational", latency: "312ms", uptime: "99.91%" },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-foreground">{s.service}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{s.latency} · {s.uptime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      <Modal open={viewUserModal.open} onClose={() => setViewUserModal({ open: false, user: null })} title="User Details">
        {viewUserModal.user && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-600 font-bold text-xl">
                {viewUserModal.user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="font-bold text-foreground">{viewUserModal.user.name}</p>
                <p className="text-sm text-muted-foreground">{viewUserModal.user.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Role", value: viewUserModal.user.role },
                { label: "Status", value: viewUserModal.user.status },
                { label: "Joined", value: viewUserModal.user.joined },
                { label: "Courses", value: String(viewUserModal.user.courses) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-muted rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium text-foreground capitalize mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { toast.success(`Message sent to ${viewUserModal.user!.name}!`); setViewUserModal({ open: false, user: null }); }} className="flex-1 btn-primary text-sm bg-red-600 hover:bg-red-700">Send Message</button>
              <button onClick={() => setViewUserModal({ open: false, user: null })} className="flex-1 btn-secondary text-sm">Close</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={editUserModal.open} onClose={() => setEditUserModal({ open: false, user: null })} title="Edit User">
        {editUserModal.user && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Display Name</label>
              <input className="input-field" defaultValue={editUserModal.user.name} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input type="email" className="input-field" defaultValue={editUserModal.user.email} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Role</label>
              <select className="input-field" defaultValue={editUserModal.user.role}>
                <option value="student">Student</option>
                <option value="developer">Developer</option>
                <option value="trainer">Trainer</option>
                <option value="recruiter">Recruiter</option>
                <option value="corporate">Corporate</option>
                <option value="startup">Startup</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditUserModal({ open: false, user: null })} className="flex-1 btn-secondary text-sm">Cancel</button>
              <button onClick={() => { toast.success(`${editUserModal.user!.name} updated!`); setEditUserModal({ open: false, user: null }); }} className="flex-1 btn-primary text-sm bg-red-600 hover:bg-red-700">Save Changes</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={deleteUserConfirm.open} onClose={() => setDeleteUserConfirm({ open: false, id: 0, name: "" })} title="Delete User Account">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Delete "{deleteUserConfirm.name}"?</p>
            <p className="text-sm text-muted-foreground mt-1">This will permanently delete the account and all associated data. This cannot be undone.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setDeleteUserConfirm({ open: false, id: 0, name: "" })} className="flex-1 btn-secondary text-sm">Cancel</button>
            <button onClick={handleDeleteUser} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors">Delete Permanently</button>
          </div>
        </div>
      </Modal>

      <Modal open={inviteUserModal} onClose={() => setInviteUserModal(false)} title="Invite New User">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
            <input type="email" className="input-field" placeholder="user@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Assign Role</label>
            <select className="input-field">
              <option>Student</option><option>Trainer</option><option>Recruiter</option><option>Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Personal Message (optional)</label>
            <textarea className="input-field resize-none min-h-[80px]" placeholder="Welcome to VedTechno!" />
          </div>
          <button onClick={() => { toast.success("Invitation sent!"); setInviteUserModal(false); }} className="btn-primary w-full text-sm bg-red-600 hover:bg-red-700">Send Invitation</button>
        </div>
      </Modal>

      <Modal open={platformSettingsModal} onClose={() => setPlatformSettingsModal(false)} title="Platform Settings">
        <div className="space-y-4">
          {[
            { label: "Maintenance Mode", desc: "Disable platform access for maintenance", enabled: false },
            { label: "New User Registration", desc: "Allow new users to register", enabled: true },
            { label: "Course Submissions", desc: "Accept new course submissions from trainers", enabled: true },
            { label: "AI Features", desc: "Enable AI coding assistant and tools", enabled: true },
            { label: "Email Notifications", desc: "Send automated platform emails", enabled: true },
          ].map((setting, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{setting.label}</p>
                <p className="text-xs text-muted-foreground">{setting.desc}</p>
              </div>
              <button onClick={() => toast.success(`${setting.label} ${setting.enabled ? "disabled" : "enabled"}!`)}
                className={cn("relative w-11 h-6 rounded-full transition-colors", setting.enabled ? "bg-red-600" : "bg-muted")}>
                <div className={cn("absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform", setting.enabled ? "translate-x-5" : "")} />
              </button>
            </div>
          ))}
          <button onClick={() => { toast.success("Settings saved!"); setPlatformSettingsModal(false); }} className="btn-primary w-full text-sm bg-red-600 hover:bg-red-700">Save Settings</button>
        </div>
      </Modal>
    </div>
  );
}
