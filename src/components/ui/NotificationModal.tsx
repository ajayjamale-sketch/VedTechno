import { useState } from "react";
import { X, Bell, Check, Trash2, ShieldAlert, BookOpen, Award, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface NotificationItem {
  id: string;
  title: string;
  msg: string;
  time: string;
  category: "course" | "cert" | "community" | "system";
  read: boolean;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_NOTIFS: NotificationItem[] = [
  { id: "1", title: "New course available", msg: "Advanced React Patterns is now live and ready for enrollment.", time: "2 minutes ago", category: "course", read: false },
  { id: "2", title: "Certificate earned!", msg: "Congratulations! You completed Python Fundamentals and earned a certificate.", time: "1 hour ago", category: "cert", read: false },
  { id: "3", title: "Community mention", msg: "@maya replied to your thread in General Programming.", time: "3 hours ago", category: "community", read: false },
  { id: "4", title: "System maintenance", msg: "VedTechno will be undergoing scheduled maintenance on June 10 from 2:00 AM to 4:00 AM UTC.", time: "1 day ago", category: "system", read: true },
  { id: "5", title: "Job match alert", msg: "A new Senior Frontend Engineer role matching your profile was posted.", time: "2 days ago", category: "system", read: true },
];

const categoryIcons = {
  course: { icon: BookOpen, color: "text-blue-500 bg-blue-500/10" },
  cert: { icon: Award, color: "text-emerald-500 bg-emerald-500/10" },
  community: { icon: MessageSquare, color: "text-orange-500 bg-orange-500/10" },
  system: { icon: ShieldAlert, color: "text-purple-500 bg-purple-500/10" },
};

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  if (!isOpen) return null;

  const filtered = notifications.filter(n => filter === "all" || !n.read);

  const handleMarkRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    toast.success("Notification marked as read");
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success("Notification deleted");
  };

  const handleClearAll = () => {
    setNotifications([]);
    toast.success("Cleared all notifications");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-card border border-border w-full max-w-2xl rounded-2xl shadow-xl flex flex-col max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Notifications</h3>
              <p className="text-xs text-muted-foreground">{notifications.filter(n => !n.read).length} unread alerts</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Filters and Actions toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/10 text-sm">
          <div className="flex gap-2">
            <button 
              onClick={() => setFilter("all")} 
              className={cn("px-3 py-1 rounded-lg font-medium transition-colors", filter === "all" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("unread")} 
              className={cn("px-3 py-1 rounded-lg font-medium transition-colors", filter === "unread" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              Unread
            </button>
          </div>
          {notifications.length > 0 && (
            <div className="flex gap-4">
              <button onClick={handleMarkAllRead} className="text-xs text-primary dark:text-primary/80 hover:underline flex items-center gap-1">
                <Check className="w-3 h-3" /> Mark all read
              </button>
              <button onClick={handleClearAll} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                <Trash2 className="w-3 h-3" /> Clear all
              </button>
            </div>
          )}
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {filtered.length > 0 ? (
            filtered.map((n) => {
              const config = categoryIcons[n.category] || categoryIcons.system;
              const Icon = config.icon;
              return (
                <div 
                  key={n.id} 
                  className={cn(
                    "flex gap-4 p-4 border rounded-xl transition-all",
                    n.read ? "border-border bg-card/50 opacity-75" : "border-primary/20 bg-primary/5 shadow-sm"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5", config.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className={cn("font-bold text-foreground text-sm", !n.read && "text-primary dark:text-primary/80")}>{n.title}</h4>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">{n.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.msg}</p>
                    <div className="flex gap-4 mt-3 pt-3 border-t border-dashed border-border/60">
                      {!n.read && (
                        <button onClick={() => handleMarkRead(n.id)} className="text-[11px] font-semibold text-primary dark:text-primary/80 hover:underline flex items-center gap-1">
                          <Check className="w-3 h-3" /> Mark read
                        </button>
                      )}
                      <button onClick={() => handleDelete(n.id)} className="text-[11px] font-semibold text-red-400 hover:text-red-500 flex items-center gap-1">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3 text-muted-foreground">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm text-foreground font-medium">No notifications found</p>
              <p className="text-xs text-muted-foreground mt-1">You are all caught up!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
