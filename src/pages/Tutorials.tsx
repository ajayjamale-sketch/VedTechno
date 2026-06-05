import { useState } from "react";
import { Link } from "react-router-dom";
import { Play, Clock, Star, BookOpen, Search, ArrowRight, Video, FileText, CheckCircle2, X, Code2, Database, Layout, Smartphone, PlayCircle } from "lucide-react";
import { toast } from "sonner";

const categories = [
  { name: "Frontend", icon: Layout, count: 45, color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "Backend", icon: Database, count: 38, color: "text-accent", bg: "bg-accent/10" },
  { name: "Full Stack", icon: Code2, count: 24, color: "text-purple-500", bg: "bg-purple-500/10" },
  { name: "Mobile", icon: Smartphone, count: 18, color: "text-pink-500", bg: "bg-pink-500/10" }
];

const tutorials = [
  { id: 1, title: "Build a TikTok Clone with React Native", duration: "45 min", level: "Intermediate", category: "Mobile", views: "12K", thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=250&fit=crop" },
  { id: 2, title: "Understanding Next.js App Router in 10 Mins", duration: "12 min", level: "Beginner", category: "Frontend", views: "34K", thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=250&fit=crop" },
  { id: 3, title: "Create a REST API with Node & Express", duration: "25 min", level: "Beginner", category: "Backend", views: "8K", thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop" },
  { id: 4, title: "State Management: Redux vs Zustand", duration: "18 min", level: "Intermediate", category: "Frontend", views: "15K", thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop" },
  { id: 5, title: "Deploying Docker Containers to AWS", duration: "35 min", level: "Advanced", category: "Backend", views: "22K", thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop" },
  { id: 6, title: "Building a Chat App with Socket.io", duration: "50 min", level: "Advanced", category: "Full Stack", views: "9K", thumbnail: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=400&h=250&fit=crop" }
];

export default function Tutorials() {
  const [activeCat, setActiveCat] = useState("All");
  const [videoModal, setVideoModal] = useState<{ open: boolean; tutorial: any }>({ open: false, tutorial: null });

  const filtered = activeCat === "All" ? tutorials : tutorials.filter(t => t.category === activeCat);

  return (
    <main className="page-enter pt-20">
      {/* 1. Hero */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-80" />
        <div className="relative container-custom text-center">
          <span className="badge-primary mb-4 inline-block !bg-primary/20 !text-blue-300 !border-blue-500/30">Free Tutorials</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Learn by Building
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Real Projects</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            Bite-sized, practical tutorials to help you learn specific tools, frameworks, and concepts quickly.
          </p>
        </div>
      </section>

      {/* 2. Featured Path */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row">
            <div className="flex-1 p-10 lg:p-12 text-white">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold mb-6">
                <Star className="w-3.5 h-3.5" /> Featured Path
              </div>
              <h2 className="text-3xl font-bold mb-4">React to Full Stack in 30 Days</h2>
              <p className="text-blue-100 mb-8 leading-relaxed max-w-md">
                A curated sequence of 15 short tutorials that takes you from basic React components to a fully deployed MERN stack application.
              </p>
              <div className="flex flex-wrap gap-6 mb-8 text-sm font-medium text-blue-200">
                <span className="flex items-center gap-2"><Video className="w-4 h-4" /> 15 Videos</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> 8 Hours Total</span>
                <span className="flex items-center gap-2"><Code2 className="w-4 h-4" /> 4 Projects</span>
              </div>
              <Link to="/dashboard" className="px-8 py-3 bg-white text-blue-700 hover:bg-primary/10 font-bold rounded-xl transition-colors inline-block">
                Start Path Free
              </Link>
            </div>
            <div className="md:w-2/5 min-h-[300px] relative">
              <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop" alt="Coding" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-transparent opacity-90 md:opacity-0" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Browse by Category */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-foreground mb-8">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.name} onClick={() => setActiveCat(cat.name)} className={`p-6 rounded-2xl border cursor-pointer transition-all ${activeCat === cat.name ? "border-primary bg-primary/5 shadow-md" : "border-border bg-card hover:border-primary/30"}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.bg}`}>
                    <Icon className={`w-6 h-6 ${cat.color}`} />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">{cat.count} tutorials</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Latest Tutorials Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              {activeCat === "All" ? "Latest Tutorials" : `${activeCat} Tutorials`}
            </h2>
            {activeCat !== "All" && (
              <button onClick={() => setActiveCat("All")} className="text-sm font-medium text-primary hover:underline">Clear Filter</button>
            )}
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((tutorial) => (
              <div key={tutorial.id} className="group bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer" onClick={() => setVideoModal({ open: true, tutorial })}>
                <div className="relative h-48 overflow-hidden">
                  <img src={tutorial.thumbnail} alt={tutorial.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100 duration-300">
                      <PlayCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md backdrop-blur-sm">
                    {tutorial.duration}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-secondary text-xs font-medium rounded-md text-foreground">{tutorial.category}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-md ${
                      tutorial.level === "Beginner" ? "bg-accent/10 text-accent" :
                      tutorial.level === "Intermediate" ? "bg-blue-500/10 text-primary" :
                      "bg-purple-500/10 text-purple-600"
                    }`}>
                      {tutorial.level}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">{tutorial.title}</h3>
                  <div className="flex items-center text-xs text-muted-foreground gap-4">
                    <span className="flex items-center gap-1.5"><PlayCircle className="w-3.5 h-3.5" /> {tutorial.views} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600/5 to-emerald-500/5 border-t border-border">
        <div className="container-custom text-center">
          <BookOpen className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready for structured learning?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Tutorials are great for quick wins, but to truly master a skill, you need a structured curriculum. Browse our comprehensive, expert-led courses.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/features" className="btn-primary">Browse Full Courses</Link>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {videoModal.open && videoModal.tutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-card w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden border border-border">
            <div className="flex justify-between items-center p-4 border-b border-border bg-black">
              <h3 className="font-semibold text-white">{videoModal.tutorial.title}</h3>
              <button onClick={() => setVideoModal({ open: false, tutorial: null })} className="p-1 hover:bg-white/10 rounded-lg transition-colors"><X className="w-5 h-5 text-white" /></button>
            </div>
            <div className="aspect-video bg-black relative flex items-center justify-center group/video">
              <img src={videoModal.tutorial.thumbnail} alt={videoModal.tutorial.title} className="w-full h-full object-cover opacity-50" />
              <button className="absolute w-20 h-20 rounded-full bg-primary/80 text-white flex items-center justify-center group-hover/video:scale-110 transition-transform">
                <Play className="w-8 h-8 ml-1" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {videoModal.tutorial.duration}</span>
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /> {videoModal.tutorial.rating}</span>
                <span className="px-2 py-0.5 bg-secondary rounded-md">{videoModal.tutorial.level}</span>
              </div>
              <p className="text-foreground font-medium mb-6">In this tutorial, you will learn the core concepts of {videoModal.tutorial.title} by building practical examples and exploring best practices.</p>
              <div className="flex justify-end gap-3">
                <button className="btn-secondary flex items-center gap-2"><FileText className="w-4 h-4" /> Download Resources</button>
                <Link to="/dashboard" className="btn-primary">View Full Course</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
