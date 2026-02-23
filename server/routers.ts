import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getUserHabits, getHabitById, createHabit, updateHabit, deleteHabit, checkCompletion, addCompletion, removeCompletion, getCompletionsByHabit } from "./db";
import { z } from "zod";

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
    list: protectedProcedure.query(async ({ ctx }) => {
      return getUserHabits(ctx.user.id);
    }),
    
    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return getHabitById(input.id, ctx.user.id);
      }),
    
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
        color: z.string().optional(),
        icon: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return createHabit(ctx.user.id, input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
        color: z.string().optional(),
        icon: z.string().optional(),
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
});

export type AppRouter = typeof appRouter;
