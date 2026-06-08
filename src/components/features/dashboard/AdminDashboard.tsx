import { useState, useMemo, useEffect } from "react";
import {
  Users,
  BookOpen,
  Award,
  BarChart3,
  Settings,
  Shield,
  TrendingUp,
  DollarSign,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Edit,
  Trash2,
  Plus,
  Flag,
  Clock,
  Server,
  ArrowUp,
  Download,
  Search,
  X,
  Filter,
  Ban,
  Mail,
  Key,
  Webhook,
  Database,
  Mail as MailIcon,
  Zap,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { toast } from "sonner";
import type { User } from "@/types";

const revenueData = [
  { month: "Jan", revenue: 48000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 61000 },
  { month: "Apr", revenue: 74000 },
  { month: "May", revenue: 89000 },
  { month: "Jun", revenue: 104000 },
];
const userGrowthData = [
  { month: "Jan", users: 18000 },
  { month: "Feb", users: 21000 },
  { month: "Mar", users: 25000 },
  { month: "Apr", users: 29000 },
  { month: "May", users: 234000 },
  { month: "Jun", users: 250000 },
];

const INIT_USERS = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "student",
    joined: "Jan 2025",
    courses: 7,
    status: "active",
  },
  {
    id: 2,
    name: "Dr. Ravi Kumar",
    email: "ravi@example.com",
    role: "trainer",
    joined: "Mar 2024",
    courses: 3,
    status: "active",
  },
  {
    id: 3,
    name: "Sarah Mitchell",
    email: "sarah@example.com",
    role: "recruiter",
    joined: "Feb 2025",
    courses: 0,
    status: "active",
  },
  {
    id: 4,
    name: "James Anderson",
    email: "james@corp.com",
    role: "corporate",
    joined: "Nov 2024",
    courses: 0,
    status: "active",
  },
  {
    id: 5,
    name: "spam_user_99",
    email: "spam@fake.com",
    role: "student",
    joined: "Jun 2026",
    courses: 0,
    status: "banned",
  },
  {
    id: 6,
    name: "Zara Khan",
    email: "zara@neuraledge.io",
    role: "startup",
    joined: "Mar 2025",
    courses: 4,
    status: "active",
  },
];

const INIT_MODERATION_ITEMS = [
  {
    id: 1,
    type: "Course",
    title: "Advanced React Patterns",
    author: "Maya Patel",
    reported: "Plagiarism suspected",
    time: "2h ago",
    severity: "high",
    details:
      "The content appears to be copied from another author's work without attribution.",
  },
  {
    id: 2,
    type: "Comment",
    title: "Forum post in React community",
    author: "unknown_user",
    reported: "Spam/promotional",
    time: "5h ago",
    severity: "medium",
    details: "Comment contains links to external commercial websites.",
  },
  {
    id: 3,
    type: "Course",
    title: "Python for Beginners 2026",
    author: "New Instructor",
    reported: "Incomplete content",
    time: "1 day ago",
    severity: "low",
    details: "The course only has 3 out of 12 modules uploaded.",
  },
];

const INIT_PLATFORM_SETTINGS = [
  {
    id: "maintenance",
    label: "Maintenance Mode",
    desc: "Disable platform access for maintenance",
    enabled: false,
  },
  {
    id: "registration",
    label: "New User Registration",
    desc: "Allow new users to register",
    enabled: true,
  },
  {
    id: "course_submissions",
    label: "Course Submissions",
    desc: "Accept new course submissions from trainers",
    enabled: true,
  },
  {
    id: "ai_features",
    label: "AI Features",
    desc: "Enable AI coding assistant and tools",
    enabled: true,
  },
  {
    id: "email_notifications",
    label: "Email Notifications",
    desc: "Send automated platform emails",
    enabled: true,
  },
];

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}
function Modal({ open, onClose, children, title }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard({
  user,
  initialTab,
}: {
  user: User;
  initialTab?: string;
}) {
  const [activeTab, setActiveTab] = useState(initialTab || "overview");
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem("admin_users");
    return saved ? JSON.parse(saved) : INIT_USERS;
  });
  const [moderationItems, setModerationItems] = useState(() => {
    const saved = localStorage.getItem("admin_moderation");
    return saved ? JSON.parse(saved) : INIT_MODERATION_ITEMS;
  });
  const [platformSettings, setPlatformSettings] = useState(() => {
    const saved = localStorage.getItem("admin_platform_settings");
    return saved ? JSON.parse(saved) : INIT_PLATFORM_SETTINGS;
  });

  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("All");
  const [viewUserModal, setViewUserModal] = useState<{
    open: boolean;
    user: (typeof INIT_USERS)[0] | null;
  }>({ open: false, user: null });
  const [editUserModal, setEditUserModal] = useState<{
    open: boolean;
    user: (typeof INIT_USERS)[0] | null;
  }>({ open: false, user: null });
  const [deleteUserConfirm, setDeleteUserConfirm] = useState<{
    open: boolean;
    id: number;
    name: string;
  }>({ open: false, id: 0, name: "" });
  const [inviteUserModal, setInviteUserModal] = useState(false);
  const [platformSettingsModal, setPlatformSettingsModal] = useState(false);
  const [courseFilter, setCourseFilter] = useState("All");
  const [reviewModal, setReviewModal] = useState<{
    open: boolean;
    item: (typeof INIT_MODERATION_ITEMS)[0] | null;
  }>({ open: false, item: null });
  const [inviteForm, setInviteForm] = useState({
    email: "",
    role: "student",
    message: "",
  });
  const [editUserForm, setEditUserForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  // New modals for platform actions
  const [featureFlagsModal, setFeatureFlagsModal] = useState(false);
  const [emailTemplatesModal, setEmailTemplatesModal] = useState(false);
  const [apiKeysModal, setApiKeysModal] = useState(false);
  const [webhooksModal, setWebhooksModal] = useState(false);
  const [maintenanceModal, setMaintenanceModal] = useState(false);
  const [backupModal, setBackupModal] = useState(false);
  const [courseViewModal, setCourseViewModal] = useState<{
    open: boolean;
    course: any;
  }>({ open: false, course: null });
  const [flagCourseModal, setFlagCourseModal] = useState<{
    open: boolean;
    course: any;
  }>({ open: false, course: null });
  const [flagReason, setFlagReason] = useState("");

  // Persist data
  useEffect(() => {
    localStorage.setItem("admin_users", JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    localStorage.setItem("admin_moderation", JSON.stringify(moderationItems));
  }, [moderationItems]);
  useEffect(() => {
    localStorage.setItem(
      "admin_platform_settings",
      JSON.stringify(platformSettings),
    );
  }, [platformSettings]);

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "users", label: "Users", icon: Users },
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "revenue", label: "Revenue", icon: DollarSign },
    { id: "moderation", label: "Moderation", icon: Flag },
    { id: "platform", label: "Platform", icon: Server },
  ];

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchRole =
        userRoleFilter === "All" ||
        u.role === userRoleFilter ||
        (userRoleFilter === "banned" && u.status === "banned");
      return matchSearch && matchRole;
    });
  }, [users, userSearch, userRoleFilter]);

  const ADMIN_COURSES = [
    {
      id: 1,
      title: "Full Stack Web Development Bootcamp",
      instructor: "Alex Johnson",
      students: 12450,
      status: "published",
      revenue: 124500,
      rating: 4.9,
      description:
        "Complete bootcamp covering React, Node.js, MongoDB, and deployment. 12 weeks of hands-on projects.",
    },
    {
      id: 2,
      title: "Machine Learning with Python",
      instructor: "Dr. Sarah Chen",
      students: 8920,
      status: "published",
      revenue: 89200,
      rating: 4.8,
      description:
        "Master ML algorithms using scikit-learn, TensorFlow, and real-world datasets.",
    },
    {
      id: 3,
      title: "Cybersecurity Fundamentals",
      instructor: "Emma Wilson",
      students: 9450,
      status: "published",
      revenue: 55755,
      rating: 4.8,
      description:
        "Learn network security, cryptography, and ethical hacking techniques.",
    },
    {
      id: 4,
      title: "Advanced React Patterns",
      instructor: "Maya Patel",
      students: 0,
      status: "under-review",
      revenue: 0,
      rating: 0,
      description:
        "Deep dive into React hooks, context, custom renderers, and performance optimization.",
    },
    {
      id: 5,
      title: "Python for Beginners 2026",
      instructor: "New Instructor",
      students: 0,
      status: "under-review",
      revenue: 0,
      rating: 0,
      description:
        "Start from zero – variables, loops, functions, OOP, and mini projects.",
    },
  ];

  const filteredCourses = useMemo(() => {
    if (courseFilter === "All") return ADMIN_COURSES;
    return ADMIN_COURSES.filter((c) => c.status === courseFilter);
  }, [courseFilter]);

  // ========== User Management Handlers ==========
  const handleInviteUser = () => {
    if (!inviteForm.email.trim()) {
      toast.error("Email is required");
      return;
    }
    const newId = Math.max(...users.map((u) => u.id), 0) + 1;
    const newUser = {
      id: newId,
      name: inviteForm.email.split("@")[0],
      email: inviteForm.email,
      role: inviteForm.role,
      joined: new Date().toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      courses: 0,
      status: "active",
    };
    setUsers((prev) => [...prev, newUser]);
    toast.success(`Invitation sent to ${inviteForm.email}`);
    setInviteUserModal(false);
    setInviteForm({ email: "", role: "student", message: "" });
  };

  const handleEditUser = () => {
    if (!editUserModal.user) return;
    setUsers((prev) =>
      prev.map((u) =>
        u.id === editUserModal.user!.id
          ? {
              ...u,
              name: editUserForm.name,
              email: editUserForm.email,
              role: editUserForm.role,
            }
          : u,
      ),
    );
    toast.success(`User ${editUserForm.name} updated`);
    setEditUserModal({ open: false, user: null });
  };

  const handleToggleBan = (id: number, name: string, currentStatus: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: currentStatus === "banned" ? "active" : "banned" }
          : u,
      ),
    );
    toast.success(
      currentStatus === "banned"
        ? `${name} has been unbanned`
        : `${name} has been banned`,
    );
  };

  const handleDeleteUser = () => {
    setUsers((prev) => prev.filter((u) => u.id !== deleteUserConfirm.id));
    toast.success(`${deleteUserConfirm.name} deleted from platform`);
    setDeleteUserConfirm({ open: false, id: 0, name: "" });
  };

  const exportUsersCSV = () => {
    const headers = ["Name", "Email", "Role", "Joined", "Courses", "Status"];
    const rows = filteredUsers.map((u) => [
      u.name,
      u.email,
      u.role,
      u.joined,
      u.courses,
      u.status,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users_export.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("User data exported");
  };

  // ========== Course Management Handlers ==========
  const handleApproveCourse = (course: any) => {
    toast.success(`"${course.title}" approved and published!`);
    // In a real app, update course status in backend
  };

  const handleFlagCourseSubmit = () => {
    if (!flagReason.trim()) {
      toast.error("Please provide a reason for flagging");
      return;
    }
    const newItem = {
      id: Date.now(),
      type: "Course",
      title: flagCourseModal.course.title,
      author: flagCourseModal.course.instructor,
      reported: flagReason,
      time: "Just now",
      severity: "medium",
      details: `Flagged by admin: ${flagReason}`,
    };
    setModerationItems((prev) => [newItem, ...prev]);
    toast.success(`"${flagCourseModal.course.title}" flagged for review.`);
    setFlagCourseModal({ open: false, course: null });
    setFlagReason("");
  };

  // ========== Moderation Handlers ==========
  const handleApproveModItem = (id: number, title: string) => {
    setModerationItems((prev) => prev.filter((m) => m.id !== id));
    toast.success(`"${title}" approved and kept on platform.`);
  };

  const handleRemoveModItem = (id: number, title: string) => {
    setModerationItems((prev) => prev.filter((m) => m.id !== id));
    toast.error(`"${title}" removed from platform.`);
  };

  // ========== Platform Settings Handlers ==========
  const togglePlatformSetting = (settingId: string) => {
    setPlatformSettings((prev) =>
      prev.map((s) => (s.id === settingId ? { ...s, enabled: !s.enabled } : s)),
    );
    toast.success(`Setting toggled`);
  };

  const savePlatformSettings = () => {
    toast.success("Platform settings saved");
    setPlatformSettingsModal(false);
  };

  // ========== Revenue Export ==========
  const exportRevenueReport = () => {
    const headers = ["Month", "Revenue ($)"];
    const rows = revenueData.map((d) => [d.month, d.revenue]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "revenue_report.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Revenue report downloaded");
  };

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-6 pb-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeTab === id
                ? "bg-primary text-white shadow-lg shadow-red-600/25"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
            {id === "moderation" && moderationItems.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center ml-0.5">
                {moderationItems.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Overview Tab (unchanged but functional) */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Admin Control Panel 
              </h1>
              <p className="text-sm text-muted-foreground">
                Platform health:{" "}
                <span className="text-accent font-medium">
                  All systems operational
                </span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportRevenueReport}
                className="btn-secondary text-sm flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Export Report
              </button>
              <button
                onClick={() => setPlatformSettingsModal(true)}
                className="btn-primary text-sm bg-primary hover:bg-red-700 shadow-red-600/25"
              >
                <Settings className="w-4 h-4 mr-1.5" />
                Settings
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total Users",
                value: users.length.toLocaleString(),
                icon: Users,
                color: "text-red-600 bg-primary/10",
                change: "+1,240 today",
                up: true,
                tab: "users",
              },
              {
                label: "Active Courses",
                value: "1,247",
                icon: BookOpen,
                color: "text-primary bg-primary/10",
                change: "+8 this week",
                up: true,
                tab: "courses",
              },
              {
                label: "Monthly Revenue",
                value: "$104K",
                icon: DollarSign,
                color: "text-accent bg-accent/10",
                change: "+17% vs last mo",
                up: true,
                tab: "revenue",
              },
              {
                label: "Pending Reviews",
                value: String(moderationItems.length),
                icon: Flag,
                color: "text-orange-600 bg-accent/10",
                change:
                  moderationItems.length > 0 ? "Needs attention" : "All clear",
                up: moderationItems.length === 0,
                tab: "moderation",
              },
            ].map(({ label, value, icon: Icon, color, change, up, tab }) => (
              <button
                key={label}
                onClick={() => setActiveTab(tab)}
                className="bg-card border border-border rounded-2xl p-4 hover:border-red-600/30 transition-colors text-left"
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center mb-3",
                    color,
                  )}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p
                  className={cn(
                    "text-xs mt-1 font-medium flex items-center gap-0.5",
                    up
                      ? "text-accent dark:text-emerald-400"
                      : "text-orange-600 dark:text-orange-400",
                  )}
                >
                  {up ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                  {change}
                </p>
              </button>
            ))}
          </div>
          {/* Charts remain same */}
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">
                Monthly Revenue
              </h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{
                        fontSize: 11,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(v: number) => [
                        `$${(v / 1000).toFixed(0)}K`,
                        "Revenue",
                      ]}
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#DC2626"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">
                User Growth
              </h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={userGrowthData}>
                    <defs>
                      <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="5%"
                          stopColor="#DC2626"
                          stopOpacity={0.2}
                        />
                        <stop
                          offset="95%"
                          stopColor="#DC2626"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="month"
                      tick={{
                        fontSize: 11,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#DC2626"
                      strokeWidth={2}
                      fill="url(#redGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="font-semibold text-foreground text-sm">
                  Platform Status
                </h3>
                <span className="text-xs text-accent font-medium">
                  All OK
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { service: "Learning API", latency: "42ms" },
                  { service: "Coding Lab", latency: "89ms" },
                  { service: "Auth Service", latency: "21ms" },
                  { service: "Storage CDN", latency: "134ms" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-muted-foreground">{s.service}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{s.latency}</span>
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 lg:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="font-semibold text-foreground text-sm">
                  Recent Admin Actions
                </h3>
                <button
                  onClick={() => toast.info("Loading full audit log...")}
                  className="text-xs text-red-600 hover:underline"
                >
                  View Audit Log
                </button>
              </div>
              <div className="space-y-2">
                {[
                  {
                    action: "Approved course",
                    target: "Advanced Kubernetes — by Dr. Ravi",
                    time: "5m ago",
                    type: "success",
                  },
                  {
                    action: "Banned user",
                    target: "spam_account_123 (TOS violation)",
                    time: "1h ago",
                    type: "danger",
                  },
                  {
                    action: "Published blog",
                    target: "10 Skills Developers Need in 2026",
                    time: "3h ago",
                    type: "info",
                  },
                  {
                    action: "Updated pricing",
                    target: "Enterprise plan: $99 → $89/mo",
                    time: "Yesterday",
                    type: "warning",
                  },
                ].map((a, i) => (
                  <button
                    key={i}
                    onClick={() => toast.info(a.target)}
                    className="w-full flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors text-left"
                  >
                    <div
                      className={cn("w-2 h-2 rounded-full flex-shrink-0", {
                        "bg-accent": a.type === "success",
                        "bg-red-500": a.type === "danger",
                        "bg-blue-500": a.type === "info",
                        "bg-yellow-500": a.type === "warning",
                      })}
                    />
                    <span className="text-xs text-muted-foreground">
                      {a.action}:{" "}
                    </span>
                    <span className="text-xs text-foreground font-medium flex-1 truncate">
                      {a.target}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {a.time}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab (unchanged, fully functional) */}
      {activeTab === "users" && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h1 className="text-2xl font-bold text-foreground">
              User Management
            </h1>
            <div className="flex gap-2">
              <button
                onClick={exportUsersCSV}
                className="btn-secondary text-sm flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => setInviteUserModal(true)}
                className="btn-primary text-sm bg-primary hover:bg-red-700"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Invite User
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                className="input-field pl-9 py-2 text-sm"
                placeholder="Search by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
              />
              {userSearch && (
                <button
                  onClick={() => setUserSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <select
              className="input-field py-2 text-sm w-auto"
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
            >
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
            <div className="p-3 border-b border-border text-xs text-muted-foreground">
              {filteredUsers.length} users shown
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    {[
                      "User",
                      "Role",
                      "Joined",
                      "Courses",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-medium text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No users match your search
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="border-t border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-foreground text-sm">
                            {u.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {u.email}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 capitalize">
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {u.joined}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground text-center">
                          {u.courses}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "text-xs px-2 py-0.5 rounded-full font-medium",
                              u.status === "active"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700",
                            )}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button
                              onClick={() =>
                                setViewUserModal({ open: true, user: u })
                              }
                              className="p-1.5 hover:bg-muted rounded"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setEditUserForm({
                                  name: u.name,
                                  email: u.email,
                                  role: u.role,
                                });
                                setEditUserModal({ open: true, user: u });
                              }}
                              className="p-1.5 hover:bg-muted rounded"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                handleToggleBan(u.id, u.name, u.status)
                              }
                              className={cn(
                                "p-1.5 rounded",
                                u.status === "banned"
                                  ? "hover:bg-accent/10"
                                  : "hover:bg-orange-50",
                              )}
                            >
                              <Ban
                                className={cn(
                                  "w-3.5 h-3.5",
                                  u.status === "banned"
                                    ? "text-accent"
                                    : "text-orange-500",
                                )}
                              />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteUserConfirm({
                                  open: true,
                                  id: u.id,
                                  name: u.name,
                                })
                              }
                              className="p-1.5 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Courses Tab with working View and Flag */}
      {activeTab === "courses" && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h1 className="text-2xl font-bold text-foreground">
              Course Management
            </h1>
            <div className="flex gap-2">
              {["All", "published", "under-review"].map((f) => (
                <button
                  key={f}
                  onClick={() => setCourseFilter(f)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border",
                    courseFilter === f
                      ? "bg-primary text-white border-red-600"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  {f === "All"
                    ? "All"
                    : f === "published"
                      ? "Published"
                      : "Under Review"}
                  {f === "under-review" && (
                    <span className="ml-1 px-1.5 bg-orange-500 text-white rounded-full text-xs">
                      {
                        ADMIN_COURSES.filter((c) => c.status === "under-review")
                          .length
                      }
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {filteredCourses.map((c) => (
              <div
                key={c.id}
                className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-medium text-foreground text-sm">
                      {c.title}
                    </p>
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        {
                          "bg-emerald-100 text-emerald-700":
                            c.status === "published",
                          "bg-yellow-100 text-yellow-700":
                            c.status === "under-review",
                        },
                      )}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    By {c.instructor} · {c.students.toLocaleString()} students{" "}
                    {c.rating > 0 ? `· ★ ${c.rating}` : ""}
                  </p>
                  <p className="text-xs text-accent font-medium mt-0.5">
                    {c.revenue > 0
                      ? `$${c.revenue.toLocaleString()} total revenue`
                      : "Pending review"}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {c.status === "under-review" && (
                    <button
                      onClick={() => handleApproveCourse(c)}
                      className="px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-accent/90"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setCourseViewModal({ open: true, course: c })
                    }
                    className="px-3 py-1.5 border border-border text-xs font-medium rounded-lg hover:bg-muted"
                  >
                    View
                  </button>
                  <button
                    onClick={() =>
                      setFlagCourseModal({ open: true, course: c })
                    }
                    className="p-1.5 border border-red-200 rounded-lg hover:bg-red-50"
                  >
                    <Flag className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revenue Tab (unchanged) */}
      {activeTab === "revenue" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-foreground">
              Revenue Analytics
            </h1>
            <button
              onClick={exportRevenueReport}
              className="btn-secondary text-sm flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Download Report
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Monthly Revenue",
                value: "$104K",
                color: "text-red-600",
              },
              {
                label: "Annual Run Rate",
                value: "$1.2M",
                color: "text-accent",
              },
              {
                label: "Avg Order Value",
                value: "$29.50",
                color: "text-primary",
              },
              { label: "Churn Rate", value: "2.8%", color: "text-orange-600" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="bg-card border border-border rounded-2xl p-4 text-center"
              >
                <p className={cn("text-2xl font-bold", color)}>{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">
                Monthly Revenue
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="month"
                      tick={{
                        fontSize: 11,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(v: number) => [
                        `$${(v / 1000).toFixed(0)}K`,
                        "Revenue",
                      ]}
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: "hsl(var(--foreground))",
                      }}
                    />
                    <Bar
                      dataKey="revenue"
                      fill="#DC2626"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">
                Revenue Breakdown
              </h3>
              <div className="space-y-3">
                {[
                  {
                    plan: "Pro Plan",
                    revenue: "$62,400",
                    pct: 60,
                    color: "bg-red-500",
                  },
                  {
                    plan: "Enterprise",
                    revenue: "$31,200",
                    pct: 30,
                    color: "bg-orange-500",
                  },
                  {
                    plan: "Course Sales",
                    revenue: "$10,400",
                    pct: 10,
                    color: "bg-yellow-500",
                  },
                ].map((r) => (
                  <div key={r.plan}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-foreground font-medium">
                        {r.plan}
                      </span>
                      <span className="text-muted-foreground">{r.revenue}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div
                        className={cn("h-full rounded-full", r.color)}
                        style={{ width: `${r.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Moderation Tab (unchanged) */}
      {activeTab === "moderation" && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h1 className="text-2xl font-bold text-foreground">
              Content Moderation
            </h1>
            <span
              className={cn(
                "text-sm font-medium px-3 py-1.5 rounded-xl",
                moderationItems.length > 0
                  ? "bg-orange-100 text-orange-700"
                  : "bg-emerald-100 text-emerald-700",
              )}
            >
              {moderationItems.length} pending{" "}
              {moderationItems.length === 1 ? "item" : "items"}
            </span>
          </div>
          {moderationItems.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl">
              <CheckCircle2 className="w-12 h-12 text-accent mx-auto mb-3" />
              <p className="font-semibold text-foreground">All clear!</p>
              <p className="text-muted-foreground text-sm">
                No items pending moderation review.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {moderationItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-card border border-border rounded-2xl p-5"
                >
                  <div className="flex items-start gap-4">
                    <AlertTriangle
                      className={cn("w-5 h-5 flex-shrink-0 mt-0.5", {
                        "text-red-500": item.severity === "high",
                        "text-yellow-500": item.severity === "medium",
                        "text-blue-500": item.severity === "low",
                      })}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {item.type}
                        </span>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full font-medium",
                            {
                              "bg-red-100 text-red-700":
                                item.severity === "high",
                              "bg-yellow-100 text-yellow-700":
                                item.severity === "medium",
                              "bg-blue-100 text-blue-700":
                                item.severity === "low",
                            },
                          )}
                        >
                          {item.severity} priority
                        </span>
                      </div>
                      <p className="font-semibold text-foreground text-sm">
                        {item.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        By {item.author} · {item.time}
                      </p>
                      <p className="text-xs text-orange-600 mt-1">
                        Reported: {item.reported}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => setReviewModal({ open: true, item })}
                        className="px-3 py-1.5 border border-border text-xs font-medium rounded-lg hover:bg-muted"
                      >
                        Review
                      </button>
                      <button
                        onClick={() =>
                          handleApproveModItem(item.id, item.title)
                        }
                        className="px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-accent/90"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRemoveModItem(item.id, item.title)}
                        className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Platform Tab with working setting buttons */}
      {activeTab === "platform" && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-foreground">
            Platform Settings
          </h1>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Settings className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">
                  Feature Flags
                </p>
                <p className="text-xs text-muted-foreground">
                  Enable or disable platform features
                </p>
              </div>
              <button
                onClick={() => setFeatureFlagsModal(true)}
                className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-red-700"
              >
                Configure
              </button>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MailIcon className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">
                  Email Templates
                </p>
                <p className="text-xs text-muted-foreground">
                  Customize system email notifications
                </p>
              </div>
              <button
                onClick={() => setEmailTemplatesModal(true)}
                className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-red-700"
              >
                Edit Templates
              </button>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Key className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">
                  API Keys
                </p>
                <p className="text-xs text-muted-foreground">
                  Manage integrations and API access
                </p>
              </div>
              <button
                onClick={() => setApiKeysModal(true)}
                className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-red-700"
              >
                Manage Keys
              </button>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Webhook className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">
                  Webhooks
                </p>
                <p className="text-xs text-muted-foreground">
                  Configure event-based webhooks
                </p>
              </div>
              <button
                onClick={() => setWebhooksModal(true)}
                className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-red-700"
              >
                View Webhooks
              </button>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">
                  Maintenance Mode
                </p>
                <p className="text-xs text-muted-foreground">
                  Put platform in maintenance mode
                </p>
              </div>
              <button
                onClick={() => setMaintenanceModal(true)}
                className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-red-700"
              >
                Toggle
              </button>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Database className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">
                  Backup & Restore
                </p>
                <p className="text-xs text-muted-foreground">
                  Manage data backups and restoration
                </p>
              </div>
              <button
                onClick={() => setBackupModal(true)}
                className="px-3 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-red-700"
              >
                View Backups
              </button>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">
              System Health
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { service: "Learning API", latency: "42ms", uptime: "99.98%" },
                { service: "Coding Lab", latency: "89ms", uptime: "99.95%" },
                { service: "Auth Service", latency: "21ms", uptime: "100%" },
                { service: "Storage CDN", latency: "134ms", uptime: "99.99%" },
                {
                  service: "WebSocket Service",
                  latency: "56ms",
                  uptime: "99.97%",
                },
                { service: "AI Engine", latency: "312ms", uptime: "99.91%" },
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <span className="text-sm font-medium text-foreground">
                      {s.service}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">
                      {s.latency} · {s.uptime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========== MODALS ========== */}

      {/* User Modals (unchanged) */}
      <Modal
        open={viewUserModal.open}
        onClose={() => setViewUserModal({ open: false, user: null })}
        title="User Details"
      >
        {viewUserModal.user && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-red-600 font-bold text-xl">
                {viewUserModal.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <p className="font-bold text-foreground">
                  {viewUserModal.user.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {viewUserModal.user.email}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { label: "Role", value: viewUserModal.user.role },
                { label: "Status", value: viewUserModal.user.status },
                { label: "Joined", value: viewUserModal.user.joined },
                { label: "Courses", value: String(viewUserModal.user.courses) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-muted rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium text-foreground capitalize mt-0.5">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  toast.success(`Message sent to ${viewUserModal.user!.name}!`);
                  setViewUserModal({ open: false, user: null });
                }}
                className="flex-1 btn-primary text-sm bg-primary hover:bg-red-700"
              >
                Send Message
              </button>
              <button
                onClick={() => setViewUserModal({ open: false, user: null })}
                className="flex-1 btn-secondary text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={editUserModal.open}
        onClose={() => setEditUserModal({ open: false, user: null })}
        title="Edit User"
      >
        {editUserModal.user && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Display Name
              </label>
              <input
                className="input-field"
                value={editUserForm.name}
                onChange={(e) =>
                  setEditUserForm({ ...editUserForm, name: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <input
                type="email"
                className="input-field"
                value={editUserForm.email}
                onChange={(e) =>
                  setEditUserForm({ ...editUserForm, email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Role
              </label>
              <select
                className="input-field"
                value={editUserForm.role}
                onChange={(e) =>
                  setEditUserForm({ ...editUserForm, role: e.target.value })
                }
              >
                <option value="student">Student</option>
                <option value="trainer">Trainer</option>
                <option value="recruiter">Recruiter</option>
                <option value="corporate">Corporate</option>
                <option value="startup">Startup</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setEditUserModal({ open: false, user: null })}
                className="flex-1 btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleEditUser}
                className="flex-1 btn-primary text-sm bg-primary hover:bg-red-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={deleteUserConfirm.open}
        onClose={() => setDeleteUserConfirm({ open: false, id: 0, name: "" })}
        title="Delete User Account"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center mx-auto">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              Delete "{deleteUserConfirm.name}"?
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              This will permanently delete the account and all associated data.
              This cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() =>
                setDeleteUserConfirm({ open: false, id: 0, name: "" })
              }
              className="flex-1 btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteUser}
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-red-700"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={inviteUserModal}
        onClose={() => setInviteUserModal(false)}
        title="Invite New User"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              className="input-field"
              placeholder="user@example.com"
              value={inviteForm.email}
              onChange={(e) =>
                setInviteForm({ ...inviteForm, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Assign Role
            </label>
            <select
              className="input-field"
              value={inviteForm.role}
              onChange={(e) =>
                setInviteForm({ ...inviteForm, role: e.target.value })
              }
            >
              <option value="student">Student</option>
              <option value="trainer">Trainer</option>
              <option value="recruiter">Recruiter</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Personal Message (optional)
            </label>
            <textarea
              className="input-field resize-none min-h-[80px]"
              placeholder="Welcome to VedTechno!"
              value={inviteForm.message}
              onChange={(e) =>
                setInviteForm({ ...inviteForm, message: e.target.value })
              }
            />
          </div>
          <button
            onClick={handleInviteUser}
            className="btn-primary w-full text-sm bg-primary hover:bg-red-700"
          >
            Send Invitation
          </button>
        </div>
      </Modal>

      <Modal
        open={platformSettingsModal}
        onClose={() => setPlatformSettingsModal(false)}
        title="Platform Settings"
      >
        <div className="space-y-4">
          {platformSettings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between py-2 border-b border-border last:border-0"
            >
              <div>
                <p className="text-sm font-medium text-foreground">
                  {setting.label}
                </p>
                <p className="text-xs text-muted-foreground">{setting.desc}</p>
              </div>
              <button
                onClick={() => togglePlatformSetting(setting.id)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  setting.enabled ? "bg-primary" : "bg-muted",
                )}
              >
                <div
                  className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
                    setting.enabled ? "translate-x-5" : "",
                  )}
                />
              </button>
            </div>
          ))}
          <button
            onClick={savePlatformSettings}
            className="btn-primary w-full text-sm bg-primary hover:bg-red-700"
          >
            Save Settings
          </button>
        </div>
      </Modal>

      {/* Moderation Review Modal */}
      <Modal
        open={reviewModal.open}
        onClose={() => setReviewModal({ open: false, item: null })}
        title="Review Moderation Item"
      >
        {reviewModal.item && (
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-xl">
              <p className="text-xs text-muted-foreground">
                Type: {reviewModal.item.type}
              </p>
              <p className="text-sm font-semibold text-foreground mt-1">
                {reviewModal.item.title}
              </p>
              <p className="text-xs text-muted-foreground">
                Reported by: {reviewModal.item.author}
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-xl">
              <p className="text-xs font-medium text-orange-700">
                Report Reason
              </p>
              <p className="text-sm text-foreground mt-1">
                {reviewModal.item.reported}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Full Details</p>
              <p className="text-sm text-foreground mt-1">
                {reviewModal.item.details}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  handleApproveModItem(
                    reviewModal.item!.id,
                    reviewModal.item!.title,
                  );
                  setReviewModal({ open: false, item: null });
                }}
                className="flex-1 bg-accent text-white py-2 rounded-lg text-sm hover:bg-accent/90"
              >
                Approve
              </button>
              <button
                onClick={() => {
                  handleRemoveModItem(
                    reviewModal.item!.id,
                    reviewModal.item!.title,
                  );
                  setReviewModal({ open: false, item: null });
                }}
                className="flex-1 bg-primary text-white py-2 rounded-lg text-sm hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Course View Modal */}
      <Modal
        open={courseViewModal.open}
        onClose={() => setCourseViewModal({ open: false, course: null })}
        title="Course Details"
      >
        {courseViewModal.course && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-foreground">
                {courseViewModal.course.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                By {courseViewModal.course.instructor}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-muted rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="text-sm font-medium capitalize">
                  {courseViewModal.course.status}
                </p>
              </div>
              <div className="bg-muted rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Students</p>
                <p className="text-sm font-medium">
                  {courseViewModal.course.students.toLocaleString()}
                </p>
              </div>
              <div className="bg-muted rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Revenue</p>
                <p className="text-sm font-medium">
                  ${courseViewModal.course.revenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-muted rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Rating</p>
                <p className="text-sm font-medium">
                  {courseViewModal.course.rating > 0
                    ? `★ ${courseViewModal.course.rating}`
                    : "Not rated"}
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Description</p>
              <p className="text-sm text-foreground mt-1">
                {courseViewModal.course.description}
              </p>
            </div>
            <button
              onClick={() => setCourseViewModal({ open: false, course: null })}
              className="btn-primary w-full text-sm bg-primary hover:bg-red-700"
            >
              Close
            </button>
          </div>
        )}
      </Modal>

      {/* Flag Course Modal */}
      <Modal
        open={flagCourseModal.open}
        onClose={() => setFlagCourseModal({ open: false, course: null })}
        title="Flag Course for Review"
      >
        {flagCourseModal.course && (
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-xl">
              <p className="font-semibold">{flagCourseModal.course.title}</p>
              <p className="text-xs text-muted-foreground">
                By {flagCourseModal.course.instructor}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Reason for flagging *
              </label>
              <textarea
                className="input-field resize-none min-h-[80px]"
                placeholder="Explain why this course needs review..."
                value={flagReason}
                onChange={(e) => setFlagReason(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setFlagCourseModal({ open: false, course: null })
                }
                className="flex-1 btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleFlagCourseSubmit}
                className="flex-1 btn-primary text-sm bg-primary hover:bg-red-700"
              >
                Flag Course
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Platform Sub-modals */}
      <Modal
        open={featureFlagsModal}
        onClose={() => setFeatureFlagsModal(false)}
        title="Feature Flags"
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span>AI Code Assistant</span>
            <button
              className="px-3 py-1 bg-primary text-white rounded-lg text-sm"
              onClick={() => toast.success("AI Assistant toggled")}
            >
              Toggle
            </button>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span>Collaboration Tools</span>
            <button
              className="px-3 py-1 bg-primary text-white rounded-lg text-sm"
              onClick={() => toast.success("Collaboration toggled")}
            >
              Toggle
            </button>
          </div>
          <div className="flex justify-between items-center py-2">
            <span>Analytics Dashboard</span>
            <button
              className="px-3 py-1 bg-primary text-white rounded-lg text-sm"
              onClick={() => toast.success("Analytics toggled")}
            >
              Toggle
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={emailTemplatesModal}
        onClose={() => setEmailTemplatesModal(false)}
        title="Email Templates"
      >
        <div className="space-y-3">
          <div className="p-3 border rounded-lg">
            <p className="font-medium">Welcome Email</p>
            <p className="text-xs text-muted-foreground">Sent to new users</p>
            <button
              className="mt-1 text-sm text-red-600"
              onClick={() => toast.info("Edit template")}
            >
              Edit
            </button>
          </div>
          <div className="p-3 border rounded-lg">
            <p className="font-medium">Course Completion</p>
            <p className="text-xs text-muted-foreground">
              Sent when user completes a course
            </p>
            <button
              className="mt-1 text-sm text-red-600"
              onClick={() => toast.info("Edit template")}
            >
              Edit
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={apiKeysModal}
        onClose={() => setApiKeysModal(false)}
        title="API Keys"
      >
        <div className="space-y-3">
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-mono text-sm">vk_live_abc123def456</p>
            <p className="text-xs text-muted-foreground">
              Created: Jan 2026 · Last used: Today
            </p>
            <button
              className="mt-1 text-sm text-red-600"
              onClick={() => toast.success("Key regenerated")}
            >
              Regenerate
            </button>
          </div>
          <button
            className="w-full btn-secondary text-sm"
            onClick={() => toast.success("New API key generated")}
          >
            + Generate New Key
          </button>
        </div>
      </Modal>

      <Modal
        open={webhooksModal}
        onClose={() => setWebhooksModal(false)}
        title="Webhooks"
      >
        <div className="space-y-3">
          <div className="p-3 border rounded-lg">
            <p className="font-medium">Course Published</p>
            <p className="text-xs text-muted-foreground">
              https://api.example.com/webhook/course
            </p>
            <button
              className="mt-1 text-sm text-red-600"
              onClick={() => toast.info("Test webhook")}
            >
              Test
            </button>
          </div>
          <button
            className="w-full btn-secondary text-sm"
            onClick={() => toast.success("Add webhook")}
          >
            + Add Webhook
          </button>
        </div>
      </Modal>

      <Modal
        open={maintenanceModal}
        onClose={() => setMaintenanceModal(false)}
        title="Maintenance Mode"
      >
        <div className="text-center space-y-4">
          <p className="text-sm">
            Enable maintenance mode to restrict access for all users except
            admins.
          </p>
          <button
            className="btn-primary w-full bg-primary"
            onClick={() => {
              toast.success("Maintenance mode toggled");
              setMaintenanceModal(false);
            }}
          >
            Toggle Maintenance Mode
          </button>
        </div>
      </Modal>

      <Modal
        open={backupModal}
        onClose={() => setBackupModal(false)}
        title="Backup & Restore"
      >
        <div className="space-y-3">
          <div className="p-3 border rounded-lg flex justify-between items-center">
            <span>backup_2026_06_01.sql</span>
            <button
              className="text-sm text-red-600"
              onClick={() => toast.success("Backup downloaded")}
            >
              Download
            </button>
          </div>
          <div className="p-3 border rounded-lg flex justify-between items-center">
            <span>backup_2026_05_25.sql</span>
            <button
              className="text-sm text-red-600"
              onClick={() => toast.success("Backup downloaded")}
            >
              Download
            </button>
          </div>
          <button
            className="w-full btn-secondary text-sm"
            onClick={() => toast.success("Creating backup...")}
          >
            Create New Backup
          </button>
        </div>
      </Modal>
    </div>
  );
}
