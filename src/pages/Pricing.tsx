import { useState } from "react";
import { Check, Zap, ArrowRight, HelpCircle } from "lucide-react";
import { PRICING_PLANS, FAQS } from "@/lib/constants";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState as useAccordionState } from "react";
import { useAuth } from "@/hooks/useAuth";

const addons = [
  { name: "AI Interview Coach", price: 9, desc: "Unlimited AI mock interviews with feedback" },
  { name: "Mentor Access", price: 19, desc: "Monthly 1:1 sessions with industry mentors" },
  { name: "Career Concierge", price: 29, desc: "Dedicated job placement specialist" },
];

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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
          <span className="badge-primary mb-4 inline-block ">Pricing</span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5">
            Simple,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
              Transparent
            </span>{" "}
            Pricing
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Toggle */}
      <section className="pt-12 pb-4 bg-background">
        <div className="container-custom">
          <div className="flex items-center justify-center gap-3">
            <span className={cn("text-sm font-medium", !isAnnual ? "text-foreground" : "text-muted-foreground")}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={cn("relative w-12 h-6 rounded-full transition-colors", isAnnual ? "bg-primary" : "bg-muted-foreground/30")}
            >
              <div className={cn("absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform", isAnnual ? "translate-x-6" : "")} />
            </button>
            <span className={cn("text-sm font-medium flex items-center gap-2", isAnnual ? "text-foreground" : "text-muted-foreground")}>
              Annual
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-medium">Save 35%</span>
            </span>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="pt-6 pb-16 bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-2xl border p-8 flex flex-col",
                  plan.highlighted
                    ? "border-primary bg-gradient-to-b from-blue-600/5 to-background shadow-2xl shadow-primary/10 scale-105"
                    : "border-border bg-card"
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-primary text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                      <Zap className="w-3 h-3" />{plan.badge}
                    </span>
                  </div>
                )}
                <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-sm text-muted-foreground mb-5">{plan.description}</p>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-5xl font-bold text-foreground">${isAnnual ? plan.price.annual : plan.price.monthly}</span>
                  {plan.price.monthly > 0 && <span className="text-muted-foreground">/mo</span>}
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className={cn("w-4 h-4 flex-shrink-0 mt-0.5", plan.highlighted ? "text-primary" : "text-accent")} />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to={user ? (plan.price.monthly === 0 ? "/contact" : "/payment") : "/register"} className={cn("w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all", plan.highlighted ? "bg-primary text-white hover:bg-primary/90 shadow-lg" : "border border-border hover:border-primary/50 hover:bg-muted text-foreground")}>
                  {plan.price.monthly === 0 ? "Start Free" : "Try Free 14 Days"} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-2">Power-Up Add-ons</h2>
            <p className="text-muted-foreground text-sm">Enhance any plan with targeted career tools.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {addons.map((a) => (
              <div key={a.name} className="feature-card">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-foreground text-sm">{a.name}</h3>
                  <span className="text-primary font-bold">${a.price}<span className="text-xs text-muted-foreground font-normal">/mo</span></span>
                </div>
                <p className="text-xs text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Full Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 pr-6 text-foreground font-semibold">Feature</th>
                  {PRICING_PLANS.map((p) => (
                    <th key={p.id} className={cn("text-center py-3 px-4 font-semibold", p.highlighted ? "text-primary" : "text-foreground")}>{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Course Access", "5 courses", "Unlimited", "Unlimited"],
                  ["AI Coding Assistant", "❌", "✅", "✅"],
                  ["Coding Lab", "Basic", "Advanced", "Enterprise"],
                  ["Certificates", "❌", "✅", "✅"],
                  ["Career Hub", "❌", "✅", "✅"],
                  ["Team Analytics", "❌", "❌", "✅"],
                  ["Custom Learning Paths", "❌", "❌", "✅"],
                  ["API Access", "❌", "❌", "✅"],
                  ["Support", "Email", "Priority", "Dedicated Manager"],
                ].map(([feature, free, pro, ent]) => (
                  <tr key={feature} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="py-3 pr-6 text-muted-foreground">{feature}</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">{free}</td>
                    <td className="text-center py-3 px-4 text-primary dark:text-primary/80 font-medium">{pro}</td>
                    <td className="text-center py-3 px-4 text-muted-foreground">{ent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground text-center mb-10">Pricing FAQ</h2>
          <div className="space-y-3">
            {FAQS.slice(0, 5).map((faq, idx) => (
              <div key={idx} className={cn("border rounded-2xl overflow-hidden transition-all", openFaq === idx ? "border-primary/30 bg-primary/5" : "border-border bg-card")}>
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="flex items-center justify-between w-full text-left px-5 py-4">
                  <span className="text-sm font-medium text-foreground">{faq.question}</span>
                  <HelpCircle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
