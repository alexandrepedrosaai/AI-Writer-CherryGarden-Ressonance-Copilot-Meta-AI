import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { Plus, LogOut, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import HabitCard from "@/components/HabitCard";
import CreateHabitDialog from "@/components/CreateHabitDialog";
import { requestNotificationPermission } from "@/lib/notificationService";
import TemplatesBrowser from "@/components/TemplatesBrowser";
import { HABIT_TEMPLATES, type HabitTemplate } from "@shared/habitTemplates";

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

  const [showNotificationBanner, setShowNotificationBanner] = useState(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission !== 'granted'
  );
  const [showTemplates, setShowTemplates] = useState(false);

  const handleSelectTemplate = (template: HabitTemplate) => {
    setShowCreateDialog(true);
    setShowTemplates(false);
  };

  useEffect(() => {
    requestNotificationPermission().catch(console.error);
  }, []);

  // Calculate today's completion stats
  const completedToday = 0; // Will be calculated from completion queries

  const completionPercentage = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {showNotificationBanner && (
        <div className="bg-accent/10 border-b border-accent/20 px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-accent-foreground">Enable notifications to get habit reminders</p>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                const granted = await requestNotificationPermission();
                if (granted) {
                  setShowNotificationBanner(false);
                }
              }}
              className="text-xs font-medium px-3 py-1 bg-accent text-accent-foreground rounded hover:opacity-90"
            >
              Enable
            </button>
            <button
              onClick={() => setShowNotificationBanner(false)}
              className="text-xs font-medium px-3 py-1 hover:bg-accent/10 rounded"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

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
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-serif font-semibold mb-4">Get Started with Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {HABIT_TEMPLATES.slice(0, 6).map(template => (
                  <button
                    key={template.id}
                    onClick={() => setShowTemplates(true)}
                    className="p-4 rounded-lg border border-border/50 hover:border-accent/50 transition-smooth text-left group"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-110 transition-smooth"
                        style={{ backgroundColor: `${template.color}20` }}
                      >
                        {template.icon === 'circle' ? '●' : '◆'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-1">{template.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">{template.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => setShowTemplates(true)}
              >
                Browse All Templates
              </Button>
            </div>
            <div className="text-center py-8">
              <h3 className="text-xl font-serif font-semibold mb-2">Or create a custom habit</h3>
              <p className="text-muted-foreground mb-6">
                Build your own habit from scratch with custom settings.
              </p>
              <Button onClick={() => setShowCreateDialog(true)} size="lg">
                Create Custom Habit
              </Button>
            </div>
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

      {/* Templates Browser */}
      <TemplatesBrowser
        open={showTemplates}
        onOpenChange={setShowTemplates}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}
