import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen, Code2, Award, Users, BarChart3, Settings, LogOut, Menu, X,
  Bell, Search, ChevronRight, Target, TrendingUp, FileText,
  LayoutDashboard, Briefcase, Brain, MessageSquare, Trophy, GitBranch, Rocket, Flag, Server, DollarSign, Lightbulb
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn, getInitials } from "@/lib/utils";
import { toast } from "sonner";

import StudentDashboard from "@/components/features/dashboard/StudentDashboard";
import DeveloperDashboard from "@/components/features/dashboard/DeveloperDashboard";
import TrainerDashboard from "@/components/features/dashboard/TrainerDashboard";
import RecruiterDashboard from "@/components/features/dashboard/RecruiterDashboard";
import CorporateDashboard from "@/components/features/dashboard/CorporateDashboard";
import StartupDashboard from "@/components/features/dashboard/StartupDashboard";
import AdminDashboard from "@/components/features/dashboard/AdminDashboard";
import Profile from "@/pages/Profile";
import SettingsPage from "@/pages/Settings";

export default function Dashboard({ defaultTab }: { defaultTab?: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab || "overview");
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary/30">
            <Code2 className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-3 text-foreground">Access Your Dashboard</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Sign in to access your personalized dashboard — or try a demo account to explore each user type instantly.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/login" className="btn-primary">Sign In</Link>
            <Link to="/register" className="btn-secondary">Create Account</Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Signed out successfully");
  };

  const handleSidebarNav = (id: string) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  const roleConfig = {
    student: { label: "Student", color: "bg-primary", icon: BookOpen, sidebar: studentSidebar },
    developer: { label: "Developer", color: "bg-primary", icon: Code2, sidebar: developerSidebar },
    trainer: { label: "Trainer", color: "bg-accent", icon: Brain, sidebar: trainerSidebar },
    recruiter: { label: "Recruiter", color: "bg-accent", icon: Briefcase, sidebar: recruiterSidebar },
    corporate: { label: "Corporate", color: "bg-primary", icon: Users, sidebar: corporateSidebar },
    startup: { label: "Startup", color: "bg-accent", icon: Rocket, sidebar: startupSidebar },
    admin: { label: "Admin", color: "bg-primary", icon: Settings, sidebar: adminSidebar },
  };

  const config = roleConfig[user.role as keyof typeof roleConfig] || roleConfig.student;
  const RoleIcon = config.icon;

  const ChildDashboard = {
    student: StudentDashboard,
    developer: DeveloperDashboard,
    trainer: TrainerDashboard,
    recruiter: RecruiterDashboard,
    corporate: CorporateDashboard,
    startup: StartupDashboard,
    admin: AdminDashboard,
  }[user.role as keyof typeof roleConfig] || StudentDashboard;

  // Search suggestions based on role
  const searchSuggestions = {
    student: ["My Courses", "Coding Lab", "Certificates", "Career Hub", "Community"],
    developer: ["Challenges", "Hackathons", "Portfolio", "Career"],
    trainer: ["Create Course", "Students", "Revenue", "Reviews"],
    recruiter: ["Candidates", "Post Job", "Interviews", "Analytics"],
    corporate: ["Team", "Learning Paths", "Reports", "Certifications"],
    startup: ["Mentors", "Challenges", "AI Tools", "Innovation"],
    admin: ["Users", "Courses", "Revenue", "Moderation", "Platform"],
  };

  const filteredSuggestions = searchQuery.length > 0
    ? (searchSuggestions[user.role as keyof typeof searchSuggestions] || [])
        .filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="min-h-screen bg-muted/20 dark:bg-background flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex items-center justify-between p-5 border-b border-border/20">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground">VedTechno</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-muted-foreground hover:text-foreground rounded transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 py-3 border-b border-border/20">
          <div className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white", config.color)}>
            <RoleIcon className="w-3 h-3" />
            {config.label} Dashboard
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto scrollbar-hide">
          {(config.sidebar as SidebarItem[]).map(({ icon: Icon, label, id }) => (
            <button
              key={id}
              onClick={() => handleSidebarNav(id)}
              className={cn("sidebar-link w-full", activeTab === id && "sidebar-link-active")}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border/20 space-y-1">
          <button onClick={() => handleSidebarNav("profile")} className={cn("sidebar-link w-full text-left", activeTab === "profile" && "sidebar-link-active")}>
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-lg object-cover flex-shrink-0 border border-border" />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 border border-primary/30">
                {getInitials(user.name)}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </button>
          <button onClick={() => handleSidebarNav("settings")} className={cn("sidebar-link w-full text-left", activeTab === "settings" && "sidebar-link-active")}>
            <Settings className="w-4 h-4" />Settings
          </button>
          <button onClick={handleLogout} className="sidebar-link text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full">
            <LogOut className="w-4 h-4" />Sign Out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen bg-muted/20 dark:bg-background">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors">
            <Menu className="w-5 h-5" />
          </button>

          {/* Search */}
          <div className="flex-1 relative max-w-sm hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              className="input-field pl-9 py-2 text-sm"
              placeholder="Search dashboard..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && filteredSuggestions.length > 0) {
                  const match = config.sidebar.find((s: SidebarItem) => s.label.toLowerCase() === filteredSuggestions[0].toLowerCase());
                  if (match) { handleSidebarNav(match.id); setSearchQuery(""); }
                }
              }}
            />
            {searchQuery && filteredSuggestions.length > 0 && (
              <div className="absolute top-full mt-1 left-0 right-0 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                {filteredSuggestions.map(s => {
                  const match = config.sidebar.find((si: SidebarItem) => si.label.toLowerCase().includes(s.toLowerCase()));
                  return (
                    <button key={s} onClick={() => { if (match) { handleSidebarNav(match.id); } setSearchQuery(""); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-muted transition-colors text-left">
                      <Search className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm text-foreground">{s}</span>
                    </button>
                  );
                })}
              </div>
            )}
            {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-3.5 h-3.5 text-muted-foreground" /></button>}
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Notifications */}
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 hover:bg-muted rounded-lg transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-border flex items-center justify-between">
                      <h3 className="font-semibold text-foreground text-sm">Notifications</h3>
                      <button onClick={() => { toast.success("All marked as read"); setNotifOpen(false); }} className="text-xs text-primary dark:text-primary/80 hover:underline">Mark all read</button>
                    </div>
                    {[
                      { title: "New course available", msg: "Advanced React Patterns is now live", time: "2m ago", dot: "bg-blue-500" },
                      { title: "Certificate earned!", msg: "You completed Python Fundamentals", time: "1h ago", dot: "bg-accent" },
                      { title: "Community mention", msg: "@maya replied to your thread", time: "3h ago", dot: "bg-orange-500" },
                    ].map((n, i) => (
                      <button key={i} onClick={() => { toast.info(n.msg); setNotifOpen(false); }} className="w-full flex items-start gap-3 p-4 hover:bg-muted transition-colors text-left border-b border-border last:border-0">
                        <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", n.dot)} />
                        <div>
                          <p className="text-sm font-medium text-foreground">{n.title}</p>
                          <p className="text-xs text-muted-foreground">{n.msg}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                        </div>
                      </button>
                    ))}
                    <div className="p-3 text-center">
                      <button onClick={() => { toast.info("Opening all notifications..."); setNotifOpen(false); }} className="text-xs text-primary dark:text-primary/80 hover:underline">View all notifications</button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button onClick={() => setActiveTab("profile")} className="focus:outline-none">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg object-cover border border-border" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold">
                  {getInitials(user.name)}
                </div>
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {activeTab === "profile" ? (
            <Profile />
          ) : activeTab === "settings" ? (
            <SettingsPage />
          ) : (
            <ChildDashboard user={user} initialTab={activeTab} key={activeTab} />
          )}
        </main>
      </div>
    </div>
  );
}

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  id: string;
}

const studentSidebar: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: BookOpen, label: "My Courses", id: "courses" },
  { icon: Code2, label: "Coding Lab", id: "lab" },
  { icon: Award, label: "Certificates", id: "certs" },
  { icon: Target, label: "Career Hub", id: "career" },
  { icon: Users, label: "Community", id: "community" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
];

const developerSidebar: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: Code2, label: "Coding Challenges", id: "challenges" },
  { icon: Trophy, label: "Hackathons", id: "hackathons" },
  { icon: Briefcase, label: "Portfolio", id: "portfolio" },
  { icon: Users, label: "Community", id: "community" },
  { icon: TrendingUp, label: "Career", id: "career" },
];

const trainerSidebar: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: BookOpen, label: "My Courses", id: "courses" },
  { icon: Users, label: "Students", id: "students" },
  { icon: DollarSign, label: "Revenue", id: "revenue" },
  { icon: Award, label: "Reviews", id: "reviews" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
];

const recruiterSidebar: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: Search, label: "Candidates", id: "candidates" },
  { icon: Briefcase, label: "Job Postings", id: "jobs" },
  { icon: MessageSquare, label: "Interviews", id: "interviews" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
];

const corporateSidebar: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: Users, label: "Team", id: "team" },
  { icon: BookOpen, label: "Learning Paths", id: "paths" },
  { icon: Award, label: "Certifications", id: "certs" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: FileText, label: "Reports", id: "reports" },
];

const startupSidebar: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: BookOpen, label: "Learning Path", id: "learning" },
  { icon: Lightbulb, label: "Innovation Hub", id: "innovation" },
  { icon: Users, label: "Mentorship", id: "mentors" },
  { icon: Trophy, label: "Challenges", id: "challenges" },
  { icon: Brain, label: "AI Tools", id: "ai" },
];

const adminSidebar: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: Users, label: "User Management", id: "users" },
  { icon: BookOpen, label: "Courses", id: "courses" },
  { icon: DollarSign, label: "Revenue", id: "revenue" },
  { icon: Flag, label: "Moderation", id: "moderation" },
  { icon: Server, label: "Platform", id: "platform" },
];
