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
import { Bell, Trash2 } from "lucide-react";

interface ReminderDialogProps {
  habitId: number;
  habitName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function ReminderDialog({
  habitId,
  habitName,
  open,
  onOpenChange,
  onSuccess,
}: ReminderDialogProps) {
  const [reminderTime, setReminderTime] = useState("09:00");
  const [reminders, setReminders] = useState<Reminder[]>([]);

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Set Reminders for {habitName}
          </DialogTitle>
          <DialogDescription>
            Get notified at specific times to complete this habit.
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
