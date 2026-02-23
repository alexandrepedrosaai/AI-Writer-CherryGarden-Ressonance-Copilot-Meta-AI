import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  HABIT_TEMPLATES,
  getCategories,
  getCategoryLabel,
  searchTemplates,
  type HabitTemplate,
  type HabitCategory,
} from '@shared/habitTemplates';
import { Search, ChevronRight } from 'lucide-react';

interface TemplatesBrowserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: HabitTemplate) => void;
}

export default function TemplatesBrowser({
  open,
  onOpenChange,
  onSelectTemplate,
}: TemplatesBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HabitCategory | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<HabitTemplate | null>(null);

  const categories = useMemo(() => getCategories(), []);

  const filteredTemplates = useMemo(() => {
    let templates = HABIT_TEMPLATES;

    if (searchQuery) {
      templates = searchTemplates(searchQuery);
    } else if (selectedCategory) {
      templates = templates.filter(t => t.category === selectedCategory);
    }

    return templates;
  }, [searchQuery, selectedCategory]);

  const handleSelectTemplate = (template: HabitTemplate) => {
    onSelectTemplate(template);
    onOpenChange(false);
    setSearchQuery('');
    setSelectedCategory(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Habit Templates Library</DialogTitle>
          <DialogDescription>
            Choose from our curated collection of habit templates to get started quickly
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedCategory(null);
              }}
              className="pl-10"
            />
          </div>

          {/* Category filters */}
          {!searchQuery && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {getCategoryLabel(category)}
                </Button>
              ))}
            </div>
          )}

          {/* Templates grid */}
          {selectedTemplate ? (
            // Template detail view
            <div className="space-y-6">
              <Button
                variant="outline"
                onClick={() => setSelectedTemplate(null)}
              >
                ← Back to Templates
              </Button>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${selectedTemplate.color}20` }}
                  >
                    {selectedTemplate.icon === 'circle' ? '●' : '◆'}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-serif font-bold mb-2">
                      {selectedTemplate.name}
                    </h2>
                    <p className="text-muted-foreground mb-3">
                      {selectedTemplate.description}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline">
                        {getCategoryLabel(selectedTemplate.category)}
                      </Badge>
                      <Badge variant="outline">
                        {selectedTemplate.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {selectedTemplate.estimatedDuration}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Benefits</h3>
                  <ul className="space-y-1">
                    {selectedTemplate.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tips */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Tips for Success</h3>
                  <ul className="space-y-1">
                    {selectedTemplate.tips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suggested reminders */}
                <div className="space-y-2">
                  <h3 className="font-semibold">Suggested Reminders</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.suggestedReminders.map((time, idx) => (
                      <Badge key={idx} variant="secondary">
                        {time}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => handleSelectTemplate(selectedTemplate)}
                  className="w-full"
                  size="lg"
                >
                  Create Habit from Template
                </Button>
              </div>
            </div>
          ) : (
            // Templates list
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredTemplates.map(template => (
                <Card
                  key={template.id}
                  className="p-4 cursor-pointer hover:border-accent/50 transition-smooth"
                  onClick={() => setSelectedTemplate(template)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: `${template.color}20` }}
                    >
                      {template.icon === 'circle' ? '●' : '◆'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                        {template.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {template.difficulty}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {filteredTemplates.length === 0 && !selectedTemplate && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No templates found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
