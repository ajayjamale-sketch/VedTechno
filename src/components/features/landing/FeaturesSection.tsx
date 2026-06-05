import { Link } from "react-router-dom";
import { Code2, Brain, Rocket, Cloud, Shield, Users, BarChart3, Database, Smartphone, ArrowUpRight } from "lucide-react";

const FEATURES = [
  {
    icon: Code2,
    title: "Interactive Coding Lab",
    desc: "Cloud IDE with 20+ languages, real-time evaluation, and sandboxed environments that persist across sessions.",
    tag: "Core",
  },
  {
    icon: Brain,
    title: "AI Coding Assistant",
    desc: "Code generation, bug detection, refactoring suggestions, and architecture guidance — all context-aware.",
    tag: "AI",
  },
  {
    icon: Rocket,
    title: "Project-Based Learning",
    desc: "Real capstone projects, team challenges, and portfolio generation reviewed by industry professionals.",
    tag: "Core",
  },
  {
    icon: Cloud,
    title: "Cloud & DevOps Paths",
    desc: "Hands-on labs for AWS, Docker, Kubernetes, CI/CD, and cloud-native architecture patterns.",
    tag: "New",
  },
  {
    icon: Shield,
    title: "Certification System",
    desc: "Proctored assessments, digital certificates, and verified skill badges recognized by 500+ hiring partners.",
    tag: "Core",
  },
  {
    icon: Users,
    title: "Developer Community",
    desc: "Forums, open-source groups, hackathons, and knowledge-sharing spaces organized by technology.",
    tag: "Core",
  },
  {
    icon: BarChart3,
    title: "Career Hub",
    desc: "Resume builder, mock interviews, job board, and personalized roadmaps based on your skills.",
    tag: "Core",
  },
  {
    icon: Database,
    title: "Learning Analytics",
    desc: "Track coding output, skill velocity, course completion rates, and career readiness scores in one view.",
    tag: "Core",
  },
  {
    icon: Smartphone,
    title: "Enterprise & Teams",
    desc: "Corporate learning management, skill gap analysis, team progress tracking, and compliance reports.",
    tag: "Teams",
  },
];

const tagColor: Record<string, string> = {
  Core: "bg-muted text-muted-foreground",
  AI: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  New: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Teams: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-primary/80",
};

export default function FeaturesSection() {
  return (
    <section className="section-padding bg-background" id="features">
      <div className="container-custom">

        {/* Two-column header — left text, right statement */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 pb-10 border-b border-border">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Platform capabilities</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight max-w-lg">
              Every tool a developer needs to learn, build, and grow
            </h2>
          </div>
          <div className="lg:max-w-sm">
            <p className="text-muted-foreground leading-relaxed text-sm">
              From beginner programming to enterprise architecture — structured courses, live coding, certifications, and placement support built into one coherent platform.
            </p>
            <Link to="/features" className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary dark:hover:text-primary/80 mt-4 group transition-colors">
              All features
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Feature table — alternating layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            const isFeatured = i === 0;
            return (
              <div
                key={f.title}
                className={`bg-card p-6 hover:bg-muted/40 transition-colors group ${isFeatured ? "md:col-span-2 lg:col-span-1" : ""}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary dark:group-hover:text-primary/80 transition-colors" />
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tagColor[f.tag]}`}>
                    {f.tag}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
