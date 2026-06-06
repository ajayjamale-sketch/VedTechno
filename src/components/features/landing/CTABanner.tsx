import { Link } from "react-router-dom";
import { ArrowRight, Code2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function CTABanner() {
  const { user } = useAuth();
  return (
    <section className="py-24 bg-background border-t border-border">
      <div className="container-custom">
        <div className="max-w-3xl">

          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Code2 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm text-muted-foreground font-medium">VedTechno</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.05] mb-6">
            Your tech career
            <br />
            starts today.
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-xl">
            250,000+ learners have already built real skills, shipped real projects, and landed real jobs. There's no better time to start than now.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={user ? "/dashboard" : "/register"}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 text-base"
            >
              {user ? "Go to Dashboard" : "Start learning for free"}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 border border-border text-foreground font-medium rounded-xl hover:bg-muted transition-colors text-base"
            >
              View pricing
            </Link>
          </div>

          <p className="mt-5 text-xs text-muted-foreground">
            No credit card required. Free plan available forever.
          </p>
        </div>
      </div>
    </section>
  );
}
