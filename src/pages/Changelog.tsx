import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, GitCommit, Search, Star, ArrowRight, X, Map, GitPullRequest, Bell, Code2, Rocket } from "lucide-react";
import { toast } from "sonner";
import { validateEmail } from "@/lib/utils";

const releases = [
  {
    version: "v2.4.0",
    date: "June 2, 2026",
    title: "AI Assistant V2 & Dark Mode Improvements",
    badge: "Latest",
    changes: [
      "Completely rewritten AI engine with 40% faster response times.",
      "Added context-awareness for multi-file projects in the coding lab.",
      "Refined dark mode colors for better contrast in bright environments.",
      "Fixed an issue where certificates wouldn't render on iOS Safari."
    ]
  },
  {
    version: "v2.3.5",
    date: "May 15, 2026",
    title: "New Cloud Engineering Path",
    changes: [
      "Launched the full 6-month Cloud Engineering learning path.",
      "Added 12 new interactive AWS sandboxes.",
      "Improved performance on the student dashboard."
    ]
  },
  {
    version: "v2.3.0",
    date: "April 28, 2026",
    title: "Community Forums Redesign",
    changes: [
      "Revamped the community forums with nested replies and rich text.",
      "Added reputation points for answering questions.",
      "Integrated job board directly into the career hub."
    ]
  }
];

export default function Changelog() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roadmapModal, setRoadmapModal] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) { toast.error("Please enter a valid email"); return; }
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    setIsSubmitting(false);
    toast.success("Subscribed to release notes!");
    setEmail("");
  };

  return (
    <main className="page-enter pt-20">
      {/* 1. Hero */}
      <section className="py-16 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-80" />
        <div className="relative container-custom text-center">
          <span className="badge-primary mb-4 inline-block !bg-primary/20 !text-blue-300 !border-blue-500/30">Changelog</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What's New in
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">VedTechno</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto">
            New updates, improvements, and fixes to help you learn better.
          </p>
        </div>
      </section>

      {/* 2. Highlight Section */}
      <section className="py-12 bg-background border-b border-border">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-primary/20 rounded-3xl p-8 lg:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-4">
                <Star className="w-3.5 h-3.5" /> Major Update
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">AI Assistant V2 is here!</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our coding assistant just got a massive upgrade. It now understands context across multiple files in your workspace and responds 40% faster. Try it out in the coding lab today.
              </p>
              <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
                Try it in Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex-1 w-full relative">
              <div className="aspect-video bg-card border border-border rounded-xl shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="text-center">
                  <BotIcon className="w-16 h-16 text-primary mx-auto mb-4" />
                  <p className="font-medium text-foreground">AI Engine Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Release History */}
      <section className="section-padding bg-background">
        <div className="container-custom max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" /> Release History
          </h2>
          <div className="space-y-12">
            {releases.map((release) => (
              <div key={release.version} className="relative pl-8 md:pl-0">
                <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px bg-border translate-x-[120px]" />
                <div className="flex flex-col md:flex-row gap-6 md:gap-12 relative">
                  <div className="md:w-[120px] flex-shrink-0 pt-1">
                    <div className="hidden md:block absolute left-[120px] top-2 w-3 h-3 bg-primary rounded-full -translate-x-[5.5px] ring-4 ring-background" />
                    <p className="text-sm font-bold text-foreground">{release.date}</p>
                    <p className="text-xs text-muted-foreground mt-1">{release.version}</p>
                  </div>
                  <div className="flex-1 bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className="text-xl font-bold text-foreground">{release.title}</h3>
                      {release.badge && (
                        <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs font-bold rounded-full">
                          {release.badge}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-3">
                      {release.changes.map((change, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/50 mt-1.5 flex-shrink-0" />
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Roadmap / Feedback */}
      <section className="section-padding bg-muted/30 border-y border-border">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <Rocket className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">What's Next?</h3>
              <p className="text-sm text-muted-foreground mb-6">See what we're working on and what's coming in the next few months.</p>
              <button onClick={() => setRoadmapModal(true)} className="btn-secondary w-full">View Public Roadmap</button>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <Code2 className="w-10 h-10 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-bold text-foreground mb-2">Have Feedback?</h3>
              <p className="text-sm text-muted-foreground mb-6">Found a bug or have a feature request? Let our engineering team know.</p>
              <Link to="/contact" className="btn-secondary w-full">Submit Feedback</Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Subscribe CTA */}
      <section className="py-20 bg-background">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Bell className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Never Miss an Update</h2>
            <p className="text-muted-foreground mb-8">Subscribe to our developer newsletter to get release notes delivered directly to your inbox.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="developer@example.com" 
                className="input-field flex-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit" disabled={isSubmitting} className="btn-primary whitespace-nowrap">
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Roadmap Modal */}
      {roadmapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center p-4 border-b border-border bg-muted/30">
              <h3 className="font-semibold text-foreground flex items-center gap-2"><Map className="w-5 h-5 text-primary" /> Public Roadmap</h3>
              <button onClick={() => setRoadmapModal(false)} className="p-1 hover:bg-muted rounded-lg transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-accent border-b border-border pb-2 uppercase text-xs tracking-wider">Now</h4>
                  <div className="bg-muted/50 p-4 rounded-xl border border-border">
                    <p className="font-medium text-foreground text-sm mb-2"><GitPullRequest className="w-4 h-4 inline mr-1 text-accent" /> AI Code Reviewer V2</p>
                    <p className="text-xs text-muted-foreground">Upgrading the underlying LLM to support multi-file analysis.</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-xl border border-border">
                    <p className="font-medium text-foreground text-sm mb-2"><GitPullRequest className="w-4 h-4 inline mr-1 text-accent" /> Mobile App (iOS)</p>
                    <p className="text-xs text-muted-foreground">Beta testing the official iOS app for offline learning.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-blue-500 border-b border-border pb-2 uppercase text-xs tracking-wider">Next</h4>
                  <div className="bg-muted/50 p-4 rounded-xl border border-border">
                    <p className="font-medium text-foreground text-sm mb-2"><GitPullRequest className="w-4 h-4 inline mr-1 text-blue-500" /> Corporate Dashboard Redesign</p>
                    <p className="text-xs text-muted-foreground">Adding more analytics and CSV exports.</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-purple-500 border-b border-border pb-2 uppercase text-xs tracking-wider">Later</h4>
                  <div className="bg-muted/50 p-4 rounded-xl border border-border opacity-60">
                    <p className="font-medium text-foreground text-sm mb-2">Web3 & Blockchain Courses</p>
                    <p className="text-xs text-muted-foreground">Expanding the curriculum to include Solidity.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function BotIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}
