import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { trpc } from "@/lib/trpc";
import { Reminder } from "@shared/types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Bell, Trash2, X } from "lucide-react";

interface ReminderDialogProps {
  habitId: number;
  habitName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  defaultSnoozeIntervals?: number[];
}

export default function ReminderDialog({
  habitId,
  habitName,
  open,
  onOpenChange,
  onSuccess,
  defaultSnoozeIntervals = [5, 10, 15],
}: ReminderDialogProps) {
  const [reminderTime, setReminderTime] = useState("09:00");
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [snoozeIntervals, setSnoozeIntervals] = useState<number[]>(defaultSnoozeIntervals);
  const [snoozeInput, setSnoozeInput] = useState("");

  const listQuery = trpc.reminders.listByHabit.useQuery({ habitId }, { enabled: open });
  const createMutation = trpc.reminders.create.useMutation();
  const toggleMutation = trpc.reminders.toggle.useMutation();
  const deleteMutation = trpc.reminders.delete.useMutation();

  useEffect(() => {
    if (listQuery.data) {
      setReminders(listQuery.data);
    }
  }, [listQuery.data]);

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reminderTime) {
      toast.error("Please select a time");
      return;
    }

    try {
      await createMutation.mutateAsync({
        habitId,
        reminderTime,
      });

      setReminderTime("09:00");
      listQuery.refetch();
      onSuccess();
      toast.success("Reminder created!");
    } catch (error) {
      toast.error("Failed to create reminder");
    }
  };

  const handleToggleReminder = async (reminderId: number, enabled: boolean) => {
    try {
      await toggleMutation.mutateAsync({
        id: reminderId,
        enabled: !enabled,
      });

      listQuery.refetch();
      toast.success(enabled ? "Reminder disabled" : "Reminder enabled");
    } catch (error) {
      toast.error("Failed to update reminder");
    }
  };

  const handleDeleteReminder = async (reminderId: number) => {
    try {
      await deleteMutation.mutateAsync({ id: reminderId });
      listQuery.refetch();
      toast.success("Reminder deleted");
    } catch (error) {
      toast.error("Failed to delete reminder");
    }
  };

  const handleAddSnoozeInterval = () => {
    const num = parseInt(snoozeInput);
    if (num > 0 && num <= 120 && !snoozeIntervals.includes(num)) {
      setSnoozeIntervals([...snoozeIntervals, num].sort((a, b) => a - b));
      setSnoozeInput("");
      toast.success(`Added ${num} minute snooze option`);
    } else if (snoozeIntervals.includes(num)) {
      toast.error("This snooze interval already exists");
    } else {
      toast.error("Please enter a value between 1 and 120");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Reminders for {habitName}
          </DialogTitle>
          <DialogDescription>
            Set reminder times and configure snooze options.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Create new reminder */}
          <form onSubmit={handleCreateReminder} className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div>
              <label className="text-sm font-medium">Reminder Time</label>
              <Input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                disabled={createMutation.isPending}
                className="mt-2"
              />
            </div>

            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full"
            >
              {createMutation.isPending ? "Creating..." : "Add Reminder"}
            </Button>
          </form>

          {/* Snooze interval settings */}
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <label className="text-sm font-medium">Snooze Options (minutes)</label>
            <div className="flex flex-wrap gap-2">
              {snoozeIntervals.map((interval, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-background px-3 py-2 rounded border border-border"
                >
                  <span className="text-sm font-medium">{interval}</span>
                  <button
                    onClick={() => setSnoozeIntervals(snoozeIntervals.filter((_, i) => i !== idx))}
                    className="text-destructive hover:bg-destructive/10 p-0.5 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                max="120"
                placeholder="Add interval (e.g., 5)"
                value={snoozeInput}
                onChange={(e) => setSnoozeInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddSnoozeInterval();
                  }
                }}
                className="text-sm"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSnoozeInterval}
              >
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              These intervals will appear as snooze buttons in notifications
            </p>
          </div>

          {/* List existing reminders */}
          {reminders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">No reminders set yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium">Active Reminders</p>
              {reminders.map(reminder => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Switch
                      checked={reminder.enabled}
                      onCheckedChange={() =>
                        handleToggleReminder(reminder.id, reminder.enabled)
                      }
                      disabled={toggleMutation.isPending}
                    />
                    <span className="font-mono text-sm font-medium">
                      {reminder.reminderTime}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteReminder(reminder.id)}
                    disabled={deleteMutation.isPending}
                    className="p-1 hover:bg-destructive/10 rounded-lg transition-smooth text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
