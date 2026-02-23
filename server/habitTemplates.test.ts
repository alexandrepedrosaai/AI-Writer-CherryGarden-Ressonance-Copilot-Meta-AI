import { describe, it, expect } from 'vitest';
import {
  HABIT_TEMPLATES,
  getTemplatesByCategory,
  searchTemplates,
  getCategories,
  getCategoryLabel,
  type HabitCategory,
} from '../shared/habitTemplates';

describe('Habit Templates Library', () => {
  it('should have templates defined', () => {
    expect(HABIT_TEMPLATES.length).toBeGreaterThan(0);
  });

  it('should have all required fields on each template', () => {
    HABIT_TEMPLATES.forEach(template => {
      expect(template.id).toBeDefined();
      expect(template.name).toBeDefined();
      expect(template.description).toBeDefined();
      expect(template.category).toBeDefined();
      expect(template.difficulty).toBeDefined();
      expect(template.icon).toBeDefined();
      expect(template.color).toBeDefined();
      expect(template.suggestedFrequency).toBeDefined();
      expect(template.suggestedReminders).toBeDefined();
      expect(template.tips).toBeDefined();
      expect(template.benefits).toBeDefined();
      expect(template.estimatedDuration).toBeDefined();
    });
  });

  it('should have unique template IDs', () => {
    const ids = HABIT_TEMPLATES.map(t => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should filter templates by category', () => {
    const healthTemplates = getTemplatesByCategory('health');
    expect(healthTemplates.length).toBeGreaterThan(0);
    healthTemplates.forEach(template => {
      expect(template.category).toBe('health');
    });
  });

  it('should search templates by name', () => {
    const results = searchTemplates('meditation');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(t => t.name.toLowerCase().includes('meditation'))).toBe(true);
  });

  it('should search templates by description', () => {
    const results = searchTemplates('flexibility');
    expect(results.length).toBeGreaterThan(0);
  });

  it('should search templates by tips', () => {
    const results = searchTemplates('breathing');
    expect(results.length).toBeGreaterThan(0);
  });

  it('should return empty array for non-matching search', () => {
    const results = searchTemplates('xyzabc123notfound');
    expect(results.length).toBe(0);
  });

  it('should return all categories', () => {
    const categories = getCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(categories).toContain('health');
    expect(categories).toContain('fitness');
    expect(categories).toContain('learning');
  });

  it('should have valid category labels', () => {
    const categories = getCategories();
    categories.forEach(category => {
      const label = getCategoryLabel(category);
      expect(label).toBeDefined();
      expect(label.length).toBeGreaterThan(0);
    });
  });

  it('should have valid difficulty levels', () => {
    const validDifficulties = ['easy', 'medium', 'hard'];
    HABIT_TEMPLATES.forEach(template => {
      expect(validDifficulties).toContain(template.difficulty);
    });
  });

  it('should have valid frequencies', () => {
    const validFrequencies = ['daily', 'weekly', 'monthly'];
    HABIT_TEMPLATES.forEach(template => {
      expect(validFrequencies).toContain(template.suggestedFrequency);
    });
  });

  it('should have valid icons', () => {
    const validIcons = ['circle', 'star', 'heart', 'flame', 'target', 'zap', 'check'];
    HABIT_TEMPLATES.forEach(template => {
      expect(validIcons).toContain(template.icon);
    });
  });

  it('should have valid hex colors', () => {
    const hexColorRegex = /^#[0-9A-F]{6}$/i;
    HABIT_TEMPLATES.forEach(template => {
      expect(template.color).toMatch(hexColorRegex);
    });
  });

  it('should have at least one suggested reminder', () => {
    HABIT_TEMPLATES.forEach(template => {
      expect(template.suggestedReminders.length).toBeGreaterThan(0);
    });
  });

  it('should have at least one tip', () => {
    HABIT_TEMPLATES.forEach(template => {
      expect(template.tips.length).toBeGreaterThan(0);
    });
  });

  it('should have at least one benefit', () => {
    HABIT_TEMPLATES.forEach(template => {
      expect(template.benefits.length).toBeGreaterThan(0);
    });
  });

  it('should have valid time format for reminders', () => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    HABIT_TEMPLATES.forEach(template => {
      template.suggestedReminders.forEach(reminder => {
        expect(reminder).toMatch(timeRegex);
      });
    });
  });

  it('should have diverse templates across categories', () => {
    const categories = getCategories();
    categories.forEach(category => {
      const templatesInCategory = getTemplatesByCategory(category);
      expect(templatesInCategory.length).toBeGreaterThan(0);
    });
  });
});
