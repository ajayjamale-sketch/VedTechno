import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Code2, Play, CheckCircle2, Star, Users, Award } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.jpg";

const roles = ["Students", "Developers", "Teams", "Founders", "Engineers"];

export default function HeroSection() {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const word = roles[roleIdx];

    if (typing) {
      if (displayed.length < word.length) {
        timerRef.current = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 60);
      } else {
        timerRef.current = setTimeout(() => setTyping(false), 1800);
      }
    } else {
      if (displayed.length > 0) {
        timerRef.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35);
      } else {
        setRoleIdx((i) => (i + 1) % roles.length);
        setTyping(true);
      }
    }
    return () => clearTimeout(timerRef.current);
  }, [displayed, typing, roleIdx]);

  return (
    <section className="relative pt-24 md:pt-32 pb-0 bg-background overflow-hidden">

      {/* Subtle background grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          opacity: 0.4,
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      <div className="relative container-custom">
        <div className="max-w-4xl mx-auto text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-card text-xs font-medium text-muted-foreground mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            250,000+ learners — now hiring
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.05] mb-6">
            The platform built
            <br />
            for{" "}
            <span className="text-primary dark:text-primary/80">
              {displayed}
              <span className="animate-pulse">|</span>
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Coding courses, AI tools, certifications, and career support — everything a modern developer needs in one place.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link
              to="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-sm"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-border text-foreground font-medium rounded-xl hover:bg-muted transition-colors text-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current text-primary" />
              See the dashboard
            </Link>
          </div>

          {/* Social proof row */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-16 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["photo-1507003211169-0a1dd7228f2d", "photo-1494790108377-be9c29b29330", "photo-1472099645785-5658abf4ff4e", "photo-1438761681033-6461ffad8d80"].map((id) => (
                  <img
                    key={id}
                    src={`https://images.unsplash.com/${id}?w=32&h=32&fit=crop&crop=face`}
                    className="w-7 h-7 rounded-full border-2 border-background object-cover"
                    alt=""
                  />
                ))}
              </div>
              <span>Trusted by 250k+</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" />)}
              </div>
              <span>4.9 / 5 rating</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
              <span>No credit card needed</span>
            </div>
          </div>
        </div>

        {/* Dashboard screenshot — bottom-aligned, no float */}
        <div className="relative max-w-5xl mx-auto">
          {/* Fade to background at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
            style={{ background: "linear-gradient(to top, hsl(var(--background)), transparent)" }}
          />

          <div className="rounded-t-2xl border border-border border-b-0 overflow-hidden shadow-2xl shadow-black/10">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/70" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/70" />
              </div>
              <div className="flex-1 mx-3">
                <div className="bg-background border border-border rounded-md px-3 py-1 text-xs text-muted-foreground text-center max-w-xs mx-auto">
                  app.vedtechno.com/dashboard
                </div>
              </div>
            </div>
            <img
              src={heroDashboard}
              alt="VedTechno dashboard"
              className="w-full object-cover object-top"
              style={{ maxHeight: "480px" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
