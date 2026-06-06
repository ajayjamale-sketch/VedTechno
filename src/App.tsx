import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { useScrollTop } from "@/hooks/useScrollTop";
import { useTheme } from "@/hooks/useTheme";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import Index from "@/pages/Index";
import About from "@/pages/About";
import Features from "@/pages/Features";
import Pricing from "@/pages/Pricing";
import Contact from "@/pages/Contact";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import Blog from "@/pages/Blog";
import BlogDetail from "@/pages/BlogDetail";
import FAQ from "@/pages/FAQ";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import Changelog from "@/pages/Changelog";
import Careers from "@/pages/Careers";
import Documentation from "@/pages/Documentation";
import Community from "@/pages/Community";
import Tutorials from "@/pages/Tutorials";
import CookiePolicy from "@/pages/CookiePolicy";
import Security from "@/pages/Security";
import NotFound from "@/pages/NotFound";
import Payment from "@/pages/Payment";

const NO_LAYOUT_ROUTES = ["/login", "/register", "/forgot-password", "/dashboard", "/profile", "/settings"];
const NO_FOOTER_ROUTES = ["/dashboard", "/profile", "/settings"];

function AppContent() {
  const location = useLocation();
  useScrollTop();

  const noLayout = NO_LAYOUT_ROUTES.some((r) => location.pathname.startsWith(r));
  const noFooter = NO_FOOTER_ROUTES.some((r) => location.pathname.startsWith(r));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!noLayout && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Dashboard defaultTab="profile" />} />
          <Route path="/settings" element={<Dashboard defaultTab="settings" />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/community" element={<Community />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/security" element={<Security />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!noLayout && !noFooter && <Footer />}
      <ScrollToTop />
    </div>
  );
}

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  useTheme();
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeWrapper>
        <AppContent />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: "12px",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
            },
          }}
          richColors
        />
      </ThemeWrapper>
    </BrowserRouter>
  );
}
