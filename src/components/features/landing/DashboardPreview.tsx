import { Link } from "react-router-dom";
import { BarChart2, Code2, Award, BookOpen, TrendingUp, ArrowRight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";

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
  return (
    <section className="section-padding bg-muted/30" id="dashboard">
      <div className="container-custom">

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">

          {/* Left text — asymmetric */}
          <div className="lg:w-96 flex-shrink-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Your command center</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-5">
              One dashboard. Every metric that matters.
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              Track daily coding hours, course velocity, certification progress, and career readiness — all updated in real time based on your activity.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: BarChart2, label: "Skill progress tracking", sub: "Per language, per topic" },
                { icon: TrendingUp, label: "Career readiness score", sub: "Benchmarked against job requirements" },
                { icon: Award, label: "Certificate management", sub: "Share directly to LinkedIn" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center flex-shrink-0">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
              Explore the dashboard
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Dashboard mockup */}
          <div className="flex-1 w-full">
            <div className="bg-secondary rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/20">

              {/* Top bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Code2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-white/70 font-medium text-xs">Alex Johnson — Student Dashboard</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white/30 text-xs">Live</span>
                </div>
              </div>

              <div className="p-5 grid lg:grid-cols-3 gap-4">

                {/* Main panel */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Stats row */}
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: "Courses", value: "7", icon: BookOpen, color: "text-blue-400" },
                      { label: "Hours", value: "156", icon: TrendingUp, color: "text-emerald-400" },
                      { label: "Certs", value: "3", icon: Award, color: "text-yellow-400" },
                      { label: "Streak", value: "24d", icon: BarChart2, color: "text-purple-400" },
                    ].map((s) => {
                      const Icon = s.icon;
                      return (
                        <div key={s.label} className="bg-white/5 border border-white/8 rounded-xl p-3">
                          <Icon className={`w-3.5 h-3.5 ${s.color} mb-2`} />
                          <p className="text-white text-lg font-bold leading-none">{s.value}</p>
                          <p className="text-white/40 text-xs mt-1">{s.label}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Chart */}
                  <div className="bg-white/5 border border-white/8 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white/70 text-xs font-medium">Learning hours — 2026</span>
                      <span className="text-emerald-400 text-xs font-medium">+34% vs last month</span>
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
                          <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ background: "#1e3a8a", border: "none", borderRadius: "8px", color: "white", fontSize: "11px" }} />
                          <Area type="monotone" dataKey="hours" stroke="#2563EB" strokeWidth={2} fill="url(#blueGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Courses */}
                  <div className="bg-white/5 border border-white/8 rounded-xl p-4">
                    <p className="text-white/70 text-xs font-medium mb-3">Active courses</p>
                    <div className="space-y-3">
                      {courses.map((c) => (
                        <div key={c.title}>
                          <div className="flex justify-between mb-1.5">
                            <span className="text-white/60 text-xs truncate flex-1 mr-3">{c.title}</span>
                            <span className="text-white text-xs font-medium flex-shrink-0">{c.progress}%</span>
                          </div>
                          <div className="h-1 bg-white/10 rounded-full">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${c.progress}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Side panel */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-600/20 to-emerald-500/10 border border-blue-500/20 rounded-xl p-4">
                    <p className="text-white/50 text-xs mb-1">Career readiness</p>
                    <p className="text-4xl font-bold text-white leading-none">82<span className="text-lg text-white/30">/100</span></p>
                    <div className="h-1.5 bg-white/10 rounded-full mt-3">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full" style={{ width: "82%" }} />
                    </div>
                    <p className="text-emerald-400 text-xs mt-2">↑ +8 pts this month</p>
                  </div>

                  <div className="bg-white/5 border border-white/8 rounded-xl p-4">
                    <p className="text-white/50 text-xs font-medium mb-3">Recent achievements</p>
                    <div className="space-y-2.5">
                      {[
                        { icon: "🏆", title: "React Master cert", when: "2 days ago" },
                        { icon: "🔥", title: "24-day streak", when: "Today" },
                        { icon: "⭐", title: "Top 5% learner", when: "1 week ago" },
                      ].map((a) => (
                        <div key={a.title} className="flex items-center gap-2.5">
                          <span className="text-base">{a.icon}</span>
                          <div>
                            <p className="text-white/80 text-xs">{a.title}</p>
                            <p className="text-white/30 text-xs">{a.when}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/8 rounded-xl p-4">
                    <p className="text-white/50 text-xs mb-2">AI recommendation</p>
                    <p className="text-white/70 text-xs leading-relaxed">
                      Based on your progress, start{" "}
                      <span className="text-blue-400 font-medium">TypeScript Advanced Patterns</span>{" "}
                      to strengthen your React skills.
                    </p>
                    <button className="mt-2.5 text-xs text-blue-400 flex items-center gap-1 hover:text-blue-300 transition-colors">
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
