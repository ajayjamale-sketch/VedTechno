import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Book, Terminal, Code2, PlayCircle, LifeBuoy, ArrowRight, ChevronRight, FileText, X, Key } from "lucide-react";
import { toast } from "sonner";

const quickStarts = [
  { icon: Terminal, title: "Platform Overview", desc: "Get familiar with the dashboard, coding lab, and community features." },
  { icon: Code2, title: "Your First Course", desc: "How to enroll, navigate lessons, and submit coding challenges." },
  { icon: PlayCircle, title: "AI Assistant Guide", desc: "Tips and tricks for getting the most out of the AI coding companion." }
];

const categories = [
  {
    title: "Core Concepts",
    links: ["Workspace Setup", "Version Control", "Running Tests", "Submitting Projects", "Earning Certificates"]
  },
  {
    title: "API Reference",
    links: ["Authentication", "User Profiles", "Course Data", "Progress Tracking", "Webhooks"]
  },
  {
    title: "Billing & Accounts",
    links: ["Managing Subscription", "Invoice History", "Team Management", "SSO Setup"]
  }
];

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState("");
  const [docModal, setDocModal] = useState<{ open: boolean; title: string }>({ open: false, title: "" });
  const [apiKeyModal, setApiKeyModal] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    toast.info(`Searching documentation for "${searchQuery}"...`);
  };

  return (
    <main className="page-enter pt-20">
      {/* 1. Hero / Search */}
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
          <span className="badge-primary mb-4 inline-block ">Documentation</span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How can we help you
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">build today?</span>
          </h1>
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              className="w-full pl-12 pr-32 py-4 bg-muted/60 dark:bg-card border border-border dark:border-input rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-card focus:border-primary focus:ring-1 focus:ring-primary transition-all text-lg shadow-sm"
              placeholder="Search guides, API docs, and tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors">
              Search
            </button>
          </form>

        </div>
      </section>

      {/* 2. Quick Starts */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-foreground mb-8">Quick Starts</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickStarts.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group p-6 bg-card border border-border rounded-2xl hover:border-primary/30 transition-all hover:shadow-lg cursor-pointer" onClick={() => setDocModal({ open: true, title })}>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                <div className="mt-4 flex items-center text-sm font-medium text-primary dark:text-primary/80">
                  Read Guide <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Core Categories */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Browse by Topic</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((cat) => (
              <div key={cat.title} className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                  <Book className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-foreground text-lg">{cat.title}</h3>
                </div>
                <ul className="space-y-3">
                  {cat.links.map(link => (
                    <li key={link}>
                      <button onClick={() => setDocModal({ open: true, title: link })} className="flex items-center justify-between w-full text-left group">
                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{link}</span>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. API & Developer Tools */}
      <section className="section-padding bg-background border-y border-border">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
            <div className="grid lg:grid-cols-2">
              <div className="p-10 lg:p-12 flex flex-col justify-center">
                <div className="inline-flex px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full mb-6 w-fit">Developer API</div>
                <h2 className="text-3xl font-bold text-white mb-4">Build on VedTechno</h2>
                <p className="text-slate-300 mb-8 leading-relaxed">
                  Integrate your internal HR systems, build custom learning dashboards, or automate reporting with our GraphQL and REST APIs.
                </p>
                <div className="flex gap-4">
                  <button onClick={() => setDocModal({ open: true, title: "API Reference" })} className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl transition-colors">
                    View API Reference
                  </button>
                  <button onClick={() => setApiKeyModal(true)} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors">
                    Generate API Keys
                  </button>
                </div>
              </div>
              <div className="bg-slate-950 p-8 lg:p-12 border-l border-slate-800 flex items-center justify-center">
                <div className="w-full max-w-sm font-mono text-sm">
                  <div className="flex gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-accent/80"></div>
                  </div>
                  <div className="text-emerald-400 mb-2">$ curl -X GET \</div>
                  <div className="text-blue-300 ml-4 mb-2">https://api.vedtechno.com/v1/users/me \</div>
                  <div className="text-slate-400 ml-4 mb-6">-H "Authorization: Bearer YOUR_API_KEY"</div>
                  
                  <div className="text-slate-500 mb-2">{`{`}</div>
                  <div className="text-slate-300 ml-4 mb-1">"id": <span className="text-amber-300">"usr_123"</span>,</div>
                  <div className="text-slate-300 ml-4 mb-1">"name": <span className="text-amber-300">"Alex Dev"</span>,</div>
                  <div className="text-slate-300 ml-4 mb-1">"plan": <span className="text-amber-300">"pro"</span>,</div>
                  <div className="text-slate-300 ml-4">"completed_courses": <span className="text-purple-400">12</span></div>
                  <div className="text-slate-500">{`}`}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Support CTA */}
      <section className="py-20 bg-background text-center">
        <div className="container-custom">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LifeBuoy className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Can't find what you're looking for?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Our support team is available 24/7 to help you with any technical issues, billing questions, or learning path recommendations.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/contact" className="btn-primary">Contact Support</Link>
            <Link to="/faq" className="btn-secondary">View FAQs</Link>
          </div>
        </div>
      </section>

      {/* Doc Viewer Modal */}
      {docModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-4xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2"><Book className="w-5 h-5 text-primary" /> {docModal.title}</h3>
              <button onClick={() => setDocModal({ open: false, title: "" })} className="p-1 hover:bg-muted rounded-lg transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 prose prose-sm sm:prose-base dark:prose-invert max-w-none">
              <h1>{docModal.title}</h1>
              <p className="lead">This is the official documentation for {docModal.title}. Here you will find all the necessary concepts, examples, and best practices to get started.</p>
              <h2>Overview</h2>
              <p>Welcome to the {docModal.title} guide. This document provides a comprehensive overview of the features and capabilities. Follow the steps below to integrate the solution into your workflow seamlessly.</p>
              <h3>Prerequisites</h3>
              <ul>
                <li>Node.js v18 or higher</li>
                <li>An active VedTechno account</li>
                <li>Basic understanding of modern web development</li>
              </ul>
              <h2>Installation</h2>
              <pre><code>npm install @vedtechno/core</code></pre>
              <h2>Usage Example</h2>
              <p>Below is a simple example to get you started quickly:</p>
              <pre><code>{`import { init } from '@vedtechno/core';\n\ninit({\n  apiKey: 'YOUR_API_KEY',\n  environment: 'production'\n});`}</code></pre>
              <p>For more advanced configurations, please refer to our deep dive tutorials and API reference.</p>
            </div>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      {apiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2"><Key className="w-5 h-5 text-primary" /> API Keys</h3>
              <button onClick={() => setApiKeyModal(false)} className="p-1 hover:bg-muted rounded-lg transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-4">Your secret API keys grant full access to your account. Do not share them publicly.</p>
              <div className="p-4 bg-muted rounded-xl flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-medium text-foreground mb-1">Production Key</p>
                  <p className="text-sm text-muted-foreground font-mono blur-sm hover:blur-none transition-all cursor-pointer">sk_prod_8f92j10x...</p>
                </div>
                <button onClick={() => toast.success("Copied to clipboard!")} className="btn-secondary text-xs px-3 py-1.5">Copy</button>
              </div>
              <button onClick={() => { toast.success("New API key generated!"); setApiKeyModal(false); }} className="btn-primary w-full">Generate New Key</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
