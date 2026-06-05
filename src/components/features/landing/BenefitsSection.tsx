import { TrendingUp, Clock, Trophy, Briefcase, Globe, Zap } from "lucide-react";

const STATS = [
  { value: "250K+", label: "Active learners", sub: "across 180 countries" },
  { value: "87%", label: "Job placement rate", sub: "within 6 months of completion" },
  { value: "1,200+", label: "Courses available", sub: "from intro to advanced" },
  { value: "500+", label: "Hiring partners", sub: "actively recruiting graduates" },
];

const REASONS = [
  {
    icon: TrendingUp,
    title: "Outcomes, not completions",
    body: "We track career placement, salary increases, and promotion rates — not just lesson views. Every feature is built backwards from job outcomes.",
  },
  {
    icon: Trophy,
    title: "Credentials that actually matter",
    body: "Our certificates are backed by skills assessments that hiring managers have designed. 500+ companies specifically search for VedTechno graduates.",
  },
  {
    icon: Zap,
    title: "AI that adapts to you",
    body: "The platform adjusts pacing, recommends next steps, and flags knowledge gaps based on your actual coding output — not just quiz scores.",
  },
  {
    icon: Clock,
    title: "Built for working professionals",
    body: "Modular lessons from 10–40 minutes. Offline access. Progress syncs across devices. Designed around a schedule that isn't 9-to-5.",
  },
  {
    icon: Globe,
    title: "A real community",
    body: "Not a dead forum. Weekly hackathons, open-source projects, live workshops, and peer code review — all organized by tech stack.",
  },
  {
    icon: Briefcase,
    title: "Portfolio that speaks for itself",
    body: "Every project you build gets packaged into a portfolio page. Recruiters see your work, not just your certificate.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="section-padding bg-background" id="benefits">
      <div className="container-custom">

        {/* Stats strip — editorial */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border border border-border rounded-2xl overflow-hidden mb-20">
          {STATS.map((s) => (
            <div key={s.label} className="bg-card px-6 py-8">
              <p className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">{s.value}</p>
              <p className="text-sm font-medium text-foreground mt-1">{s.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Why section — two-column editorial */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          <div className="lg:w-72 flex-shrink-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Why VedTechno</p>
            <h2 className="text-3xl font-bold text-foreground leading-tight">
              We built this for outcomes, not engagement
            </h2>
            <p className="text-muted-foreground text-sm mt-4 leading-relaxed">
              Most platforms optimize for time-on-site. We optimize for the moment you land a better job.
            </p>
          </div>

          <div className="flex-1 grid sm:grid-cols-2 gap-x-8 gap-y-10">
            {REASONS.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <div className="flex items-center gap-2.5 mb-3">
                  <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
