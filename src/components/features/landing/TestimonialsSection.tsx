import { useState } from "react";
import { Star, ArrowRight } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function TestimonialsSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section className="section-padding bg-background" id="testimonials">
      <div className="container-custom">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 pb-10 border-b border-border">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">From our community</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              Real learners,<br />real career changes
            </h2>
          </div>
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">4.9</p>
              <div className="flex gap-0.5 mt-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />)}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">50k+ reviews</p>
            </div>
          </div>
        </div>

        {/* Main featured quote + grid */}
        <div className="grid lg:grid-cols-12 gap-8">

          {/* Featured — takes more space */}
          <div className="lg:col-span-5">
            <div className="h-full flex flex-col justify-between bg-blue-600 rounded-2xl p-8 text-white">
              <div>
                <div className="flex gap-0.5 mb-6">
                  {[...Array(TESTIMONIALS[activeIdx].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-white/80 fill-white/80" />
                  ))}
                </div>
                <blockquote className="text-white/90 text-lg leading-relaxed font-medium">
                  "{TESTIMONIALS[activeIdx].content}"
                </blockquote>
              </div>
              <div className="mt-8 flex items-center gap-3">
                <img
                  src={TESTIMONIALS[activeIdx].avatar}
                  alt={TESTIMONIALS[activeIdx].name}
                  className="w-10 h-10 rounded-lg object-cover ring-2 ring-white/20"
                />
                <div>
                  <p className="font-semibold text-white text-sm">{TESTIMONIALS[activeIdx].name}</p>
                  <p className="text-white/60 text-xs">{TESTIMONIALS[activeIdx].role} · {TESTIMONIALS[activeIdx].company}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Grid of cards */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4 content-start">
            {TESTIMONIALS.map((t, idx) => (
              <button
                key={t.id}
                onClick={() => setActiveIdx(idx)}
                className={cn(
                  "text-left p-5 rounded-xl border transition-all duration-200",
                  idx === activeIdx
                    ? "border-blue-600/40 bg-blue-600/5"
                    : "border-border bg-card hover:border-muted-foreground/30"
                )}
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />)}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">"{t.content}"</p>
                <div className="flex items-center gap-2.5">
                  <img src={t.avatar} alt={t.name} className="w-7 h-7 rounded-md object-cover" />
                  <div>
                    <p className="text-xs font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

        </div>

        {/* Bottom CTA */}
        <div className="mt-12 pt-10 border-t border-border flex items-center justify-between gap-4 flex-wrap">
          <p className="text-sm text-muted-foreground">Join 250,000+ learners who've already made the switch.</p>
          <Link to="/register" className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
            Get started free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
