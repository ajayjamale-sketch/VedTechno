import { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Server, FileCheck, Bug, Mail, ArrowRight, CheckCircle2, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const securityFeatures = [
  { icon: Lock, title: "Data Encryption", desc: "All data is encrypted at rest using AES-256 and in transit using TLS 1.3 or higher." },
  { icon: Server, title: "Isolated Infrastructure", desc: "Coding labs run in secure, isolated Docker containers with strict resource limits." },
  { icon: Shield, title: "DDoS Protection", desc: "Enterprise-grade DDoS mitigation and WAF protect our platform 24/7." }
];

const certifications = [
  { name: "SOC 2 Type II", desc: "Audited annually by independent third-party firms.", status: "Certified" },
  { name: "GDPR Compliant", desc: "Strict adherence to EU data protection laws.", status: "Compliant" },
  { name: "ISO 27001", desc: "Information security management system standard.", status: "In Progress" }
];

export default function Security() {
  const [complianceModal, setComplianceModal] = useState(false);
  const [bountyModal, setBountyModal] = useState(false);

  const handleComplianceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Compliance report request received! Our team will contact you shortly.");
    setComplianceModal(false);
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
          <span className="badge-primary mb-4 inline-block !bg-accent/20 !text-emerald-300 !border-emerald-500/30">Security Center</span>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Bank-Grade Security for
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">Your Peace of Mind</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We treat your data, code, and privacy with the highest level of security. 
            Here's how we protect the VedTechno ecosystem.
          </p>
        </div>
      </section>

      {/* 2. Infrastructure */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Infrastructure Security</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Built from the ground up with defense-in-depth principles.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {securityFeatures.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-card border border-border p-6 rounded-2xl hover:border-emerald-500/30 transition-colors">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Compliance */}
      <section className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary dark:text-primary/80 text-xs font-bold rounded-full mb-4">
                <FileCheck className="w-4 h-4" /> Compliance & Privacy
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Verified by Independent Auditors</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                We undergo regular third-party audits and penetration testing to ensure our security controls meet or exceed industry standards.
              </p>
              <button onClick={() => setComplianceModal(true)} className="btn-secondary">Request SOC 2 Report</button>
            </div>
            <div className="lg:w-1/2 w-full space-y-4">
              {certifications.map((cert) => (
                <div key={cert.name} className="flex items-center justify-between p-5 bg-card border border-border rounded-2xl">
                  <div>
                    <h4 className="font-bold text-foreground mb-1">{cert.name}</h4>
                    <p className="text-sm text-muted-foreground">{cert.desc}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {cert.status === "Certified" || cert.status === "Compliant" ? (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-accent/10 text-accent dark:text-emerald-400 text-xs font-bold rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {cert.status}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> {cert.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Bug Bounty */}
      <section className="section-padding bg-background border-y border-border">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
            <div className="p-10 lg:p-16 text-center text-white max-w-3xl mx-auto">
              <Bug className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Responsible Disclosure & Bug Bounty</h2>
              <p className="text-slate-300 mb-8 leading-relaxed">
                We believe that working with skilled security researchers across the globe is crucial in identifying weaknesses in any technology. If you believe you've found a security vulnerability in VedTechno, we encourage you to let us know right away.
              </p>
              <div className="flex justify-center gap-4">
                <button onClick={() => setBountyModal(true)} className="px-8 py-3 bg-accent hover:bg-accent text-white font-bold rounded-xl transition-colors">
                  View Bug Bounty Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container-custom text-center">
          <Mail className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">Report an Issue</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            If you have discovered a security vulnerability or have a security-related question, please contact our security team immediately.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2">Contact Security Team <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* Compliance Modal */}
      {complianceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Request Compliance Report</h3>
              <button onClick={() => setComplianceModal(false)} className="p-1 hover:bg-muted rounded-lg transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <form onSubmit={handleComplianceSubmit} className="p-4 space-y-4">
              <p className="text-sm text-muted-foreground mb-2">We require verification of business identity before sharing detailed compliance documents.</p>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Business Email</label>
                <input required type="email" className="input-field" placeholder="you@company.com" />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Company Name</label>
                <input required className="input-field" placeholder="Acme Corp" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setComplianceModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Request Access</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bug Bounty Modal */}
      {bountyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center p-4 border-b border-border">
              <h3 className="font-semibold text-foreground flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-accent" /> Bug Bounty Policy</h3>
              <button onClick={() => setBountyModal(false)} className="p-1 hover:bg-muted rounded-lg transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="p-6 overflow-y-auto prose prose-sm dark:prose-invert max-w-none">
              <p>VedTechno takes security seriously. If you believe you have found a security vulnerability in our platform, we encourage you to let us know right away. We will investigate all legitimate reports and do our best to quickly fix the problem.</p>
              <h4>In Scope</h4>
              <ul>
                <li><code>*.vedtechno.com</code></li>
                <li>API Endpoints</li>
                <li>Authentication Mechanisms</li>
              </ul>
              <h4>Out of Scope</h4>
              <ul>
                <li>Denial of Service (DoS) attacks</li>
                <li>Social Engineering</li>
                <li>Third-party integrations</li>
              </ul>
              <h4>Rewards</h4>
              <p>Rewards are distributed based on severity:</p>
              <ul>
                <li><strong>Critical:</strong> Up to $10,000</li>
                <li><strong>High:</strong> Up to $5,000</li>
                <li><strong>Medium:</strong> Up to $2,000</li>
                <li><strong>Low:</strong> Swag & Hall of Fame</li>
              </ul>
            </div>
            <div className="p-4 border-t border-border flex justify-end">
              <button onClick={() => setBountyModal(false)} className="btn-primary">Got it</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
