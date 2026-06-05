import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { PRICING_PLANS } from "@/lib/constants";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="section-padding bg-muted/30" id="pricing">
      <div className="container-custom">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight max-w-sm">
              Simple pricing, no surprises
            </h2>
          </div>
          {/* Toggle — minimal */}
          <div className="flex items-center gap-3 bg-card border border-border rounded-xl p-1 w-fit">
            <button
              onClick={() => setIsAnnual(false)}
              className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all", !isAnnual ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={cn("px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2", isAnnual ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")}
            >
              Annual
              <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-semibold">−35%</span>
            </button>
          </div>
        </div>

        {/* Plans — horizontal for desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl border flex flex-col",
                plan.highlighted
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-border bg-card"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-6">
                  <span className="px-3 py-1 bg-background border border-border text-foreground text-xs font-semibold rounded-full shadow-sm">
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="p-6 pb-0">
                <h3 className={cn("text-base font-semibold mb-1", plan.highlighted ? "text-white" : "text-foreground")}>
                  {plan.name}
                </h3>
                <p className={cn("text-sm leading-relaxed mb-6", plan.highlighted ? "text-white/70" : "text-muted-foreground")}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={cn("text-4xl font-bold tracking-tight", plan.highlighted ? "text-white" : "text-foreground")}>
                    ${isAnnual ? plan.price.annual : plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className={cn("text-sm", plan.highlighted ? "text-white/60" : "text-muted-foreground")}>/mo</span>
                  )}
                </div>
              </div>

              <div className={cn("mx-6 border-t", plan.highlighted ? "border-white/20" : "border-border")} />

              <ul className="px-6 py-5 space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check className={cn("w-4 h-4 flex-shrink-0", plan.highlighted ? "text-white/80" : "text-emerald-500")} />
                    <span className={cn(plan.highlighted ? "text-white/80" : "text-muted-foreground")}>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="p-6 pt-0">
                <Link
                  to="/register"
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors",
                    plan.highlighted
                      ? "bg-white text-blue-600 hover:bg-white/90"
                      : "border border-border text-foreground hover:bg-muted"
                  )}
                >
                  {plan.price.monthly === 0 ? "Start for free" : "Start free trial"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise footnote */}
        <p className="mt-8 text-sm text-muted-foreground text-center">
          Need a custom plan for large teams?{" "}
          <Link to="/contact" className="text-foreground font-medium hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2 transition-colors">
            Talk to our enterprise team
          </Link>
        </p>

      </div>
    </section>
  );
}
