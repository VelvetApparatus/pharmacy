import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { productRouter } from "./routers/product";
import { discountRouter } from "./routers/discount";
import { cartRouter } from "./routers/cart";
import { orderRouter } from "./routers/order";
import { feedbackRouter } from "./routers/feedback";

export const appRouter = createTRPCRouter({
  user: userRouter,
  product: productRouter,
  discount: discountRouter,
  cart: cartRouter,
  order: orderRouter,
  feedback: feedbackRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
