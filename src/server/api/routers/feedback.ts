
import { asc, desc, eq } from "drizzle-orm";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { feedback, feedbackStatusSchema } from "~/server/db/schema";

export const feedbackRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({
      email: z.string().email({
        message: "Некорректная почта",
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(feedback).values({
        email: input.email,
      })
    }),
  getAll: adminProcedure
    .query(({ ctx }) => {
      return ctx.db.query.feedback.findMany({
        orderBy: [
          desc(feedback.createdAt)
        ],
      })
    }),
  updateStatus: adminProcedure
    .input(z.object({
      id: z.string(),
      status: feedbackStatusSchema
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(feedback)
        .set({ status: input.status })
        .where(eq(feedback.id, input.id)).returning();
    }),
});
