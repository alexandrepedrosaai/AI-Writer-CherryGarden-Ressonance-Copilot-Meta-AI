/**
 * Browser Notification Service
 * Handles requesting permission and sending notifications for habit reminders
 * Includes snooze functionality for delaying reminders
 */

interface SnoozedReminder {
  habitId: number;
  snoozedUntil: number; // timestamp
  snoozeInterval: number; // minutes
}

const SNOOZED_REMINDERS_KEY = 'habit_snoozed_reminders';

function getSnoozedReminders(): SnoozedReminder[] {
  try {
    const data = localStorage.getItem(SNOOZED_REMINDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to get snoozed reminders:', error);
    return [];
  }
}

function saveSnoozedReminders(reminders: SnoozedReminder[]): void {
  try {
    localStorage.setItem(SNOOZED_REMINDERS_KEY, JSON.stringify(reminders));
  } catch (error) {
    console.error('Failed to save snoozed reminders:', error);
  }
}

export function snoozeReminder(habitId: number, minutes: number): void {
  const snoozed = getSnoozedReminders();
  const now = Date.now();
  const snoozedUntil = now + minutes * 60 * 1000;

  // Remove existing snooze for this habit
  const filtered = snoozed.filter(r => r.habitId !== habitId);

  // Add new snooze
  filtered.push({
    habitId,
    snoozedUntil,
    snoozeInterval: minutes,
  });

  saveSnoozedReminders(filtered);
}

export function isReminderSnoozed(habitId: number): boolean {
  const snoozed = getSnoozedReminders();
  const reminder = snoozed.find(r => r.habitId === habitId);

  if (!reminder) return false;

  const now = Date.now();
  if (now >= reminder.snoozedUntil) {
    // Snooze expired, remove it
    const filtered = snoozed.filter(r => r.habitId !== habitId);
    saveSnoozedReminders(filtered);
    return false;
  }

  return true;
}

export function getSnoozedUntil(habitId: number): number | null {
  const snoozed = getSnoozedReminders();
  const reminder = snoozed.find(r => r.habitId === habitId);
  return reminder?.snoozedUntil ?? null;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendNotification(
  title: string,
  habitId: number,
  options?: NotificationOptions
): Notification | null {
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.log('Notification permission not granted');
    return null;
  }

  const notification = new Notification(title, {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    tag: `habit-${habitId}`,
    requireInteraction: true,
    ...options,
  });

  // Handle notification clicks
  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  return notification;
}

export function scheduleReminder(
  reminderTime: string, // HH:MM format
  habitName: string,
  habitId: number,
  snoozeIntervals: number[], // snooze options in minutes
  onReminder?: () => void
): () => void {
  // Parse reminder time
  const [hours, minutes] = reminderTime.split(':').map(Number);

  function checkAndNotify() {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    // Check if reminder is snoozed
    if (isReminderSnoozed(habitId)) {
      return;
    }

    if (currentHours === hours && currentMinutes === minutes) {
      const notification = sendNotification(
        `Time to complete: ${habitName}`,
        habitId,
        {
          body: 'Your daily habit reminder',
          actions: snoozeIntervals.map(interval => ({
            action: `snooze-${interval}`,
            title: `Snooze ${interval}m`,
          })),
        } as any
      );

      if (notification) {
        notification.onclose = () => {
          // Handle notification close
        };
      }

      if (onReminder) {
        onReminder();
      }
    }
  }

  // Check every minute
  const intervalId = setInterval(checkAndNotify, 60000);

  // Return cleanup function
  return () => clearInterval(intervalId);
}

export function scheduleReminders(
  reminders: Array<{
    id: number;
    habitId: number;
    habitName: string;
    reminderTime: string;
    enabled: boolean;
    snoozeIntervals?: number[];
  }>,
  onReminder?: (habitId: number) => void
): () => void {
  const cleanupFunctions: Array<() => void> = [];

  reminders.forEach(reminder => {
    if (reminder.enabled) {
      const cleanup = scheduleReminder(
        reminder.reminderTime,
        reminder.habitName,
        reminder.habitId,
        reminder.snoozeIntervals || [5, 10, 15],
        () => onReminder?.(reminder.habitId)
      );
      cleanupFunctions.push(cleanup);
    }
  });

  // Return cleanup function that clears all reminders
  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
}
