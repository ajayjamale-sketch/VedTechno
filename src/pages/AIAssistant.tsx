import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Brain, Sparkles, MessageSquare, Terminal, ChevronRight, Play, ArrowRight,
  ShieldAlert, FileText, Cpu, CheckCircle, RefreshCw, Zap
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const SAMPLE_PROMPTS = [
  {
    label: "Debug React Effect",
    prompt: "Why is this useEffect running on every render?",
    response: `// The issue is a missing dependency array!\n// Update your code like this:\n\nuseEffect(() => {\n  fetchData();\n}, []); // <-- Add empty array to run only on mount`
  },
  {
    label: "Refactor to Async/Await",
    prompt: "Rewrite this .then callback structure using async/await.",
    response: `// Refactored async function:\nasync function getUserData(userId) {\n  try {\n    const response = await fetch(\`/api/users/\${userId}\`);\n    return await response.json();\n  } catch (error) {\n    console.error("Failed fetching user", error);\n  }\n}`
  },
  {
    label: "Optimize SQL Query",
    prompt: "Optimize a query that retrieves recent users and posts count.",
    response: `-- Optimization: Added indexes and INNER JOIN\nSELECT u.id, u.username, COUNT(p.id) AS post_count\nFROM users u\nINNER JOIN posts p ON u.id = p.author_id\nWHERE u.status = 'active'\nGROUP BY u.id;\n-- Tip: Add index on posts(author_id)`
  }
];

export default function AIAssistant() {
  const { user } = useAuth();
  const [selectedPrompt, setSelectedPrompt] = useState(SAMPLE_PROMPTS[0]);
  const [responseCode, setResponseCode] = useState(selectedPrompt.response);
  const [isGenerating, setIsGenerating] = useState(false);
  const [inputText, setInputText] = useState(selectedPrompt.prompt);

  const handleSelectPrompt = (prompt: typeof SAMPLE_PROMPTS[0]) => {
    setSelectedPrompt(prompt);
    setInputText(prompt.prompt);
    setResponseCode("// Select a prompt and click Generate...");
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setResponseCode("// Thinking...");
    setTimeout(() => {
      setIsGenerating(false);
      setResponseCode(selectedPrompt.response);
      toast.success("AI suggestion generated!");
    }, 1200);
  };

  return (
    <main className="page-enter pt-20">
      {/* SECTION 1: Hero Section */}
      <section className="relative py-20 bg-background overflow-hidden border-b border-border">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            opacity: 0.3,
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          }}
        />
        <div className="relative container-custom text-center">
          <span className="badge-primary mb-4 inline-block">AI Coding Assistant</span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Code Smarter and Debug Faster <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              With Your AI Pair Programmer
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            An intelligent assistant integrated directly into your learning flow. Get instant bug explanations, automated documentation, refactoring tips, and unit test generators.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                document.getElementById("interactive-ai")?.scrollIntoView({ behavior: "smooth" });
                toast.info("Scrolled to Interactive AI Prompt Simulator!");
              }}
              className="btn-primary text-base px-8 py-3"
            >
              Try AI Copilot Demo <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: AI Metrics */}
      <section className="py-12 bg-muted/20 border-b border-border">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Bug fixing speedup", value: "10x Faster", icon: Zap },
              { label: "AI Accuracy Rate", value: "99.8%", icon: CheckCircle },
              { label: "AI Suggestions Daily", value: "2M+", icon: Brain },
              { label: "Time Saved/Week", value: "8+ Hours", icon: Cpu },
            ].map((s) => (
              <div key={s.label} className="text-center p-4 bg-card rounded-xl border border-border/50">
                <div className="flex justify-center text-primary mb-3"><s.icon className="w-7 h-7" /></div>
                <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Live Interactive AI Simulator - FIXED FOR LIGHT/DARK MODE */}
      <section id="interactive-ai" className="py-20 bg-background border-b border-border">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Interactive AI Prompt Simulator</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Select one of our preset helper tasks below and click "Ask AI Assistant" to see the output.
            </p>
          </div>

          <div className="w-full max-w-4xl mx-auto bg-card border border-border rounded-2xl overflow-hidden shadow-lg flex flex-col h-[500px]">
            {/* Toolbar */}
            <div className="bg-muted/50 dark:bg-slate-900 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-muted-foreground">assistant / copilot-agent-v2</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex bg-background dark:bg-slate-950 rounded-lg p-1 border border-border">
                  {SAMPLE_PROMPTS.map((pr) => (
                    <button
                      key={pr.label}
                      onClick={() => handleSelectPrompt(pr)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                        selectedPrompt.label === pr.label
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {pr.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-55"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="w-3.5 h-3.5 fill-current" />
                      Ask AI Assistant
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Editor Workspace */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* User Prompt / Input panel */}
              <div className="flex-1 border-r border-border flex flex-col bg-background">
                <div className="bg-muted/30 px-4 py-2 border-b border-border text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Developer Input
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 w-full bg-background text-foreground p-5 font-mono text-sm leading-relaxed focus:outline-none resize-none"
                  spellCheck="false"
                  placeholder="Type your question for the AI Assistant here..."
                />
              </div>

              {/* AI Code Response Panel */}
              <div className="w-full md:w-96 bg-muted/20 dark:bg-slate-900/50 flex flex-col">
                <div className="bg-muted/30 px-4 py-2 border-b border-border text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  AI Solution Code
                </div>
                <pre className="flex-1 p-5 font-mono text-xs text-foreground dark:text-blue-300 leading-relaxed overflow-y-auto whitespace-pre-wrap">
                  {responseCode}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: AI Capabilities Grid */}
      <section className="py-20 bg-muted/10 border-b border-border">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Four Smart Coding Capabilities</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Trained on trillions of lines of code to assist your development learning curve.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Bug Detector", desc: "Instantly spot compiler errors, memory leaks, and scope bugs with custom fixes.", icon: ShieldAlert },
              { title: "Boilerplate Gen", desc: "Build functions, controllers, schema models, and tests instantly from comments.", icon: Cpu },
              { title: "Docs Generator", desc: "Create complete API documentations and markdown guides with one click.", icon: FileText },
              { title: "Complexity Advisor", desc: "Evaluate Big-O complexity, runtime overhead, and refactoring guidelines.", icon: Brain },
            ].map((cap, i) => (
              <div key={i} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:border-primary/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                  <cap.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-2">{cap.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Ready for the Next-Gen AI Coding?</h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">
            Get personalized career mentorship, project-level suggestions, and codebase explanations with our Pro account.
          </p>
          <div className="flex justify-center gap-4">
            <Link to={user ? "/dashboard" : "/register"} className="px-8 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-blue-50 transition-colors">
              Unlock AI Copilot
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}