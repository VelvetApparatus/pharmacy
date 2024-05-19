import { eq } from "drizzle-orm";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { discounts } from "~/server/db/schema";

export const discountRouter = createTRPCRouter({
  create: adminProcedure
    .input(z.object({
      name: z.string(),
      image: z.string(),
      href: z.string().url(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(discounts).values(input);
    }),
  update: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string(),
      image: z.string(),
      href: z.string().url(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(discounts)
        .set(input)
        .where(eq(discounts.id, input.id));
    }),
  delete: adminProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(discounts).where(eq(discounts.id, input.id));
    }),
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      return ctx.db.query.discounts.findMany();
    })
});
