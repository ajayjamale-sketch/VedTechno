import { useState } from "react";
import { Link } from "react-router-dom";
import { Code2, Search, ArrowRight, Terminal, BookOpen, Star, Users, CheckCircle, Play, ChevronRight, Sparkles, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { createPortal } from "react-dom";

const PROJECTS_LIST = [
  {
    id: "proj-1",
    title: "Build a Cloud-Based Interactive IDE",
    category: "Full-Stack Development",
    difficulty: "Advanced",
    time: "24 hours",
    rating: 4.9,
    students: "12,450",
    tech: ["React", "Node.js", "Docker", "Socket.io"],
    desc: "Architect a multi-user, collaborative editor with real-time sync, sandboxed code execution, and persistent file structures.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=350&fit=crop",
    popular: true,
  },
  {
    id: "proj-2",
    title: "AI-Powered Customer Support agent",
    category: "Artificial Intelligence",
    difficulty: "Intermediate",
    time: "16 hours",
    rating: 4.8,
    students: "8,920",
    tech: ["Python", "OpenAI API", "Vector Databases", "LangChain"],
    desc: "Build a fully autonomous chatbot that learns from custom knowledge bases, resolves complex queries, and integrates with Slack.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=350&fit=crop",
    popular: true,
  },
  {
    id: "proj-3",
    title: "Kubernetes GitOps Pipeline",
    category: "DevOps & Cloud",
    difficulty: "Advanced",
    time: "18 hours",
    rating: 4.7,
    students: "5,340",
    tech: ["ArgoCD", "Kubernetes", "GitHub Actions", "Terraform"],
    desc: "Automate code deployments from git commits to AWS EKS with canary releases, health checks, and secure secret vaults.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=350&fit=crop",
    popular: false,
  },
  {
    id: "proj-4",
    title: "E-Commerce Microservices Architecture",
    category: "Backend Development",
    difficulty: "Intermediate",
    time: "20 hours",
    rating: 4.8,
    students: "7,100",
    tech: ["Go", "gRPC", "PostgreSQL", "RabbitMQ"],
    desc: "Develop decoupled services for checkout, inventory, and notifications utilizing messaging brokers and distributed tracing.",
    image: "https://images.unsplash.com/photo-1508873535684-277a3cbcc4e8?w=600&h=350&fit=crop",
    popular: false,
  },
];

export default function Projects({ isDashboardView = false }: { isDashboardView?: boolean }) {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [enrolled, setEnrolled] = useState<string[]>(["proj-1"]);
  const [ideModal, setIdeModal] = useState<{ open: boolean; title: string } | null>(null);

  const filtered = PROJECTS_LIST.filter(p => {
    const matchesCategory = filter === "All" || p.category === filter;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.desc.toLowerCase().includes(search.toLowerCase()) ||
                          p.tech.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleEnroll = (id: string, title: string) => {
    if (enrolled.includes(id)) {
      setIdeModal({ open: true, title });
    } else {
      setEnrolled([...enrolled, id]);
      toast.success(`Enrolled in "${title}" successfully! Launching coding lab...`);
      setTimeout(() => {
        setIdeModal({ open: true, title });
      }, 800);
    }
  };

  const renderContent = () => (
    <>
      {/* Filter and Content */}
      <section className={cn("bg-muted/20 rounded-2xl border border-border/10", isDashboardView ? "py-2" : "section-padding")}>
        <div className={isDashboardView ? "w-full" : "container-custom"}>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
            <div className="flex flex-wrap gap-2">
              {["All", "Full-Stack Development", "Artificial Intelligence", "DevOps & Cloud", "Backend Development"].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    filter === cat 
                      ? "bg-primary text-white shadow-sm" 
                      : "bg-card border border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {cat === "All" ? "All Categories" : cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects, stacks..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/40"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {filtered.map((proj) => {
              const isEnrolled = enrolled.includes(proj.id);
              return (
                <div key={proj.id} className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all duration-200 flex flex-col h-full">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img src={proj.image} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    {proj.popular && (
                      <span className="absolute top-4 left-4 bg-primary text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <Sparkles className="w-3 h-3" /> Popular
                      </span>
                    )}
                    <span className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-lg">
                      {proj.difficulty}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <span>{proj.category}</span>
                      <span>•</span>
                      <span>{proj.time}</span>
                    </div>

                    <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1">
                      {proj.desc}
                    </p>

                    {/* Tech Stacks */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {proj.tech.map(t => (
                        <span key={t} className="text-[11px] font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Footer / Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /> {proj.rating}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {proj.students} enrolled</span>
                      </div>
                      <button
                        onClick={() => handleEnroll(proj.id, proj.title)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isEnrolled 
                            ? "bg-accent/15 text-accent border border-accent/30 hover:bg-accent/20" 
                            : "bg-primary text-white hover:bg-primary/95"
                        }`}
                      >
                        {isEnrolled ? (
                          <>
                            <Play className="w-3 h-3 fill-accent" /> Launch Lab
                          </>
                        ) : (
                          <>
                            Enroll Project <ArrowRight className="w-3 h-3" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cloud IDE Simulator Modal */}
      {ideModal && ideModal.open && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className={cn(
            "w-full max-w-5xl h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border transition-colors duration-200",
            isDark ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-white border-slate-200 text-slate-800 shadow-2xl"
          )}>
            {/* IDE Header */}
            <div className={cn(
              "flex justify-between items-center px-4 py-3 border-b transition-colors duration-200",
              isDark ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
            )}>
              <div className="flex items-center gap-2">
                <Terminal className={cn("w-4 h-4", isDark ? "text-emerald-400" : "text-emerald-600")} />
                <span className={cn("text-xs font-mono", isDark ? "text-slate-400" : "text-slate-500")}>
                  workspace / {ideModal.title.toLowerCase().replace(/\s+/g, '-')}
                </span>
              </div>
              <button 
                onClick={() => setIdeModal(null)} 
                className={cn(
                  "px-3 py-1 text-xs font-semibold rounded-lg transition-colors",
                  isDark 
                    ? "bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-300" 
                    : "bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 border border-slate-200"
                )}
              >
                Close Lab
              </button>
            </div>

            {/* IDE Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* File tree */}
              <div className={cn(
                "w-48 border-r p-3 flex flex-col gap-2 font-mono text-xs transition-colors duration-200",
                isDark ? "bg-slate-950 border-slate-900 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
              )}>
                <p className={cn("font-semibold mb-2 uppercase text-[10px]", isDark ? "text-slate-500" : "text-slate-400")}>Explorer</p>
                <div className={cn("flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer", isDark ? "hover:bg-slate-900" : "hover:bg-slate-200/50")}><ChevronRight className="w-3 h-3" /> components</div>
                <div className={cn("flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer", isDark ? "hover:bg-slate-900" : "hover:bg-slate-200/50")}><ChevronRight className="w-3 h-3" /> server</div>
                <div className={cn("flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer", isDark ? "bg-slate-900 text-slate-200" : "bg-slate-200/80 text-slate-900 font-semibold")}>index.js</div>
                <div className={cn("flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer", isDark ? "hover:bg-slate-900" : "hover:bg-slate-200/50")}>Dockerfile</div>
                <div className={cn("flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer", isDark ? "hover:bg-slate-900" : "hover:bg-slate-200/50")}>package.json</div>
              </div>

              {/* Code Editor */}
              <div className={cn("flex-1 flex flex-col transition-colors duration-200", isDark ? "bg-slate-950" : "bg-white")}>
                <div className="flex-1 p-6 font-mono text-sm leading-relaxed overflow-y-auto">
                  <div className={isDark ? "text-slate-500" : "text-slate-400 font-medium"}>// Welcome to your cloud developer environment</div>
                  <div className={isDark ? "text-slate-500" : "text-slate-400 font-medium"}>// Complete the implementation to trigger evaluation</div>
                  <br />
                  <div><span className={isDark ? "text-purple-400" : "text-purple-600 font-semibold"}>const</span> express = <span className={isDark ? "text-blue-400" : "text-blue-600"}>require</span>(<span className={isDark ? "text-emerald-400" : "text-emerald-600"}>"express"</span>);</div>
                  <div><span className={isDark ? "text-purple-400" : "text-purple-600 font-semibold"}>const</span> app = <span className={isDark ? "text-blue-400" : "text-blue-600"}>express</span>();</div>
                  <br />
                  <div className={isDark ? "text-slate-500" : "text-slate-400 font-medium"}>// TODO: Implement web socket connection for live updates</div>
                  <div>app.get(<span className={isDark ? "text-emerald-400" : "text-emerald-600"}>"/api/health"</span>, (req, res) =&gt; {`{`}</div>
                  <div className="pl-4">res.json({`{`} status: <span className={isDark ? "text-emerald-400" : "text-emerald-600"}>"healthy"</span> {`}`});</div>
                  <div>{`}`});</div>
                </div>

                {/* Terminal Pane */}
                <div className={cn(
                  "h-48 border-t p-4 font-mono text-xs transition-colors duration-200",
                  isDark ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
                )}>
                  <p className={isDark ? "text-slate-500" : "text-slate-400 font-semibold mb-2"}>Terminal</p>
                  <p className={isDark ? "text-emerald-400" : "text-emerald-600"}>
                    ubuntu@vedtechno-sandbox:~$ <span className={isDark ? "text-slate-200" : "text-slate-900 font-semibold"}>npm run dev</span>
                  </p>
                  <p className="text-slate-400 mt-1">VITE v5.4.1 ready in 450 ms</p>
                  <p className="text-slate-400">➜ Local: http://localhost:5173/</p>
                  <p className={isDark ? "text-slate-500" : "text-slate-400 font-medium mt-1"}>Watching for file changes...</p>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );

  if (isDashboardView) {
    return renderContent();
  }

  return (
    <main className="page-enter pt-20">
      {/* Hero Header */}
      <section className="relative py-16 bg-background overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            opacity: 0.4,
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          }}
        />
        <div className="relative container-custom">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <span className="badge-primary mb-3 inline-block">Project-Based Learning</span>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 leading-tight">
                Learn by building <span className="gradient-text">production-ready projects</span>
              </h1>
              <p className="text-muted-foreground text-sm max-w-xl">
                Ditch the simple tutorials. Work through guided industry assignments in sandboxed cloud IDEs, participate in team hackathons, and automatically package everything into your recruiter portfolio.
              </p>
            </div>
            {user && (
              <div className="flex gap-4 p-4 bg-muted/40 rounded-2xl border border-border w-full lg:w-auto">
                <div className="text-center px-4 border-r border-border">
                  <p className="text-xs text-muted-foreground">My Projects</p>
                  <p className="text-2xl font-bold text-foreground">{enrolled.length}</p>
                </div>
                <div className="text-center px-4 border-r border-border">
                  <p className="text-xs text-muted-foreground">Verified Skills</p>
                  <p className="text-2xl font-bold text-foreground">8</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-xs text-muted-foreground">Cohort Rank</p>
                  <p className="text-2xl font-bold text-primary dark:text-primary/80">#14</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
