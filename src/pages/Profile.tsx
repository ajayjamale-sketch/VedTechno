import { useState } from "react";
import { Link } from "react-router-dom";
import { Camera, Save, CheckCircle2, Loader2, MapPin, Globe, Briefcase, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils";

const skillOptions = ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Machine Learning", "AWS", "Docker", "Kubernetes", "Data Science", "SQL", "MongoDB", "GraphQL", "Go", "Rust"];

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
    skills: user?.skills || [],
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">You need to sign in to view your profile.</p>
          <Link to="/login" className="btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    updateProfile(form);
    setIsSaving(false);
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const toggleSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  return (
    <main className="page-enter pt-20">
      <div className="container-custom py-10 max-w-5xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground text-sm">Manage your public profile and learning identity.</p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button onClick={() => setIsEditing(false)} className="btn-secondary text-sm">Cancel</button>
                <button onClick={handleSave} disabled={isSaving} className="btn-primary text-sm">
                  {isSaving ? <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />Saving...</> : <><Save className="w-3.5 h-3.5 mr-1.5" />Save Changes</>}
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="btn-primary text-sm">Edit Profile</button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Card */}
          <div className="lg:col-span-1 space-y-5">
            {/* Avatar */}
            <div className="feature-card text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-24 h-24 rounded-2xl object-cover" />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                    {getInitials(user.name)}
                  </div>
                )}
                {isEditing && (
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center border-2 border-background">
                    <Camera className="w-3.5 h-3.5 text-white" />
                  </button>
                )}
              </div>
              <h2 className="text-lg font-bold text-foreground">{user.name}</h2>
              <p className="text-blue-600 dark:text-blue-400 text-sm capitalize">{user.role}</p>
              <p className="text-xs text-muted-foreground mt-1">Member since {new Date(user.joinedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
            </div>

            {/* Stats */}
            <div className="feature-card">
              <h3 className="font-semibold text-foreground text-sm mb-4">Learning Stats</h3>
              <div className="space-y-3">
                {[
                  { label: "Courses Completed", value: user.coursesCompleted },
                  { label: "Certificates Earned", value: user.certificatesEarned },
                  { label: "Current Streak", value: `${user.streakDays} days` },
                  { label: "Total Points", value: user.points.toLocaleString() },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{s.label}</span>
                    <span className="font-semibold text-foreground">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-2 space-y-5">
            <div className="feature-card">
              <h3 className="font-semibold text-foreground mb-5">Personal Information</h3>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Full Name</label>
                    {isEditing ? (
                      <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    ) : (
                      <p className="text-sm text-foreground font-medium">{user.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">Email</label>
                    <p className="text-sm text-foreground font-medium">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Contact support to change email</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Bio</label>
                  {isEditing ? (
                    <textarea rows={3} className="input-field resize-none" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell others about yourself..." />
                  ) : (
                    <p className="text-sm text-foreground">{user.bio || "No bio added yet."}</p>
                  )}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      <MapPin className="w-3 h-3 inline mr-1" />Location
                    </label>
                    {isEditing ? (
                      <input className="input-field" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Country" />
                    ) : (
                      <p className="text-sm text-foreground">{user.location || "Not set"}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                      <Globe className="w-3 h-3 inline mr-1" />Website
                    </label>
                    {isEditing ? (
                      <input className="input-field" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://yoursite.com" />
                    ) : (
                      <p className="text-sm text-blue-600 dark:text-blue-400">{user.website || "Not set"}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="feature-card">
              <h3 className="font-semibold text-foreground mb-4">Skills & Technologies</h3>
              {isEditing ? (
                <div className="flex flex-wrap gap-2">
                  {skillOptions.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                        form.skills.includes(skill)
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-border text-muted-foreground hover:border-blue-600/50"
                      )}
                    >
                      {form.skills.includes(skill) && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                      {skill}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {(user.skills || []).map((skill) => (
                    <span key={skill} className="badge-primary text-xs">{skill}</span>
                  ))}
                  {(!user.skills || user.skills.length === 0) && (
                    <p className="text-sm text-muted-foreground">No skills added yet. Edit profile to add skills.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
