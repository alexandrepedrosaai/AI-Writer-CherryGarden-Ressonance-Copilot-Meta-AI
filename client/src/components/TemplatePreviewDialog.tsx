import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type HabitTemplate, getCategoryLabel } from '@shared/habitTemplates';

interface TemplatePreviewDialogProps {
  template: HabitTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateFromTemplate: (template: HabitTemplate) => void;
}

export default function TemplatePreviewDialog({
  template,
  open,
  onOpenChange,
  onCreateFromTemplate,
}: TemplatePreviewDialogProps) {
  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Template Preview</DialogTitle>
          <DialogDescription>
            Review the template details before creating the habit
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with icon */}
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl flex-shrink-0"
              style={{ backgroundColor: `${template.color}20` }}
            >
              {template.icon === 'circle' ? '●' : '◆'}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-serif font-bold mb-2">
                {template.name}
              </h2>
              <p className="text-sm text-muted-foreground mb-3">
                {template.description}
              </p>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {getCategoryLabel(template.category)}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {template.difficulty}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {template.estimatedDuration}
                </Badge>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Benefits</h3>
            <ul className="space-y-1">
              {template.benefits.map((benefit, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-accent mt-1">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Tips for Success</h3>
            <ul className="space-y-1">
              {template.tips.map((tip, idx) => (
                <li key={idx} className="text-sm text-muted-foreground">
                  • {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Suggested reminders */}
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Suggested Reminders</h3>
            <div className="flex flex-wrap gap-2">
              {template.suggestedReminders.map((time, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {time}
                </Badge>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onCreateFromTemplate(template);
                onOpenChange(false);
              }}
            >
              Create Habit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
