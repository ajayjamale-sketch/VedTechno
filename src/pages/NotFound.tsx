import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft, Code2 } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-lg">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 mb-12">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">VedTechno</span>
        </Link>

        {/* 404 */}
        <div className="mb-8 relative">
          <div className="text-[10rem] font-black leading-none bg-clip-text text-transparent bg-gradient-to-b from-blue-600 to-blue-600/10 select-none">
            404
          </div>
          <div className="absolute inset-0 bg-gradient-radial from-blue-600/20 to-transparent rounded-full blur-3xl" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-3">Page Not Found</h1>
        <p className="text-muted-foreground text-base mb-8 leading-relaxed">
          Looks like you've navigated to an unknown path. The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <button onClick={() => window.history.back()} className="btn-secondary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>

        {/* Quick links */}
        <div className="mt-10 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Maybe you were looking for:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: "Dashboard", href: "/dashboard" },
              { label: "Courses", href: "/features" },
              { label: "Pricing", href: "/pricing" },
              { label: "Blog", href: "/blog" },
              { label: "Contact", href: "/contact" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
