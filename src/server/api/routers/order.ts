import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { cartProducts, orderProducts, orderStatusEnumSchema, orders } from "~/server/db/schema";

export const orderRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      address: z.string(),
      date: z.date(),
      comment: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.cartProducts.length === 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Корзина пуста" })
      }

      await ctx.db.transaction(async (tx) => {
        const order = await tx
          .insert(orders)
          .values({
            address: input.address,
            date: input.date,
            comment: input.comment,
            userId: ctx.session.user.id
          })
          .returning()

        await tx
          .insert(orderProducts)
          .values(
            ctx.session.user.cartProducts.map((cartProduct) => ({
              orderId: order[0]!.id,
              productId: cartProduct.productId,
              quantity: cartProduct.quantity
            }))
          )

        await tx
          .update(cartProducts)
          .set({
            quantity: 0
          })
          .where(eq(cartProducts.userId, ctx.session.user.id))
      })
    }),
  updateStatus: adminProcedure
    .input(z.object({
      id: z.string(),
      status: orderStatusEnumSchema
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(orders)
        .set({ status: input.status })
        .where(eq(orders.id, input.id))
    }),
  getAll: adminProcedure
    .query(({ ctx }) => {
      return ctx.db.query.orders.findMany({
        orderBy: [desc(orders.date)],
        with: {
          products: {
            with: {
              product: true
            }
          },
          user: true
        }
      })
    }),
  getOwned: protectedProcedure
    .query(({ ctx }) => {
      return ctx.db.query.orders.findMany({
        with: {
          products: {
            with: {
              product: true
            }
          }
        }
      })
    }),
  repeatOrder: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const orderProducts = await ctx.db.query.orders.findFirst({
        where: eq(orders.id, input.id),
        with: {
          products: true
        },
        columns: {
          id: true
        }
      })

      if (!orderProducts) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Заказ не найден" })
      }

      await ctx.db.transaction(async (tx) => {
        await tx
          .delete(cartProducts)
          .where(eq(cartProducts.userId, ctx.session.user.id));

        await tx
          .insert(cartProducts)
          .values(
            orderProducts!.products.filter((p) => p.productId !== null).map((product) => ({
              productId: product.productId!,
              quantity: product.quantity,
              userId: ctx.session.user.id
            }))
          )
      })
    }),
});
