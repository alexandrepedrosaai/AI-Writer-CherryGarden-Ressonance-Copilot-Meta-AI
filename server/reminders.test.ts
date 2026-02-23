import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const mockUser = {
  id: 1,
  openId: "test-user-123",
  email: "test@example.com",
  name: "Test User",
  loginMethod: "manus",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

function createMockContext(): TrpcContext {
  return {
    user: mockUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Reminder Management API", () => {
  it("should create a reminder for a habit", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // First create a habit
    const habitResult = await caller.habits.create({
      name: "Morning Meditation",
      description: "10 minutes of meditation",
      frequency: "daily",
      color: "#8b5cf6",
      icon: "circle",
    });

    const habitId = habitResult[0]?.insertId || 1;

    // Create a reminder
    const result = await caller.reminders.create({
      habitId,
      reminderTime: "08:00",
    });

    expect(result).toBeDefined();
  });

  it("should list reminders by habit", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const habits = await caller.habits.list();
    if (habits.length === 0) return;

    const reminders = await caller.reminders.listByHabit({ habitId: habits[0].id });

    expect(Array.isArray(reminders)).toBe(true);
  });

  it("should list reminders by user", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const reminders = await caller.reminders.listByUser();

    expect(Array.isArray(reminders)).toBe(true);
  });

  it("should toggle reminder enabled state", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const reminders = await caller.reminders.listByUser();
    if (reminders.length === 0) return;

    const reminder = reminders[0];
    const initialState = reminder.enabled;

    await caller.reminders.toggle({
      id: reminder.id,
      enabled: !initialState,
    });

    const updated = await caller.reminders.listByUser();
    const updatedReminder = updated.find(r => r.id === reminder.id);

    expect(updatedReminder?.enabled).toBe(!initialState);
  });

  it("should update reminder time", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const reminders = await caller.reminders.listByUser();
    if (reminders.length === 0) return;

    const reminder = reminders[0];

    await caller.reminders.update({
      id: reminder.id,
      reminderTime: "14:30",
    });

    const updated = await caller.reminders.listByUser();
    const updatedReminder = updated.find(r => r.id === reminder.id);

    expect(updatedReminder?.reminderTime).toBe("14:30");
  });

  it("should delete a reminder", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const reminders = await caller.reminders.listByUser();
    if (reminders.length === 0) return;

    const reminderId = reminders[0].id;

    await caller.reminders.delete({ id: reminderId });

    const updated = await caller.reminders.listByUser();
    const deleted = !updated.some(r => r.id === reminderId);

    expect(deleted).toBe(true);
  });
});
