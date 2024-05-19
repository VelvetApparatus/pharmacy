import { z } from "zod";
import bcrypt from "bcrypt";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const exists = await ctx.db.query.users.findFirst({
        where: (user, { eq }) => eq(user.email, input.email),
      })

      if (exists) {
        throw new Error("Пользователь уже существует")
      }

      const hashedPassword = await bcrypt.hash(input.password, 10)

      return (await ctx.db.insert(users).values({
        name: input.name,
        email: input.email,
        passwordHash: hashedPassword
      }).returning())[0]!
    }),
});
