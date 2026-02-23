import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  snoozeReminder,
  isReminderSnoozed,
  getSnoozedUntil,
} from './notificationService';

describe('Snooze Functionality', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it('should snooze a reminder for specified minutes', () => {
    const habitId = 1;
    const minutes = 5;

    snoozeReminder(habitId, minutes);

    expect(isReminderSnoozed(habitId)).toBe(true);
  });

  it('should return snoozed until timestamp', () => {
    const habitId = 1;
    const minutes = 10;
    const now = Date.now();

    snoozeReminder(habitId, minutes);

    const snoozedUntil = getSnoozedUntil(habitId);
    expect(snoozedUntil).not.toBeNull();
    expect(snoozedUntil).toBeGreaterThan(now);
    expect(snoozedUntil).toBeLessThanOrEqual(now + minutes * 60 * 1000);
  });

  it('should expire snooze after specified time', () => {
    const habitId = 1;
    const minutes = 5;

    snoozeReminder(habitId, minutes);
    expect(isReminderSnoozed(habitId)).toBe(true);

    // Advance time past snooze duration
    vi.advanceTimersByTime(minutes * 60 * 1000 + 1000);

    expect(isReminderSnoozed(habitId)).toBe(false);
  });

  it('should handle multiple snoozed reminders', () => {
    const habit1 = 1;
    const habit2 = 2;

    snoozeReminder(habit1, 5);
    snoozeReminder(habit2, 10);

    expect(isReminderSnoozed(habit1)).toBe(true);
    expect(isReminderSnoozed(habit2)).toBe(true);
  });

  it('should update snooze for same habit', () => {
    const habitId = 1;

    snoozeReminder(habitId, 5);
    const firstSnooze = getSnoozedUntil(habitId);

    vi.advanceTimersByTime(1000);

    snoozeReminder(habitId, 10);
    const secondSnooze = getSnoozedUntil(habitId);

    expect(secondSnooze).toBeGreaterThan(firstSnooze!);
  });

  it('should handle localStorage errors gracefully', () => {
    const habitId = 1;

    // Mock localStorage to throw error
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = vi.fn(() => {
      throw new Error('Storage full');
    });

    // Should not throw
    expect(() => snoozeReminder(habitId, 5)).not.toThrow();

    // Restore
    localStorage.setItem = originalSetItem;
  });

  it('should return null for non-snoozed reminder', () => {
    const habitId = 999;

    const snoozedUntil = getSnoozedUntil(habitId);

    expect(snoozedUntil).toBeNull();
  });

  it('should return false for non-snoozed reminder check', () => {
    const habitId = 999;

    const isSnoozed = isReminderSnoozed(habitId);

    expect(isSnoozed).toBe(false);
  });
});
