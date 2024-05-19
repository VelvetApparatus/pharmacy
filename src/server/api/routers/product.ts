import { eq, ilike, like, sql } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  adminProcedure,
} from "~/server/api/trpc";
import { products, categoryEnumSchema } from "~/server/db/schema";

export const productRouter = createTRPCRouter({
  create: adminProcedure
    .input(z.object({
      name: z.string(),
      price: z.number(),
      image: z.string(),
      category: categoryEnumSchema,
      manufacturer: z.string(),
      manufacturerCountry: z.string(),
      activeSubstance: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(products).values(input);
    }),
  update: adminProcedure
    .input(z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      image: z.string(),
      manufacturer: z.string(),
      manufacturerCountry: z.string(),
      category: categoryEnumSchema,
      activeSubstance: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.update(products).set(input).where(eq(products.id, input.id));
    }),
  delete: adminProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(products).where(eq(products.id, input.id));
    }),
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      return await ctx.db.query.products.findMany();
    }),
  getSearch: publicProcedure
    .input(z.object({
      query: z.string().optional(),
    }))
    .query(async ({ ctx, input }) => {
      if (!input.query) return [];
      return await ctx.db.query.products.findMany({
        where: ilike(products.name, `%${input.query.toLowerCase()}%`),
      });
    }),
  getOne: publicProcedure
    .input(z.object({
      id: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.products.findFirst({
        where: eq(products.id, input.id),
      });
    }),
  getByCategory: publicProcedure
    .input(z.object({
      category: categoryEnumSchema,
    }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.products.findMany({
        where: eq(products.category, input.category),
      });
    }),
});
