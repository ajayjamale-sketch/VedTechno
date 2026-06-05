import { useState, useMemo, useEffect } from "react";
import {
  Rocket, BookOpen, Users, Trophy, Brain, TrendingUp, Lightbulb,
  Target, Star, Zap, ArrowRight, Plus, CheckCircle2, Clock, MessageSquare,
  X, Search, Calendar, DollarSign, ExternalLink, Edit, Trash2, Send, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";
import { toast } from "sonner";
import type { User } from "@/types";

const growthData = [
  { month: "Jan", score: 40 }, { month: "Feb", score: 48 }, { month: "Mar", score: 55 },
  { month: "Apr", score: 63 }, { month: "May", score: 72 }, { month: "Jun", score: 81 },
];
const learningData = [
  { week: "W1", hours: 8 }, { week: "W2", hours: 12 }, { week: "W3", hours: 10 }, { week: "W4", hours: 15 },
];

const MENTORS = [
  { id: 1, name: "David Chen", role: "CTO at CloudNine", expertise: ["AWS", "Scaling", "Team Building"], rating: 4.9, available: true },
  { id: 2, name: "Sarah Kim", role: "Founder @ ProductHQ", expertise: ["Product Strategy", "Go-to-market", "Fundraising"], rating: 4.8, available: true },
  { id: 3, name: "Marcus Torres", role: "Engineering Lead @ Meta", expertise: ["System Design", "ML", "Hiring"], rating: 4.9, available: false },
  { id: 4, name: "Anita Patel", role: "VC Partner @ TechFund", expertise: ["Fundraising", "Pitch Deck", "Valuation"], rating: 4.7, available: true },
];

const INIT_LEARNING_MODULES = [
  { id: 1, title: "Startup Fundamentals", module: "Business Model Canvas", status: "completed", lessons: 12, duration: "4h" },
  { id: 2, title: "Technical Product Building", module: "MVP Development", status: "in-progress", lessons: 18, duration: "8h" },
  { id: 3, title: "Fundraising & Pitch", module: "Investor Decks", status: "upcoming", lessons: 10, duration: "6h" },
  { id: 4, title: "Growth & Marketing", module: "Product-Led Growth", status: "upcoming", lessons: 14, duration: "5h" },
];

const INIT_IDEAS = [
  { id: 1, name: "NeuralEdge v2.0 — Context-aware AI editor", stage: "Development", votes: 47, status: "in-progress" },
  { id: 2, name: "AI-powered code review bot for Slack", stage: "Ideation", votes: 23, status: "draft" },
  { id: 3, name: "Browser extension for VedTechno learning", stage: "Concept", votes: 31, status: "draft" },
];

const MILESTONES = [
  { id: 1, milestone: "MVP Architecture Design", status: "done" },
  { id: 2, milestone: "Technical Co-founder Matched", status: "done" },
  { id: 3, milestone: "Seed Pitch Deck Completed", status: "done" },
  { id: 4, milestone: "Beta Product Launch", status: "in-progress" },
  { id: 5, milestone: "Series A Preparation", status: "upcoming" },
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

export default function StartupDashboard({ user, initialTab }: { user: User; initialTab?: string }) {
  const [activeTab, setActiveTab] = useState(initialTab || "overview");
  const [bookMentorModal, setBookMentorModal] = useState<{ open: boolean; mentor: typeof MENTORS[0] | null }>({ open: false, mentor: null });
  const [ideaModal, setIdeaModal] = useState(false);
  const [challengeSearch, setChallengeSearch] = useState("");
  const [challengeModal, setChallengeModal] = useState<{ open: boolean; challenge: any | null }>({ open: false, challenge: null });
  
  // Stateful data with localStorage persistence
  const [learningModules, setLearningModules] = useState(() => {
    const saved = localStorage.getItem("startup_learning_modules");
    return saved ? JSON.parse(saved) : INIT_LEARNING_MODULES;
  });
  const [ideas, setIdeas] = useState(() => {
    const saved = localStorage.getItem("startup_ideas");
    return saved ? JSON.parse(saved) : INIT_IDEAS;
  });
  const [milestones, setMilestones] = useState(() => {
    const saved = localStorage.getItem("startup_milestones");
    return saved ? JSON.parse(saved) : MILESTONES;
  });
  const [registeredChallenges, setRegisteredChallenges] = useState<string[]>(() => {
    const saved = localStorage.getItem("startup_registered_challenges");
    return saved ? JSON.parse(saved) : [];
  });
  const [bookedMentors, setBookedMentors] = useState<number[]>(() => {
    const saved = localStorage.getItem("startup_booked_mentors");
    return saved ? JSON.parse(saved) : [];
  });

  // AI Tool modals state
  const [aiModal, setAiModal] = useState<{ open: boolean; tool: string }>({ open: false, tool: "" });
  const [aiOutput, setAiOutput] = useState("");

  useEffect(() => {
    localStorage.setItem("startup_learning_modules", JSON.stringify(learningModules));
    localStorage.setItem("startup_ideas", JSON.stringify(ideas));
    localStorage.setItem("startup_milestones", JSON.stringify(milestones));
    localStorage.setItem("startup_registered_challenges", JSON.stringify(registeredChallenges));
    localStorage.setItem("startup_booked_mentors", JSON.stringify(bookedMentors));
  }, [learningModules, ideas, milestones, registeredChallenges, bookedMentors]);

  const tabs = [
    { id: "overview", label: "Overview", icon: Rocket },
    { id: "learning", label: "Learning Path", icon: BookOpen },
    { id: "innovation", label: "Innovation Hub", icon: Lightbulb },
    { id: "mentors", label: "Mentorship", icon: Users },
    { id: "challenges", label: "Challenges", icon: Trophy },
    { id: "ai", label: "AI Tools", icon: Brain },
  ];

  const allChallenges = [
    { id: "ch1", title: "AI Build Weekend", type: "Hackathon", reward: "$1,500", deadline: "Jun 7", status: registeredChallenges.includes("ch1") ? "registered" : "upcoming", theme: "AI-powered productivity", description: "Build an AI tool that solves a real-world productivity problem. Teams of up to 4.", requirements: "Submit working prototype and 3-min demo video.", prize: "$1,500 + mentorship session" },
    { id: "ch2", title: "Startup Mentor Match", type: "Mentorship", reward: "3 sessions", deadline: "Jun 15", status: registeredChallenges.includes("ch2") ? "active" : "upcoming", theme: "Startup growth", description: "Get matched with a successful founder for 3 one-on-one sessions.", requirements: "Submit your startup pitch deck and goals.", prize: "3 mentoring sessions" },
    { id: "ch3", title: "Incubation Program", type: "Innovation", reward: "$10K grant", deadline: "Jun 30", status: registeredChallenges.includes("ch3") ? "applied" : "upcoming", theme: "Product development", description: "Join a 3-month incubation program with office space and funding.", requirements: "Complete application form and pitch video.", prize: "$10K grant + workspace" },
    { id: "ch4", title: "Y Combinator Practice", type: "Pitch", reward: "Feedback", deadline: "Jul 5", status: "upcoming", theme: "Investor pitch", description: "Mock YC interview with real investors.", requirements: "Submit pitch deck and attend live session.", prize: "Professional feedback" },
    { id: "ch5", title: "Blockchain DeFi Sprint", type: "Hackathon", reward: "$2,000", deadline: "Jul 12", status: "upcoming", theme: "Decentralized Finance", description: "Build a DeFi prototype on Ethereum or Solana.", requirements: "Smart contracts, frontend, presentation.", prize: "$2,000 + mentorship" },
  ];

  const filteredChallenges = useMemo(() => {
    if (!challengeSearch) return allChallenges;
    return allChallenges.filter(c =>
      c.title.toLowerCase().includes(challengeSearch.toLowerCase()) ||
      c.type.toLowerCase().includes(challengeSearch.toLowerCase()) ||
      c.theme.toLowerCase().includes(challengeSearch.toLowerCase())
    );
  }, [challengeSearch, registeredChallenges]);

  // Learning module handlers
  const handleModuleAction = (moduleId: number) => {
    setLearningModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        if (m.status === "completed") {
          toast.info("Reviewing module...");
          return m;
        } else if (m.status === "in-progress") {
          toast.success(`Module "${m.title}" completed! 🎉`);
          return { ...m, status: "completed" };
        } else if (m.status === "upcoming") {
          const prevModule = prev.find(pm => pm.id === moduleId - 1);
          if (prevModule && prevModule.status !== "completed") {
            toast.error("Please complete the previous module first.");
            return m;
          }
          toast.info(`Starting "${m.title}"`);
          return { ...m, status: "in-progress" };
        }
      }
      return m;
    }));
  };

  const learningProgress = Math.round((learningModules.filter(m => m.status === "completed").length / learningModules.length) * 100);

  // Milestone handler
  const handleMilestoneClick = (id: number) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === id) {
        let newStatus = "upcoming";
        if (m.status === "upcoming") newStatus = "in-progress";
        else if (m.status === "in-progress") newStatus = "done";
        else if (m.status === "done") newStatus = "done";
        toast.success(`Milestone "${m.milestone}" updated to ${newStatus}`);
        return { ...m, status: newStatus };
      }
      return m;
    }));
  };

  // Idea handlers
  const handleAddIdea = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("ideaName") as string;
    const stage = formData.get("stage") as string;
    if (!name.trim()) { toast.error("Idea name is required"); return; }
    const newIdea = {
      id: Date.now(),
      name: name,
      stage: stage,
      votes: 0,
      status: "draft",
    };
    setIdeas(prev => [newIdea, ...prev]);
    toast.success("Idea submitted! It will be reviewed by our team.");
    setIdeaModal(false);
  };

  const deleteIdea = (id: number, name: string) => {
    setIdeas(prev => prev.filter(i => i.id !== id));
    toast.success(`Idea "${name}" removed`);
  };

  // Mentor booking
  const handleBookMentor = (mentorId: number, mentorName: string) => {
    if (bookedMentors.includes(mentorId)) {
      toast.info("You have already booked a session with this mentor.");
      return;
    }
    setBookedMentors(prev => [...prev, mentorId]);
    toast.success(`Session booked with ${mentorName}! Check your email for confirmation.`);
    setBookMentorModal({ open: false, mentor: null });
  };

  // Challenge registration
  const registerForChallenge = (challengeId: string, title: string) => {
    if (registeredChallenges.includes(challengeId)) {
      toast.info("You are already registered for this challenge.");
      return;
    }
    setRegisteredChallenges(prev => [...prev, challengeId]);
    toast.success(`Registered for ${title}!`);
  };

  // Open challenge details
  const openChallengeModal = (challenge: any) => {
    setChallengeModal({ open: true, challenge });
  };

  // AI Tool simulation
  const openAiTool = (tool: string) => {
    let output = "";
    switch(tool) {
      case "Business Plan Generator":
        output = "📝 **AI-Generated Business Plan**\n\n**Executive Summary:** NeuralEdge is an AI productivity platform...\n**Market Opportunity:** $50B TAM\n**Revenue Model:** SaaS subscription ($29/mo)";
        break;
      case "Competitor Analysis":
        output = "🔍 **Competitor Analysis**\n\nTop 3 Competitors:\n1. Notion AI – Strength: integration ecosystem\n2. Coda – Weakness: complex pricing\n3. Mem – Opportunity: AI-first UX";
        break;
      case "Pitch Deck Creator":
        output = "📊 **Pitch Deck Outline**\n\n1. Problem (Slide 1)\n2. Solution (Slide 2)\n3. Market Size (Slide 3)\n4. Traction (Slide 4)\n5. Team (Slide 5)\n6. Ask (Slide 6)";
        break;
      case "Tech Stack Advisor":
        output = "⚙️ **Recommended Tech Stack**\n\nFrontend: Next.js + Tailwind\nBackend: Node.js + Express\nDatabase: PostgreSQL + Redis\nAI: OpenAI API + LangChain\nHosting: Vercel + AWS";
        break;
      default:
        output = "✅ AI tool generated sample output. In production, this would connect to real AI APIs.";
    }
    setAiOutput(output);
    setAiModal({ open: true, tool });
  };

  return (
    <div>
      <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-6 pb-1">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={cn("flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all",
              activeTab === id ? "bg-accent text-white shadow-lg shadow-pink-600/25" : "text-muted-foreground hover:text-foreground hover:bg-muted")}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {/* Overview Tab (unchanged) */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Startup Launchpad 🚀</h1>
              <p className="text-sm text-muted-foreground">NeuralEdge · Building the future of AI productivity</p>
            </div>
            <button onClick={() => setActiveTab("innovation")} className="btn-primary text-sm bg-accent hover:bg-pink-700 shadow-pink-600/25">
              <Lightbulb className="w-4 h-4 mr-1.5" />Innovation Hub
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Startup Score", value: "81/100", icon: Rocket, color: "text-pink-600 bg-accent/10", tab: "overview" },
              { label: "Courses Done", value: String(learningModules.filter(m => m.status === "completed").length), icon: BookOpen, color: "text-primary bg-primary/10", tab: "learning" },
              { label: "Mentor Sessions", value: String(bookedMentors.length), icon: Users, color: "text-accent bg-accent/10", tab: "mentors" },
              { label: "Challenges Won", value: "3", icon: Trophy, color: "text-yellow-600 bg-yellow-600/10", tab: "challenges" },
            ].map(({ label, value, icon: Icon, color, tab }) => (
              <button key={label} onClick={() => setActiveTab(tab)}
                className="bg-card border border-border rounded-2xl p-4 hover:border-pink-600/30 transition-colors text-left">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", color)}><Icon className="w-4 h-4" /></div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </button>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Startup Growth Score</h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs><linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#DB2777" stopOpacity={0.3} /><stop offset="95%" stopColor="#DB2777" stopOpacity={0} /></linearGradient></defs>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                    <Area type="monotone" dataKey="score" stroke="#DB2777" strokeWidth={2} fill="url(#pinkGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Product Milestones</h3>
              <div className="space-y-3">
                {milestones.map((m, i) => (
                  <button key={i} onClick={() => handleMilestoneClick(m.id)}
                    className="w-full flex items-center gap-3 text-left hover:bg-muted/50 p-1 rounded-lg transition-colors">
                    <div className={cn("w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0", {
                      "bg-accent": m.status === "done",
                      "bg-blue-500 animate-pulse": m.status === "in-progress",
                      "bg-muted border border-border": m.status === "upcoming",
                    })}>
                      {m.status === "done" && <CheckCircle2 className="w-3 h-3 text-white" />}
                      {m.status === "in-progress" && <Clock className="w-3 h-3 text-white" />}
                    </div>
                    <span className={cn("text-sm", m.status === "upcoming" ? "text-muted-foreground" : "text-foreground")}>{m.milestone}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h2 className="font-semibold text-foreground mb-4">Active Programs</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allChallenges.slice(0, 3).map((c, i) => {
                const isRegistered = registeredChallenges.includes(c.id);
                const displayStatus = isRegistered ? (c.type === "Hackathon" ? "registered" : "active") : "upcoming";
                return (
                  <div key={i} className={cn("border rounded-2xl p-4", 
                    displayStatus === "registered" ? "bg-accent/10 border-pink-600/20" :
                    displayStatus === "active" ? "bg-primary/10 border-primary/20" : "bg-accent/10 border-accent/20"
                  )}>
                    <p className="text-xs font-medium text-muted-foreground mb-1">{c.type}</p>
                    <h3 className="font-semibold text-foreground mb-2">{c.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">Reward: <span className="text-accent dark:text-emerald-400 font-medium">{c.reward}</span></p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Due: {c.deadline}</span>
                      <button onClick={() => registerForChallenge(c.id, c.title)} disabled={isRegistered}
                        className={cn("px-3 py-1.5 text-xs font-medium rounded-lg transition-colors", isRegistered ? "bg-gray-300 text-gray-600 cursor-not-allowed" : "bg-accent text-white hover:bg-pink-700")}>
                        {displayStatus === "registered" ? "Registered" : displayStatus === "active" ? "Active" : "Register"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Learning Path Tab (unchanged) */}
      {activeTab === "learning" && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-foreground">Startup Learning Path</h1>
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Your Progress</h3>
              <span className="text-2xl font-bold text-pink-600">{learningProgress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full mb-6">
              <div className="h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full" style={{ width: `${learningProgress}%` }} />
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={learningData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px", color: "hsl(var(--foreground))" }} />
                  <Bar dataKey="hours" fill="#DB2777" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-3">
            {learningModules.map((module) => (
              <div key={module.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", {
                  "bg-accent/10": module.status === "completed",
                  "bg-pink-500/10": module.status === "in-progress",
                  "bg-muted": module.status === "upcoming",
                })}>
                  {module.status === "completed" ? <CheckCircle2 className="w-5 h-5 text-accent" /> :
                    module.status === "in-progress" ? <Clock className="w-5 h-5 text-pink-500" /> :
                      <BookOpen className="w-5 h-5 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm">{module.title}</p>
                  <p className="text-xs text-muted-foreground">{module.module} · {module.lessons} lessons · {module.duration}</p>
                </div>
                <button onClick={() => handleModuleAction(module.id)}
                  className={cn("px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex-shrink-0", {
                    "bg-accent text-white hover:bg-accent/90": module.status === "completed",
                    "bg-accent text-white hover:bg-pink-700": module.status === "in-progress",
                    "border border-border text-muted-foreground hover:bg-muted": module.status === "upcoming",
                  })}>
                  {module.status === "completed" ? "Review" : module.status === "in-progress" ? "Continue" : "Locked"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Innovation Hub Tab (unchanged) */}
      {activeTab === "innovation" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Innovation Hub</h1>
            <button onClick={() => setIdeaModal(true)} className="btn-primary text-sm bg-accent hover:bg-pink-700">
              <Plus className="w-4 h-4 mr-1.5" />Submit Idea
            </button>
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            {[
              { title: "Product Lab", desc: "Build and test your MVP in a sandboxed environment with AI assistance", icon: Rocket, color: "from-pink-500 to-rose-600" },
              { title: "Market Research", desc: "AI-powered market analysis, competitor insights, and TAM calculation", icon: TrendingUp, color: "from-violet-500 to-purple-600" },
              { title: "Pitch Simulator", desc: "Practice your investor pitch with AI feedback on content and delivery", icon: Target, color: "from-blue-500 to-indigo-600" },
            ].map((tool, i) => (
              <button key={i} onClick={() => openAiTool(tool.title)} className="feature-card text-left hover:border-pink-600/30">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br", tool.color)}>
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{tool.title}</h3>
                <p className="text-sm text-muted-foreground">{tool.desc}</p>
                <span className="text-xs text-pink-600 dark:text-pink-400 font-medium mt-3 block">Open Tool →</span>
              </button>
            ))}
          </div>
          <div>
            <h2 className="font-semibold text-foreground mb-4">My Ideas & Projects</h2>
            <div className="space-y-3">
              {ideas.map((idea) => (
                <div key={idea.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{idea.name}</p>
                    <p className="text-xs text-muted-foreground">Stage: {idea.stage}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium text-foreground">{idea.votes}</span>
                    </div>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", idea.status === "in-progress" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600")}>{idea.status}</span>
                    <button onClick={() => deleteIdea(idea.id, idea.name)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
              {ideas.length === 0 && <p className="text-center text-muted-foreground py-4">No ideas yet. Submit your first startup idea!</p>}
            </div>
          </div>
        </div>
      )}

      {/* Mentors Tab (unchanged) */}
      {activeTab === "mentors" && (
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-6">Mentorship Network</h1>
          <div className="grid sm:grid-cols-2 gap-4">
            {MENTORS.map((m) => {
              const isBooked = bookedMentors.includes(m.id);
              return (
                <div key={m.id} className="feature-card">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-pink-600 font-bold text-lg">
                      {m.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", m.available && !isBooked ? "bg-emerald-100 text-emerald-700" : isBooked ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600")}>
                      {isBooked ? "Booked" : m.available ? "Available" : "Busy"}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground">{m.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{m.role}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {m.expertise.map(e => <span key={e} className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground">{e}</span>)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">★ {m.rating}</span>
                    <button onClick={() => m.available && !isBooked ? setBookMentorModal({ open: true, mentor: m }) : toast.info(isBooked ? "You already booked a session with this mentor." : "Mentor is busy. Join waitlist?")}
                      className={cn("px-3 py-1.5 text-xs font-medium rounded-lg transition-colors", (m.available && !isBooked) ? "bg-accent text-white hover:bg-pink-700" : "border border-border text-muted-foreground hover:bg-muted")}>
                      {isBooked ? "Booked" : m.available ? "Book Session" : "Waitlist"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Challenges Tab with Open button functional */}
      {activeTab === "challenges" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Challenges & Programs</h1>
            <span className="text-sm text-muted-foreground">{filteredChallenges.length} available</span>
          </div>
          <div className="relative mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input className="input-field pl-9 py-2 text-sm" placeholder="Search challenges by title, type, or theme..."
              value={challengeSearch} onChange={e => setChallengeSearch(e.target.value)} />
            {challengeSearch && <button onClick={() => setChallengeSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-muted-foreground" /></button>}
          </div>
          <div className="grid lg:grid-cols-2 gap-4">
            {filteredChallenges.map((c) => (
              <div key={c.id} className="bg-card border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-pink-600 font-medium">{c.type}</span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", {
                    "bg-emerald-100 text-emerald-700": c.status === "registered" || c.status === "active",
                    "bg-blue-100 text-blue-700": c.status === "applied",
                    "bg-gray-100 text-gray-600": c.status === "upcoming",
                  })}>{c.status}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{c.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">Theme: {c.theme}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-accent">{c.reward}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5"><Calendar className="w-3 h-3" />Deadline: {c.deadline}</p>
                  </div>
                  <button onClick={() => {
                    if (c.status === "upcoming") {
                      registerForChallenge(c.id, c.title);
                    } else {
                      openChallengeModal(c);
                    }
                  }} className="px-4 py-2 bg-accent text-white text-xs font-medium rounded-xl hover:bg-pink-700 transition-colors">
                    {c.status === "upcoming" ? "Register" : "Open"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Tools Tab (unchanged) */}
      {activeTab === "ai" && (
        <div className="space-y-5">
          <h1 className="text-2xl font-bold text-foreground">AI Tools for Founders</h1>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Business Plan Generator", desc: "AI generates a full business plan from your idea", icon: "📝", action: "Generate Plan" },
              { title: "Competitor Analysis", desc: "Deep research on competitors, pricing, and positioning", icon: "🔍", action: "Analyze Market" },
              { title: "Pitch Deck Creator", desc: "AI designs investor-ready pitch decks in minutes", icon: "📊", action: "Create Deck" },
              { title: "Tech Stack Advisor", desc: "Get recommendations for your product's architecture", icon: "⚙️", action: "Get Advice" },
              { title: "Financial Projections", desc: "Generate 3-year financial models with AI assistance", icon: "💰", action: "Build Model" },
              { title: "Marketing Copy AI", desc: "Generate landing pages, ads, and email sequences", icon: "✍️", action: "Generate Copy" },
            ].map((tool, i) => (
              <button key={i} onClick={() => openAiTool(tool.title)} className="feature-card text-left hover:border-pink-600/30">
                <span className="text-3xl mb-3 block">{tool.icon}</span>
                <h3 className="font-semibold text-foreground text-sm mb-1">{tool.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{tool.desc}</p>
                <span className="text-xs text-pink-600 font-medium">{tool.action} →</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Challenge Details Modal */}
      <Modal open={challengeModal.open} onClose={() => setChallengeModal({ open: false, challenge: null })} title={challengeModal.challenge?.title || "Challenge Details"}>
        {challengeModal.challenge && (
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-xl">
              <p className="text-xs text-muted-foreground">Type: {challengeModal.challenge.type}</p>
              <p className="text-sm text-foreground mt-1">{challengeModal.challenge.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-muted rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Reward</p>
                <p className="text-sm font-bold text-accent">{challengeModal.challenge.reward}</p>
              </div>
              <div className="bg-muted rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Deadline</p>
                <p className="text-sm font-medium text-foreground">{challengeModal.challenge.deadline}</p>
              </div>
              <div className="bg-muted rounded-xl p-3 col-span-2">
                <p className="text-xs text-muted-foreground">Requirements</p>
                <p className="text-sm text-foreground mt-1">{challengeModal.challenge.requirements || "No specific requirements listed."}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => {
                toast.success(`You have successfully submitted to ${challengeModal.challenge.title}!`);
                setChallengeModal({ open: false, challenge: null });
              }} className="flex-1 btn-primary text-sm bg-accent hover:bg-accent/90">Submit Work</button>
              <button onClick={() => {
                toast.info(`Check your email for further instructions about ${challengeModal.challenge.title}.`);
                setChallengeModal({ open: false, challenge: null });
              }} className="flex-1 btn-secondary text-sm">Get Instructions</button>
            </div>
          </div>
        )}
      </Modal>

      {/* AI Result Modal */}
      <Modal open={aiModal.open} onClose={() => setAiModal({ open: false, tool: "" })} title={aiModal.tool}>
        <div className="space-y-4">
          <div className="bg-muted p-4 rounded-xl whitespace-pre-wrap text-sm font-mono">
            {aiOutput}
          </div>
          <p className="text-xs text-muted-foreground">This is a simulation. In production, it would call real AI APIs.</p>
          <button onClick={() => setAiModal({ open: false, tool: "" })} className="btn-primary w-full bg-accent hover:bg-pink-700">Close</button>
        </div>
      </Modal>

      {/* Book Mentor Modal (unchanged) */}
      <Modal open={bookMentorModal.open} onClose={() => setBookMentorModal({ open: false, mentor: null })} title="Book Mentor Session">
        {bookMentorModal.mentor && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-muted rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center text-pink-600 font-bold text-lg">
                {bookMentorModal.mentor.name.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="font-bold text-foreground">{bookMentorModal.mentor.name}</p>
                <p className="text-xs text-muted-foreground">{bookMentorModal.mentor.role}</p>
                <p className="text-xs text-yellow-500">★ {bookMentorModal.mentor.rating}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Session Topic</label>
              <select className="input-field">
                {bookMentorModal.mentor.expertise.map(e => <option key={e}>{e}</option>)}
                <option>General Startup Advice</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-sm font-medium text-foreground mb-1.5">Preferred Date</label><input type="date" className="input-field" /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1.5">Duration</label><select className="input-field"><option>30 min</option><option>45 min</option><option>60 min</option></select></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">What do you want to discuss?</label>
              <textarea className="input-field resize-none min-h-[80px]" placeholder="Describe your specific questions or goals..." />
            </div>
            <button onClick={() => handleBookMentor(bookMentorModal.mentor!.id, bookMentorModal.mentor!.name)} className="btn-primary w-full text-sm bg-accent hover:bg-pink-700">Confirm Booking</button>
          </div>
        )}
      </Modal>

      {/* Submit Idea Modal (unchanged) */}
      <Modal open={ideaModal} onClose={() => setIdeaModal(false)} title="Submit Startup Idea">
        <form onSubmit={handleAddIdea} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Idea Name *</label>
            <input name="ideaName" className="input-field" placeholder="e.g. AI-powered customer support bot" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Problem Statement</label>
            <textarea name="problem" className="input-field resize-none min-h-[80px]" placeholder="What problem does this solve?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Target Market</label>
            <input name="market" className="input-field" placeholder="e.g. SaaS companies with 10-100 employees" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Stage</label>
            <select name="stage" className="input-field">
              <option>Concept</option><option>Ideation</option><option>MVP Planning</option><option>Development</option>
            </select>
          </div>
          <button type="submit" className="btn-primary w-full text-sm bg-accent hover:bg-pink-700">Submit Idea</button>
        </form>
      </Modal>
    </div>
  );
}