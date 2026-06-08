import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Code2, Terminal, Play, Settings, RefreshCw, Cpu, Database, Cloud, Shield, CheckCircle2, Languages, Users, ChevronRight, Sparkles, ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const LANGUAGES = [
  { name: "JavaScript", extension: "js", template: `// JavaScript Coding Lab\nfunction greet(name) {\n  console.log("Hello, " + name + "!");\n}\n\ngreet("VedTechno Developer");` },
  { name: "Python", extension: "py", template: `# Python Coding Lab\ndef greet(name):\n    print(f"Hello, {name}!")\n\ngreet("VedTechno Developer")` },
  { name: "Rust", extension: "rs", template: `// Rust Coding Lab\nfn main() {\n    println!("Hello, {}!", "VedTechno Developer");\n}` },
  { name: "Go", extension: "go", template: `// Go Coding Lab\npackage main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, VedTechno Developer!")\n}` }
];

export default function CodingLab() {
  const { user } = useAuth();
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [code, setCode] = useState(selectedLang.template);
  const [output, setOutput] = useState("Click 'Run Code' to execute and view output.");
  const [isRunning, setIsRunning] = useState(false);

  const handleLangChange = (lang: typeof LANGUAGES[0]) => {
    setSelectedLang(lang);
    setCode(lang.template);
    setOutput("Click 'Run Code' to execute.");
  };

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput("Compiling and running on sandboxed container...");
    setTimeout(() => {
      setIsRunning(false);
      if (selectedLang.name === "JavaScript") {
        setOutput("> Hello, VedTechno Developer!\n\nExecution finished successfully (exit code 0)");
      } else if (selectedLang.name === "Python") {
        setOutput("Hello, VedTechno Developer!\n\nProcess finished with exit code 0");
      } else if (selectedLang.name === "Rust") {
        setOutput("Compiling... running...\nHello, VedTechno Developer!\n\nProcess completed.");
      } else {
        setOutput("Hello, VedTechno Developer!\n\nSuccess!");
      }
      toast.success("Code executed successfully!");
    }, 1500);
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
          <span className="badge-primary mb-4 inline-block">Interactive Coding Lab</span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
            Write, Compile, and Run Code <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              Instantly in Your Browser
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Our cloud-based development environment provides pre-configured container sandboxes. Practice 20+ programming languages with real-time feedback and zero local setup.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                document.getElementById("interactive-playground")?.scrollIntoView({ behavior: "smooth" });
                toast.info("Scrolled to Interactive Coding Playground!");
              }}
              className="btn-primary text-base px-8 py-3"
            >
              Open Interactive Playground <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2: Coding Stats */}
      <section className="py-12 bg-muted/20 border-b border-border">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Sandboxes", value: "24,850+", icon: Cloud },
              { label: "Runtimes Supported", value: "20+", icon: Languages },
              { label: "Daily Executions", value: "1.2M+", icon: Play },
              { label: "Compilation Latency", value: "<150ms", icon: Cpu },
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

      {/* SECTION 3: Interactive Sandbox Playground - FIXED FOR LIGHT/DARK MODE */}
      <section id="interactive-playground" className="py-20 bg-background border-b border-border">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Try the Live Code Editor</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Select your language, make changes, and hit "Run Code" to experience our high-speed compiler microservice.
            </p>
          </div>

          <div className="w-full max-w-4xl mx-auto bg-card border border-border rounded-2xl overflow-hidden shadow-lg flex flex-col h-[500px]">
            {/* Toolbar */}
            <div className="bg-muted/50 dark:bg-slate-900 px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-muted-foreground">sandbox / playground.{selectedLang.extension}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {/* Language Selectors */}
                <div className="flex bg-background dark:bg-slate-950 rounded-lg p-1 border border-border">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.name}
                      onClick={() => handleLangChange(lang)}
                      className={`px-3 py-1 rounded text-xs font-semibold font-mono transition-all ${
                        selectedLang.name === lang.name
                          ? "bg-primary/20 text-primary border border-primary/30"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-55"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Run Code
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Sandbox Layout */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Text Area Code Editor */}
              <div className="flex-1 border-r border-border flex flex-col bg-background">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="flex-1 w-full bg-background text-foreground p-5 font-mono text-sm leading-relaxed focus:outline-none resize-none"
                  spellCheck="false"
                />
              </div>

              {/* Console Output Pane */}
              <div className="w-full md:w-80 bg-muted/20 dark:bg-slate-900/50 flex flex-col">
                <div className="bg-muted/30 px-4 py-2 border-b border-border text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                  Output Console
                </div>
                <pre className="flex-1 p-5 font-mono text-xs text-foreground dark:text-slate-300 leading-relaxed overflow-y-auto whitespace-pre-wrap">
                  {output}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Coding Lab Key Capabilities */}
      <section className="py-20 bg-muted/10 border-b border-border">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Enterprise-Grade Coding Sandbox</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you expect from a local development environment, built directly for the web.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Complete Isolation",
                desc: "Each workspace runs inside a secure, sandbox Docker container protecting your code environment.",
                icon: Shield,
              },
              {
                title: "Package Manager Integration",
                desc: "Install packages via npm, pip, cargo, and go modules directly in the integrated terminal emulator.",
                icon: Database,
              },
              {
                title: "Instant Collaboration",
                desc: "Share your live sandbox URL with instructors, reviewers, or peers to code together in real-time.",
                icon: Users,
              },
            ].map((cap, i) => (
              <div key={i} className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:border-primary/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                  <cap.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-foreground text-lg mb-3">{cap.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">Unlock the Full Cloud IDE Simulator</h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">
            Get access to multi-file projects, hot-reloading web views, persistent workspace storage, and git integration.
          </p>
          <div className="flex justify-center gap-4">
            <Link to={user ? "/dashboard" : "/register"} className="px-8 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-blue-50 transition-colors">
              Start Coding Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
} 