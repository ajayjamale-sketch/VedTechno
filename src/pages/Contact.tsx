import { useState, useRef } from "react";
import { Mail, Phone, MapPin, MessageCircle, Send, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { validateEmail } from "@/lib/utils";

const contactMethods = [
  { icon: Mail, title: "Email Us", detail: "hello@vedtechno.com", sub: "We respond within 2 hours" },
  { icon: Phone, title: "Call Us", detail: "+1 (800) VED-TECH", sub: "Mon-Fri, 9am-6pm EST" },
  { icon: MessageCircle, title: "Live Chat", detail: "Chat with Support", sub: "Available 24/7 for Pro & Enterprise" },
  { icon: MapPin, title: "Headquarters", detail: "San Francisco, CA", sub: "United States" },
];

const topics = ["General Inquiry", "Technical Support", "Enterprise Sales", "Partnership", "Press & Media", "Career Opportunities"];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", company: "", topic: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nameInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!validateEmail(form.email)) e.email = "Valid email required";
    if (!form.topic) e.topic = "Please select a topic";
    if (form.message.length < 20) e.message = "Message must be at least 20 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setIsSuccess(true);
    toast.success("Message sent! We'll get back to you shortly.");
  };

  const handleBookDemo = () => {
    setForm(prev => ({ ...prev, topic: "Enterprise Sales" }));
    document.querySelector("form")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      nameInputRef.current?.focus();
    }, 600);
    toast.info("Topic set to 'Enterprise Sales'. Please enter your details below.");
  };


  return (
    <main className="page-enter">
      {/* Hero */}
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
          <span className="badge-primary mb-4 inline-block ">Contact Us</span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5">
            We'd Love to
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">Hear From You</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Have a question, feedback, or enterprise inquiry? Our team is here to help.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 bg-background border-b border-border">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {contactMethods.map(({ icon: Icon, title, detail, sub }) => (
              <div key={title} className="feature-card text-center">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1">{title}</h3>
                <p className="text-primary dark:text-primary/80 text-sm font-medium">{detail}</p>
                <p className="text-xs text-muted-foreground mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Send Us a Message</h2>
              <p className="text-muted-foreground text-sm mb-6">Fill out the form and we'll be in touch within 24 hours.</p>

              {isSuccess ? (
                <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-center">
                  <CheckCircle2 className="w-14 h-14 text-accent mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground text-sm">Thanks for reaching out. We'll get back to you at <strong>{form.email}</strong> within 24 hours.</p>
                  <button onClick={() => { setIsSuccess(false); setForm({ name: "", email: "", company: "", topic: "", message: "" }); }} className="mt-4 btn-primary text-sm">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                      <input ref={nameInputRef} className={`input-field ${errors.name ? "border-red-500 focus:ring-red-500" : ""}`} placeholder="Alex Johnson" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Email Address *</label>
                      <input type="email" className={`input-field ${errors.email ? "border-red-500" : ""}`} placeholder="alex@company.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Company (Optional)</label>
                    <input className="input-field" placeholder="Your company name" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Topic *</label>
                    <select className={`input-field ${errors.topic ? "border-red-500" : ""}`} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                      <option value="">Select a topic</option>
                      {topics.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {errors.topic && <p className="text-red-500 text-xs mt-1">{errors.topic}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Message *</label>
                    <textarea rows={5} className={`input-field resize-none ${errors.message ? "border-red-500" : ""}`} placeholder="Tell us how we can help..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>
                  <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
                    {isSubmitting ? (
                      <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</span>
                    ) : (
                      <span className="flex items-center gap-2"><Send className="w-4 h-4" />Send Message</span>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-2xl p-6 border border-border">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-foreground">Response Times</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "General Inquiries", time: "Within 24 hours" },
                    { label: "Technical Support (Free)", time: "Within 48 hours" },
                    { label: "Technical Support (Pro)", time: "Within 4 hours" },
                    { label: "Enterprise Sales", time: "Within 2 hours" },
                    { label: "Emergency Issues", time: "Within 1 hour" },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{r.label}</span>
                      <span className="font-medium text-foreground text-xs">{r.time}</span>
                    </div>
                  ))}
                </div>
              </div>


              <img src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=500&h=250&fit=crop" alt="Support team" className="rounded-2xl w-full h-40 object-cover" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
