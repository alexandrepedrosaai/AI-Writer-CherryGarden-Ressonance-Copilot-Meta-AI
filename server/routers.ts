import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  createHabit,
  getUserHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
  addCompletion,
  removeCompletion,
  checkCompletion,
  getCompletionsByHabit,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  habits: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        frequency: z.enum(["daily", "weekly", "monthly"]),
        color: z.string(),
        icon: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        return createHabit(ctx.user.id, input);
      }),

    list: protectedProcedure
      .query(async ({ ctx }) => {
        return getUserHabits(ctx.user.id);
      }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return getHabitById(input.id, ctx.user.id);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        frequency: z.enum(["daily", "weekly", "monthly"]).optional(),
        color: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return updateHabit(id, ctx.user.id, data);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return deleteHabit(input.id, ctx.user.id);
      }),
  }),

  completions: router({
    toggleToday: protectedProcedure
      .input(z.object({ habitId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const today = new Date();
        const isCompleted = await checkCompletion(input.habitId, ctx.user.id, today);
        
        if (isCompleted) {
          await removeCompletion(input.habitId, ctx.user.id, today);
          return { completed: false };
        } else {
          await addCompletion(input.habitId, ctx.user.id, today);
          return { completed: true };
        }
      }),
    
    getByHabit: protectedProcedure
      .input(z.object({
        habitId: z.number(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      }))
      .query(async ({ ctx, input }) => {
        const startDate = input.startDate ? new Date(input.startDate) : undefined;
        const endDate = input.endDate ? new Date(input.endDate) : undefined;
        return getCompletionsByHabit(input.habitId, startDate, endDate);
      }),
    
    checkToday: protectedProcedure
      .input(z.object({ habitId: z.number() }))
      .query(async ({ ctx, input }) => {
        const today = new Date();
        return checkCompletion(input.habitId, ctx.user.id, today);
      }),
  }),

  reminders: router({
    listByHabit: protectedProcedure
      .input(z.object({ habitId: z.number() }))
      .query(async ({ ctx, input }) => {
        const { getRemindersByHabit } = await import('./db');
        return getRemindersByHabit(input.habitId);
      }),
    
    listByUser: protectedProcedure
      .query(async ({ ctx }) => {
        const { getRemindersByUser } = await import('./db');
        return getRemindersByUser(ctx.user.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        habitId: z.number(),
        reminderTime: z.string().regex(/^\d{2}:\d{2}$/),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createReminder } = await import('./db');
        return createReminder(ctx.user.id, input.habitId, input.reminderTime);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        reminderTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
        enabled: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { updateReminder } = await import('./db');
        const { id, ...data } = input;
        return updateReminder(id, ctx.user.id, data);
      }),
    
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const { deleteReminder } = await import('./db');
        return deleteReminder(input.id, ctx.user.id);
      }),
    
    toggle: protectedProcedure
      .input(z.object({ id: z.number(), enabled: z.boolean() }))
      .mutation(async ({ ctx, input }) => {
        const { toggleReminder } = await import('./db');
        return toggleReminder(input.id, ctx.user.id, input.enabled);
      }),
  }),
});

export type AppRouter = typeof appRouter;
