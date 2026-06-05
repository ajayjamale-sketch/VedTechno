import { useState } from "react";
import { Link } from "react-router-dom";
import { Cookie, Settings2, ShieldCheck, Check, X, ArrowRight, Shield } from "lucide-react";
import { toast } from "sonner";

export default function CookiePolicy() {
  const [preferences, setPreferences] = useState({
    essential: true, // always true
    analytics: true,
    personalization: false,
    marketing: false
  });

  const handleSave = () => {
    toast.success("Cookie preferences saved successfully");
  };

  const handleAcceptAll = () => {
    setPreferences({ essential: true, analytics: true, personalization: true, marketing: true });
    toast.success("All cookies accepted");
  };

  return (
    <main className="page-enter pt-20">
      {/* 1. Hero */}
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
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-blue-500/30">
            <Cookie className="w-8 h-8 text-primary/80" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Cookie Policy</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We use cookies to ensure you get the best experience on our platform. 
            Here's exactly what we track, why we track it, and how you can control it.
          </p>
        </div>
      </section>

      {/* 2. What are Cookies */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container-custom max-w-4xl">
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground mb-4">What are cookies?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you browse websites. 
                They are widely used to make websites work more efficiently and provide information to the owners of the site.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                At VedTechno, we use cookies to keep you logged in, remember your course progress, understand how you interact with our platform, and personalize your learning experience.
              </p>
            </div>
            <div className="md:w-1/3 p-6 bg-muted/30 rounded-2xl border border-border">
              <ShieldCheck className="w-8 h-8 text-accent mb-4" />
              <h3 className="font-bold text-foreground mb-2">Our Promise</h3>
              <p className="text-sm text-muted-foreground">
                We never sell your cookie data to third-party data brokers. Your learning data stays strictly within our ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. How We Use Them */}
      <section className="section-padding bg-muted/30 border-b border-border">
        <div className="container-custom max-w-4xl">
          <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Types of Cookies We Use</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-card border border-border p-6 rounded-2xl">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Essential
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Required for the platform to function properly. Includes authentication, security, and load balancing.
              </p>
              <p className="text-xs font-medium text-foreground">Cannot be disabled.</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-2xl">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" /> Analytics
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Helps us understand how visitors interact with our platform, report errors, and improve the user experience.
              </p>
              <p className="text-xs font-medium text-foreground">Can be disabled.</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-2xl">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500" /> Personalization
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Used to remember your preferences, timezone, language, and customize course recommendations based on your history.
              </p>
              <p className="text-xs font-medium text-foreground">Can be disabled.</p>
            </div>
            <div className="bg-card border border-border p-6 rounded-2xl">
              <h3 className="font-bold text-foreground mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500" /> Marketing
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Used to deliver relevant advertisements on other websites and track the effectiveness of our marketing campaigns.
              </p>
              <p className="text-xs font-medium text-foreground">Can be disabled.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Manage Preferences */}
      <section className="section-padding bg-background">
        <div className="container-custom max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <Settings2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Manage Preferences</h2>
          </div>
          
          <div className="space-y-4 mb-8">
            {/* Essential */}
            <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border">
              <div>
                <h4 className="font-semibold text-foreground">Essential Cookies</h4>
                <p className="text-sm text-muted-foreground">Required for basic site functionality.</p>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative opacity-50 cursor-not-allowed">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
              </div>
            </div>

            {/* Analytics */}
            <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors">
              <div>
                <h4 className="font-semibold text-foreground">Analytics Cookies</h4>
                <p className="text-sm text-muted-foreground">Help us improve the platform.</p>
              </div>
              <button 
                onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                className={`w-12 h-6 rounded-full relative transition-colors ${preferences.analytics ? 'bg-primary' : 'bg-secondary'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.analytics ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Personalization */}
            <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors">
              <div>
                <h4 className="font-semibold text-foreground">Personalization Cookies</h4>
                <p className="text-sm text-muted-foreground">Remember your settings and history.</p>
              </div>
              <button 
                onClick={() => setPreferences(prev => ({ ...prev, personalization: !prev.personalization }))}
                className={`w-12 h-6 rounded-full relative transition-colors ${preferences.personalization ? 'bg-primary' : 'bg-secondary'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.personalization ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Marketing */}
            <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/30 transition-colors">
              <div>
                <h4 className="font-semibold text-foreground">Marketing Cookies</h4>
                <p className="text-sm text-muted-foreground">Track ad effectiveness.</p>
              </div>
              <button 
                onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                className={`w-12 h-6 rounded-full relative transition-colors ${preferences.marketing ? 'bg-primary' : 'bg-secondary'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${preferences.marketing ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-end border-t border-border pt-6">
            <button onClick={handleAcceptAll} className="btn-secondary">Accept All</button>
            <button onClick={handleSave} className="btn-primary">Save Preferences</button>
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600/5 to-emerald-500/5 border-t border-border">
        <div className="container-custom text-center">
          <Shield className="w-12 h-12 text-accent mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">Want to read the full policy?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Our comprehensive privacy policy outlines everything from data retention to your rights under GDPR and CCPA.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/privacy" className="btn-primary inline-flex items-center gap-2">Read Privacy Policy <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
