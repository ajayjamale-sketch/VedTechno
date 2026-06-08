import { Link } from "react-router-dom";
import { BarChart2, Code2, Award, BookOpen, TrendingUp, ArrowRight, Trophy, Flame, Star } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const progressData = [
  { month: "Jan", hours: 12 }, { month: "Feb", hours: 18 }, { month: "Mar", hours: 24 },
  { month: "Apr", hours: 31 }, { month: "May", hours: 28 }, { month: "Jun", hours: 42 },
];

const courses = [
  { title: "React Advanced Patterns", progress: 78 },
  { title: "Machine Learning Fundamentals", progress: 45 },
  { title: "AWS Solutions Architect", progress: 62 },
];

export default function DashboardPreview() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section
      className={cn(
        "section-padding relative overflow-hidden transition-colors duration-200",
        isDark ? "bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-800"
      )}
      id="dashboard"
    >
      {isDark && (
        <>
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />
        </>
      )}
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          {/* Left text */}
          <div className="lg:w-96 flex-shrink-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">
              Your command center
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight mb-5 text-gray-900 dark:text-white">
              One dashboard. Every metric that matters.
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8">
              Track daily coding hours, course velocity, certification progress, and career readiness — all updated in real time based on your activity.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: BarChart2, label: "Skill progress tracking", sub: "Per language, per topic" },
                { icon: TrendingUp, label: "Career readiness score", sub: "Benchmarked against job requirements" },
                { icon: Award, label: "Certificate management", sub: "Share directly to LinkedIn" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border",
                      isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200 shadow-sm"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{label}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
            >
              Explore the dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Dashboard mockup */}
          <div className="flex-1 w-full">
            <div
              className={cn(
                "rounded-2xl border overflow-hidden shadow-2xl transition-all duration-200",
                isDark ? "bg-slate-950 border-white/10 shadow-black/40" : "bg-white border-gray-200 shadow-gray-200/50"
              )}
            >
              {/* Top bar */}
              <div
                className={cn(
                  "flex items-center justify-between px-5 py-3.5 border-b",
                  isDark ? "border-white/10" : "border-gray-100 bg-gray-50/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Code2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-medium text-xs text-gray-600 dark:text-white/70">
                    Alex Johnson — Student Dashboard
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-gray-400 dark:text-white/30 text-xs">Live</span>
                </div>
              </div>

              <div className="p-5 grid lg:grid-cols-3 gap-4">
                {/* Main panel */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Stats row */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: "Courses", value: "7", icon: BookOpen, color: "text-blue-600 dark:text-blue-400" },
                      { label: "Hours", value: "156", icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400" },
                      { label: "Certs", value: "3", icon: Award, color: "text-amber-600 dark:text-amber-400" },
                      { label: "Streak", value: "24d", icon: BarChart2, color: "text-purple-600 dark:text-purple-400" },
                    ].map((s) => {
                      const Icon = s.icon;
                      return (
                        <div
                          key={s.label}
                          className={cn(
                            "border rounded-xl p-3",
                            isDark ? "bg-white/5 border-white/10" : "bg-gray-50/50 border-gray-100"
                          )}
                        >
                          <Icon className={`w-3.5 h-3.5 ${s.color} mb-2`} />
                          <p className="text-lg font-bold leading-none text-gray-900 dark:text-white">{s.value}</p>
                          <p className="text-xs mt-1 text-gray-500 dark:text-white/40">{s.label}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Chart */}
                  <div
                    className={cn(
                      "border rounded-xl p-4",
                      isDark ? "bg-white/5 border-white/10" : "bg-gray-50/50 border-gray-100"
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-700 dark:text-white/70 text-xs font-medium">
                        Learning hours — 2026
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                        +34% vs last month
                      </span>
                    </div>
                    <div className="h-28">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={progressData}>
                          <defs>
                            <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="month"
                            tick={{ fill: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.4)", fontSize: 10 }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            contentStyle={
                              isDark
                                ? { background: "#1e293b", border: "none", borderRadius: "8px", color: "white", fontSize: "11px" }
                                : { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#0f172a", fontSize: "11px" }
                            }
                          />
                          <Area type="monotone" dataKey="hours" stroke="#2563EB" strokeWidth={2} fill="url(#blueGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Courses */}
                  <div
                    className={cn(
                      "border rounded-xl p-4",
                      isDark ? "bg-white/5 border-white/10" : "bg-gray-50/50 border-gray-100"
                    )}
                  >
                    <p className="text-gray-700 dark:text-white/70 text-xs font-medium mb-3">Active courses</p>
                    <div className="space-y-3">
                      {courses.map((c) => (
                        <div key={c.title}>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-xs truncate flex-1 mr-3 text-gray-700 dark:text-white/60">
                              {c.title}
                            </span>
                            <span className="text-xs font-medium flex-shrink-0 text-gray-900 dark:text-white">
                              {c.progress}%
                            </span>
                          </div>
                          <div className={cn("h-1 rounded-full", isDark ? "bg-white/10" : "bg-gray-100")}>
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${c.progress}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Side panel */}
                <div className="space-y-4">
                  <div
                    className={cn(
                      "border rounded-xl p-4",
                      isDark
                        ? "bg-gradient-to-br from-blue-600/20 to-emerald-500/10 border-blue-500/20"
                        : "bg-gradient-to-br from-blue-50 to-emerald-50 border-blue-100"
                    )}
                  >
                    <p className="text-gray-500 dark:text-white/50 text-xs mb-1">Career readiness</p>
                    <p className="text-4xl font-bold leading-none text-gray-900 dark:text-white">
                      82<span className="text-gray-400 dark:text-white/30 text-lg">/100</span>
                    </p>
                    <div className={cn("h-1.5 rounded-full mt-3", isDark ? "bg-white/10" : "bg-gray-100")}>
                      <div className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full" style={{ width: "82%" }} />
                    </div>
                    <p className="text-emerald-600 dark:text-emerald-400 text-xs mt-2">↑ +8 pts this month</p>
                  </div>

                  <div
                    className={cn(
                      "border rounded-xl p-4",
                      isDark ? "bg-white/5 border-white/10" : "bg-gray-50/50 border-gray-100"
                    )}
                  >
                    <p className="text-gray-500 dark:text-white/50 text-xs font-medium mb-3">Recent achievements</p>
                    <div className="space-y-2.5">
                      {[
                        { icon: Trophy, title: "React Master cert", when: "2 days ago", color: "text-amber-500" },
                        { icon: Flame, title: "24-day streak", when: "Today", color: "text-orange-500" },
                        { icon: Star, title: "Top 5% learner", when: "1 week ago", color: "text-yellow-500" },
                      ].map((a) => {
                        const Icon = a.icon;
                        return (
                          <div key={a.title} className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${a.color}`} />
                            <div>
                              <p className="text-xs text-gray-800 dark:text-white/80">{a.title}</p>
                              <p className="text-xs text-gray-500 dark:text-white/30">{a.when}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div
                    className={cn(
                      "border rounded-xl p-4",
                      isDark ? "bg-white/5 border-white/10" : "bg-gray-50/50 border-gray-100"
                    )}
                  >
                    <p className="text-gray-500 dark:text-white/50 text-xs mb-2">AI recommendation</p>
                    <p className="text-xs leading-relaxed text-gray-700 dark:text-white/70">
                      Based on your progress, start{" "}
                      <span className="text-blue-600 dark:text-blue-400 font-medium">TypeScript Advanced Patterns</span>{" "}
                      to strengthen your React skills.
                    </p>
                    <button className="mt-2.5 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                      View roadmap <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}