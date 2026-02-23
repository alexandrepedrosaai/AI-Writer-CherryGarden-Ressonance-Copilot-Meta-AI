/**
 * Service Worker for handling notification events
 * Manages snooze actions and notification interactions
 */

const SNOOZED_REMINDERS_KEY = 'habit_snoozed_reminders';

self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const action = event.action;

  // Handle snooze actions
  if (action && action.startsWith('snooze-')) {
    const minutes = parseInt(action.replace('snooze-', ''));
    const habitId = parseInt(notification.tag.replace('habit-', ''));

    // Store snooze in IndexedDB or localStorage
    const now = Date.now();
    const snoozedUntil = now + minutes * 60 * 1000;

    // Try to get existing snoozed reminders
    try {
      const data = localStorage.getItem(SNOOZED_REMINDERS_KEY);
      const snoozed = data ? JSON.parse(data) : [];

      // Remove existing snooze for this habit
      const filtered = snoozed.filter(r => r.habitId !== habitId);

      // Add new snooze
      filtered.push({
        habitId,
        snoozedUntil,
        snoozeInterval: minutes,
      });

      localStorage.setItem(SNOOZED_REMINDERS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to store snooze:', error);
    }

    notification.close();
  } else {
    // Default: focus window and close notification
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
    notification.close();
  }
});

self.addEventListener('notificationclose', (event) => {
  // Handle notification dismissal
  console.log('Notification closed:', event.notification.tag);
});
