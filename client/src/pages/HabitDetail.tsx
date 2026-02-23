import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation, useRoute } from "wouter";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";

export default function HabitDetail() {
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [, params] = useRoute("/habit/:id");
  const habitId = params?.id ? parseInt(params.id) : null;

  if (!isAuthenticated || !habitId) {
    navigate("/");
    return null;
  }

  const { data: habit, isLoading } = trpc.habits.get.useQuery({ id: habitId });
  const { data: completions = [] } = trpc.completions.getByHabit.useQuery({
    habitId,
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="h-40 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (!habit) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-semibold mb-2">Habit not found</h2>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalCompletions = completions.length;
  const completionRate = totalCompletions > 0 ? Math.round((totalCompletions / 90) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container flex items-center gap-4 h-16">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-accent/10 rounded-lg transition-smooth"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-serif font-semibold">{habit.name}</h1>
            <p className="text-xs text-muted-foreground">{habit.frequency}</p>
          </div>
        </div>
      </header>

      <div className="container py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 border-border/50">
            <p className="text-sm text-muted-foreground mb-2">Total Completions</p>
            <p className="text-4xl font-serif font-bold text-accent">{totalCompletions}</p>
            <p className="text-xs text-muted-foreground mt-2">Last 90 days</p>
          </Card>

          <Card className="p-6 border-border/50">
            <p className="text-sm text-muted-foreground mb-2">Completion Rate</p>
            <p className="text-4xl font-serif font-bold text-accent">{completionRate}%</p>
            <p className="text-xs text-muted-foreground mt-2">90-day average</p>
          </Card>

          <Card className="p-6 border-border/50">
            <p className="text-sm text-muted-foreground mb-2">Description</p>
            <p className="text-sm font-medium">{habit.description || "No description"}</p>
          </Card>
        </div>

        {/* Calendar Grid */}
        <Card className="p-6 border-border/50">
          <h2 className="text-xl font-serif font-semibold mb-6">Last 90 Days</h2>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 90 }).map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (89 - i));
              const dateStr = date.toISOString().split('T')[0];
              const isCompleted = completions.some(c => String(c.completedDate) === dateStr);

              return (
                <div
                  key={i}
                  className="aspect-square rounded-lg flex items-center justify-center text-xs font-medium"
                  style={{
                    backgroundColor: isCompleted ? habit.color : '#f0f0f0',
                    color: isCompleted ? 'white' : '#999',
                  }}
                  title={dateStr}
                >
                  {isCompleted ? '✓' : ''}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Recent Completions */}
        <Card className="p-6 border-border/50">
          <h2 className="text-xl font-serif font-semibold mb-6">Recent Completions</h2>
          {completions.length === 0 ? (
            <p className="text-muted-foreground">No completions yet</p>
          ) : (
            <div className="space-y-2">
              {completions.slice(-10).reverse().map(completion => (
                <div key={completion.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                  <span className="text-sm">{String(completion.completedDate)}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
