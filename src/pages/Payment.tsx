import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Payment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Mock payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <main className="page-enter min-h-[80vh] flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center shadow-lg">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-6">Your subscription is now active. Redirecting you to the dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-enter min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        
        <div className="grid md:grid-cols-5 gap-8">
          {/* Payment Form */}
          <div className="md:col-span-3">
            <h1 className="text-3xl font-bold text-foreground mb-6">Secure Checkout</h1>
            
            <form onSubmit={handlePayment} className="space-y-6 bg-card border border-border rounded-2xl p-6 md:p-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
                  <input type="email" required placeholder="you@example.com" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Card Information</label>
                  <div className="relative">
                    <input type="text" required placeholder="Card number" className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    <CreditCard className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <input type="text" required placeholder="MM / YY" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    <input type="text" required placeholder="CVC" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Name on card</label>
                  <input type="text" required placeholder="John Doe" className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full py-3.5 px-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isProcessing ? "Processing..." : "Pay $29.00"}
                {!isProcessing && <Lock className="w-4 h-4" />}
              </button>
              
              <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3" /> Payments are secure and encrypted.
              </p>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="md:col-span-2">
            <div className="bg-muted/30 rounded-2xl p-6 border border-border sticky top-24">
              <h3 className="text-lg font-semibold text-foreground mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Pro Plan (Monthly)</span>
                  <span className="font-medium text-foreground">$29.00</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Setup fee</span>
                  <span className="font-medium text-foreground">$0.00</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <span className="text-base font-semibold text-foreground">Total due today</span>
                <span className="text-xl font-bold text-foreground">$29.00</span>
              </div>
              
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Full access to all Pro features</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span>Cancel anytime, no questions asked</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
