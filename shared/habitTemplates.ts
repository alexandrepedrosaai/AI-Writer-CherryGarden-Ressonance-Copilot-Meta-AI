/**
 * Habit Templates Library
 * Pre-built habit templates with metadata and suggestions
 */

export type HabitCategory = 'health' | 'fitness' | 'learning' | 'productivity' | 'mindfulness' | 'social' | 'creativity';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category: HabitCategory;
  difficulty: DifficultyLevel;
  icon: string;
  color: string;
  suggestedFrequency: 'daily' | 'weekly' | 'monthly';
  suggestedReminders: string[]; // HH:MM format
  tips: string[];
  benefits: string[];
  estimatedDuration: string; // e.g., "10 minutes"
}

export const HABIT_TEMPLATES: HabitTemplate[] = [
  // Health & Wellness
  {
    id: 'morning-meditation',
    name: 'Morning Meditation',
    description: 'Start your day with mindfulness and calm your mind',
    category: 'mindfulness',
    difficulty: 'easy',
    icon: 'circle',
    color: '#8b5cf6',
    suggestedFrequency: 'daily',
    suggestedReminders: ['06:00', '07:00'],
    tips: [
      'Find a quiet, comfortable place',
      'Start with just 5 minutes',
      'Focus on your breathing',
      'Use a meditation app if needed',
    ],
    benefits: [
      'Reduces stress and anxiety',
      'Improves focus and concentration',
      'Enhances emotional regulation',
      'Better sleep quality',
    ],
    estimatedDuration: '5-10 minutes',
  },
  {
    id: 'morning-exercise',
    name: 'Morning Exercise',
    description: 'Get your body moving with a morning workout routine',
    category: 'fitness',
    difficulty: 'medium',
    icon: 'circle',
    color: '#ef4444',
    suggestedFrequency: 'daily',
    suggestedReminders: ['06:30', '07:00'],
    tips: [
      'Start with light stretching',
      'Choose exercises you enjoy',
      'Stay hydrated',
      'Wear comfortable clothes',
    ],
    benefits: [
      'Increases energy levels',
      'Improves cardiovascular health',
      'Boosts metabolism',
      'Enhances mood',
    ],
    estimatedDuration: '20-30 minutes',
  },
  {
    id: 'drink-water',
    name: 'Drink Water',
    description: 'Stay hydrated throughout the day',
    category: 'health',
    difficulty: 'easy',
    icon: 'circle',
    color: '#06b6d4',
    suggestedFrequency: 'daily',
    suggestedReminders: ['09:00', '12:00', '15:00', '18:00'],
    tips: [
      'Drink at least 8 glasses daily',
      'Keep a water bottle with you',
      'Drink water before meals',
      'Add lemon or cucumber for flavor',
    ],
    benefits: [
      'Improves hydration',
      'Boosts energy',
      'Aids digestion',
      'Improves skin health',
    ],
    estimatedDuration: '2 minutes',
  },
  {
    id: 'healthy-eating',
    name: 'Eat Healthy',
    description: 'Maintain a balanced diet with nutritious meals',
    category: 'health',
    difficulty: 'medium',
    icon: 'circle',
    color: '#22c55e',
    suggestedFrequency: 'daily',
    suggestedReminders: ['08:00', '12:00', '18:00'],
    tips: [
      'Plan meals ahead',
      'Include vegetables in every meal',
      'Limit processed foods',
      'Practice portion control',
    ],
    benefits: [
      'Better nutrition',
      'Sustained energy',
      'Improved digestion',
      'Better weight management',
    ],
    estimatedDuration: '30-45 minutes',
  },
  {
    id: 'sleep-routine',
    name: 'Sleep Routine',
    description: 'Establish a consistent sleep schedule for better rest',
    category: 'health',
    difficulty: 'medium',
    icon: 'circle',
    color: '#6366f1',
    suggestedFrequency: 'daily',
    suggestedReminders: ['21:00', '22:00'],
    tips: [
      'Go to bed at the same time daily',
      'Avoid screens 1 hour before bed',
      'Keep bedroom cool and dark',
      'Try relaxation techniques',
    ],
    benefits: [
      'Better sleep quality',
      'Improved mood',
      'Enhanced cognitive function',
      'Stronger immune system',
    ],
    estimatedDuration: '7-9 hours',
  },

  // Learning & Productivity
  {
    id: 'reading',
    name: 'Reading',
    description: 'Expand your knowledge and imagination through reading',
    category: 'learning',
    difficulty: 'easy',
    icon: 'circle',
    color: '#f59e0b',
    suggestedFrequency: 'daily',
    suggestedReminders: ['19:00', '20:00'],
    tips: [
      'Choose books you enjoy',
      'Set a daily reading goal',
      'Find a quiet place',
      'Join a book club',
    ],
    benefits: [
      'Expands vocabulary',
      'Improves focus',
      'Reduces stress',
      'Enhances imagination',
    ],
    estimatedDuration: '20-30 minutes',
  },
  {
    id: 'learning-new-skill',
    name: 'Learn New Skill',
    description: 'Dedicate time to learning and mastering a new skill',
    category: 'learning',
    difficulty: 'hard',
    icon: 'circle',
    color: '#3b82f6',
    suggestedFrequency: 'daily',
    suggestedReminders: ['10:00', '14:00'],
    tips: [
      'Break learning into small steps',
      'Practice consistently',
      'Use multiple resources',
      'Track your progress',
    ],
    benefits: [
      'Personal growth',
      'Career advancement',
      'Increased confidence',
      'Mental stimulation',
    ],
    estimatedDuration: '30-60 minutes',
  },
  {
    id: 'journaling',
    name: 'Journaling',
    description: 'Reflect on your day and track your thoughts and feelings',
    category: 'mindfulness',
    difficulty: 'easy',
    icon: 'circle',
    color: '#ec4899',
    suggestedFrequency: 'daily',
    suggestedReminders: ['21:00', '22:00'],
    tips: [
      'Write freely without judgment',
      'Be honest about your feelings',
      'Write at the same time daily',
      'Reflect on your entries',
    ],
    benefits: [
      'Emotional clarity',
      'Stress relief',
      'Self-awareness',
      'Better memory',
    ],
    estimatedDuration: '10-15 minutes',
  },

  // Fitness & Movement
  {
    id: 'yoga',
    name: 'Yoga',
    description: 'Practice yoga for flexibility, strength, and mindfulness',
    category: 'fitness',
    difficulty: 'medium',
    icon: 'circle',
    color: '#8b5cf6',
    suggestedFrequency: 'daily',
    suggestedReminders: ['07:00', '18:00'],
    tips: [
      'Start with beginner poses',
      'Use a yoga mat',
      'Follow online tutorials',
      'Listen to your body',
    ],
    benefits: [
      'Increased flexibility',
      'Improved strength',
      'Reduced stress',
      'Better balance',
    ],
    estimatedDuration: '20-30 minutes',
  },
  {
    id: 'running',
    name: 'Running',
    description: 'Build endurance and cardiovascular fitness through running',
    category: 'fitness',
    difficulty: 'hard',
    icon: 'circle',
    color: '#ef4444',
    suggestedFrequency: 'daily',
    suggestedReminders: ['06:00', '17:00'],
    tips: [
      'Warm up before running',
      'Start at a comfortable pace',
      'Invest in good running shoes',
      'Track your distance',
    ],
    benefits: [
      'Cardiovascular health',
      'Weight management',
      'Stress relief',
      'Improved mood',
    ],
    estimatedDuration: '20-45 minutes',
  },
  {
    id: 'stretching',
    name: 'Stretching',
    description: 'Improve flexibility and reduce muscle tension with stretching',
    category: 'fitness',
    difficulty: 'easy',
    icon: 'circle',
    color: '#10b981',
    suggestedFrequency: 'daily',
    suggestedReminders: ['08:00', '18:00'],
    tips: [
      'Hold stretches for 20-30 seconds',
      'Never bounce while stretching',
      'Stretch after warming up',
      'Breathe deeply',
    ],
    benefits: [
      'Increased flexibility',
      'Reduced muscle tension',
      'Improved circulation',
      'Better posture',
    ],
    estimatedDuration: '10-15 minutes',
  },

  // Creativity & Social
  {
    id: 'creative-writing',
    name: 'Creative Writing',
    description: 'Express yourself through creative writing and storytelling',
    category: 'creativity',
    difficulty: 'medium',
    icon: 'circle',
    color: '#f59e0b',
    suggestedFrequency: 'daily',
    suggestedReminders: ['09:00', '19:00'],
    tips: [
      'Write without editing',
      'Use writing prompts',
      'Set a word count goal',
      'Read your work aloud',
    ],
    benefits: [
      'Enhanced creativity',
      'Improved writing skills',
      'Emotional expression',
      'Stress relief',
    ],
    estimatedDuration: '20-30 minutes',
  },
  {
    id: 'social-connection',
    name: 'Social Connection',
    description: 'Strengthen relationships by connecting with friends and family',
    category: 'social',
    difficulty: 'easy',
    icon: 'circle',
    color: '#ec4899',
    suggestedFrequency: 'daily',
    suggestedReminders: ['18:00', '19:00'],
    tips: [
      'Call or text a friend',
      'Schedule regular meetups',
      'Join a community group',
      'Practice active listening',
    ],
    benefits: [
      'Stronger relationships',
      'Improved mental health',
      'Reduced loneliness',
      'Better social skills',
    ],
    estimatedDuration: '15-30 minutes',
  },
  {
    id: 'gratitude-practice',
    name: 'Gratitude Practice',
    description: 'Cultivate positivity by reflecting on things you are grateful for',
    category: 'mindfulness',
    difficulty: 'easy',
    icon: 'circle',
    color: '#fbbf24',
    suggestedFrequency: 'daily',
    suggestedReminders: ['08:00', '20:00'],
    tips: [
      'Write 3 things you are grateful for',
      'Be specific about why',
      'Share gratitude with others',
      'Notice small positive moments',
    ],
    benefits: [
      'Increased happiness',
      'Improved perspective',
      'Better mental health',
      'Enhanced relationships',
    ],
    estimatedDuration: '5-10 minutes',
  },
];

export function getTemplatesByCategory(category: HabitCategory): HabitTemplate[] {
  return HABIT_TEMPLATES.filter(t => t.category === category);
}

export function searchTemplates(query: string): HabitTemplate[] {
  const lowerQuery = query.toLowerCase();
  return HABIT_TEMPLATES.filter(
    t =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tips.some(tip => tip.toLowerCase().includes(lowerQuery))
  );
}

export function getCategories(): HabitCategory[] {
  const categories = new Set<HabitCategory>();
  HABIT_TEMPLATES.forEach(t => categories.add(t.category));
  return Array.from(categories).sort();
}

export function getCategoryLabel(category: HabitCategory): string {
  const labels: Record<HabitCategory, string> = {
    health: 'Health & Wellness',
    fitness: 'Fitness',
    learning: 'Learning',
    productivity: 'Productivity',
    mindfulness: 'Mindfulness',
    social: 'Social',
    creativity: 'Creativity',
  };
  return labels[category];
}
