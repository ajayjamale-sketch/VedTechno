import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Set your goal",
    body: "Choose a learning path based on your role — student, developer, corporate team, or startup founder. Answer a short skill assessment to get a personalized roadmap.",
    detail: "Takes about 3 minutes. No technical knowledge required to start.",
    checks: ["Skill assessment", "Role-based dashboard", "Personalized roadmap"],
  },
  {
    number: "02",
    title: "Learn through structured paths",
    body: "Follow expert-designed curriculum with video lessons, written guides, and interactive quizzes. Each path is broken into focused modules you can finish in a sitting.",
    detail: "Courses range from 2 hours to 6 months depending on depth.",
    checks: ["Video + written content", "Progress tracking", "Adaptive pacing"],
  },
  {
    number: "03",
    title: "Build real things in the coding lab",
    body: "Apply what you learn in our browser-based IDE. Work through guided projects, capstones, and open challenges. Everything you build goes into your portfolio automatically.",
    detail: "Supports 20+ languages. AI reviews your code in real time.",
    checks: ["Browser-based IDE", "AI code review", "Portfolio generation"],
  },
  {
    number: "04",
    title: "Get certified and get hired",
    body: "Take proctored assessments to earn verified certificates. Connect with 500+ hiring partners through our job board. Track your career readiness score as you progress.",
    detail: "87% of VedTechno graduates land a role within 6 months.",
    checks: ["Verified certificates", "Job board access", "Placement support"],
  },
];

export default function WorkflowSection() {
  return (
    <section className="section-padding bg-muted/30" id="workflow">
      <div className="container-custom">

        {/* Header — left aligned */}
        <div className="max-w-lg mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            From first lesson to first job offer
          </h2>
        </div>

        {/* Steps — horizontal rule between each */}
        <div className="space-y-0 divide-y divide-border">
          {STEPS.map((step, i) => (
            <div
              key={step.number}
              className="grid lg:grid-cols-12 gap-6 lg:gap-12 py-10 group"
            >
              {/* Number + title */}
              <div className="lg:col-span-4 flex items-start gap-5">
                <span className="text-4xl font-bold text-muted-foreground/20 tabular-nums leading-none mt-1 select-none min-w-[2.5rem]">
                  {step.number}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-foreground leading-snug">{step.title}</h3>
                  <p className="text-xs text-muted-foreground mt-2">{step.detail}</p>
                </div>
              </div>

              {/* Body */}
              <div className="lg:col-span-5">
                <p className="text-muted-foreground leading-relaxed text-sm">{step.body}</p>
              </div>

              {/* Checks */}
              <div className="lg:col-span-3">
                <ul className="space-y-2">
                  {step.checks.map((c) => (
                    <li key={c} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-border">
          <Link to="/register" className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
            Start your path today
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
