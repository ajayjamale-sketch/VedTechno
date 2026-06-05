import { Link } from "react-router-dom";
import { Shield, Lock, Eye, Database, Bell, Mail, ChevronRight } from "lucide-react";

const sections = [
  {
    id: "1",
    title: "Information We Collect",
    icon: Database,
    content: `We collect information you provide directly to us, such as when you create an account, enroll in courses, complete assessments, or contact our support team. This includes:

• **Account Information**: Name, email address, password, and profile details
• **Learning Data**: Course progress, assessment scores, coding submissions, and learning preferences
• **Usage Information**: Pages visited, features used, session duration, and interaction patterns
• **Device Information**: Browser type, operating system, IP address, and device identifiers
• **Payment Information**: Billing details processed securely through our payment providers (we never store full card numbers)
• **Communications**: Messages sent to our support team or community forums`,
  },
  {
    id: "2",
    title: "How We Use Your Information",
    icon: Eye,
    content: `We use the information we collect to provide, improve, and personalize our services:

• Deliver and manage your learning experience
• Personalize course recommendations and learning paths through AI
• Issue and verify digital certificates and skill badges
• Process payments and manage your subscription
• Send important account notifications and learning reminders
• Provide customer support and respond to inquiries
• Analyze platform usage to improve features and content
• Connect you with career opportunities through our hiring partners (with your consent)
• Conduct security monitoring to protect your account and our platform`,
  },
  {
    id: "3",
    title: "Information Sharing",
    icon: Lock,
    content: `We do not sell your personal information. We may share your information in the following circumstances:

• **With Your Consent**: When you authorize us to share your profile or certificates with employers
• **Service Providers**: Third-party vendors who help us operate our platform (hosting, payments, analytics)
• **Business Transfers**: In connection with a merger, acquisition, or sale of assets
• **Legal Requirements**: When required by law or to protect our rights and users' safety
• **Anonymized Data**: Aggregated, de-identified data for research and analytics

**Hiring Partners**: With your explicit consent, we may share your certified profile with our 500+ hiring partners. You can opt out at any time in your Privacy Settings.`,
  },
  {
    id: "4",
    title: "Data Security",
    icon: Shield,
    content: `We implement industry-standard security measures to protect your information:

• AES-256 encryption for data at rest
• TLS 1.3 encryption for all data in transit
• Multi-factor authentication support
• Regular security audits and penetration testing
• SOC 2 Type II compliance
• GDPR and CCPA compliant data handling
• Automated threat detection and monitoring
• Secure, isolated coding environments

While we take extensive measures to protect your data, no security system is completely impenetrable. We encourage you to use a strong, unique password and enable two-factor authentication.`,
  },
  {
    id: "5",
    title: "Your Rights & Choices",
    icon: Bell,
    content: `You have the following rights regarding your personal data:

• **Access**: Request a copy of all data we hold about you
• **Correction**: Update or correct inaccurate information
• **Deletion**: Request deletion of your account and associated data
• **Portability**: Export your learning data in a machine-readable format
• **Opt-Out**: Unsubscribe from marketing communications at any time
• **Restriction**: Limit how we process certain data about you
• **Objection**: Object to certain data processing activities

To exercise these rights, visit your Account Settings or contact privacy@vedtechno.com. We'll respond to requests within 30 days.`,
  },
  {
    id: "6",
    title: "Cookies & Tracking",
    icon: Eye,
    content: `We use cookies and similar tracking technologies to improve your experience:

• **Essential Cookies**: Required for authentication and core platform functionality
• **Performance Cookies**: Help us understand how users interact with our platform
• **Personalization Cookies**: Remember your preferences and learning history
• **Analytics Cookies**: Aggregate usage data to improve our services

You can manage cookie preferences through your browser settings or our Cookie Preferences panel. Note that disabling certain cookies may affect platform functionality.`,
  },
];

export default function PrivacyPolicy() {
  return (
    <main className="page-enter pt-20">
      {/* Hero */}
      <section className="py-16 bg-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-80" />
        <div className="relative container-custom">
          <div className="max-w-3xl">
            <span className="badge-primary mb-4 inline-block !bg-blue-600/20 !text-blue-300 !border-blue-500/30">Legal</span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-white/60 text-lg mb-4">
              We take your privacy seriously. This policy explains how VedTechno collects, uses, and protects your personal information.
            </p>
            <p className="text-white/40 text-sm">Last updated: June 1, 2026 · Effective: June 1, 2026</p>
          </div>
        </div>
      </section>

      {/* Quick summary */}
      <section className="py-10 bg-background border-b border-border">
        <div className="container-custom">
          <div className="grid sm:grid-cols-3 gap-4 max-w-4xl">
            {[
              { icon: Lock, title: "No Data Selling", desc: "We never sell your personal information to third parties." },
              { icon: Shield, title: "Bank-Grade Security", desc: "AES-256 encryption, SOC 2 compliant, GDPR ready." },
              { icon: Eye, title: "Full Transparency", desc: "You have complete control over your data at all times." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl border border-border">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
            {/* TOC */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card border border-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Table of Contents</h3>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#section-${section.id}`}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors py-1.5"
                    >
                      <ChevronRight className="w-3 h-3" />
                      {section.title}
                    </a>
                  ))}
                </nav>
                <div className="mt-5 pt-4 border-t border-border">
                  <Link to="/contact" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                    Questions? Contact us →
                  </Link>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-3 space-y-8">
              <div className="p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Privacy Questions</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      For privacy-related inquiries, contact us at{" "}
                      <a href="mailto:privacy@vedtechno.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                        privacy@vedtechno.com
                      </a>{" "}
                      or write to: VedTechno Privacy Team, 123 Tech Avenue, San Francisco, CA 94105
                    </p>
                  </div>
                </div>
              </div>

              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <div key={section.id} id={`section-${section.id}`} className="bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-9 h-9 rounded-xl bg-blue-600/10 flex items-center justify-center">
                        <Icon className="w-4.5 h-4.5 text-blue-600" />
                      </div>
                      <h2 className="text-lg font-bold text-foreground">{section.id}. {section.title}</h2>
                    </div>
                    <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {section.content.split("**").map((part, i) =>
                        i % 2 === 1 ? <strong key={i} className="font-semibold text-foreground">{part}</strong> : part
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
