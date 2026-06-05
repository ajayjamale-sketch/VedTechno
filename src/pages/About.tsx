import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Code2 } from "lucide-react";


const milestones = [
  { year: "2021", event: "Founded with 10 founding courses and a 4-person team." },
  { year: "2022", event: "50,000 learners. Launched the AI coding assistant." },
  { year: "2023", event: "Enterprise plan launched. 200+ company partnerships." },
  { year: "2024", event: "250,000 learners. 85,000 certificates issued." },
  { year: "2025", event: "Expanded to 180 countries. Innovation Hub launched." },
  { year: "2026", event: "Next-gen AI engine launched. Mobile app released." },
];

export default function About() {
  return (
    <main className="page-enter">

      {/* Hero — editorial, left-aligned */}
      <section className="pt-28 pb-20 bg-background border-b border-border">
        <div className="container-custom">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">About VedTechno</p>
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground tracking-tight leading-[1.05] mb-6">
              We believe the skills gap shouldn't determine who gets to work in tech.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl mb-10">
              VedTechno was founded in 2021 with one conviction: world-class technical education should be available to any person with an internet connection, not just those who can afford $150,000 CS degrees.
            </p>
            <div className="flex gap-3">
              <Link to="/register" className="btn-primary text-sm">Join the platform</Link>
              <Link to="/contact" className="btn-secondary text-sm">Get in touch</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats — clean horizontal */}
      <section className="border-b border-border bg-background">
        <div className="container-custom py-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border">
            {[
              { value: "250K+", label: "Active learners" },
              { value: "180+", label: "Countries" },
              { value: "1,200+", label: "Courses" },
              { value: "500+", label: "Hiring partners" },
            ].map((s) => (
              <div key={s.label} className="px-8 py-10">
                <p className="text-3xl font-bold text-foreground">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission — two column */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Our mission</p>
              <h2 className="text-3xl font-bold text-foreground leading-tight mb-6">
                Make technical education accessible — not just affordable
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Affordable tuition is only part of the problem. We've also built mentorship access, AI-powered personalization, project labs, and a placement network that turns learning into employment.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our platform serves everyone: university students supplementing their degree, self-taught developers filling knowledge gaps, corporate teams upgrading their skills, and startup founders learning to build what they're selling.
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                alt="Team collaboration"
                className="rounded-2xl w-full object-cover"
              />
              <div className="mt-5 p-5 bg-muted rounded-xl border border-border">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Best EdTech Platform 2025</p>
                    <p className="text-xs text-muted-foreground mt-0.5">TechCrunch Startup Awards — Recognized for innovation in career-outcome-focused learning</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values — simple list */}
      <section className="section-padding bg-muted/30 border-y border-border">
        <div className="container-custom">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-10">What we stand for</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {[
              { title: "Outcomes first", body: "We measure ourselves by your career placement rate, not your lesson completion rate." },
              { title: "Learner-built", body: "Every feature gets designed around what helps learners move faster, not what increases engagement metrics." },
              { title: "Globally accessible", body: "Purchasing-power parity pricing so a student in Lagos pays the same relative cost as one in London." },
              { title: "Continuously honest", body: "We publish our placement data publicly. No cherry-picking. No 'of those who responded to our survey'." },
            ].map(({ title, body }) => (
              <div key={title} className="bg-card p-7">
                <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-background">
        <div className="container-custom max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-10">Company timeline</p>
          <div className="space-y-0 divide-y divide-border">
            {milestones.map((m) => (
              <div key={m.year} className="flex gap-8 py-6">
                <span className="text-sm font-bold text-muted-foreground tabular-nums flex-shrink-0 w-10">{m.year}</span>
                <p className="text-sm text-foreground leading-relaxed">{m.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="py-20 bg-background border-t border-border">
        <div className="container-custom">
          <div className="max-w-lg">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to join?</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Start learning today and become part of a community of 250,000 developers building the future of technology.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 btn-primary text-sm">
              Get started for free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
