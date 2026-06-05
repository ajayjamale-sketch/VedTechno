import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Lock, Eye, Globe, Shield, Trash2, Loader2, CheckCircle2, Moon, Sun, Monitor } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const settingsTabs = [
  { id: "account", label: "Account", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy", icon: Lock },
  { id: "appearance", label: "Appearance", icon: Eye },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    courseUpdates: true,
    newCourses: true,
    communityReplies: false,
    weeklyDigest: true,
    jobAlerts: true,
    achievements: true,
  });
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showProgress: false,
    showCertificates: true,
    allowMessages: true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSaving(false);
    toast.success("Settings saved successfully!");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Please sign in to access settings.</p>
          <Link to="/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animation-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm">Manage your account preferences and platform settings.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {settingsTabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn("sidebar-link w-full", activeTab === id && "sidebar-link-active")}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3 space-y-5">
            {activeTab === "account" && (
              <>
                <div className="feature-card">
                  <h3 className="font-semibold text-foreground mb-5">Account Information</h3>
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Display Name</label>
                        <input className="input-field" defaultValue={user.name} />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email Address</label>
                        <input type="email" className="input-field" defaultValue={user.email} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Language</label>
                      <select className="input-field">
                        <option>English (US)</option>
                        <option>Hindi</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Timezone</label>
                      <select className="input-field">
                        <option>UTC-5 (Eastern Time)</option>
                        <option>UTC+5:30 (India Standard Time)</option>
                        <option>UTC+0 (GMT)</option>
                        <option>UTC+1 (Central European Time)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="feature-card">
                  <h3 className="font-semibold text-foreground mb-5">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">Current Password</label>
                      <input type="password" className="input-field" placeholder="••••••••" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">New Password</label>
                        <input type="password" className="input-field" placeholder="••••••••" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Confirm Password</label>
                        <input type="password" className="input-field" placeholder="••••••••" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="feature-card border-red-200 dark:border-red-800/50">
                  <h3 className="font-semibold text-red-600 mb-3">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                  <button onClick={() => toast.error("Account deletion requires email confirmation.")} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-300 dark:border-red-700 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 text-sm font-medium transition-colors">
                    <Trash2 className="w-4 h-4" />Delete My Account
                  </button>
                </div>
              </>
            )}

            {activeTab === "notifications" && (
              <div className="feature-card">
                <h3 className="font-semibold text-foreground mb-5">Notification Preferences</h3>
                <div className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => {
                    const labels: Record<string, { label: string; desc: string }> = {
                      courseUpdates: { label: "Course Updates", desc: "New lessons and content in enrolled courses" },
                      newCourses: { label: "New Courses", desc: "Recommendations based on your interests" },
                      communityReplies: { label: "Community Replies", desc: "Replies to your forum posts" },
                      weeklyDigest: { label: "Weekly Digest", desc: "Summary of your learning progress" },
                      jobAlerts: { label: "Job Alerts", desc: "Matching jobs from our hiring partners" },
                      achievements: { label: "Achievements", desc: "Badges, certificates, and milestones" },
                    };
                    const item = labels[key];
                    return (
                      <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => setNotifications((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                          className={cn("relative w-11 h-6 rounded-full transition-colors", value ? "bg-primary" : "bg-muted")}
                        >
                          <div className={cn("absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform", value ? "translate-x-5" : "")} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="feature-card">
                <h3 className="font-semibold text-foreground mb-5">Privacy Settings</h3>
                <div className="space-y-4">
                  {Object.entries(privacy).map(([key, value]) => {
                    const labels: Record<string, { label: string; desc: string }> = {
                      showProfile: { label: "Public Profile", desc: "Allow others to view your profile page" },
                      showProgress: { label: "Show Learning Progress", desc: "Display your course completion on profile" },
                      showCertificates: { label: "Show Certificates", desc: "Make your earned certificates visible publicly" },
                      allowMessages: { label: "Allow Direct Messages", desc: "Let community members send you messages" },
                    };
                    const item = labels[key];
                    return (
                      <div key={key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div>
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <button
                          onClick={() => setPrivacy((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))}
                          className={cn("relative w-11 h-6 rounded-full transition-colors", value ? "bg-primary" : "bg-muted")}
                        >
                          <div className={cn("absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform", value ? "translate-x-5" : "")} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="feature-card">
                <h3 className="font-semibold text-foreground mb-5">Appearance</h3>
                <p className="text-xs text-muted-foreground mb-4">Choose how VedTechno looks to you.</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "light", icon: Sun, label: "Light", active: theme === "light" },
                    { id: "dark", icon: Moon, label: "Dark", active: theme === "dark" },
                    { id: "system", icon: Monitor, label: "System", active: false },
                  ].map(({ id, icon: Icon, label, active }) => (
                    <button
                      key={id}
                      onClick={() => { if (id !== "system") { if (theme !== id) toggleTheme(); } else toast.info("System theme follows your OS preference."); }}
                      className={cn("p-4 rounded-2xl border text-center transition-all", active ? "border-primary bg-primary/10" : "border-border hover:border-primary/30")}
                    >
                      <Icon className={cn("w-6 h-6 mx-auto mb-2", active ? "text-primary" : "text-muted-foreground")} />
                      <p className={cn("text-sm font-medium", active ? "text-primary" : "text-foreground")}>{label}</p>
                      {active && <CheckCircle2 className="w-4 h-4 text-primary mx-auto mt-1" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
              <button onClick={handleSave} disabled={isSaving} className="btn-primary">
                {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
