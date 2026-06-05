import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="section-padding bg-background" id="faq">
      <div className="container-custom">

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">

          {/* Left — sticky */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 self-start">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">FAQ</p>
            <h2 className="text-3xl font-bold text-foreground leading-tight mb-4">
              Questions we get a lot
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              Can't find what you're looking for?
            </p>
            <div className="flex flex-col gap-2">
              <Link to="/contact" className="inline-flex items-center justify-center px-4 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
                Ask our team
              </Link>
            </div>

            {/* Support status */}
            <div className="mt-8 flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              Support team is online — avg. 2h response
            </div>
          </div>

          {/* Right — accordion */}
          <div className="lg:col-span-8">
            <div className="divide-y divide-border">
              {FAQS.map((faq, idx) => (
                <div key={idx}>
                  <button
                    onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                    className="flex items-center justify-between w-full text-left py-5 gap-4"
                  >
                    <span className={cn("text-sm font-medium transition-colors", openIdx === idx ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200",
                        openIdx === idx && "rotate-180"
                      )}
                    />
                  </button>
                  {openIdx === idx && (
                    <div className="pb-5">
                      <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
