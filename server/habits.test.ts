import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock user context
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

describe("Habit Management API", () => {
  let habitId: number;

  it("should create a new habit", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.habits.create({
      name: "Morning Exercise",
      description: "30 minutes of cardio",
      frequency: "daily",
      color: "#3b82f6",
      icon: "circle",
    });

    expect(result).toBeDefined();
    habitId = result[0]?.insertId || 1;
  });

  it("should list all habits for a user", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const habits = await caller.habits.list();

    expect(Array.isArray(habits)).toBe(true);
    expect(habits.length).toBeGreaterThan(0);
  });

  it("should get a specific habit by ID", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const habits = await caller.habits.list();
    if (habits.length === 0) return;

    const habit = await caller.habits.get({ id: habits[0].id });

    expect(habit).toBeDefined();
    expect(habit?.name).toBe("Morning Exercise");
  });

  it("should update a habit", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const habits = await caller.habits.list();
    if (habits.length === 0) return;

    await caller.habits.update({
      id: habits[0].id,
      name: "Morning Exercise Updated",
      description: "45 minutes of cardio",
    });

    const updated = await caller.habits.get({ id: habits[0].id });
    expect(updated?.name).toBe("Morning Exercise Updated");
  });

  it("should toggle habit completion for today", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const habits = await caller.habits.list();
    if (habits.length === 0) return;

    const result = await caller.completions.toggleToday({ habitId: habits[0].id });

    expect(result.completed).toBe(true);
  });

  it("should check if habit is completed today", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const habits = await caller.habits.list();
    if (habits.length === 0) return;

    const isCompleted = await caller.completions.checkToday({ habitId: habits[0].id });

    expect(typeof isCompleted).toBe("boolean");
  });

  it("should delete a habit", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const habits = await caller.habits.list();
    if (habits.length === 0) return;

    await caller.habits.delete({ id: habits[0].id });

    const allHabits = await caller.habits.list();
    const isDeleted = !allHabits.some(h => h.id === habits[0].id);
    expect(isDeleted).toBe(true);
  });
});
