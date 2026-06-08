import { useState, useMemo, useEffect } from "react";
import {
  Users, Briefcase, Search, Award, MessageSquare, BarChart3, Plus, Eye,
  CheckCircle2, TrendingUp, ArrowRight, Mail, X, Edit, Trash2,
  Download, Filter, Star, MapPin, DollarSign, Calendar, Link2, Send, FileText
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

const INIT_INTERVIEWS = [
  { id: 1, candidate: "Alex Johnson", role: "Senior React Developer", date: "Jun 7, 2026", time: "2:00 PM", type: "Technical", status: "scheduled", meetingLink: "https://meet.google.com/abc-defg-hij" },
  { id: 2, candidate: "Maya Patel", role: "ML Engineer", date: "Jun 8, 2026", time: "10:00 AM", type: "Final Round", status: "scheduled", meetingLink: "https://zoom.us/j/123456789" },
  { id: 3, candidate: "Daniel Kim", role: "Frontend Developer", date: "Jun 5, 2026", time: "3:30 PM", type: "Initial Screen", status: "completed", meetingLink: null },
];

// Mock applicants for jobs
const getApplicantsForJob = (jobTitle: string) => {
  const keywords = jobTitle.toLowerCase();
  if (keywords.includes("react")) return ALL_CANDIDATES.filter(c => c.role.includes("Frontend") || c.role.includes("Full Stack"));
  if (keywords.includes("ml") || keywords.includes("machine")) return ALL_CANDIDATES.filter(c => c.role.includes("ML") || c.role.includes("Data"));
  if (keywords.includes("devops")) return ALL_CANDIDATES.filter(c => c.role.includes("DevOps"));
  if (keywords.includes("designer")) return [];
  return ALL_CANDIDATES.slice(0, 3);
};

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

export default function RecruiterDashboard({ user, initialTab }: { user: User; initialTab?: string }) {
  const [activeTab, setActiveTab] = useState(initialTab || "overview");
  const [jobs, setJobs] = useState(INIT_JOBS);
  const [interviews, setInterviews] = useState(INIT_INTERVIEWS);
  const [candidateSearch, setCandidateSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewCandidateModal, setViewCandidateModal] = useState<{ open: boolean; candidate: typeof ALL_CANDIDATES[0] | null }>({ open: false, candidate: null });
  const [postJobModal, setPostJobModal] = useState(false);
  const [editJobModal, setEditJobModal] = useState<{ open: boolean; job: typeof INIT_JOBS[0] | null }>({ open: false, job: null });
  const [editJobForm, setEditJobForm] = useState({ title: "", dept: "", location: "", status: "" });
  const [newJob, setNewJob] = useState({ title: "", dept: "", location: "", type: "Full-time" });
  const [scheduleModal, setScheduleModal] = useState<{ open: boolean; interview?: typeof INIT_INTERVIEWS[0] }>({ open: false });
  const [scheduleForm, setScheduleForm] = useState({ candidate: "", date: "", time: "", type: "Initial Screen", link: "" });
  const [viewApplicantsModal, setViewApplicantsModal] = useState<{ open: boolean; job: typeof INIT_JOBS[0] | null }>({ open: false, job: null });
  const [messageModal, setMessageModal] = useState<{ open: boolean; candidateName: string }>({ open: false, candidateName: "" });
  const [messageText, setMessageText] = useState("");

  // Feedback modal state
  const [feedbackModal, setFeedbackModal] = useState<{ open: boolean; interview: typeof INIT_INTERVIEWS[0] | null }>({ open: false, interview: null });
  const [feedbackData, setFeedbackData] = useState({ rating: 3, decision: "Hire", comments: "" });
  const [feedbackList, setFeedbackList] = useState<{ interviewId: number; feedback: typeof feedbackData }[]>([]);

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

  // Job handlers
  const handlePostJob = () => {
    if (!newJob.title.trim()) { toast.error("Job title is required"); return; }
    const job = { 
      id: Date.now(), 
      title: newJob.title, 
      dept: newJob.dept || "General", 
      location: newJob.location || "Remote", 
      applicants: 0, 
      status: "active", 
      posted: "Just now", 
      type: newJob.type 
    };
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

  const openEditJob = (job: typeof INIT_JOBS[0]) => {
    setEditJobForm({ title: job.title, dept: job.dept, location: job.location, status: job.status });
    setEditJobModal({ open: true, job });
  };

  const handleEditJob = () => {
    if (!editJobModal.job) return;
    setJobs(prev => prev.map(j => 
      j.id === editJobModal.job!.id 
        ? { ...j, title: editJobForm.title, dept: editJobForm.dept, location: editJobForm.location, status: editJobForm.status as any }
        : j
    ));
    toast.success("Job updated!");
    setEditJobModal({ open: false, job: null });
  };

  // Interview handlers
  const openScheduleModal = (interview?: typeof INIT_INTERVIEWS[0]) => {
    if (interview) {
      setScheduleForm({
        candidate: interview.candidate,
        date: interview.date,
        time: interview.time,
        type: interview.type,
        link: interview.meetingLink || "",
      });
      setScheduleModal({ open: true, interview });
    } else {
      setScheduleForm({ candidate: "", date: "", time: "", type: "Initial Screen", link: "" });
      setScheduleModal({ open: true });
    }
  };

  const handleSchedule = () => {
    if (!scheduleForm.candidate || !scheduleForm.date || !scheduleForm.time) {
      toast.error("Please fill in candidate, date and time");
      return;
    }
    if (scheduleModal.interview) {
      // Reschedule existing interview
      setInterviews(prev => prev.map(i =>
        i.id === scheduleModal.interview!.id
          ? { ...i, date: scheduleForm.date, time: scheduleForm.time, type: scheduleForm.type, meetingLink: scheduleForm.link }
          : i
      ));
      toast.success(`Interview rescheduled for ${scheduleForm.candidate} on ${scheduleForm.date} at ${scheduleForm.time}`);
    } else {
      // Create new interview (simplified – just toast)
      toast.success(`Interview scheduled for ${scheduleForm.candidate} on ${scheduleForm.date} at ${scheduleForm.time}`);
    }
    setScheduleModal({ open: false });
  };

  const sendMeetingLink = (interview: typeof INIT_INTERVIEWS[0]) => {
    if (!interview.meetingLink) {
      toast.info("No meeting link set for this interview. Please add one in the interview settings.");
      return;
    }
    navigator.clipboard.writeText(interview.meetingLink);
    toast.success(`Meeting link copied to clipboard! You can now share it with ${interview.candidate}.`);
  };

  // Feedback handlers
  const openFeedbackModal = (interview: typeof INIT_INTERVIEWS[0]) => {
    const existing = feedbackList.find(f => f.interviewId === interview.id);
    setFeedbackData({
      rating: existing?.feedback.rating || 3,
      decision: existing?.feedback.decision || "Hire",
      comments: existing?.feedback.comments || "",
    });
    setFeedbackModal({ open: true, interview });
  };

  const submitFeedback = () => {
    if (!feedbackModal.interview) return;
    if (!feedbackData.comments.trim()) {
      toast.error("Please enter feedback comments");
      return;
    }
    // Save feedback
    setFeedbackList(prev => {
      const existing = prev.find(f => f.interviewId === feedbackModal.interview!.id);
      if (existing) {
        return prev.map(f => f.interviewId === feedbackModal.interview!.id ? { ...f, feedback: feedbackData } : f);
      } else {
        return [...prev, { interviewId: feedbackModal.interview!.id, feedback: feedbackData }];
      }
    });
    toast.success(`Feedback submitted for ${feedbackModal.interview.candidate}`);
    setFeedbackModal({ open: false, interview: null });
  };

  // Message handler
  const openMessageModal = (candidateName: string) => {
    setMessageText(`Hi ${candidateName.split(" ")[0]}, I came across your profile and would love to discuss an opportunity.`);
    setMessageModal({ open: true, candidateName });
  };

  const sendMessage = () => {
    if (!messageText.trim()) { toast.error("Please enter a message"); return; }
    toast.success(`Message sent to ${messageModal.candidateName}!`);
    setMessageModal({ open: false, candidateName: "" });
    setMessageText("");
  };

  // View applicants
  const openApplicantsModal = (job: typeof INIT_JOBS[0]) => {
    setViewApplicantsModal({ open: true, job });
  };

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-6 pb-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={cn("flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeTab === id ? "bg-accent text-white shadow-lg shadow-orange-600/25" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {/* Overview Tab (unchanged) */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Recruiter Hub </h1>
              <p className="text-sm text-muted-foreground">Find verified, certified tech talent ready to hire.</p>
            </div>
            <button onClick={() => setPostJobModal(true)} className="btn-primary text-sm bg-accent hover:bg-orange-700 shadow-orange-600/25">
              <Plus className="w-4 h-4 mr-1.5" />Post Job
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Active Jobs", value: String(jobs.filter(j => j.status === "active").length), icon: Briefcase, color: "text-orange-600 bg-accent/10", tab: "jobs" },
              { label: "Total Applicants", value: String(jobs.reduce((a, j) => a + j.applicants, 0)), icon: Users, color: "text-primary bg-primary/10", tab: "candidates" },
              { label: "Interviews Scheduled", value: String(interviews.filter(i => i.status === "scheduled").length), icon: MessageSquare, color: "text-accent bg-accent/10", tab: "interviews" },
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="font-semibold text-foreground">Top Matched Candidates</h2>
              <button onClick={() => setActiveTab("candidates")} className="text-sm text-orange-600 hover:underline flex items-center gap-1">
                Search all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-3">
              {ALL_CANDIDATES.slice(0, 3).map((c) => (
                <div key={c.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-orange-600 font-bold text-sm flex-shrink-0">
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
                    <p className="text-sm font-bold text-accent dark:text-emerald-400">{c.match}% match</p>
                    <p className="text-xs text-muted-foreground">{c.certs} certs</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => setViewCandidateModal({ open: true, candidate: c })} className="p-2 hover:bg-muted rounded-lg transition-colors"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                    <button onClick={() => openScheduleModal()} className="px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-orange-700 transition-colors">Invite</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Candidates Tab (unchanged) */}
      {activeTab === "candidates" && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
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
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-orange-600 font-bold flex-shrink-0">
                      {c.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground">{c.name}</h3>
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", {
                          "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-primary/80": c.status === "applied",
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
                      <p className="text-lg font-bold text-accent dark:text-emerald-400">{c.match}%</p>
                      <p className="text-xs text-muted-foreground">match · {c.certs} certs</p>
                      <div className="flex gap-1.5 mt-2">
                        <button onClick={() => setViewCandidateModal({ open: true, candidate: c })} className="p-1.5 border border-border rounded-lg hover:bg-muted transition-colors"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button onClick={() => openMessageModal(c.name)} className="p-1.5 border border-border rounded-lg hover:bg-muted transition-colors"><Mail className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button onClick={() => openScheduleModal()} className="px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-orange-700 transition-colors">Schedule</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Jobs Tab (unchanged) */}
      {activeTab === "jobs" && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h1 className="text-2xl font-bold text-foreground">Job Postings</h1>
            <button onClick={() => setPostJobModal(true)} className="btn-primary text-sm bg-accent hover:bg-orange-700">
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
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-primary/80">{job.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{job.dept} · {job.location} · Posted {job.posted}</p>
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400 mt-1">{job.applicants} applicants</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openApplicantsModal(job)} className="px-3 py-1.5 border border-border text-xs font-medium rounded-lg hover:bg-muted transition-colors text-foreground">View Apps</button>
                  <button onClick={() => openEditJob(job)} className="px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:bg-orange-700 transition-colors">Edit</button>
                  <button onClick={() => handleDeleteJob(job.id, job.title)} className="p-1.5 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interviews Tab (with Add Feedback button now functional) */}
      {activeTab === "interviews" && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h1 className="text-2xl font-bold text-foreground">Interview Schedule</h1>
            <button onClick={() => openScheduleModal()} className="btn-primary text-sm bg-accent hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-1.5" />Schedule Interview
            </button>
          </div>
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div key={interview.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0", interview.status === "scheduled" ? "bg-accent/10" : "bg-accent/10")}>
                      <MessageSquare className={cn("w-5 h-5", interview.status === "scheduled" ? "text-orange-600" : "text-accent")} />
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
                        <button onClick={() => sendMeetingLink(interview)} className="px-3 py-1.5 border border-border text-xs rounded-lg hover:bg-muted transition-colors text-foreground">Send Link</button>
                        <button onClick={() => openScheduleModal(interview)} className="px-3 py-1.5 bg-accent text-white text-xs rounded-lg hover:bg-orange-700 transition-colors">Reschedule</button>
                      </div>
                    ) : (
                      <button onClick={() => openFeedbackModal(interview)} className="px-3 py-1.5 bg-accent text-white text-xs rounded-lg hover:bg-accent/90 transition-colors">Add Feedback</button>
                    )}
                  </div>
                </div>
                {/* Show feedback if exists */}
                {(() => {
                  const saved = feedbackList.find(f => f.interviewId === interview.id);
                  if (saved) return (
                    <div className="mt-3 p-2 bg-muted rounded-lg text-xs">
                      <span className="font-medium text-foreground">Feedback: </span>
                      <span className="text-muted-foreground">{saved.feedback.decision} (⭐ {saved.feedback.rating})</span>
                    </div>
                  );
                  return null;
                })()}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab (unchanged) */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-foreground">Hiring Analytics</h1>
            <button onClick={() => toast.success("Analytics report downloaded!")} className="btn-secondary text-sm flex items-center gap-1.5">
              <Download className="w-4 h-4" />Export Report
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Time to Hire", value: "18 days", color: "text-orange-600" },
              { label: "Offer Accept Rate", value: "78%", color: "text-accent" },
              { label: "Qualified Rate", value: "42%", color: "text-primary" },
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

      {/* ---------- MODALS ---------- */}

      {/* Candidate Profile Modal (unchanged) */}
      <Modal open={viewCandidateModal.open} onClose={() => setViewCandidateModal({ open: false, candidate: null })} title="Candidate Profile">
        {viewCandidateModal.candidate && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center text-orange-600 font-bold text-2xl">
                {viewCandidateModal.candidate.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="font-bold text-foreground text-lg">{viewCandidateModal.candidate.name}</p>
                <p className="text-sm text-muted-foreground">{viewCandidateModal.candidate.role}</p>
                <p className="text-xs text-accent dark:text-emerald-400 font-bold">{viewCandidateModal.candidate.match}% match</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                {viewCandidateModal.candidate.skills.map(s => <span key={s} className="text-xs px-2 py-1 bg-accent/10 text-orange-600 dark:text-orange-400 rounded-lg font-medium">{s}</span>)}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { openScheduleModal(); setViewCandidateModal({ open: false, candidate: null }); }} className="flex-1 btn-primary text-sm bg-accent hover:bg-orange-700">Invite to Interview</button>
              <button onClick={() => { openMessageModal(viewCandidateModal.candidate!.name); setViewCandidateModal({ open: false, candidate: null }); }} className="flex-1 btn-secondary text-sm">Send Message</button>
            </div>
          </div>
        )}
      </Modal>

      {/* Post Job Modal (unchanged) */}
      <Modal open={postJobModal} onClose={() => setPostJobModal(false)} title="Post New Job">
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Job Title *</label><input className="input-field" placeholder="e.g. Senior React Developer" value={newJob.title} onChange={e => setNewJob(p => ({ ...p, title: e.target.value }))} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label className="block text-sm font-medium text-foreground mb-1.5">Department</label><input className="input-field" placeholder="Engineering" value={newJob.dept} onChange={e => setNewJob(p => ({ ...p, dept: e.target.value }))} /></div><div><label className="block text-sm font-medium text-foreground mb-1.5">Location</label><input className="input-field" placeholder="Remote / City" value={newJob.location} onChange={e => setNewJob(p => ({ ...p, location: e.target.value }))} /></div></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Employment Type</label><select className="input-field" value={newJob.type} onChange={e => setNewJob(p => ({ ...p, type: e.target.value }))}><option>Full-time</option><option>Part-time</option><option>Contract</option><option>Internship</option></select></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Job Description</label><textarea className="input-field resize-none min-h-[80px]" placeholder="Describe responsibilities, requirements..." /></div>
          <div className="flex gap-3"><button onClick={() => setPostJobModal(false)} className="flex-1 btn-secondary text-sm">Cancel</button><button onClick={handlePostJob} className="flex-1 btn-primary text-sm bg-accent hover:bg-orange-700">Post Job</button></div>
        </div>
      </Modal>

      {/* Edit Job Modal (unchanged) */}
      <Modal open={editJobModal.open} onClose={() => setEditJobModal({ open: false, job: null })} title="Edit Job Posting">
        {editJobModal.job && (
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Job Title</label><input className="input-field" value={editJobForm.title} onChange={e => setEditJobForm({ ...editJobForm, title: e.target.value })} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label className="block text-sm font-medium text-foreground mb-1.5">Department</label><input className="input-field" value={editJobForm.dept} onChange={e => setEditJobForm({ ...editJobForm, dept: e.target.value })} /></div><div><label className="block text-sm font-medium text-foreground mb-1.5">Location</label><input className="input-field" value={editJobForm.location} onChange={e => setEditJobForm({ ...editJobForm, location: e.target.value })} /></div></div>
            <div><label className="block text-sm font-medium text-foreground mb-1.5">Status</label><select className="input-field" value={editJobForm.status} onChange={e => setEditJobForm({ ...editJobForm, status: e.target.value })}><option value="active">Active</option><option value="draft">Draft</option><option value="closed">Closed</option></select></div>
            <div className="flex gap-3"><button onClick={() => setEditJobModal({ open: false, job: null })} className="flex-1 btn-secondary text-sm">Cancel</button><button onClick={handleEditJob} className="flex-1 btn-primary text-sm bg-accent hover:bg-orange-700">Save Changes</button></div>
          </div>
        )}
      </Modal>

      {/* Schedule / Reschedule Modal (unchanged) */}
      <Modal open={scheduleModal.open} onClose={() => setScheduleModal({ open: false })} title={scheduleModal.interview ? "Reschedule Interview" : "Schedule Interview"}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Candidate *</label><input className="input-field" value={scheduleForm.candidate} onChange={e => setScheduleForm({ ...scheduleForm, candidate: e.target.value })} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div><label className="block text-sm font-medium text-foreground mb-1.5">Date *</label><input type="date" className="input-field" value={scheduleForm.date} onChange={e => setScheduleForm({ ...scheduleForm, date: e.target.value })} /></div><div><label className="block text-sm font-medium text-foreground mb-1.5">Time *</label><input type="time" className="input-field" value={scheduleForm.time} onChange={e => setScheduleForm({ ...scheduleForm, time: e.target.value })} /></div></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Interview Type</label><select className="input-field" value={scheduleForm.type} onChange={e => setScheduleForm({ ...scheduleForm, type: e.target.value })}><option>Initial Screen</option><option>Technical Round</option><option>System Design</option><option>Final Round</option></select></div>
          <div><label className="block text-sm font-medium text-foreground mb-1.5">Meeting Link (optional)</label><input className="input-field" placeholder="https://meet.google.com/..." value={scheduleForm.link} onChange={e => setScheduleForm({ ...scheduleForm, link: e.target.value })} /></div>
          <button onClick={handleSchedule} className="btn-primary w-full text-sm bg-accent hover:bg-orange-700">{scheduleModal.interview ? "Reschedule & Notify" : "Schedule & Send Invite"}</button>
        </div>
      </Modal>

      {/* Message Modal (unchanged) */}
      <Modal open={messageModal.open} onClose={() => setMessageModal({ open: false, candidateName: "" })} title={`Message ${messageModal.candidateName}`}>
        <div className="space-y-4">
          <textarea className="input-field resize-none min-h-[120px]" placeholder="Type your message..." value={messageText} onChange={e => setMessageText(e.target.value)} />
          <button onClick={sendMessage} className="w-full btn-primary bg-accent hover:bg-orange-700 flex items-center justify-center gap-2"><Send className="w-4 h-4" /> Send Message</button>
        </div>
      </Modal>

      {/* View Applicants Modal (unchanged) */}
      <Modal open={viewApplicantsModal.open} onClose={() => setViewApplicantsModal({ open: false, job: null })} title={`Applicants for ${viewApplicantsModal.job?.title}`}>
        {viewApplicantsModal.job && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{getApplicantsForJob(viewApplicantsModal.job.title).length} applicants found</p>
            {getApplicantsForJob(viewApplicantsModal.job.title).map((candidate, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 border border-border rounded-xl">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-orange-600 font-bold text-sm">{candidate.name.split(" ").map(n => n[0]).join("")}</div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{candidate.name}</p>
                  <p className="text-xs text-muted-foreground">{candidate.role} · {candidate.match}% match</p>
                </div>
                <button onClick={() => openScheduleModal()} className="px-2 py-1 bg-accent text-white text-xs rounded-lg hover:bg-orange-700">Invite</button>
              </div>
            ))}
            {getApplicantsForJob(viewApplicantsModal.job.title).length === 0 && <p className="text-center text-muted-foreground py-8">No applicants yet.</p>}
          </div>
        )}
      </Modal>

      {/* Feedback Modal */}
      <Modal open={feedbackModal.open} onClose={() => setFeedbackModal({ open: false, interview: null })} title={`Feedback for ${feedbackModal.interview?.candidate}`}>
        {feedbackModal.interview && (
          <div className="space-y-4">
            <div className="bg-muted rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Interview details</p>
              <p className="text-sm font-medium text-foreground">{feedbackModal.interview.role} · {feedbackModal.interview.type}</p>
              <p className="text-xs text-muted-foreground">{feedbackModal.interview.date} at {feedbackModal.interview.time}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Rating (1-5)</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(r => (
                  <button
                    key={r}
                    onClick={() => setFeedbackData(prev => ({ ...prev, rating: r }))}
                    className={cn("px-3 py-1.5 rounded-lg text-sm transition-colors", feedbackData.rating === r ? "bg-accent text-white" : "bg-muted text-foreground hover:bg-muted/80")}
                  >
                    {r}★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Decision</label>
              <select className="input-field" value={feedbackData.decision} onChange={e => setFeedbackData(prev => ({ ...prev, decision: e.target.value }))}>
                <option>Hire</option><option>Consider for another role</option><option>Reject</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Comments *</label>
              <textarea className="input-field resize-none min-h-[100px]" placeholder="Provide detailed feedback..." value={feedbackData.comments} onChange={e => setFeedbackData(prev => ({ ...prev, comments: e.target.value }))} />
            </div>
            <button onClick={submitFeedback} className="btn-primary w-full text-sm bg-accent hover:bg-accent/90">Submit Feedback</button>
          </div>
        )}
      </Modal>
    </div>
  );
}