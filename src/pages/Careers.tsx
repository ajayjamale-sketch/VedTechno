import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Coffee, Globe, Heart, Laptop, MapPin, Rocket, Users, X } from "lucide-react";
import { toast } from "sonner";

const values = [
  { icon: Rocket, title: "Impact First", desc: "We measure success by the number of careers we transform." },
  { icon: Users, title: "Learner Obsessed", desc: "Every product decision starts with the student experience." },
  { icon: Globe, title: "Default Global", desc: "Talent is everywhere. We build for a worldwide audience." },
  { icon: Heart, title: "Empathy Always", desc: "Learning is hard. We treat our users and each other with grace." }
];

const perks = [
  { icon: Laptop, title: "Remote First", desc: "Work from anywhere in the world. We'll set up your home office." },
  { icon: Coffee, title: "Flexible Hours", desc: "We care about what you deliver, not when you clock in." },
  { icon: Briefcase, title: "Continuous Learning", desc: "Free access to all VedTechno courses and a $1,500/yr learning stipend." }
];

const jobs = [
  { id: 1, role: "Senior Frontend Engineer", dept: "Engineering", location: "Remote (Global)", type: "Full-time" },
  { id: 2, role: "AI Research Scientist", dept: "Data Science", location: "San Francisco / Remote", type: "Full-time" },
  { id: 3, role: "Product Designer", dept: "Design", location: "Remote (Americas)", type: "Full-time" },
  { id: 4, role: "Technical Curriculum Developer", dept: "Education", location: "Remote (Global)", type: "Contract" },
  { id: 5, role: "Developer Advocate", dept: "DevRel", location: "Remote (EMEA)", type: "Full-time" }
];

export default function Careers() {
  const [filter, setFilter] = useState("All");
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState("");
  
  const filteredJobs = filter === "All" ? jobs : jobs.filter(j => j.dept === filter);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Application submitted for ${selectedJob}! We will be in touch.`);
    setApplyModalOpen(false);
  };

  return (
    <main className="page-enter pt-20">
      {/* 1. Hero */}
      <section className="py-20 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-80" />
        <div className="relative container-custom text-center">
          <span className="badge-primary mb-4 inline-block !bg-primary/20 !text-blue-300 !border-blue-500/30">Join the Team</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Help Us Build the Future of
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Technical Education</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
            We're on a mission to make world-class developer education accessible to anyone with an internet connection.
          </p>
          <button onClick={() => document.getElementById('open-roles')?.scrollIntoView({ behavior: 'smooth' })} className="btn-primary">
            View Open Roles
          </button>
        </div>
      </section>

      {/* 2. Values */}
      <section className="section-padding bg-background border-b border-border">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Core Values</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">This is how we operate, make decisions, and build products.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card border border-border p-6 rounded-2xl">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Perks */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-foreground mb-6">Why work with us?</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                We believe that to build the best learning platform, we need to provide the best environment for our team to learn, grow, and thrive.
              </p>
              <div className="space-y-6">
                {perks.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-accent dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-1">{title}</h4>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 w-full grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=400&fit=crop" alt="Team meeting" className="rounded-2xl w-full h-48 object-cover" />
              <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=400&fit=crop" alt="Working from home" className="rounded-2xl w-full h-48 object-cover mt-8" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Open Positions */}
      <section id="open-roles" className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">Open Positions</h2>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {["All", "Engineering", "Data Science", "Design", "Education", "DevRel"].map(dept => (
                <button
                  key={dept}
                  onClick={() => setFilter(dept)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === dept ? "bg-primary text-white" : "border border-border text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <div key={job.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-card border border-border rounded-2xl hover:border-primary/30 hover:shadow-md transition-all">
                  <div>
                    <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors mb-2">{job.role}</h3>
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5" /> {job.dept}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.type}</span>
                    </div>
                  </div>
                  <button onClick={() => { setSelectedJob(job.role); setApplyModalOpen(true); }} className="btn-primary mt-4 sm:mt-0 text-sm py-2 px-6 shadow-sm">
                    Apply Now
                  </button>

                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
                <p className="text-foreground font-medium mb-1">No open roles in this department</p>
                <p className="text-muted-foreground text-sm">Check back later or apply generally.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. General Application CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border-t border-border">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Don't see a perfect fit?</h2>
            <p className="text-muted-foreground mb-8">
              We're always looking for talented individuals who are passionate about education. Send us your resume and tell us how you can contribute.
            </p>
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
              Get in Touch <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Apply for {selectedJob}</h3>
              <button onClick={() => setApplyModalOpen(false)} className="p-1 hover:bg-muted rounded-lg transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleApply} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name</label>
                <input required className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
                <input required type="email" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="jane@example.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">LinkedIn Profile</label>
                <input required type="url" className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="https://linkedin.com/in/..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Resume / CV</label>
                <input required type="file" className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-secondary file:text-foreground hover:file:bg-muted" accept=".pdf,.doc,.docx" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Cover Letter (Optional)</label>
                <textarea rows={3} className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" placeholder="Tell us why you're a great fit..."></textarea>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setApplyModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90">Submit Application</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function Clock(props: React.ComponentProps<"svg">) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
