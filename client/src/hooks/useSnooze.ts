import { useEffect, useState } from 'react';
import { snoozeReminder, isReminderSnoozed, getSnoozedUntil } from '@/lib/notificationService';

interface SnoozeState {
  habitId: number;
  isSnoozed: boolean;
  snoozedUntil: number | null;
  timeRemaining: string;
}

export function useSnooze(habitId: number) {
  const [snoozeState, setSnoozeState] = useState<SnoozeState>({
    habitId,
    isSnoozed: false,
    snoozedUntil: null,
    timeRemaining: '',
  });

  // Update snooze state periodically
  useEffect(() => {
    const updateSnoozeState = () => {
      const isSnoozed = isReminderSnoozed(habitId);
      const snoozedUntil = getSnoozedUntil(habitId);

      let timeRemaining = '';
      if (isSnoozed && snoozedUntil) {
        const now = Date.now();
        const remaining = snoozedUntil - now;

        if (remaining > 0) {
          const minutes = Math.floor(remaining / 60000);
          const seconds = Math.floor((remaining % 60000) / 1000);
          timeRemaining = `${minutes}m ${seconds}s`;
        }
      }

      setSnoozeState({
        habitId,
        isSnoozed,
        snoozedUntil,
        timeRemaining,
      });
    };

    updateSnoozeState();

    // Update every second if snoozed
    const interval = setInterval(updateSnoozeState, 1000);

    return () => clearInterval(interval);
  }, [habitId]);

  const handleSnooze = (minutes: number) => {
    snoozeReminder(habitId, minutes);
    setSnoozeState(prev => ({
      ...prev,
      isSnoozed: true,
      snoozedUntil: Date.now() + minutes * 60 * 1000,
    }));
  };

  return {
    ...snoozeState,
    snooze: handleSnooze,
  };
}
