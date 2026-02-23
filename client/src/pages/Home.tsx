import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { CheckCircle2, Sparkles, TrendingUp, Zap } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (isAuthenticated && user) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Navigation */}
      <nav className="border-b border-border/40 backdrop-blur-sm">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent-foreground" />
            </div>
            <h1 className="text-xl font-serif font-semibold">Habit Tracker</h1>
          </div>
          <a href={getLoginUrl()}>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-serif font-bold tracking-tight">
              Build Better Habits,{" "}
              <span className="bg-gradient-to-r from-accent to-purple-600 bg-clip-text text-transparent">
                One Day at a Time
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Track your daily habits with an elegant, intuitive interface. Get insights,
              celebrate streaks, and transform your life through consistent action.
            </p>
          </div>

          <a href={getLoginUrl()}>
            <Button size="lg" className="h-12 px-8 text-base">
              Get Started Free
            </Button>
          </a>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-smooth">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-serif font-semibold text-lg mb-2">Easy Tracking</h3>
            <p className="text-muted-foreground">
              Mark habits complete with a single click. Simple, elegant, and distraction-free.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-smooth">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-serif font-semibold text-lg mb-2">Streak Tracking</h3>
            <p className="text-muted-foreground">
              Visualize your progress with streaks, calendars, and detailed statistics.
            </p>
          </div>

          <div className="p-6 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm hover:border-accent/50 transition-smooth">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-serif font-semibold text-lg mb-2">AI Insights</h3>
            <p className="text-muted-foreground">
              Get personalized suggestions and motivational messages powered by AI.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container py-20">
        <div className="max-w-2xl mx-auto text-center p-8 rounded-2xl border border-accent/20 bg-accent/5">
          <h3 className="text-3xl font-serif font-bold mb-4">Ready to transform your habits?</h3>
          <p className="text-muted-foreground mb-6">
            Start tracking today and see the power of consistency.
          </p>
          <a href={getLoginUrl()}>
            <Button size="lg" className="h-12 px-8">
              Sign In to Get Started
            </Button>
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 mt-20">
        <div className="container text-center text-muted-foreground text-sm">
          <p>© 2026 Habit Tracker. Built with elegance and purpose.</p>
        </div>
      </footer>
    </div>
  );
}
