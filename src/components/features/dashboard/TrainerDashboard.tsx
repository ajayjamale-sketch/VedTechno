import { useState, useMemo, useEffect } from "react";
import {
  BookOpen, Users, BarChart3, DollarSign, Star, MessageSquare, TrendingUp,
  Plus, Eye, Edit, CheckCircle2, Clock, Award, ChevronRight, ArrowRight,
  Search, X, Trash2, Filter, Download, UploadCloud, Send, CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BarChart, Bar, ResponsiveContainer, XAxis, Tooltip, CartesianGrid, LineChart, Line, AreaChart, Area } from "recharts";
import { toast } from "sonner";
import type { User } from "@/types";

const revenueData = [
  { month: "Jan", revenue: 2400 }, { month: "Feb", revenue: 3200 }, { month: "Mar", revenue: 2800 },
  { month: "Apr", revenue: 4100 }, { month: "May", revenue: 5200 }, { month: "Jun", revenue: 4800 },
];
const enrollmentData = [
  { month: "Jan", students: 45 }, { month: "Feb", students: 62 }, { month: "Mar", students: 58 },
  { month: "Apr", students: 89 }, { month: "May", students: 112 }, { month: "Jun", students: 98 },
];

const INIT_COURSES = [
  { id: 1, title: "Machine Learning with Python", students: 1247, rating: 4.9, revenue: 12470, status: "published", category: "AI/ML" },
  { id: 2, title: "Deep Learning & Neural Networks", students: 892, rating: 4.8, revenue: 8920, status: "published", category: "AI/ML" },
  { id: 3, title: "Natural Language Processing", students: 634, rating: 4.7, revenue: 6340, status: "published", category: "AI/ML" },
  { id: 4, title: "Computer Vision Fundamentals", students: 0, rating: 0, revenue: 0, status: "draft", category: "AI/ML" },
];

const STUDENTS_DATA = [
  { name: "Priya Sharma", course: "Machine Learning with Python", progress: 78, last: "Today", status: "active", email: "priya@example.com" },
  { name: "Marcus Chen", course: "Deep Learning & Neural Networks", progress: 45, last: "Yesterday", status: "active", email: "marcus@example.com" },
  { name: "Sarah Mitchell", course: "Machine Learning with Python", progress: 92, last: "2 days ago", status: "active", email: "sarah@example.com" },
  { name: "Arjun Nair", course: "Natural Language Processing", progress: 23, last: "1 week ago", status: "inactive", email: "arjun@example.com" },
  { name: "Emily Rodriguez", course: "Deep Learning & Neural Networks", progress: 67, last: "3 days ago", status: "active", email: "emily@example.com" },
];

const REVIEWS = [
  { name: "Priya Sharma", course: "Machine Learning with Python", rating: 5, text: "Outstanding course! The explanations are crystal clear and projects are amazing.", date: "3 days ago" },
  { name: "Marcus Chen", course: "Deep Learning & Neural Networks", rating: 5, text: "Best ML course I've taken. The hands-on labs are worth every penny.", date: "1 week ago" },
  { name: "Emily Rodriguez", course: "Deep Learning & Neural Networks", rating: 4, text: "Very comprehensive. Would love more real-world case studies.", date: "2 weeks ago" },
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

export default function TrainerDashboard({ user, initialTab }: { user: User; initialTab?: string }) {
  const [activeTab, setActiveTab] = useState(initialTab || "overview");
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem("trainer_courses");
    return saved ? JSON.parse(saved) : INIT_COURSES;
  });
  const [createCourseModal, setCreateCourseModal] = useState(false);
  const [editCourseModal, setEditCourseModal] = useState<{ open: boolean; course: typeof INIT_COURSES[0] | null }>({ open: false, course: null });
  const [editFormData, setEditFormData] = useState({ title: "", category: "", status: "" });
  const [viewStudentModal, setViewStudentModal] = useState<{ open: boolean; student: typeof STUDENTS_DATA[0] | null }>({ open: false, student: null });
  const [studentSearch, setStudentSearch] = useState("");
  const [studentFilter, setStudentFilter] = useState("All");
  const [newCourse, setNewCourse] = useState({ title: "", category: "AI/ML", price: "" });
  const [reviewModal, setReviewModal] = useState<{ open: boolean; review: typeof REVIEWS[0] | null }>({ open: false, review: null });
  const [reviewReply, setReviewReply] = useState("");

  // New state for functional buttons
  const [previewModal, setPreviewModal] = useState<{ open: boolean; course: typeof INIT_COURSES[0] | null }>({ open: false, course: null });
  const [messageModal, setMessageModal] = useState<{ open: boolean; student: typeof STUDENTS_DATA[0] | null }>({ open: false, student: null });
  const [messageText, setMessageText] = useState("");
  const [payoutModal, setPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("bank");

  // Persist courses to localStorage
  useEffect(() => {
    localStorage.setItem("trainer_courses", JSON.stringify(courses));
  }, [courses]);

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "courses", label: "My Courses", icon: BookOpen },
    { id: "students", label: "Students", icon: Users },
    { id: "revenue", label: "Revenue", icon: DollarSign },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ];

  const filteredStudents = useMemo(() => {
    return STUDENTS_DATA.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.course.toLowerCase().includes(studentSearch.toLowerCase());
      const matchFilter = studentFilter === "All" || s.status === studentFilter.toLowerCase();
      return matchSearch && matchFilter;
    });
  }, [studentSearch, studentFilter]);

  const totalStudents = courses.reduce((sum, c) => sum + c.students, 0);
  const totalRevenue = courses.reduce((sum, c) => sum + c.revenue, 0);
  const avgRating = courses.filter(c => c.rating > 0).reduce((sum, c, _, arr) => sum + c.rating / arr.length, 0).toFixed(1) || "0";

  // Course handlers
  const handleCreateCourse = () => {
    if (!newCourse.title.trim()) { toast.error("Course title is required"); return; }
    const newId = Math.max(...courses.map(c => c.id), 0) + 1;
    const course = {
      id: newId,
      title: newCourse.title,
      students: 0,
      rating: 0,
      revenue: 0,
      status: "draft",
      category: newCourse.category,
    };
    setCourses(prev => [...prev, course]);
    toast.success("Course created! You can now add content.");
    setCreateCourseModal(false);
    setNewCourse({ title: "", category: "AI/ML", price: "" });
    setActiveTab("courses");
  };

  const handlePublish = (id: number) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, status: "published" } : c));
    toast.success("Course published successfully!");
  };

  const handleDeleteCourse = (id: number, title: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    toast.success(`"${title}" deleted`);
  };

  const openEditModal = (course: typeof INIT_COURSES[0]) => {
    setEditFormData({ title: course.title, category: course.category, status: course.status });
    setEditCourseModal({ open: true, course });
  };

  const handleEditCourse = () => {
    if (!editCourseModal.course) return;
    setCourses(prev => prev.map(c => 
      c.id === editCourseModal.course!.id 
        ? { ...c, title: editFormData.title, category: editFormData.category, status: editFormData.status as any }
        : c
    ));
    toast.success("Course updated!");
    setEditCourseModal({ open: false, course: null });
  };

  // Student actions
  const exportCSV = () => {
    const csv = ["Name,Course,Progress,Status,Last Active"]
      .concat(filteredStudents.map(s => `${s.name},${s.course},${s.progress},${s.status},${s.last}`))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("CSV exported successfully!");
  };

  const openMessageModal = (student: typeof STUDENTS_DATA[0]) => {
    setMessageModal({ open: true, student });
    setMessageText(`Hi ${student.name.split(" ")[0]}, I wanted to check in on your progress in ${student.course}. Let me know if you need any help!`);
  };

  const sendMessage = () => {
    if (!messageText.trim()) {
      toast.error("Please enter a message");
      return;
    }
    toast.success(`Message sent to ${messageModal.student?.name}!`);
    setMessageModal({ open: false, student: null });
    setMessageText("");
  };

  // Review handlers
  const submitReply = () => {
    if (!reviewReply.trim()) { toast.error("Please enter a reply"); return; }
    toast.success("Reply published! The student will be notified.");
    setReviewModal({ open: false, review: null });
    setReviewReply("");
  };

  const flagReview = () => toast.info("Review flagged for moderation. Our team will review it.");

  // Payout handler
  const requestPayout = () => {
    if (!payoutAmount || parseFloat(payoutAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    toast.success(`Payout request of $${payoutAmount} submitted via ${payoutMethod === "bank" ? "Bank Transfer" : "PayPal"}. You will receive funds within 5-7 business days.`);
    setPayoutModal(false);
    setPayoutAmount("");
  };

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-6 pb-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={cn("flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeTab === id ? "bg-accent text-white shadow-lg shadow-accent/25" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {/* Overview Tab (unchanged) */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Instructor Dashboard 🎓</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user.name.split(" ")[0]}. Here's your teaching overview.</p>
            </div>
            <button onClick={() => setCreateCourseModal(true)} className="btn-primary text-sm bg-accent hover:bg-accent/90 shadow-accent/25">
              <Plus className="w-4 h-4 mr-1.5" />Create Course
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Students", value: totalStudents.toLocaleString(), icon: Users, color: "text-accent bg-accent/10", tab: "students" },
              { label: "Active Courses", value: courses.filter(c => c.status === "published").length.toString(), icon: BookOpen, color: "text-primary bg-primary/10", tab: "courses" },
              { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-yellow-600 bg-yellow-600/10", tab: "revenue" },
              { label: "Avg Rating", value: `${avgRating}★`, icon: Star, color: "text-orange-600 bg-accent/10", tab: "reviews" },
            ].map(({ label, value, icon: Icon, color, tab }) => (
              <button key={label} onClick={() => setActiveTab(tab)}
                className="bg-card border border-border rounded-2xl p-4 hover:border-accent/30 transition-colors text-left">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", color)}><Icon className="w-4 h-4" /></div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
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
                    <Tooltip formatter={(v: number) => [`$${v}`, "Revenue"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                    <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">New Enrollments</h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={enrollmentData}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                    <Line type="monotone" dataKey="students" stroke="#10B981" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">My Courses</h2>
              <button onClick={() => setActiveTab("courses")} className="text-sm text-accent hover:underline flex items-center gap-1">
                Manage all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              {courses.slice(0, 3).map((c) => (
                <div key={c.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.students} students · {c.rating > 0 ? `★ ${c.rating}` : "No reviews yet"}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-foreground">{c.revenue > 0 ? `$${c.revenue.toLocaleString()}` : "—"}</p>
                    <span className={cn("text-xs font-medium", c.status === "published" ? "text-accent" : "text-yellow-600")}>{c.status}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setPreviewModal({ open: true, course: c })} className="p-2 hover:bg-muted rounded-lg transition-colors"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                    <button onClick={() => openEditModal(c)} className="p-2 hover:bg-muted rounded-lg transition-colors"><Edit className="w-4 h-4 text-muted-foreground" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Courses Tab */}
      {activeTab === "courses" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">Course Management</h1>
            <button onClick={() => setCreateCourseModal(true)} className="btn-primary text-sm bg-accent hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-1.5" />New Course
            </button>
          </div>
          <div className="space-y-4">
            {courses.map((c) => (
              <div key={c.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-foreground">{c.title}</h3>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", c.status === "published" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400")}>{c.status}</span>
                    </div>
                    <div className="flex gap-6 text-sm text-muted-foreground">
                      <span>{c.students} enrolled</span>
                      {c.rating > 0 && <span>★ {c.rating} rating</span>}
                      <span className="text-accent font-medium">{c.revenue > 0 ? `$${c.revenue.toLocaleString()} earned` : "Not yet earning"}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => setPreviewModal({ open: true, course: c })} className="px-3 py-1.5 border border-border rounded-lg text-xs hover:bg-muted transition-colors text-foreground">Preview</button>
                    <button onClick={() => openEditModal(c)} className="px-3 py-1.5 bg-accent text-white rounded-lg text-xs hover:bg-accent/90 transition-colors">Edit</button>
                    <button onClick={() => handleDeleteCourse(c.id, c.title)} className="px-3 py-1.5 border border-red-200 dark:border-red-800 text-red-600 rounded-lg text-xs hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Delete</button>
                  </div>
                </div>
                {c.status === "draft" && (
                  <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-center justify-between">
                    <p className="text-xs text-yellow-700 dark:text-yellow-400">Draft mode — complete all sections to publish.</p>
                    <button onClick={() => handlePublish(c.id)} className="text-xs px-3 py-1 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">Publish Now</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Students Tab */}
      {activeTab === "students" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Student Management</h1>
            <button onClick={exportCSV} className="btn-secondary text-sm flex items-center gap-1.5">
              <Download className="w-4 h-4" />Export CSV
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input className="input-field pl-9 py-2 text-sm" placeholder="Search by name or course..."
                value={studentSearch} onChange={e => setStudentSearch(e.target.value)} />
              {studentSearch && <button onClick={() => setStudentSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
            </div>
            {["All", "Active", "Inactive"].map(f => (
              <button key={f} onClick={() => setStudentFilter(f)}
                className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all border whitespace-nowrap", studentFilter === f ? "bg-accent text-white border-accent" : "border-border text-muted-foreground hover:bg-muted")}>
                {f}
              </button>
            ))}
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-3 border-b border-border text-xs text-muted-foreground">{filteredStudents.length} students shown</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    {["Student", "Course", "Progress", "Last Active", "Status", "Actions"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">No students match your search</td></tr>
                  ) : filteredStudents.map((s, i) => (
                    <tr key={i} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground text-sm">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.email}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground max-w-[160px] truncate">{s.course}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 bg-muted rounded-full w-16 flex-shrink-0">
                            <div className={cn("h-full rounded-full", s.progress >= 70 ? "bg-accent" : s.progress >= 40 ? "bg-yellow-500" : "bg-red-500")} style={{ width: `${s.progress}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{s.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{s.last}</td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", s.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400")}>{s.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setViewStudentModal({ open: true, student: s })} className="p-1.5 hover:bg-muted rounded transition-colors" title="View details">
                            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                          <button onClick={() => openMessageModal(s)} className="px-2 py-1 bg-accent text-white text-xs rounded-lg hover:bg-accent/90 transition-colors">
                            Message
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

      {/* Revenue Tab */}
      {activeTab === "revenue" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Revenue Analytics</h1>
            <button onClick={() => toast.success("Revenue report downloaded!")} className="btn-secondary text-sm flex items-center gap-1.5">
              <Download className="w-4 h-4" />Download Report
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Earned", value: `$${totalRevenue.toLocaleString()}`, color: "text-accent" },
              { label: "This Month", value: "$4,800", color: "text-primary" },
              { label: "Avg per Student", value: totalStudents ? `$${(totalRevenue / totalStudents).toFixed(2)}` : "$0", color: "text-violet-600" },
              { label: "Pending Payout", value: "$1,230", color: "text-orange-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-card border border-border rounded-2xl p-4 text-center">
                <p className={cn("text-2xl font-bold", color)}>{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">Monthly Revenue Trend</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs><linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.3} /><stop offset="95%" stopColor="#10B981" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => [`$${v}`, "Revenue"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} fill="url(#emeraldGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border"><h3 className="font-semibold text-foreground text-sm">Revenue by Course</h3></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50"><tr>{["Course", "Students", "Revenue", "Avg Per Student"].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground">{h}</th>)}</tr></thead>
                <tbody>
                  {courses.filter(c => c.status === "published").map((c) => (
                    <tr key={c.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground text-sm">{c.title}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{c.students.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm font-bold text-accent dark:text-emerald-400">${c.revenue.toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{c.students > 0 ? `$${(c.revenue / c.students).toFixed(2)}` : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-center">
            <button onClick={() => setPayoutModal(true)} className="btn-primary text-sm bg-accent hover:bg-accent/90">Request Payout ($1,230)</button>
          </div>
        </div>
      )}

      {/* Reviews Tab (unchanged) */}
      {activeTab === "reviews" && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-foreground">Student Reviews</h1>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Overall Rating", value: `${avgRating}★`, color: "text-yellow-500" },
              { label: "Total Reviews", value: REVIEWS.length.toString(), color: "text-primary" },
              { label: "5-Star Reviews", value: `${Math.round((REVIEWS.filter(r => r.rating === 5).length / REVIEWS.length) * 100)}%`, color: "text-accent" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-card border border-border rounded-2xl p-4 text-center">
                <p className={cn("text-2xl font-bold", color)}>{value}</p>
                <p className="text-xs text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.course} · {r.date}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(r.rating)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-yellow-400 fill-current" />)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{r.text}</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setReviewModal({ open: true, review: r })} className="text-xs text-accent dark:text-emerald-400 hover:underline">Reply to review</button>
                  <span className="text-muted-foreground">·</span>
                  <button onClick={flagReview} className="text-xs text-muted-foreground hover:text-foreground">Flag</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab (unchanged) */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-foreground">Teaching Analytics</h1>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Monthly Revenue</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v: number) => [`$${v}`, "Revenue"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                    <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">New Enrollments</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={enrollmentData}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                    <Line type="monotone" dataKey="students" stroke="#10B981" strokeWidth={2.5} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-semibold text-foreground text-sm mb-4">Course Performance Comparison</h3>
            <div className="space-y-3">
              {courses.filter(c => c.students > 0).map(c => (
                <div key={c.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground font-medium truncate flex-1 mr-4">{c.title}</span>
                    <span className="text-muted-foreground flex-shrink-0">{c.students} students</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${Math.min(100, (c.students / 1500) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------- MODALS ---------- */}

      {/* Preview Course Modal */}
      <Modal open={previewModal.open} onClose={() => setPreviewModal({ open: false, course: null })} title="Course Preview">
        {previewModal.course && (
          <div className="space-y-4">
            <div className="aspect-video bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-white/20" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{previewModal.course.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{previewModal.course.category}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">Students:</span> <span className="font-medium">{previewModal.course.students}</span></div>
              <div><span className="text-muted-foreground">Rating:</span> <span className="font-medium">{previewModal.course.rating > 0 ? `★ ${previewModal.course.rating}` : "Not rated"}</span></div>
              <div><span className="text-muted-foreground">Status:</span> <span className={cn("font-medium", previewModal.course.status === "published" ? "text-accent" : "text-yellow-600")}>{previewModal.course.status}</span></div>
              <div><span className="text-muted-foreground">Revenue:</span> <span className="font-medium text-accent">${previewModal.course.revenue.toLocaleString()}</span></div>
            </div>
            <div className="bg-muted rounded-xl p-4">
              <p className="text-sm text-foreground font-medium">Course Description</p>
              <p className="text-sm text-muted-foreground mt-1">This course covers comprehensive {previewModal.course.title}. Students will learn practical skills through hands-on projects and real-world examples.</p>
            </div>
            <button onClick={() => setPreviewModal({ open: false, course: null })} className="btn-primary w-full text-sm bg-accent hover:bg-accent/90">Close Preview</button>
          </div>
        )}
      </Modal>

      {/* Message Student Modal */}
      <Modal open={messageModal.open} onClose={() => setMessageModal({ open: false, student: null })} title={`Message ${messageModal.student?.name || "Student"}`}>
        {messageModal.student && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold">
                {messageModal.student.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{messageModal.student.name}</p>
                <p className="text-xs text-muted-foreground">{messageModal.student.email}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
              <textarea 
                className="input-field resize-none min-h-[120px]" 
                placeholder="Type your message here..."
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
              />
            </div>
            <button onClick={sendMessage} className="w-full btn-primary bg-accent hover:bg-accent/90 flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Send Message
            </button>
          </div>
        )}
      </Modal>

      {/* Payout Request Modal */}
      <Modal open={payoutModal} onClose={() => setPayoutModal(false)} title="Request Payout">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Available Balance</label>
            <p className="text-2xl font-bold text-accent">$1,230</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Amount to Withdraw *</label>
            <input 
              type="number" 
              className="input-field" 
              placeholder="e.g. 500"
              value={payoutAmount}
              onChange={e => setPayoutAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">Min: $100 | Max: $1,230</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Payout Method</label>
            <select className="input-field" value={payoutMethod} onChange={e => setPayoutMethod(e.target.value)}>
              <option value="bank">Bank Transfer (2-3 business days)</option>
              <option value="paypal">PayPal (instant)</option>
              <option value="wise">Wise (1 business day)</option>
            </select>
          </div>
          <div className="bg-muted rounded-xl p-3">
            <p className="text-xs text-muted-foreground">Processing fee: 2% for PayPal, free for bank transfer.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setPayoutModal(false)} className="flex-1 btn-secondary text-sm">Cancel</button>
            <button onClick={requestPayout} className="flex-1 btn-primary text-sm bg-accent hover:bg-accent/90 flex items-center justify-center gap-1">
              <CreditCard className="w-4 h-4" /> Request Payout
            </button>
          </div>
        </div>
      </Modal>

      {/* Existing Modals (Create, Edit, View Student, Review Reply) - unchanged */}
      <Modal open={createCourseModal} onClose={() => setCreateCourseModal(false)} title="Create New Course">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Course Title *</label><input className="input-field" placeholder="e.g. Advanced React Patterns" value={newCourse.title} onChange={e => setNewCourse(p => ({ ...p, title: e.target.value }))} /></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Category</label><select className="input-field" value={newCourse.category} onChange={e => setNewCourse(p => ({ ...p, category: e.target.value }))}>{["AI/ML", "Web Development", "Cloud Computing", "Cybersecurity", "Data Science", "Mobile Development"].map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Price (USD)</label><input type="number" className="input-field" placeholder="e.g. 79" value={newCourse.price} onChange={e => setNewCourse(p => ({ ...p, price: e.target.value }))} /></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Course Description</label><textarea className="input-field resize-none min-h-[80px]" placeholder="What will students learn?" /></div>
          <div className="flex gap-3"><button onClick={() => setCreateCourseModal(false)} className="flex-1 btn-secondary text-sm">Cancel</button><button onClick={handleCreateCourse} className="flex-1 btn-primary text-sm bg-accent hover:bg-accent/90">Create Course</button></div>
        </div>
      </Modal>

      <Modal open={editCourseModal.open} onClose={() => setEditCourseModal({ open: false, course: null })} title="Edit Course">
        {editCourseModal.course && (
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Course Title</label><input className="input-field" value={editFormData.title} onChange={e => setEditFormData({ ...editFormData, title: e.target.value })} /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Category</label><select className="input-field" value={editFormData.category} onChange={e => setEditFormData({ ...editFormData, category: e.target.value })}>{["AI/ML", "Web Development", "Cloud Computing", "Cybersecurity", "Data Science"].map(c => <option key={c}>{c}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Status</label><select className="input-field" value={editFormData.status} onChange={e => setEditFormData({ ...editFormData, status: e.target.value })}><option value="draft">Draft</option><option value="published">Published</option></select></div>
            <div className="flex gap-3"><button onClick={() => setEditCourseModal({ open: false, course: null })} className="flex-1 btn-secondary text-sm">Cancel</button><button onClick={handleEditCourse} className="flex-1 btn-primary text-sm bg-accent hover:bg-accent/90">Save Changes</button></div>
          </div>
        )}
      </Modal>

      <Modal open={viewStudentModal.open} onClose={() => setViewStudentModal({ open: false, student: null })} title="Student Details">
        {viewStudentModal.student && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent font-bold text-xl">{viewStudentModal.student.name.split(" ").map(n => n[0]).join("")}</div>
              <div><p className="font-bold text-foreground">{viewStudentModal.student.name}</p><p className="text-sm text-muted-foreground">{viewStudentModal.student.email}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted rounded-xl p-3"><p className="text-xs text-muted-foreground">Course</p><p className="text-sm font-medium text-foreground mt-0.5 line-clamp-2">{viewStudentModal.student.course}</p></div>
              <div className="bg-muted rounded-xl p-3"><p className="text-xs text-muted-foreground">Progress</p><p className="text-sm font-bold text-foreground mt-0.5">{viewStudentModal.student.progress}%</p></div>
              <div className="bg-muted rounded-xl p-3"><p className="text-xs text-muted-foreground">Last Active</p><p className="text-sm font-medium text-foreground mt-0.5">{viewStudentModal.student.last}</p></div>
              <div className="bg-muted rounded-xl p-3"><p className="text-xs text-muted-foreground">Status</p><span className={cn("text-xs px-2 py-0.5 rounded-full font-medium inline-block mt-0.5", viewStudentModal.student.status === "active" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400")}>{viewStudentModal.student.status}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { openMessageModal(viewStudentModal.student!); setViewStudentModal({ open: false, student: null }); }} className="flex-1 btn-primary text-sm bg-accent hover:bg-accent/90">Send Message</button>
              <button onClick={() => setViewStudentModal({ open: false, student: null })} className="flex-1 btn-secondary text-sm">Close</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={reviewModal.open} onClose={() => setReviewModal({ open: false, review: null })} title="Reply to Review">
        {reviewModal.review && (
          <div className="space-y-4">
            <div className="bg-muted rounded-xl p-3"><p className="text-xs font-medium text-foreground">{reviewModal.review.name}</p><p className="text-xs text-muted-foreground mt-1">{reviewModal.review.text}</p></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Your Reply</label><textarea className="input-field resize-none min-h-[100px]" placeholder="Thank you for your feedback..." value={reviewReply} onChange={e => setReviewReply(e.target.value)} /></div>
            <button onClick={submitReply} className="btn-primary w-full text-sm bg-accent hover:bg-accent/90">Publish Reply</button>
          </div>
        )}
      </Modal>
    </div>
  );
}