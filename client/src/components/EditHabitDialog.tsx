import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Habit } from "@shared/types";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const COLORS = [
  "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4", "#ef4444",
];

interface EditHabitDialogProps {
  habit: Habit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function EditHabitDialog({
  habit,
  open,
  onOpenChange,
  onSuccess,
}: EditHabitDialogProps) {
  const [name, setName] = useState(habit.name);
  const [description, setDescription] = useState(habit.description || "");
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>(habit.frequency);
  const [color, setColor] = useState(habit.color);

  const updateMutation = trpc.habits.update.useMutation();

  useEffect(() => {
    if (open) {
      setName(habit.name);
      setDescription(habit.description || "");
      setFrequency(habit.frequency);
      setColor(habit.color);
    }
  }, [open, habit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a habit name");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        id: habit.id,
        name: name.trim(),
        description: description.trim() || undefined,
        frequency: frequency as "daily" | "weekly" | "monthly",
        color,
      });

      onOpenChange(false);
      onSuccess();
      toast.success("Habit updated successfully!");
    } catch (error) {
      toast.error("Failed to update habit");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
          <DialogDescription>
            Update your habit details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Habit Name *</label>
            <Input
              placeholder="e.g., Morning Exercise"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={updateMutation.isPending}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Add details about this habit..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={updateMutation.isPending}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Frequency</label>
            <Select value={frequency} onValueChange={(value) => setFrequency(value as 'daily' | 'weekly' | 'monthly')}>
              <SelectTrigger disabled={updateMutation.isPending}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Color</label>
            <div className="flex gap-2 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-smooth ${
                    color === c ? "border-accent" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                  disabled={updateMutation.isPending}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
