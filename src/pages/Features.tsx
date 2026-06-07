import { Link } from "react-router-dom";
import { 
  Code2, Brain, Cloud, Shield, Smartphone, Database, Rocket, Users, BarChart3, ArrowRight, Check, Terminal, GitBranch, Award, BookOpen, Building2,
  Compass, Cpu, PlayCircle, Video, Briefcase, FileCheck, Languages, CheckCircle2, FileText, LayoutGrid, ShieldAlert, Medal, Building, FileSpreadsheet, FileEdit, MessageSquare, TrendingUp, HeartHandshake, MessageCircle, Trophy, UserCheck, GitFork, FolderGit
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const featureGroups = [
  {
    category: "Learning Platform",
    icon: BookOpen,
    color: "from-blue-500 to-indigo-600",
    features: [
      { title: "1,200+ Expert Courses", desc: "From web dev to AI/ML, cloud, security, and mobile development.", icon: BookOpen },
      { title: "Structured Learning Paths", desc: "Curated 4-6 month paths designed with industry experts.", icon: GitFork },
      { title: "Adaptive Learning Engine", desc: "AI that personalizes your pace, content, and recommendations.", icon: Cpu },
      { title: "Video + Text Lessons", desc: "Multi-format content for different learning styles.", icon: PlayCircle },
      { title: "Live Sessions & Workshops", desc: "Weekly instructor-led live coding sessions.", icon: Video },
    ],
  },
  {
    category: "Project-Based Learning Platform",
    icon: Terminal,
    color: "from-blue-600 to-cyan-500",
    features: [
      { title: "Real-World Projects", desc: "Build applications that solve actual industry problems.", icon: Briefcase },
      { title: "Guided Pathways", desc: "Step-by-step instructions transitioning into independent coding.", icon: Compass },
      { title: "Portfolio Building", desc: "Automatically generate a professional portfolio of your deployed projects.", icon: FolderGit },
      { title: "Code Reviews", desc: "Get expert feedback on architecture, style, and best practices.", icon: Code2 },
      { title: "Team Collaboration", desc: "Work in Agile teams to simulate real engineering environments.", icon: Users },
    ],
  },
  {
    category: "Interactive Coding Lab",
    icon: Code2,
    color: "from-emerald-500 to-teal-600",
    features: [
      { title: "Cloud-Based IDE", desc: "Full-featured code editor accessible from any browser.", icon: Cloud },
      { title: "20+ Programming Languages", desc: "Python, JavaScript, Go, Rust, Java, C++, and more.", icon: Languages },
      { title: "Automated Code Evaluation", desc: "Instant feedback on correctness, performance, and style.", icon: CheckCircle2 },
      { title: "Sandbox Environments", desc: "Pre-configured development environments for each tech stack.", icon: Terminal },
      { title: "Pair Programming", desc: "Real-time collaborative coding with peers or mentors.", icon: Users },
    ],
  },
  {
    category: "AI Coding Assistant",
    icon: Brain,
    color: "from-purple-500 to-pink-600",
    features: [
      { title: "Intelligent Code Generation", desc: "AI generates boilerplate code, functions, and components.", icon: Brain },
      { title: "Real-Time Bug Detection", desc: "Catch errors before they compile with smart analysis.", icon: ShieldAlert },
      { title: "Refactoring Suggestions", desc: "Get recommendations to improve code quality and performance.", icon: Cpu },
      { title: "Documentation Generator", desc: "Automatically generate clear, comprehensive docs.", icon: FileText },
      { title: "Architecture Guidance", desc: "AI advises on system design and architectural patterns.", icon: LayoutGrid },
    ],
  },
  {
    category: "Certification System",
    icon: Award,
    color: "from-yellow-500 to-orange-600",
    features: [
      { title: "Proctored Assessments", desc: "Secure, verifiable skill evaluations with AI monitoring.", icon: Shield },
      { title: "Digital Certificates", desc: "Blockchain-verified certificates shareable on LinkedIn.", icon: Award },
      { title: "Skill Badges", desc: "Micro-credentials for individual competencies.", icon: Medal },
      { title: "Industry Alignment", desc: "Certifications aligned with AWS, Google, and Microsoft standards.", icon: Building },
      { title: "Practice Exams", desc: "Unlimited mock tests with detailed explanations.", icon: FileSpreadsheet },
    ],
  },
  {
    category: "Career Development",
    icon: Rocket,
    color: "from-orange-500 to-red-600",
    features: [
      { title: "AI Resume Builder", desc: "Smart resume builder tailored to each job application.", icon: FileEdit },
      { title: "Job Board Integration", desc: "500+ hiring partners posting exclusively on VedTechno.", icon: Briefcase },
      { title: "Mock Interview Platform", desc: "AI-powered technical and behavioral interview practice.", icon: MessageSquare },
      { title: "Career Roadmaps", desc: "Personalized step-by-step paths to your target role.", icon: TrendingUp },
      { title: "Placement Assistance", desc: "Dedicated career coaches for job placement support.", icon: HeartHandshake },
    ],
  },
  {
    category: "Community & Collaboration",
    icon: Users,
    color: "from-cyan-500 to-blue-600",
    features: [
      { title: "Developer Forums", desc: "Ask questions, share knowledge, get peer support.", icon: MessageCircle },
      { title: "Hackathons & Challenges", desc: "Weekly coding competitions with real prizes.", icon: Trophy },
      { title: "Open Source Projects", desc: "Contribute to real codebases and build your GitHub profile.", icon: GitBranch },
      { title: "Mentorship Network", desc: "Access experienced developers for 1:1 guidance.", icon: Users },
      { title: "Study Groups", desc: "Form cohorts and learn together with accountability partners.", icon: UserCheck },
    ],
  },
];

export default function Features() {
  const { user } = useAuth();
  return (
    <main className="page-enter">
      {/* Hero */}
      <section className="relative pt-24 md:pt-32 pb-16 bg-background overflow-hidden">
        {/* Subtle background grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            opacity: 0.4,
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          }}
        />
        <div className="relative container-custom text-center">
          <span className="badge-primary mb-4 inline-block ">Platform Features</span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5">
            Every Tool You Need to
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Become a Tech Expert
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            From your first line of code to your first dev job — VedTechno has the tools, courses, and community to get you there.
          </p>
          <Link to={user ? "/dashboard" : "/register"} className="btn-primary text-base px-8">
            {user ? "Go to Dashboard" : "Start Building Today"} <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-background border-b border-border">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Courses", value: "1,200+", icon: BookOpen },
              { label: "Languages Supported", value: "20+", icon: Code2 },
              { label: "AI Interactions Daily", value: "2M+", icon: Brain },
              { label: "Hiring Partners", value: "500+", icon: Building2 },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="flex justify-center text-primary mb-3"><s.icon className="w-8 h-8" /></div>
                <p className="text-3xl font-bold text-foreground mt-1">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Groups */}
      {featureGroups.map((group, gIdx) => (
        <section key={group.category} className={`section-padding ${gIdx % 2 === 0 ? "bg-background" : "bg-muted/30"}`}>
          <div className="container-custom">
            <div className={`grid lg:grid-cols-2 gap-12 items-center ${gIdx % 2 !== 0 ? "lg:grid-flow-dense" : ""}`}>
              <div className={gIdx % 2 !== 0 ? "lg:col-start-2" : ""}>
                <div className={`inline-flex w-12 h-12 rounded-xl bg-gradient-to-br ${group.color} items-center justify-center mb-5`}>
                  <group.icon className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-foreground mb-4">{group.category}</h2>
                <ul className="space-y-4">
                  {group.features.map((f) => {
                    const Icon = f.icon;
                    return (
                      <li key={f.title} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="w-3 h-3" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-foreground">{f.title}: </span>
                          <span className="text-sm text-muted-foreground">{f.desc}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className={`bg-gradient-to-br ${group.color} rounded-2xl p-8 text-white h-64 flex items-center justify-center ${gIdx % 2 !== 0 ? "lg:col-start-1" : ""}`}>
                <div className="text-center">
                  <group.icon className="w-16 h-16 text-white/90 mx-auto" />
                  <p className="mt-4 text-xl font-bold text-white">{group.category}</p>
                  <p className="mt-2 text-sm text-white/80">{group.features.length} key capabilities</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}


      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Experience All Features?</h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">Start with our free plan and unlock everything at your own pace.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={user ? "/dashboard" : "/register"} className="px-8 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-primary/10 transition-colors">
              {user ? "Go to Dashboard" : "Start Free Today"}
            </Link>
            <Link to="/pricing" className="px-8 py-3.5 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
              Compare Plans
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
