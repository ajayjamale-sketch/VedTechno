import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Briefcase, ArrowRight, Code2, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { validateEmail, validatePassword } from "@/lib/utils";
import type { User as UserType } from "@/types";

const roles: { value: UserType["role"]; label: string; desc: string; icon: string }[] = [
  { value: "student", label: "Student", desc: "Learning tech fundamentals", icon: "🎓" },
  { value: "developer", label: "Developer", desc: "Advancing skills & career", icon: "💻" },
  { value: "trainer", label: "Trainer", desc: "Teaching & creating courses", icon: "👨‍🏫" },
  { value: "corporate", label: "Enterprise", desc: "Training teams at scale", icon: "🏢" },
];

export default function Register() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" as UserType["role"] });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.length < 2) e.name = "Name must be at least 2 characters";
    if (!validateEmail(form.email)) e.email = "Enter a valid email address";
    const passVal = validatePassword(form.password);
    if (!passVal.isValid) e.password = passVal.errors[0];
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async () => {
    const success = await register(form);
    if (success) {
      toast.success("Welcome to VedTechno! Let's start learning.");
      navigate("/dashboard");
    } else {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, rgba(16,185,129,0.3) 0%, transparent 50%)" }} />
        <div className="relative flex flex-col justify-center px-16 text-white">
          <Link to="/" className="flex items-center gap-2 mb-16">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">VedTechno</span>
          </Link>
          <h1 className="text-4xl font-bold mb-5 leading-tight">
            Start Your Tech<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Career Journey Today</span>
          </h1>
          <p className="text-white/60 mb-10 text-lg">Join 250,000+ learners who've transformed their careers.</p>
          <div className="space-y-4">
            {[
              { stat: "87%", label: "of learners land jobs within 6 months" },
              { stat: "$28K", label: "average salary increase after certification" },
              { stat: "14 days", label: "free trial, no credit card needed" },
            ].map((s) => (
              <div key={s.stat} className="flex items-center gap-4 bg-white/5 rounded-xl p-4 border border-white/10">
                <span className="text-2xl font-bold text-blue-400">{s.stat}</span>
                <span className="text-white/60 text-sm">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground">VedTechno</span>
          </Link>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > s ? "bg-emerald-500 text-white" : step === s ? "bg-blue-600 text-white" : "bg-muted text-muted-foreground"
                }`}>
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                <span className={`text-xs font-medium ${step === s ? "text-foreground" : "text-muted-foreground"}`}>
                  {s === 1 ? "Account Details" : "Choose Role"}
                </span>
                {s < 2 && <div className="w-8 h-0.5 bg-muted ml-2" />}
              </div>
            ))}
          </div>

          {step === 1 ? (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-1">Create your account</h2>
              <p className="text-muted-foreground text-sm mb-8">
                Already have one?{" "}
                <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Sign in</Link>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input className={`input-field pl-10 ${errors.name ? "border-red-500" : ""}`} placeholder="Alex Johnson" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="email" className={`input-field pl-10 ${errors.email ? "border-red-500" : ""}`} placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type={showPassword ? "text" : "password"} className={`input-field pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`} placeholder="Min. 8 chars, 1 uppercase, 1 number" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>
                <button onClick={handleNext} className="btn-primary w-full py-3.5">
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </button>
                <p className="text-xs text-center text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <Link to="/terms" className="underline">Terms</Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="underline">Privacy Policy</Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-1">What describes you best?</h2>
              <p className="text-muted-foreground text-sm mb-8">We'll personalize your experience based on your role.</p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    onClick={() => setForm({ ...form, role: role.value })}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      form.role === role.value
                        ? "border-blue-600 bg-blue-600/10 shadow-md"
                        : "border-border bg-card hover:border-blue-600/30"
                    }`}
                  >
                    <div className="text-2xl mb-2">{role.icon}</div>
                    <p className="text-sm font-semibold text-foreground">{role.label}</p>
                    <p className="text-xs text-muted-foreground">{role.desc}</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                <button onClick={handleSubmit} disabled={isLoading} className="btn-primary flex-1">
                  {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating...</> : <>Create Account</>}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
