import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Habit } from "@shared/types";
import { CheckCircle2, Circle, MoreVertical } from "lucide-react";
import { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditHabitDialog from "./EditHabitDialog";
import ReminderDialog from "./ReminderDialog";
import { toast } from "sonner";

interface HabitCardProps {
  habit: Habit;
  onUpdate: () => void;
}

export default function HabitCard({ habit, onUpdate }: HabitCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);
  const toggleMutation = trpc.completions.toggleToday.useMutation();
  const checkTodayQuery = trpc.completions.checkToday.useQuery({ habitId: habit.id });
  const deleteMutation = trpc.habits.delete.useMutation();

  const isCompletedToday = checkTodayQuery.data ?? false;

  // Calculate streak
  const streak = useMemo(() => {
    let count = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      // This is a simplified check - in production, you'd want to fetch completions
      if (i === 0 && isCompletedToday) {
        count++;
      } else if (i > 0) {
        // Would need to fetch historical data
        break;
      }
    }
    
    return count;
  }, [isCompletedToday]);

  const handleToggle = async () => {
    try {
      await toggleMutation.mutateAsync({ habitId: habit.id });
      onUpdate();
      toast.success(isCompletedToday ? "Habit unmarked" : "Great job! Habit completed");
    } catch (error) {
      toast.error("Failed to update habit");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({ id: habit.id });
      onUpdate();
      toast.success("Habit deleted");
    } catch (error) {
      toast.error("Failed to delete habit");
    }
  };

  return (
    <>
      <Card className="p-6 border-border/50 hover:border-accent/50 transition-smooth cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-serif font-semibold text-lg mb-1">{habit.name}</h3>
            {habit.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {habit.description}
              </p>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-accent/10 rounded-lg opacity-0 group-hover:opacity-100 transition-smooth">
                <MoreVertical className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setReminderOpen(true)}>
                Set Reminder
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Frequency badge */}
        <div className="mb-4">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-accent/10 text-accent rounded-full">
            {habit.frequency}
          </span>
        </div>

        {/* Streak info */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Current Streak</p>
            <p className="text-2xl font-serif font-bold text-accent">
              {streak} days
            </p>
          </div>
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${habit.color}20` }}
          >
            <span className="text-2xl">{habit.icon === 'circle' ? '●' : '◆'}</span>
          </div>
        </div>

        {/* Complete button */}
        <Button
          onClick={handleToggle}
          variant={isCompletedToday ? "default" : "outline"}
          className="w-full gap-2"
          disabled={toggleMutation.isPending}
        >
          {isCompletedToday ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Completed Today
            </>
          ) : (
            <>
              <Circle className="w-4 h-4" />
              Mark Complete
            </>
          )}
        </Button>
      </Card>

      <EditHabitDialog
        habit={habit}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSuccess={onUpdate}
      />

      <ReminderDialog
        habitId={habit.id}
        habitName={habit.name}
        open={reminderOpen}
        onOpenChange={setReminderOpen}
        onSuccess={onUpdate}
      />
    </>
  );
}
