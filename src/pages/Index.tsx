import HeroSection from "@/components/features/landing/HeroSection";
import FeaturesSection from "@/components/features/landing/FeaturesSection";
import WorkflowSection from "@/components/features/landing/WorkflowSection";
import BenefitsSection from "@/components/features/landing/BenefitsSection";
import DashboardPreview from "@/components/features/landing/DashboardPreview";
import TestimonialsSection from "@/components/features/landing/TestimonialsSection";
import PricingSection from "@/components/features/landing/PricingSection";
import FAQSection from "@/components/features/landing/FAQSection";
import CTABanner from "@/components/features/landing/CTABanner";

export default function Index() {
  return (
    <main className="page-enter">
      <HeroSection />
      <FeaturesSection />
      <WorkflowSection />
      <BenefitsSection />
      <DashboardPreview />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTABanner />
    </main>
  );
}
