import { eq, and, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';
import { InsertHabit, completions, habits, InsertReminder, reminders } from '../drizzle/schema';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Habit queries
export async function getUserHabits(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(habits)
    .where(and(eq(habits.userId, userId), eq(habits.isActive, true)));
}

export async function getHabitById(habitId: number, userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createHabit(userId: number, data: Omit<InsertHabit, 'userId'>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const result = await db.insert(habits).values({ ...data, userId });
  return result;
}

export async function updateHabit(habitId: number, userId: number, data: Partial<InsertHabit>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.update(habits)
    .set(data)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)));
}

export async function deleteHabit(habitId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.update(habits)
    .set({ isActive: false })
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)));
}

// Completion queries
export async function getCompletionsByHabit(habitId: number, startDate?: Date, endDate?: Date) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(completions.habitId, habitId)];
  if (startDate) {
    const startStr = startDate.toISOString().split('T')[0];
    conditions.push(gte(completions.completedDate, startStr as any));
  }
  if (endDate) {
    const endStr = endDate.toISOString().split('T')[0];
    conditions.push(lte(completions.completedDate, endStr as any));
  }
  
  return db.select().from(completions)
    .where(and(...(conditions as any)));
}

export async function checkCompletion(habitId: number, userId: number, date: Date) {
  const db = await getDb();
  if (!db) return false;
  const dateStr = date.toISOString().split('T')[0];
  const result = await db.select().from(completions)
    .where(and(
      eq(completions.habitId, habitId),
      eq(completions.userId, userId),
      eq(completions.completedDate, dateStr as any)
    ))
    .limit(1);
  return result.length > 0;
}

export async function addCompletion(habitId: number, userId: number, date: Date, notes?: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.insert(completions).values({
    habitId,
    userId,
    completedDate: date,
    notes,
  });
}

export async function removeCompletion(habitId: number, userId: number, date: Date) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const dateStr = date.toISOString().split('T')[0];
  return db.delete(completions)
    .where(and(eq(completions.habitId, habitId), eq(completions.userId, userId), eq(completions.completedDate, dateStr as any)));
}


// Reminder queries
export async function getRemindersByHabit(habitId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reminders)
    .where(eq(reminders.habitId, habitId));
}

export async function getRemindersByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(reminders)
    .where(eq(reminders.userId, userId));
}

export async function createReminder(userId: number, habitId: number, reminderTime: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.insert(reminders).values({
    habitId,
    userId,
    reminderTime,
    enabled: true,
  });
}

export async function updateReminder(reminderId: number, userId: number, data: Partial<InsertReminder>) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.update(reminders)
    .set(data)
    .where(and(eq(reminders.id, reminderId), eq(reminders.userId, userId)));
}

export async function deleteReminder(reminderId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.delete(reminders)
    .where(and(eq(reminders.id, reminderId), eq(reminders.userId, userId)));
}

export async function toggleReminder(reminderId: number, userId: number, enabled: boolean) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.update(reminders)
    .set({ enabled })
    .where(and(eq(reminders.id, reminderId), eq(reminders.userId, userId)));
}


