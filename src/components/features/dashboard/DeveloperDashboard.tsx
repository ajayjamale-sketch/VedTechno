import { useState, useMemo, useEffect } from "react";
import {
  Code2,
  GitBranch,
  Trophy,
  Briefcase,
  Users,
  TrendingUp,
  Star,
  Zap,
  BarChart3,
  Award,
  Clock,
  Target,
  CheckCircle2,
  ArrowRight,
  Brain,
  Search,
  X,
  Plus,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Filter,
  Play,
  Save,
  Calendar,
  MapPin,
  UserPlus,
  FileText,
  Send,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";
import { toast } from "sonner";
import type { User } from "@/types";

// Types
interface Challenge {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  solved: boolean;
  attempts: number;
  points: number;
  tags: string[];
  description: string;
  starterCode: string;
  solution?: string;
}

interface Project {
  id: number;
  title: string;
  tech: string[];
  stars: number;
  forks: number;
  desc: string;
  status: string;
  url: string;
}

interface Hackathon {
  id: string;
  title: string;
  dates: string;
  status: "open" | "upcoming" | "ended";
  prize: string;
  participants: number;
  theme: string;
  team: boolean;
  description: string;
  location: string;
  organizer: string;
}

interface CommunityGroup {
  id: string;
  name: string;
  members: string;
  icon: any;
  color: string;
}

const activityData = [
  { day: "Mon", commits: 4 },
  { day: "Tue", commits: 7 },
  { day: "Wed", commits: 3 },
  { day: "Thu", commits: 9 },
  { day: "Fri", commits: 6 },
  { day: "Sat", commits: 11 },
  { day: "Sun", commits: 5 },
];
const skillData = [
  { subject: "React", A: 90 },
  { subject: "Node.js", A: 75 },
  { subject: "Python", A: 80 },
  { subject: "AWS", A: 65 },
  { subject: "Docker", A: 70 },
  { subject: "GraphQL", A: 55 },
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
      <div className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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

// Initial challenges
const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: "1",
    title: "Two Sum",
    difficulty: "Easy",
    solved: false,
    attempts: 1,
    points: 10,
    tags: ["Array", "Hash"],
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.",
    starterCode: `def two_sum(nums, target):\n    # Write your solution here\n    pass`,
  },
  {
    id: "2",
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    solved: false,
    attempts: 3,
    points: 25,
    tags: ["DP", "String"],
    description: "Find the longest palindromic substring in a given string.",
    starterCode: `def longest_palindrome(s: str) -> str:\n    # Write your solution here\n    pass`,
  },
  {
    id: "3",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    solved: false,
    attempts: 0,
    points: 50,
    tags: ["Binary Search"],
    description:
      "Find the median of two sorted arrays with O(log(min(n,m))) time complexity.",
    starterCode: `def find_median_sorted_arrays(nums1, nums2):\n    # Write your solution here\n    pass`,
  },
  {
    id: "4",
    title: "Binary Tree Level Order",
    difficulty: "Medium",
    solved: false,
    attempts: 2,
    points: 25,
    tags: ["Tree", "BFS"],
    description: "Return the level order traversal of a binary tree.",
    starterCode: `def level_order(root):\n    # Write your solution here\n    pass`,
  },
  {
    id: "5",
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    solved: false,
    attempts: 1,
    points: 50,
    tags: ["Heap", "Linked List"],
    description:
      "Merge k sorted linked lists and return it as one sorted list.",
    starterCode: `def merge_k_lists(lists):\n    # Write your solution here\n    pass`,
  },
  {
    id: "6",
    title: "Container With Most Water",
    difficulty: "Medium",
    solved: false,
    attempts: 0,
    points: 25,
    tags: ["Two Pointers"],
    description:
      "Find two lines that together with the x-axis forms a container that contains the most water.",
    starterCode: `def max_area(height):\n    # Write your solution here\n    pass`,
  },
  {
    id: "7",
    title: "Valid Parentheses",
    difficulty: "Easy",
    solved: false,
    attempts: 1,
    points: 10,
    tags: ["Stack", "String"],
    description: "Determine if the input string has valid parentheses.",
    starterCode: `def is_valid(s: str) -> bool:\n    # Write your solution here\n    pass`,
  },
  {
    id: "8",
    title: "Climbing Stairs",
    difficulty: "Easy",
    solved: false,
    attempts: 0,
    points: 10,
    tags: ["DP"],
    description:
      "Count distinct ways to climb to the top of n stairs (1 or 2 steps at a time).",
    starterCode: `def climb_stairs(n: int) -> int:\n    # Write your solution here\n    pass`,
  },
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    title: "AI Chat Application",
    tech: ["React", "OpenAI", "Node.js"],
    stars: 47,
    forks: 12,
    desc: "Full-stack AI chat with context awareness",
    status: "live",
    url: "https://github.com",
  },
  {
    id: 2,
    title: "E-Commerce Platform",
    tech: ["Next.js", "Stripe", "Postgres"],
    stars: 23,
    forks: 8,
    desc: "Full-featured store with payments",
    status: "live",
    url: "https://github.com",
  },
  {
    id: 3,
    title: "ML Price Predictor",
    tech: ["Python", "TensorFlow", "FastAPI"],
    stars: 31,
    forks: 15,
    desc: "Real estate price prediction model",
    status: "live",
    url: "https://github.com",
  },
];

// Extended hackathons data
const HACKATHONS: Hackathon[] = [
  {
    id: "h1",
    title: "AI Build Weekend",
    dates: "Jun 7–9, 2026",
    status: "open",
    prize: "$1,500",
    participants: 342,
    theme: "AI-powered productivity tools",
    team: false,
    description:
      "Build an AI tool that solves a real-world productivity problem. Use any tech stack.",
    location: "Online",
    organizer: "AI Dev Community",
  },
  {
    id: "h2",
    title: "Blockchain Builders",
    dates: "Jun 14–16, 2026",
    status: "upcoming",
    prize: "$2,000",
    participants: 189,
    theme: "Decentralized finance solutions",
    team: false,
    description:
      "Create a DeFi application or blockchain-based solution for financial inclusion.",
    location: "Online",
    organizer: "Web3 Foundation",
  },
  {
    id: "h3",
    title: "Green Tech Challenge",
    dates: "May 24–26, 2026",
    status: "ended",
    prize: "$3,000",
    participants: 512,
    theme: "Sustainable technology solutions",
    team: true,
    description:
      "Develop technology to combat climate change or promote sustainability.",
    location: "Hybrid (SF + Online)",
    organizer: "EarthTech Alliance",
  },
  {
    id: "h4",
    title: "EdTech Sprint",
    dates: "Jul 5–7, 2026",
    status: "upcoming",
    prize: "$1,000",
    participants: 95,
    theme: "Next-gen learning tools",
    team: false,
    description:
      "Build an educational app or platform that improves learning outcomes.",
    location: "Online",
    organizer: "EduInnovate",
  },
];

const COMMUNITY_GROUPS: CommunityGroup[] = [
  {
    id: "g1",
    name: "Open Source Contributors",
    members: "12K+",
    icon: GitBranch,
    color: "text-indigo-600 bg-primary/10",
  },
  {
    id: "g2",
    name: "React Developers",
    members: "45K+",
    icon: Code2,
    color: "text-primary bg-primary/10",
  },
  {
    id: "g3",
    name: "ML Engineers",
    members: "28K+",
    icon: Brain,
    color: "text-accent bg-accent/10",
  },
];

export default function DeveloperDashboard({
  user,
  initialTab,
}: {
  user: User;
  initialTab?: string;
}) {
  const [activeTab, setActiveTab] = useState(initialTab || "overview");
  const [challengeFilter, setChallengeFilter] = useState("All");
  const [challengeSearch, setChallengeSearch] = useState("");
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [addProjectModal, setAddProjectModal] = useState(false);
  const [editProjectModal, setEditProjectModal] = useState<{
    open: boolean;
    project: Project | null;
  }>({ open: false, project: null });
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: number;
    title: string;
  }>({ open: false, id: 0, title: "" });
  const [newProject, setNewProject] = useState({
    title: "",
    desc: "",
    tech: "",
    url: "",
  });
  const [editProjectData, setEditProjectData] = useState({
    title: "",
    desc: "",
    status: "live",
    tech: "",
    url: "",
  });
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [registeredHackathons, setRegisteredHackathons] = useState<string[]>(
    [],
  );
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);

  // Challenges state
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem("developer_challenges");
    if (saved) return JSON.parse(saved);
    return INITIAL_CHALLENGES;
  });
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null,
  );
  const [challengeModalOpen, setChallengeModalOpen] = useState(false);
  const [challengeCode, setChallengeCode] = useState("");
  const [codeOutput, setCodeOutput] = useState("");
  const [codeRunning, setCodeRunning] = useState(false);
  const [selectedLang, setSelectedLang] = useState("Python");

  // New modals and forms
  const [hackathonDetailModal, setHackathonDetailModal] =
    useState<Hackathon | null>(null);
  const [hackathonRegForm, setHackathonRegForm] = useState({
    name: "",
    email: "",
    teamName: "",
  });
  const [joinGroupModal, setJoinGroupModal] = useState<CommunityGroup | null>(
    null,
  );
  const [groupForm, setGroupForm] = useState({ name: "", role: "" });
  const [applyJobModal, setApplyJobModal] = useState<{
    open: boolean;
    jobTitle: string;
    company: string;
  }>({ open: false, jobTitle: "", company: "" });
  const [jobApplicationForm, setJobApplicationForm] = useState({
    fullName: "",
    email: "",
    resume: "",
    coverLetter: "",
  });

  useEffect(() => {
    localStorage.setItem("developer_challenges", JSON.stringify(challenges));
  }, [challenges]);

  const solvedCount = challenges.filter((c) => c.solved).length;
  const totalPoints = challenges.reduce(
    (sum, c) => sum + (c.solved ? c.points : 0),
    0,
  );
  const userPoints = user.points + totalPoints;

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "challenges", label: "Challenges", icon: Code2 },
    { id: "hackathons", label: "Hackathons", icon: Trophy },
    { id: "portfolio", label: "Portfolio", icon: Briefcase },
    { id: "community", label: "Community", icon: Users },
    { id: "career", label: "Career", icon: TrendingUp },
  ];

  const filteredChallenges = useMemo(() => {
    return challenges.filter((ch) => {
      let matchDiff = true;
      if (challengeFilter === "Solved") matchDiff = ch.solved;
      else if (challengeFilter === "Unsolved") matchDiff = !ch.solved;
      else
        matchDiff =
          challengeFilter === "All" || ch.difficulty === challengeFilter;
      const matchSearch =
        ch.title.toLowerCase().includes(challengeSearch.toLowerCase()) ||
        ch.tags.some((t) =>
          t.toLowerCase().includes(challengeSearch.toLowerCase()),
        );
      return matchDiff && matchSearch;
    });
  }, [challenges, challengeFilter, challengeSearch]);

  // Challenge handlers
  const openChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setChallengeCode(challenge.starterCode);
    setCodeOutput("");
    setChallengeModalOpen(true);
  };

  const runCode = () => {
    setCodeRunning(true);
    setTimeout(() => {
      setCodeRunning(false);
      setCodeOutput(
        "✅ Code executed successfully!\nOutput: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34] (sample)",
      );
      toast.success("Code execution completed!");
    }, 1000);
  };

  const submitSolution = () => {
    if (!selectedChallenge) return;
    if (selectedChallenge.solved) {
      toast.info("Challenge already solved!");
      return;
    }
    setChallenges((prev) =>
      prev.map((ch) =>
        ch.id === selectedChallenge.id
          ? { ...ch, solved: true, attempts: ch.attempts + 1 }
          : ch,
      ),
    );
    toast.success(
      `🎉 Challenge solved! You earned ${selectedChallenge.points} points.`,
    );
    setChallengeModalOpen(false);
    setSelectedChallenge(null);
  };

  // Portfolio handlers
  const handleAddProject = () => {
    if (!newProject.title.trim()) {
      toast.error("Title is required");
      return;
    }
    const proj: Project = {
      id: Date.now(),
      title: newProject.title,
      desc: newProject.desc || "No description",
      tech: newProject.tech
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      stars: 0,
      forks: 0,
      status: "live",
      url: newProject.url || "#",
    };
    setProjects((p) => [...p, proj]);
    toast.success("Project added to portfolio!");
    setAddProjectModal(false);
    setNewProject({ title: "", desc: "", tech: "", url: "" });
  };

  const handleDeleteProject = () => {
    setProjects((p) => p.filter((pr) => pr.id !== deleteConfirm.id));
    toast.success(`"${deleteConfirm.title}" removed from portfolio`);
    setDeleteConfirm({ open: false, id: 0, title: "" });
  };

  const openEditModal = (project: Project) => {
    setEditProjectData({
      title: project.title,
      desc: project.desc,
      status: project.status,
      tech: project.tech.join(", "),
      url: project.url,
    });
    setEditProjectModal({ open: true, project });
  };

  const handleEditProject = () => {
    if (!editProjectModal.project) return;
    setProjects((p) =>
      p.map((proj) =>
        proj.id === editProjectModal.project!.id
          ? {
              ...proj,
              title: editProjectData.title,
              desc: editProjectData.desc,
              status: editProjectData.status as any,
              tech: editProjectData.tech
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
              url: editProjectData.url,
            }
          : proj,
      ),
    );
    toast.success("Project updated!");
    setEditProjectModal({ open: false, project: null });
  };

  // Hackathon handlers
  const handleHackathonRegister = (hackathon: Hackathon) => {
    if (registeredHackathons.includes(hackathon.id)) {
      toast.info("Already registered for this hackathon");
      return;
    }
    // Validate form
    if (!hackathonRegForm.name.trim() || !hackathonRegForm.email.trim()) {
      toast.error("Please fill in name and email");
      return;
    }
    if (!hackathonRegForm.email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    // Save registration
    setRegisteredHackathons((prev) => [...prev, hackathon.id]);
    toast.success(
      `Registered for ${hackathon.title}! Check your email for confirmation.`,
    );
    setHackathonDetailModal(null);
    setHackathonRegForm({ name: "", email: "", teamName: "" });
  };

  // Community handlers
  const handleJoinGroup = (group: CommunityGroup) => {
    if (joinedGroups.includes(group.id)) {
      toast.info(`You already joined ${group.name}`);
      return;
    }
    if (!groupForm.name.trim() || !groupForm.role.trim()) {
      toast.error("Please enter your name and role/interest");
      return;
    }
    setJoinedGroups((prev) => [...prev, group.id]);
    toast.success(
      `You joined ${group.name} as "${groupForm.role}"! Welcome to the community.`,
    );
    setJoinGroupModal(null);
    setGroupForm({ name: "", role: "" });
  };

  // Career handlers
  const openApplyJob = (jobTitle: string, company: string) => {
    if (appliedJobs.includes(jobTitle)) {
      toast.info("You already applied to this job");
      return;
    }
    setApplyJobModal({ open: true, jobTitle, company });
    setJobApplicationForm({
      fullName: user.name,
      email: user.email || "",
      resume: "",
      coverLetter: "",
    });
  };

  const submitJobApplication = () => {
    if (
      !jobApplicationForm.fullName.trim() ||
      !jobApplicationForm.email.trim() ||
      !jobApplicationForm.resume.trim()
    ) {
      toast.error(
        "Please fill all required fields (Full Name, Email, Resume link)",
      );
      return;
    }
    if (!jobApplicationForm.email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    setAppliedJobs((prev) => [...prev, applyJobModal.jobTitle]);
    toast.success(
      `Application submitted for ${applyJobModal.jobTitle} at ${applyJobModal.company}! The hiring team will contact you soon.`,
    );
    setApplyJobModal({ open: false, jobTitle: "", company: "" });
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
                ? "bg-primary text-white shadow-lg"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Developer Hub 🚀
              </h1>
              <p className="text-muted-foreground text-sm">
                Rank:{" "}
                <strong className="text-foreground">
                  #{userPoints > 5000 ? "42" : "128"} on leaderboard
                </strong>
              </p>
            </div>
            <button
              onClick={() => toast.info("Opening AI code assistant...")}
              className="btn-primary text-sm bg-primary hover:bg-indigo-700 shadow-indigo-600/25"
            >
              <Brain className="w-4 h-4 mr-1.5" />
              AI Assistant
            </button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Problems Solved",
                value: solvedCount.toString(),
                icon: CheckCircle2,
                color: "text-indigo-600 bg-primary/10",
                tab: "challenges",
              },
              {
                label: "Streak Days",
                value: String(user.streakDays),
                icon: Zap,
                color: "text-yellow-600 bg-yellow-600/10",
                tab: null,
              },
              {
                label: "Skill Points",
                value: userPoints.toString(),
                icon: Star,
                color: "text-accent bg-accent/10",
                tab: null,
              },
              {
                label: "Hours Coded",
                value: "312",
                icon: Clock,
                color: "text-primary bg-primary/10",
                tab: null,
              },
            ].map(({ label, value, icon: Icon, color, tab }) => (
              <button
                key={label}
                onClick={() => (tab ? setActiveTab(tab) : undefined)}
                className={cn(
                  "bg-card border border-border rounded-2xl p-4 hover:border-indigo-600/30 transition-colors text-left",
                  !tab && "cursor-default",
                )}
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
              </button>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">
                Coding Activity (This Week)
              </h3>
              <div className="h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activityData}>
                    <defs>
                      <linearGradient
                        id="indigoGrad"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366F1"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366F1"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
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
                      dataKey="commits"
                      stroke="#6366F1"
                      strokeWidth={2}
                      fill="url(#indigoGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="font-semibold text-foreground text-sm mb-2">
                Skill Proficiency
              </h3>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={skillData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{
                        fontSize: 10,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                    />
                    <Radar
                      name="Skills"
                      dataKey="A"
                      stroke="#6366F1"
                      fill="#6366F1"
                      fillOpacity={0.2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Recent Activity</h2>
              <button
                onClick={() => setActiveTab("challenges")}
                className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                View challenges <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-2">
              {[
                {
                  action: "Solved",
                  item: "LeetCode Hard: Median of Two Sorted Arrays",
                  time: "2h ago",
                  icon: "✅",
                },
                {
                  action: "Contributed to",
                  item: "open-source/react-query-devtools",
                  time: "Yesterday",
                  icon: "🔀",
                },
                {
                  action: "Earned badge:",
                  item: "500 Problems Streak Master",
                  time: "2 days ago",
                  icon: "🏅",
                },
                {
                  action: "Joined hackathon:",
                  item: "AI Build Weekend Challenge",
                  time: "3 days ago",
                  icon: "🏆",
                },
              ].map((a, i) => (
                <button
                  key={i}
                  onClick={() => toast.info(a.item)}
                  className="w-full flex items-center gap-3 p-3 bg-card border border-border rounded-xl text-left hover:border-indigo-600/30 transition-colors"
                >
                  <span className="text-xl">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-muted-foreground">
                      {a.action}{" "}
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      {a.item}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {a.time}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Challenges Tab */}
      {activeTab === "challenges" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">
              Coding Challenges
            </h1>
            <span className="text-sm text-muted-foreground">
              {solvedCount} / {challenges.length} solved
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                className="input-field pl-9 py-2 text-sm"
                placeholder="Search by name or tag..."
                value={challengeSearch}
                onChange={(e) => setChallengeSearch(e.target.value)}
              />
              {challengeSearch && (
                <button
                  onClick={() => setChallengeSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {["All", "Easy", "Medium", "Hard", "Solved", "Unsolved"].map(
                (f) => (
                  <button
                    key={f}
                    onClick={() => setChallengeFilter(f)}
                    className={cn(
                      "px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border",
                      challengeFilter === f
                        ? "bg-primary text-white border-indigo-600"
                        : "border-border text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {f}
                  </button>
                ),
              )}
            </div>
          </div>
          {filteredChallenges.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No challenges match your filter
              </p>
              <button
                onClick={() => {
                  setChallengeFilter("All");
                  setChallengeSearch("");
                }}
                className="mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChallenges.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => openChallenge(ch)}
                  className="feature-card text-left hover:border-indigo-600/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={cn(
                        "text-xs px-2 py-0.5 rounded-full font-medium",
                        {
                          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400":
                            ch.difficulty === "Easy",
                          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400":
                            ch.difficulty === "Medium",
                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400":
                            ch.difficulty === "Hard",
                        },
                      )}
                    >
                      {ch.difficulty}
                    </span>
                    {ch.solved && (
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground text-sm mb-2">
                    {ch.title}
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {ch.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-1.5 py-0.5 bg-muted rounded text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{ch.attempts} attempts</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                      +{ch.points} pts
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hackathons Tab with Details & Register Form */}
      {activeTab === "hackathons" && (
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-6">
            Hackathons & Competitions
          </h1>
          <div className="grid lg:grid-cols-2 gap-5">
            {HACKATHONS.map((hack) => (
              <div
                key={hack.id}
                className="bg-card border border-border rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground">
                    {hack.title}
                  </h3>
                  <span
                    className={cn(
                      "text-xs px-2 py-1 rounded-full font-medium",
                      {
                        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400":
                          hack.status === "open",
                        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-primary/80":
                          hack.status === "upcoming",
                        "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400":
                          hack.status === "ended",
                      },
                    )}
                  >
                    {hack.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">
                  {hack.dates}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Theme: {hack.theme}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-foreground">
                      {hack.prize}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {hack.participants} participants
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setHackathonDetailModal(hack)}
                      className="px-3 py-2 border border-border text-xs font-medium rounded-xl hover:bg-muted transition-colors text-muted-foreground"
                    >
                      Details
                    </button>
                    {hack.status !== "ended" && (
                      <button
                        onClick={() => setHackathonDetailModal(hack)}
                        disabled={registeredHackathons.includes(hack.id)}
                        className={cn(
                          "px-4 py-2 text-sm font-medium rounded-xl transition-colors",
                          registeredHackathons.includes(hack.id)
                            ? "bg-green-600 text-white opacity-80 cursor-default"
                            : "bg-primary text-white hover:bg-indigo-700",
                        )}
                      >
                        {registeredHackathons.includes(hack.id)
                          ? "Registered ✓"
                          : hack.status === "open"
                            ? "Join Now"
                            : "Register"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio Tab */}
      {activeTab === "portfolio" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">My Portfolio</h1>
            <button
              onClick={() => setAddProjectModal(true)}
              className="btn-primary text-sm bg-primary hover:bg-indigo-700 shadow-indigo-600/25"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Project
            </button>
          </div>
          {projects.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border rounded-2xl">
              <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-muted-foreground mb-3">No projects yet</p>
              <button
                onClick={() => setAddProjectModal(true)}
                className="btn-primary text-sm"
              >
                Add Your First Project
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((proj) => (
                <div key={proj.id} className="feature-card">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-foreground text-sm">
                      {proj.title}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {proj.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {proj.desc}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {proj.tech.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2 py-0.5 bg-muted rounded-md text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {proj.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitBranch className="w-3 h-3" />
                        {proj.forks}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => window.open(proj.url, "_blank")}
                        className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                      </button>
                      <button
                        onClick={() => openEditModal(proj)}
                        className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            open: true,
                            id: proj.id,
                            title: proj.title,
                          })
                        }
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
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

      {/* Community Tab with Join Group Form */}
      {activeTab === "community" && (
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-6">
            Developer Community
          </h1>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {COMMUNITY_GROUPS.map((group) => (
              <button
                key={group.id}
                onClick={() => setJoinGroupModal(group)}
                className="feature-card text-left hover:border-indigo-600/30"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
                    group.color,
                  )}
                >
                  <group.icon className="w-5 h-5" />
                </div>
                <p className="font-semibold text-foreground text-sm">
                  {group.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {group.members} members
                </p>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-2 block">
                  {joinedGroups.includes(group.id)
                    ? "✓ Member"
                    : "Join Group →"}
                </span>
              </button>
            ))}
          </div>
          <h2 className="font-semibold text-foreground mb-3">
            Hot Discussions
          </h2>
          <div className="space-y-3">
            {[
              {
                title: "Best practices for React state management in 2026",
                replies: 24,
                views: 1230,
                tag: "React",
              },
              {
                title:
                  "Rust vs Go for backend services — which should you learn?",
                replies: 41,
                views: 3200,
                tag: "Backend",
              },
              {
                title: "How I landed a $150K remote job with VedTechno certs",
                replies: 78,
                views: 8900,
                tag: "Career",
              },
            ].map((post, i) => (
              <button
                key={i}
                onClick={() => toast.info(`Opening: ${post.title}`)}
                className="w-full bg-card border border-border rounded-xl p-4 text-left hover:border-indigo-600/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-indigo-600 font-medium">
                      {post.tag}
                    </span>
                    <p className="text-sm font-medium text-foreground mt-2">
                      {post.title}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {post.replies} replies · {post.views} views
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Career Tab with Apply Form */}
      {activeTab === "career" && (
        <div className="space-y-5">
          <h1 className="text-2xl font-bold text-foreground">Career Growth</h1>
          <div className="grid lg:grid-cols-3 gap-4">
            {[
              {
                label: "Current Level",
                value: "Senior",
                color: "text-indigo-600",
                desc: "Based on skills & activity",
              },
              {
                label: "Market Rate",
                value: "$130K",
                color: "text-accent",
                desc: "Avg for your skill set",
              },
              {
                label: "Job Matches",
                value: "47",
                color: "text-primary",
                desc: "Active openings",
              },
            ].map(({ label, value, color, desc }) => (
              <div
                key={label}
                className="bg-card border border-border rounded-2xl p-5 text-center"
              >
                <p className={cn("text-3xl font-bold", color)}>{value}</p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {label}
                </p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">Top Job Matches</h2>
              <button
                onClick={() => toast.info("Opening full job board...")}
                className="text-sm text-indigo-600 hover:underline"
              >
                View all
              </button>
            </div>
            <div className="space-y-3">
              {[
                {
                  title: "Senior React Developer",
                  company: "Stripe",
                  location: "Remote",
                  salary: "$120K–$150K",
                  match: 96,
                },
                {
                  title: "Full Stack Engineer",
                  company: "Vercel",
                  location: "Remote",
                  salary: "$130K–$160K",
                  match: 92,
                },
                {
                  title: "Software Engineer II",
                  company: "Notion",
                  location: "San Francisco",
                  salary: "$140K–$170K",
                  match: 87,
                },
              ].map((job, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 border border-border rounded-xl hover:border-indigo-600/30 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">
                      {job.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {job.company} · {job.location}
                    </p>
                    <p className="text-xs text-indigo-600 font-medium">
                      {job.salary}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-accent">
                      {job.match}%
                    </span>
                    <button
                      onClick={() => openApplyJob(job.title, job.company)}
                      disabled={appliedJobs.includes(job.title)}
                      className={cn(
                        "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                        appliedJobs.includes(job.title)
                          ? "bg-green-600 text-white opacity-80 cursor-default"
                          : "bg-primary text-white hover:bg-indigo-700",
                      )}
                    >
                      {appliedJobs.includes(job.title) ? "Applied ✓" : "Apply"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------- MODALS ---------- */}

      {/* Hackathon Detail & Registration Modal */}
      <Modal
        open={!!hackathonDetailModal}
        onClose={() => setHackathonDetailModal(null)}
        title="Hackathon Details & Registration"
      >
        {hackathonDetailModal && (
          <div className="space-y-5">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">
                {hackathonDetailModal.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" /> {hackathonDetailModal.dates}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {hackathonDetailModal.location}
                </span>
              </div>
              <p className="text-sm text-foreground mt-3">
                {hackathonDetailModal.description}
              </p>
              <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Organizer:</span>{" "}
                  <span className="text-foreground font-medium">
                    {hackathonDetailModal.organizer}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Prize Pool:</span>{" "}
                  <span className="text-accent font-bold">
                    {hackathonDetailModal.prize}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Participants:</span>{" "}
                  <span>{hackathonDetailModal.participants}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Theme:</span>{" "}
                  <span>{hackathonDetailModal.theme}</span>
                </div>
              </div>
            </div>
            {hackathonDetailModal.status !== "ended" &&
              !registeredHackathons.includes(hackathonDetailModal.id) && (
                <div className="border-t border-border pt-4">
                  <h4 className="font-semibold text-foreground mb-3">
                    Register for this hackathon
                  </h4>
                  <div className="space-y-3">
                    <input
                      className="input-field"
                      placeholder="Full Name *"
                      value={hackathonRegForm.name}
                      onChange={(e) =>
                        setHackathonRegForm({
                          ...hackathonRegForm,
                          name: e.target.value,
                        })
                      }
                    />
                    <input
                      className="input-field"
                      placeholder="Email Address *"
                      type="email"
                      value={hackathonRegForm.email}
                      onChange={(e) =>
                        setHackathonRegForm({
                          ...hackathonRegForm,
                          email: e.target.value,
                        })
                      }
                    />
                    {hackathonDetailModal.team && (
                      <input
                        className="input-field"
                        placeholder="Team Name (optional)"
                        value={hackathonRegForm.teamName}
                        onChange={(e) =>
                          setHackathonRegForm({
                            ...hackathonRegForm,
                            teamName: e.target.value,
                          })
                        }
                      />
                    )}
                    <button
                      onClick={() =>
                        handleHackathonRegister(hackathonDetailModal)
                      }
                      className="w-full btn-primary bg-primary hover:bg-indigo-700 text-white py-2.5 rounded-xl flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" /> Confirm Registration
                    </button>
                  </div>
                </div>
              )}
            {registeredHackathons.includes(hackathonDetailModal.id) && (
              <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-xl text-center">
                <CheckCircle2 className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-green-700 dark:text-green-400 font-semibold">
                  You are registered for this hackathon!
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Check your email for further instructions.
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Join Group Modal */}
      <Modal
        open={!!joinGroupModal}
        onClose={() => setJoinGroupModal(null)}
        title={`Join ${joinGroupModal?.name || "Group"}`}
      >
        {joinGroupModal && (
          <div className="space-y-4">
            <div
              className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto",
                joinGroupModal.color,
              )}
            >
              <joinGroupModal.icon className="w-8 h-8" />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Become a member of{" "}
              <strong className="text-foreground">{joinGroupModal.name}</strong>{" "}
              and connect with {joinGroupModal.members} developers.
            </p>
            <div className="space-y-3">
              <input
                className="input-field"
                placeholder="Your Name *"
                value={groupForm.name}
                onChange={(e) =>
                  setGroupForm({ ...groupForm, name: e.target.value })
                }
              />
              <input
                className="input-field"
                placeholder="Role / Interest (e.g., Frontend Dev, ML Enthusiast) *"
                value={groupForm.role}
                onChange={(e) =>
                  setGroupForm({ ...groupForm, role: e.target.value })
                }
              />
              <button
                onClick={() => handleJoinGroup(joinGroupModal)}
                className="w-full btn-primary bg-primary hover:bg-indigo-700 text-white py-2.5 rounded-xl flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Join Community
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Job Application Modal */}
      <Modal
        open={applyJobModal.open}
        onClose={() =>
          setApplyJobModal({ open: false, jobTitle: "", company: "" })
        }
        title={`Apply for ${applyJobModal.jobTitle}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Full Name *
            </label>
            <input
              className="input-field"
              value={jobApplicationForm.fullName}
              onChange={(e) =>
                setJobApplicationForm({
                  ...jobApplicationForm,
                  fullName: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Email Address *
            </label>
            <input
              className="input-field"
              type="email"
              value={jobApplicationForm.email}
              onChange={(e) =>
                setJobApplicationForm({
                  ...jobApplicationForm,
                  email: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Resume (Link or Upload) *
            </label>
            <div className="flex gap-2">
              <input
                className="input-field flex-1"
                placeholder="Google Drive / LinkedIn / GitHub resume URL"
                value={jobApplicationForm.resume}
                onChange={(e) =>
                  setJobApplicationForm({
                    ...jobApplicationForm,
                    resume: e.target.value,
                  })
                }
              />
              <button
                className="btn-secondary px-3 py-2 text-sm flex items-center gap-1"
                onClick={() =>
                  toast.info("Upload simulation - attach PDF in production")
                }
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Cover Letter (Optional)
            </label>
            <textarea
              className="input-field resize-none min-h-[100px]"
              placeholder="Why are you a good fit for this role?"
              value={jobApplicationForm.coverLetter}
              onChange={(e) =>
                setJobApplicationForm({
                  ...jobApplicationForm,
                  coverLetter: e.target.value,
                })
              }
            />
          </div>
          <button
            onClick={submitJobApplication}
            className="w-full btn-primary bg-accent hover:bg-accent/90 text-white py-2.5 rounded-xl flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" /> Submit Application
          </button>
        </div>
      </Modal>

      {/* Challenge Modal (unchanged) */}
      <Modal
        open={challengeModalOpen}
        onClose={() => setChallengeModalOpen(false)}
        title={`Solve: ${selectedChallenge?.title || "Challenge"}`}
      >
        {selectedChallenge && (
          <div className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      {
                        "bg-green-100 text-green-700":
                          selectedChallenge.difficulty === "Easy",
                        "bg-yellow-100 text-yellow-700":
                          selectedChallenge.difficulty === "Medium",
                        "bg-red-100 text-red-700":
                          selectedChallenge.difficulty === "Hard",
                      },
                    )}
                  >
                    {selectedChallenge.difficulty}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    +{selectedChallenge.points} pts
                  </span>
                </div>
                {selectedChallenge.solved && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Solved
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground mt-2">
                {selectedChallenge.description}
              </p>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-foreground">
                  Your Solution
                </label>
                <select
                  className="text-xs border border-border rounded-md px-2 py-1 bg-background"
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value)}
                >
                  <option>Python</option>
                  <option>JavaScript</option>
                  <option>Java</option>
                </select>
              </div>
              <textarea
                value={challengeCode}
                onChange={(e) => setChallengeCode(e.target.value)}
                className="w-full h-64 font-mono text-sm bg-gray-950 text-green-400 p-4 rounded-xl border border-border resize-none"
                spellCheck={false}
              />
            </div>
            {codeOutput && (
              <div className="p-3 bg-muted/50 rounded-xl">
                <p className="text-xs font-mono text-muted-foreground">
                  Output:
                </p>
                <pre className="text-xs text-foreground mt-1 whitespace-pre-wrap">
                  {codeOutput}
                </pre>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={runCode}
                disabled={codeRunning}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {codeRunning ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}{" "}
                Run Code
              </button>
              <button
                onClick={submitSolution}
                disabled={selectedChallenge.solved}
                className="flex-1 px-4 py-2 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent/90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Submit Solution
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Portfolio Add/Edit/Delete Modals (unchanged) */}
      <Modal
        open={addProjectModal}
        onClose={() => setAddProjectModal(false)}
        title="Add New Project"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Project Title *
            </label>
            <input
              className="input-field"
              value={newProject.title}
              onChange={(e) =>
                setNewProject((p) => ({ ...p, title: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Description
            </label>
            <textarea
              className="input-field resize-none min-h-[80px]"
              value={newProject.desc}
              onChange={(e) =>
                setNewProject((p) => ({ ...p, desc: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Technologies (comma-separated)
            </label>
            <input
              className="input-field"
              value={newProject.tech}
              onChange={(e) =>
                setNewProject((p) => ({ ...p, tech: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              GitHub / Live URL
            </label>
            <input
              className="input-field"
              value={newProject.url}
              onChange={(e) =>
                setNewProject((p) => ({ ...p, url: e.target.value }))
              }
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setAddProjectModal(false)}
              className="flex-1 btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleAddProject}
              className="flex-1 btn-primary text-sm bg-primary hover:bg-indigo-700"
            >
              Add Project
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={editProjectModal.open}
        onClose={() => setEditProjectModal({ open: false, project: null })}
        title="Edit Project"
      >
        {editProjectModal.project && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Project Title
              </label>
              <input
                className="input-field"
                value={editProjectData.title}
                onChange={(e) =>
                  setEditProjectData({
                    ...editProjectData,
                    title: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Description
              </label>
              <textarea
                className="input-field resize-none min-h-[80px]"
                value={editProjectData.desc}
                onChange={(e) =>
                  setEditProjectData({
                    ...editProjectData,
                    desc: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Technologies (comma-separated)
              </label>
              <input
                className="input-field"
                value={editProjectData.tech}
                onChange={(e) =>
                  setEditProjectData({
                    ...editProjectData,
                    tech: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Status
              </label>
              <select
                className="input-field"
                value={editProjectData.status}
                onChange={(e) =>
                  setEditProjectData({
                    ...editProjectData,
                    status: e.target.value,
                  })
                }
              >
                <option value="live">Live</option>
                <option value="in-progress">In Progress</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                URL
              </label>
              <input
                className="input-field"
                value={editProjectData.url}
                onChange={(e) =>
                  setEditProjectData({
                    ...editProjectData,
                    url: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  setEditProjectModal({ open: false, project: null })
                }
                className="flex-1 btn-secondary text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleEditProject}
                className="flex-1 btn-primary text-sm bg-primary hover:bg-indigo-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: 0, title: "" })}
        title="Delete Project"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              Remove "{deleteConfirm.title}"?
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() =>
                setDeleteConfirm({ open: false, id: 0, title: "" })
              }
              className="flex-1 btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteProject}
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
