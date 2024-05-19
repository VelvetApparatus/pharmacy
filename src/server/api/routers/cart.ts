import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { cartProducts, orders, users } from "~/server/db/schema";

export const cartRouter = createTRPCRouter({
  increment: protectedProcedure
    .input(z.object({
      productId: z.string(),
      increment: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const quantity = await ctx.db.query.cartProducts.findFirst({
        where: and(
          eq(cartProducts.userId, ctx.session.user.id),
          eq(cartProducts.productId, input.productId)
        ),
        columns: {
          quantity: true
        }
      })
      if (quantity && quantity.quantity + input.increment >= 0) {
        await ctx.db
          .update(cartProducts)
          .set({
            quantity: quantity.quantity + input.increment
          })
          .where(and(
            eq(cartProducts.userId, ctx.session.user.id),
            eq(cartProducts.productId, input.productId)
          ));
        return;
      }
      await ctx.db
        .insert(cartProducts)
        .values({
          productId: input.productId,
          quantity: input.increment,
          userId: ctx.session.user.id
        });
    }),
  clear: protectedProcedure
    .mutation(async ({ ctx }) => {
      await ctx.db
        .delete(cartProducts)
        .where(eq(cartProducts.userId, ctx.session.user.id));
    }),
}); 
