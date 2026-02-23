import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Plus, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import HabitCard from "@/components/HabitCard";
import CreateHabitDialog from "@/components/CreateHabitDialog";

export default function Dashboard() {
  const { user, logout, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!isAuthenticated || !user) {
    navigate("/");
    return null;
  }

  const { data: habits = [], isLoading, refetch } = trpc.habits.list.useQuery();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleHabitCreated = () => {
    setShowCreateDialog(false);
    refetch();
  };

  // Calculate today's completion stats
  const completedToday = 0; // Will be calculated from completion queries

  const completionPercentage = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-accent/10 rounded-lg transition-smooth"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-serif font-semibold">Dashboard</h1>
              <p className="text-xs text-muted-foreground">
                {completedToday} of {habits.length} habits completed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowCreateDialog(true)}
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              New Habit
            </Button>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-accent/10 rounded-lg transition-smooth"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Today's Overview Card */}
        <Card className="mb-8 p-6 border-border/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-2">Today's Progress</h2>
              <p className="text-muted-foreground">
                You've completed {completedToday} out of {habits.length} habits
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-serif font-bold text-accent">
                {completionPercentage}%
              </div>
              <p className="text-sm text-muted-foreground">Complete</p>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-4 w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-purple-600 transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </Card>

        {/* Habits Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : habits.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl font-serif font-semibold mb-2">No habits yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first habit to get started on your journey.
            </p>
            <Button onClick={() => setShowCreateDialog(true)} size="lg">
              Create Your First Habit
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onUpdate={refetch}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Habit Dialog */}
      <CreateHabitDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleHabitCreated}
      />
    </div>
  );
}
