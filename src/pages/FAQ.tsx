import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { FAQS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const additionalFaqs = [
  {
    question: "How long do I have access to courses after enrolling?",
    answer: "All course enrollments include lifetime access. Once you enroll, you can revisit the content anytime, even after completing the course. This includes all future updates to the course material.",
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer: "Yes! We offer a 30-day money-back guarantee on all paid plans, no questions asked. Simply contact our support team within 30 days of your purchase and we'll process your refund.",
  },
  {
    question: "What happens to my certificates after I downgrade or cancel?",
    answer: "Your earned certificates are yours permanently. Even if you cancel your subscription, all previously earned certificates remain valid and downloadable from your account forever.",
  },
  {
    question: "Do you offer student discounts?",
    answer: "Yes! Students with a valid .edu email address receive 50% off the Pro plan. Additionally, we offer special pricing for learners from developing countries through our global access program.",
  },
  {
    question: "How does the hackathon and coding challenge system work?",
    answer: "We host weekly coding challenges (solo), monthly hackathons (team-based), and quarterly competitions. Registration is free for all plan levels. Winners receive cash prizes, certificates, and visibility to our 500+ hiring partners.",
  },
];

const allFaqs = [...FAQS, ...additionalFaqs];
const categories = ["All", "Platform", "Learning", "Pricing & Billing", "Career", "Technical"];

export default function FAQ() {
  const [search, setSearch] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = allFaqs.filter((f) =>
    f.question.toLowerCase().includes(search.toLowerCase()) ||
    f.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="page-enter pt-20">
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
          <span className="badge-primary mb-4 inline-block ">Help Center</span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Frequently Asked
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Questions</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            Everything you need to know about VedTechno.
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-blue-500"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Quick Help Cards */}
      <section className="py-10 bg-background border-b border-border">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { emoji: "🚀", title: "Getting Started", link: "/register" },
              { emoji: "💳", title: "Billing & Plans", link: "/pricing" },
              { emoji: "🎓", title: "Courses & Learning", link: "/features" },
              { emoji: "📩", title: "Contact Support", link: "/contact" },
            ].map((card) => (
              <Link key={card.title} to={card.link} className="feature-card text-center hover:border-primary/40 group">
                <span className="text-2xl mb-2 block">{card.emoji}</span>
                <p className="text-sm font-medium text-foreground group-hover:text-primary dark:group-hover:text-primary/80 transition-colors">{card.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="section-padding bg-background">
        <div className="container-custom max-w-4xl">
          <div className="flex gap-2 flex-wrap mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat ? "bg-primary text-white" : "border border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="font-medium text-foreground">No results found</p>
              <p className="text-muted-foreground text-sm mt-1">Try different search terms</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((faq, idx) => (
                <div
                  key={idx}
                  className={cn("border rounded-2xl overflow-hidden transition-all", openIdx === idx ? "border-primary/30 bg-primary/5" : "border-border bg-card hover:border-primary/20")}
                >
                  <button
                    onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                    className="flex items-center justify-between w-full text-left px-5 py-4 gap-4 min-h-[56px]"
                  >
                    <span className="text-sm font-medium text-foreground">{faq.question}</span>
                    <ChevronDown className={cn("w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200", openIdx === idx && "rotate-180 text-primary dark:text-primary/80")} />
                  </button>
                  {openIdx === idx && (
                    <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.answer}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 text-center p-8 bg-gradient-to-r from-blue-600/5 to-emerald-500/5 rounded-2xl border border-primary/10">
            <p className="font-semibold text-foreground mb-2">Still have questions?</p>
            <p className="text-muted-foreground text-sm mb-5">Our support team is available 24/7 to help you.</p>
            <Link to="/contact" className="btn-primary text-sm">Contact Support</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
