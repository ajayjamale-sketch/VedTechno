import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, ChevronDown, Bell, User, LogOut, Settings, LayoutDashboard, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/hooks/useAuth";
import { NAV_LINKS } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import { toast } from "sonner";
import NotificationModal from "@/components/ui/NotificationModal";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [allNotifOpen, setAllNotifOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
        isScrolled
          ? "bg-background/96 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-select group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-foreground tracking-tight">
              VedTechno
            </span>
          </Link>

          {/* Desktop Nav — minimal, no decorations */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-3.5 py-2 rounded-md text-sm transition-colors",
                  isActive(link.href)
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user ? (
              <>
                <div className="relative">
                  <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
                  </button>
                  {notifOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
                        <div className="p-4 border-b border-border flex items-center justify-between">
                          <h3 className="font-semibold text-foreground text-sm">Notifications</h3>
                          <button onClick={() => { toast.success("All marked as read"); setNotifOpen(false); }} className="text-xs text-primary dark:text-primary/80 hover:underline">Mark all read</button>
                        </div>
                        {[
                          { title: "New course available", msg: "Advanced React Patterns is now live", time: "2m ago", dot: "bg-blue-500" },
                          { title: "Certificate earned!", msg: "You completed Python Fundamentals", time: "1h ago", dot: "bg-accent" },
                          { title: "Community mention", msg: "@maya replied to your thread", time: "3h ago", dot: "bg-orange-500" },
                        ].map((n, i) => (
                          <button key={i} onClick={() => { toast.info(n.msg); setNotifOpen(false); }} className="w-full flex items-start gap-3 p-4 hover:bg-muted transition-colors text-left border-b border-border last:border-0">
                            <div className={cn("w-2 h-2 rounded-full mt-1.5 flex-shrink-0", n.dot)} />
                            <div>
                              <p className="text-sm font-medium text-foreground">{n.title}</p>
                              <p className="text-xs text-muted-foreground">{n.msg}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                            </div>
                          </button>
                        ))}
                        <div className="p-3 text-center">
                          <button onClick={() => { setAllNotifOpen(true); setNotifOpen(false); }} className="text-xs text-primary dark:text-primary/80 hover:underline">View all notifications</button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="relative ml-1">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted transition-colors"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-md object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-white text-xs font-bold">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <span className="hidden md:block text-sm font-medium text-foreground max-w-[90px] truncate">{user.name.split(" ")[0]}</span>
                    <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-52 bg-card border border-border rounded-xl shadow-lg shadow-black/8 p-1.5 z-50">
                      <div className="px-3 py-2 mb-1">
                        <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <hr className="border-border mb-1" />
                      {[
                        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
                        { to: "/profile", icon: User, label: "Profile" },
                        { to: "/settings", icon: Settings, label: "Settings" },
                      ].map(({ to, icon: Icon, label }) => (
                        <Link key={to} to={to} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                          <Icon className="w-3.5 h-3.5" />
                          {label}
                        </Link>
                      ))}
                      <hr className="border-border my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-1 ml-1">
                <Link to="/login" className="px-3.5 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md">
                  Sign in
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors">
                  Get started
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors ml-1"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="container-custom py-3 space-y-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "block px-3 py-2.5 rounded-lg text-sm transition-colors",
                  isActive(link.href)
                    ? "text-foreground font-medium bg-muted"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="pt-3 flex flex-col gap-2 border-t border-border mt-2">
                <Link to="/login" className="btn-secondary w-full justify-center text-sm py-2.5">Sign in</Link>
                <Link to="/register" className="btn-primary w-full justify-center text-sm py-2.5">Get started free</Link>
              </div>
            )}
          </div>
        </div>
      )}

      {userMenuOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
      )}
      <NotificationModal isOpen={allNotifOpen} onClose={() => setAllNotifOpen(false)} />
    </header>
  );
}
