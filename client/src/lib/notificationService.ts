/**
 * Browser Notification Service
 * Handles requesting permission and sending notifications for habit reminders
 */

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

export function sendNotification(title: string, options?: NotificationOptions): Notification | null {
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.log('Notification permission not granted');
    return null;
  }

  return new Notification(title, {
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    ...options,
  });
}

export function scheduleReminder(
  reminderTime: string, // HH:MM format
  habitName: string,
  habitId: number,
  onReminder?: () => void
): () => void {
  // Parse reminder time
  const [hours, minutes] = reminderTime.split(':').map(Number);

  function checkAndNotify() {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();

    if (currentHours === hours && currentMinutes === minutes) {
      sendNotification(`Time to complete: ${habitName}`, {
        body: 'Your daily habit reminder',
        tag: `habit-${habitId}`,
        requireInteraction: true,
      });

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
  reminders: Array<{ id: number; habitId: number; habitName: string; reminderTime: string; enabled: boolean }>,
  onReminder?: (habitId: number) => void
): () => void {
  const cleanupFunctions: Array<() => void> = [];

  reminders.forEach(reminder => {
    if (reminder.enabled) {
      const cleanup = scheduleReminder(
        reminder.reminderTime,
        reminder.habitName,
        reminder.habitId,
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
