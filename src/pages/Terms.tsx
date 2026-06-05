import { Link } from "react-router-dom";
import { FileText, ChevronRight, Mail } from "lucide-react";

const termsSections = [
  {
    id: "1",
    title: "Acceptance of Terms",
    content: `By accessing or using the VedTechno platform ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.

These Terms apply to all visitors, users, and others who access or use the Service. By using VedTechno, you represent that you are at least 16 years of age and have the legal capacity to enter into a binding agreement.`,
  },
  {
    id: "2",
    title: "Account Registration & Security",
    content: `**Account Creation**: You must provide accurate, complete, and current information when creating an account. You are responsible for maintaining the confidentiality of your account credentials.

**Account Security**: You are responsible for all activities that occur under your account. Notify us immediately at security@vedtechno.com if you suspect unauthorized access.

**Account Restrictions**: You may not create accounts for others without their permission, use automated methods to create accounts, or maintain multiple accounts without explicit permission.

**Age Requirements**: Users under 18 must have parental or guardian consent to use the platform.`,
  },
  {
    id: "3",
    title: "Subscription Plans & Billing",
    content: `**Billing Cycles**: Subscriptions are billed monthly or annually as selected. Annual plans are billed upfront for the full year.

**Free Trial**: New users may access a 14-day free trial of the Pro plan. No credit card is required for the trial period. After the trial, you'll be asked to subscribe or downgrade to Free.

**Cancellation**: You may cancel your subscription at any time from your Account Settings. Cancellation takes effect at the end of the current billing period. You retain access to paid features until then.

**Refunds**: We offer a 30-day money-back guarantee on all paid plans. Refund requests after 30 days are evaluated on a case-by-case basis.

**Price Changes**: We reserve the right to modify pricing with 30 days' notice to existing subscribers.`,
  },
  {
    id: "4",
    title: "Content & Intellectual Property",
    content: `**Platform Content**: All course materials, videos, coding challenges, assessments, and other content on VedTechno are protected by intellectual property laws. You may access and use this content for personal learning only.

**Prohibited Uses**: You may not copy, reproduce, distribute, sell, or create derivative works from our content without written permission. Recording live sessions, screen-capturing premium content, or sharing account credentials violates these terms.

**User-Generated Content**: Content you create and submit (forum posts, project code, comments) remains yours. By posting, you grant VedTechno a non-exclusive license to display and use your content on the platform.

**Certificates**: Certificates are issued to the verified learner and are non-transferable. Any fraudulent representation of certificates is strictly prohibited.`,
  },
  {
    id: "5",
    title: "Acceptable Use Policy",
    content: `You agree not to use VedTechno to:

• Violate any applicable laws, regulations, or third-party rights
• Submit false, misleading, or fraudulent information
• Attempt to gain unauthorized access to other accounts or platform systems
• Distribute malware, viruses, or malicious code
• Harass, bully, or intimidate other users
• Engage in academic dishonesty (sharing exam answers, impersonating during proctored tests)
• Scrape, crawl, or use automated tools to extract platform data
• Reverse engineer or decompile any part of our software
• Use the platform for commercial purposes without authorization

Violations may result in account suspension or permanent ban without refund.`,
  },
  {
    id: "6",
    title: "Disclaimers & Limitations",
    content: `**No Employment Guarantee**: VedTechno provides career resources and connections to hiring partners but does not guarantee employment outcomes.

**Content Accuracy**: While we strive for accuracy, technology evolves rapidly. We do not guarantee that all course content is current or error-free.

**Limitation of Liability**: To the maximum extent permitted by law, VedTechno shall not be liable for indirect, incidental, special, or consequential damages arising from your use of the Service.

**Service Availability**: We strive for 99.9% uptime but cannot guarantee uninterrupted service. Scheduled maintenance will be communicated in advance.`,
  },
  {
    id: "7",
    title: "Termination",
    content: `**By You**: You may terminate your account at any time by contacting support@vedtechno.com or through Account Settings.

**By Us**: We reserve the right to suspend or terminate accounts that violate these Terms, engage in fraudulent activity, or pose a risk to our platform or other users.

**Effect of Termination**: Upon termination, your right to access the Service ceases. Earned certificates will remain accessible for download for 90 days post-termination. Refunds are handled per our refund policy.`,
  },
  {
    id: "8",
    title: "Governing Law & Disputes",
    content: `These Terms are governed by the laws of the State of California, United States, without regard to conflict of law provisions.

**Dispute Resolution**: Before filing any legal claim, you agree to attempt informal resolution by contacting legal@vedtechno.com. We'll try to resolve disputes within 30 days.

**Arbitration**: For claims under $10,000, disputes shall be resolved through binding arbitration rather than in court, except where prohibited by law.

**Class Action Waiver**: You agree to resolve disputes individually and waive the right to participate in class action lawsuits.`,
  },
];

export default function Terms() {
  return (
    <main className="page-enter pt-20">
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
        <div className="relative container-custom">
          <div className="max-w-3xl">
            <span className="badge-primary mb-4 inline-block ">Legal</span>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Terms of Service</h1>
            <p className="text-muted-foreground text-lg mb-4">
              Please read these terms carefully before using VedTechno. By using our platform, you agree to these terms.
            </p>
            <p className="text-white/40 text-sm">Last updated: June 1, 2026 · Effective: June 1, 2026</p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
            {/* TOC */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card border border-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Sections</h3>
                <nav className="space-y-2">
                  {termsSections.map((s) => (
                    <a key={s.id} href={`#term-${s.id}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-1">
                      <ChevronRight className="w-3 h-3" />
                      {s.title}
                    </a>
                  ))}
                </nav>
                <div className="mt-5 pt-4 border-t border-border space-y-2">
                  <Link to="/privacy" className="text-xs text-primary dark:text-primary/80 hover:underline block">Privacy Policy →</Link>
                  <Link to="/contact" className="text-xs text-primary dark:text-primary/80 hover:underline block">Contact Legal →</Link>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3 space-y-6">
              <div className="p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Summary:</strong> By using VedTechno, you agree to these Terms. Use the platform for learning only. Don't share accounts, cheat on assessments, or misuse our content. We offer refunds within 30 days. Questions? Email{" "}
                  <a href="mailto:legal@vedtechno.com" className="underline">legal@vedtechno.com</a>
                </p>
              </div>

              {termsSections.map((section) => (
                <div key={section.id} id={`term-${section.id}`} className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground">{section.id}. {section.title}</h2>
                  </div>
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {section.content.split("**").map((part, i) =>
                      i % 2 === 1 ? <strong key={i} className="font-semibold text-foreground">{part}</strong> : part
                    )}
                  </div>
                </div>
              ))}

              <div className="p-6 bg-gradient-to-r from-blue-600/5 to-emerald-500/5 border border-primary/10 rounded-2xl text-center">
                <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="font-semibold text-foreground mb-1">Questions about our Terms?</p>
                <p className="text-sm text-muted-foreground mb-4">Our legal team responds to inquiries within 3 business days.</p>
                <Link to="/contact" className="btn-primary text-sm">Contact Legal Team</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
