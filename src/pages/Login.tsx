import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Code2, Loader2, ChevronRight, Users, BookOpen, Brain, Briefcase, Building2, Rocket, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { validateEmail } from "@/lib/utils";

const demoAccounts = [
  { role: "student", label: "Student", emoji: "🎓", desc: "Learning courses & certifications", color: "from-blue-600 to-blue-700", icon: BookOpen },
  { role: "developer", label: "Developer", emoji: "💻", desc: "Coding challenges & portfolio", color: "from-indigo-600 to-indigo-700", icon: Code2 },
  { role: "trainer", label: "Trainer", emoji: "🎓", desc: "Creating & managing courses", color: "from-emerald-600 to-emerald-700", icon: Brain },
  { role: "recruiter", label: "Recruiter", emoji: "🔍", desc: "Finding certified talent", color: "from-orange-600 to-orange-700", icon: Briefcase },
  { role: "corporate", label: "Corporate", emoji: "🏢", desc: "Enterprise team training", color: "from-violet-600 to-violet-700", icon: Building2 },
  { role: "startup", label: "Startup", emoji: "🚀", desc: "Innovation & incubation", color: "from-pink-600 to-pink-700", icon: Rocket },
  { role: "admin", label: "Admin", emoji: "⚙️", desc: "Platform administration", color: "from-red-600 to-red-700", icon: Shield },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const { login, demoLogin, isLoading } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e: typeof errors = {};
    if (!validateEmail(email)) e.email = "Enter a valid email address";
    if (password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const success = await login(email, password);
    if (success) {
      toast.success("Welcome back!");
      navigate("/dashboard");
    } else {
      toast.error("Invalid credentials. Use any email + 6-char password.");
    }
  };

  const handleDemoLogin = async (role: string) => {
    setDemoLoading(role);
    const success = await demoLogin(role);
    setDemoLoading(null);
    if (success) {
      const label = demoAccounts.find(d => d.role === role)?.label;
      toast.success(`Logged in as ${label}!`);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary relative overflow-hidden flex-col">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, rgba(37,99,235,0.5) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(16,185,129,0.3) 0%, transparent 50%)" }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative flex flex-col h-full p-16">
          <Link to="/" className="flex items-center gap-2 mb-auto">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-600/40">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">VedTechno</span>
          </Link>
          <div className="py-8">
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              Welcome Back to<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Your Learning Journey</span>
            </h1>
            <p className="text-white/60 text-lg mb-8">Continue where you left off. Courses, projects, and community await.</p>
            <div className="space-y-3">
              {[
                { emoji: "🔥", text: "Maintain your learning streak" },
                { emoji: "🤖", text: "AI assistant ready to help you code" },
                { emoji: "🏆", text: "Certifications waiting to be earned" },
                { emoji: "👥", text: "250,000+ learners building alongside you" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-white/70">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-auto pt-8 border-t border-white/10">
            <p className="text-white/30 text-xs">Trusted by engineers at Google, Microsoft, Amazon & 500+ companies</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-start justify-center overflow-y-auto p-6">
        <div className="w-full max-w-md py-8">
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground">VedTechno</span>
          </Link>

          <h2 className="text-2xl font-bold text-foreground mb-1">Sign in to your account</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Create one free</Link>
          </p>

          {/* Demo Accounts Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs font-medium text-muted-foreground px-2 whitespace-nowrap">Try a Demo Account</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <p className="text-xs text-muted-foreground mb-3 text-center">Click any role to instantly access that user's dashboard — no credentials needed</p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map(({ role, label, desc, color, icon: Icon }) => (
                <button
                  key={role}
                  onClick={() => handleDemoLogin(role)}
                  disabled={demoLoading !== null}
                  className="group relative p-3 rounded-xl border border-border bg-card hover:border-blue-600/40 hover:shadow-md transition-all duration-200 text-left disabled:opacity-60 min-h-[64px]"
                >
                  {demoLoading === role ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                      <span className="text-xs text-muted-foreground">Logging in…</span>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground">{label}</p>
                        <p className="text-xs text-muted-foreground leading-tight truncate">{desc}</p>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-background px-3 text-muted-foreground">or sign in with email</span></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" className={`input-field pl-10 ${errors.email ? "border-red-500 focus:ring-red-500" : ""}`} placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Link to="/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type={showPassword ? "text" : "password"} className={`input-field pl-10 pr-10 ${errors.password ? "border-red-500 focus:ring-red-500" : ""}`} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5">
              {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in...</> : <>Sign In <ArrowRight className="w-4 h-4 ml-2" /></>}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-background px-3 text-muted-foreground">or</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/24px-Google_%22G%22_logo.svg.png", darkInvert: false },
              { name: "GitHub", logo: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png", darkInvert: true },
            ].map((p) => (
              <button key={p.name} onClick={() => toast.info(`${p.name} login coming soon`)} className="flex items-center justify-center gap-2 py-3 border border-border rounded-xl hover:bg-muted transition-colors text-sm font-medium text-foreground">
                <img src={p.logo} alt={p.name} className={`w-5 h-5 object-contain${p.darkInvert ? " dark:invert" : ""}`} />
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
