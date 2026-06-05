import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Users, Calendar, Trophy, ArrowRight, Heart, Share2, MessageCircle, X, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const events = [
  { id: 1, title: "Global AI Hackathon", date: "June 15-17, 2026", type: "Virtual", prize: "$10,000" },
  { id: 2, title: "React Performance Masterclass", date: "June 20, 2026", type: "Live Stream", prize: null },
  { id: 3, title: "Open Source Contribution Day", date: "July 5, 2026", type: "Virtual", prize: "Swag Box" }
];

const contributors = [
  { name: "Sarah Jenkins", role: "Frontend Mentor", points: 14500, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { name: "David Kim", role: "Cloud Expert", points: 12400, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
  { name: "Elena Rodriguez", role: "ML Engineer", points: 9800, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
  { name: "Marcus Chen", role: "Student Ambassador", points: 8500, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" }
];

const threads = [
  { title: "Best resources for learning System Design?", author: "Alex J.", replies: 45, likes: 120, tags: ["Architecture", "Interviews"] },
  { title: "React 19 vs Next.js 15: Which should I start with?", author: "Priya S.", replies: 89, likes: 340, tags: ["React", "Beginner"] },
  { title: "Showcase: My first full-stack application! 🎉", author: "Mike T.", replies: 112, likes: 560, tags: ["Showcase", "Node.js"] }
];

export default function Community() {
  const [activeTab, setActiveTab] = useState("Discussions");
  const [rsvpModal, setRsvpModal] = useState<{ open: boolean; event: any }>({ open: false, event: null });
  const [profileModal, setProfileModal] = useState<{ open: boolean; user: any }>({ open: false, user: null });
  const [threadModal, setThreadModal] = useState<{ open: boolean; thread: any }>({ open: false, thread: null });

  const handleRSVP = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`You're officially registered for ${rsvpModal.event?.title}!`);
    setRsvpModal({ open: false, event: null });
  };

  return (
    <main className="page-enter pt-20">
      {/* 1. Hero */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-80" />
        <div className="relative container-custom text-center">
          <span className="badge-primary mb-4 inline-block !bg-primary/20 !text-blue-300 !border-blue-500/30">Community Hub</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Where Developers
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Learn Together</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            Join 250,000+ developers from 180 countries. Ask questions, share projects, and find your next coding buddy.
          </p>
          <div className="flex justify-center gap-4">
            <a href="https://discord.com/invite/vedtechno" target="_blank" rel="noreferrer" className="px-8 py-3.5 bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold rounded-xl transition-colors flex items-center gap-2">
              <MessageSquare className="w-5 h-5" /> Join Discord
            </a>
            <button onClick={() => document.getElementById('forums')?.scrollIntoView({ behavior: 'smooth' })} className="btn-secondary">
              Browse Forums
            </button>
          </div>
        </div>
      </section>

      {/* 2. Upcoming Events */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" /> Upcoming Events
            </h2>
            <button onClick={() => toast.info("No more events found")} className="text-primary dark:text-primary/80 text-sm font-medium hover:underline">
              View Calendar
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {events.map((event) => (
              <div key={event.id} className="bg-card border border-border p-6 rounded-2xl hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-1 bg-accent/10 text-accent dark:text-emerald-400 text-xs font-bold rounded-md">
                    {event.type}
                  </span>
                  {event.prize && (
                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-xs font-bold rounded-md">
                      Prize: {event.prize}
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-foreground mb-2 text-lg">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-6">{event.date}</p>
                <button onClick={() => setRsvpModal({ open: true, event })} className="w-full btn-secondary text-sm py-2.5">
                  RSVP Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Top Contributors */}
      <section className="section-padding bg-muted/30 border-b border-border">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" /> Hall of Fame
            </h2>
            <p className="text-muted-foreground">This month's most helpful community members.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contributors.map((user, idx) => (
              <div key={user.name} className="bg-card border border-border rounded-2xl p-6 text-center relative overflow-hidden">
                {idx === 0 && <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600" />}
                <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-background shadow-md" />
                <h3 className="font-bold text-foreground">{user.name}</h3>
                <p className="text-xs text-primary dark:text-primary/80 font-medium mb-3">{user.role}</p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary rounded-full text-xs font-semibold text-foreground">
                  <StarIcon className="w-3.5 h-3.5 text-yellow-500" />
                  {user.points.toLocaleString()} pts
                </div>
                <button onClick={() => setProfileModal({ open: true, user })} className="mt-5 w-full btn-secondary text-xs py-2">View Profile</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Active Forums */}
      <section id="forums" className="section-padding bg-background">
        <div className="container-custom max-w-4xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-primary" /> Active Discussions
            </h2>
            <div className="flex gap-2">
              {["Discussions", "Showcase", "Q&A"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                    activeTab === tab ? "bg-primary text-white" : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {threads.map((thread, idx) => (
              <div key={idx} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all cursor-pointer group" onClick={() => setThreadModal({ open: true, thread })}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">{thread.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>Posted by <span className="font-medium text-foreground">{thread.author}</span></span>
                      <span>•</span>
                      <div className="flex gap-2">
                        {thread.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-secondary text-xs rounded-md">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{thread.replies}</p>
                      <p className="text-xs text-muted-foreground">Replies</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{thread.likes}</p>
                      <p className="text-xs text-muted-foreground">Likes</p>
                    </div>
                    <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button onClick={() => toast.info("No more discussions")} className="w-full py-4 text-center text-sm font-medium text-primary dark:text-primary/80 hover:bg-primary/10 dark:hover:bg-blue-900/10 rounded-xl transition-colors">
              View All Discussions
            </button>
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-t border-border">
        <div className="container-custom text-center">
          <div className="inline-flex -space-x-4 mb-6">
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face" alt="User" className="w-12 h-12 rounded-full border-2 border-background" />
            <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=50&h=50&fit=crop&crop=face" alt="User" className="w-12 h-12 rounded-full border-2 border-background" />
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face" alt="User" className="w-12 h-12 rounded-full border-2 border-background" />
            <div className="w-12 h-12 rounded-full border-2 border-background bg-primary flex items-center justify-center text-white text-xs font-bold">+250K</div>
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to introduce yourself?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Create an account, set up your developer profile, and join the #introductions channel in our Discord server.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/register" className="btn-primary">Create Profile</Link>
          </div>
        </div>
      </section>

      {/* Modals */}
      {rsvpModal.open && rsvpModal.event && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">RSVP for Event</h3>
              <button onClick={() => setRsvpModal({ open: false, event: null })} className="p-1 hover:bg-muted rounded-lg transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleRSVP} className="p-4 space-y-4">
              <div className="p-3 bg-muted rounded-xl mb-2">
                <p className="font-bold text-foreground text-sm">{rsvpModal.event.title}</p>
                <p className="text-xs text-muted-foreground">{rsvpModal.event.date} • {rsvpModal.event.type}</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Your Name</label>
                <input required className="input-field" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email Address</label>
                <input required type="email" className="input-field" placeholder="john@example.com" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setRsvpModal({ open: false, event: null })} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Confirm RSVP</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {profileModal.open && profileModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-sm rounded-2xl shadow-xl overflow-hidden text-center p-6">
            <button onClick={() => setProfileModal({ open: false, user: null })} className="absolute top-4 right-4 p-1 hover:bg-muted rounded-lg transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
            <img src={profileModal.user.avatar} alt={profileModal.user.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-background shadow-md" />
            <h3 className="font-bold text-foreground text-xl">{profileModal.user.name}</h3>
            <p className="text-primary dark:text-primary/80 font-medium mb-4">{profileModal.user.role}</p>
            <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary rounded-full text-sm font-semibold text-foreground mb-6">
              <StarIcon className="w-4 h-4 text-yellow-500" />
              {profileModal.user.points.toLocaleString()} points
            </div>
            <div className="flex gap-2 w-full">
              <button onClick={() => { toast.success("Message sent"); setProfileModal({ open: false, user: null }); }} className="flex-1 btn-primary text-sm py-2">Message</button>
              <button onClick={() => { toast.success("Followed user"); setProfileModal({ open: false, user: null }); }} className="flex-1 btn-secondary text-sm py-2">Follow</button>
            </div>
          </div>
        </div>
      )}

      {threadModal.open && threadModal.thread && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-4 border-b border-border bg-muted/30">
              <div className="flex gap-2">
                {threadModal.thread.tags.map((tag: string) => (
                  <span key={tag} className="px-2 py-0.5 bg-primary/10 text-primary dark:text-primary/80 text-xs font-bold rounded-md">{tag}</span>
                ))}
              </div>
              <button onClick={() => setThreadModal({ open: false, thread: null })} className="p-1 hover:bg-muted rounded-lg transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="p-6 overflow-y-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">{threadModal.thread.title}</h2>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">{threadModal.thread.author.charAt(0)}</div>
                <div>
                  <p className="font-medium text-foreground">{threadModal.thread.author}</p>
                  <p className="text-xs text-muted-foreground">Posted 2 hours ago</p>
                </div>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none mb-8">
                <p>Hello community!</p>
                <p>I'm currently looking into this topic and would love to hear your recommendations and experiences. What are the best practices you've found?</p>
                <p>Thanks in advance for your help!</p>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground border-t border-border pt-4">
                <button className="flex items-center gap-1 hover:text-primary transition-colors"><Heart className="w-4 h-4" /> {threadModal.thread.likes}</button>
                <button className="flex items-center gap-1 hover:text-primary transition-colors"><MessageCircle className="w-4 h-4" /> {threadModal.thread.replies}</button>
                <button className="flex items-center gap-1 hover:text-primary transition-colors ml-auto"><Share2 className="w-4 h-4" /> Share</button>
              </div>
            </div>
            <div className="p-4 border-t border-border bg-muted/30">
              <div className="flex gap-2">
                <input className="input-field flex-1 bg-background" placeholder="Write a reply..." />
                <button onClick={() => { toast.success("Reply posted!"); setThreadModal({ open: false, thread: null }); }} className="btn-primary whitespace-nowrap">Reply</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StarIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
  );
}
