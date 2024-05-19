import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import { cartProducts, users } from "~/server/db/schema";

import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { env } from "~/env";
import { db } from "~/server/db";
import { createTable } from "~/server/db/schema";
import { desc, eq, gt } from "drizzle-orm";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: NonNullable<Awaited<ReturnType<typeof GetDBUser>>>
    & DefaultSession["user"];
  }
}

async function GetDBUser(id?: string, email?: string) {
  let where: any = undefined;

  if (id) {
    where = eq(users.id, id);
  } else if (email) {
    where = eq(users.email, email);
  }

  if (!where) {
    throw new Error("Пользователь не найден");
  }

  return await db.query.users.findFirst({
    where: where,
    columns: {
      id: true,
      email: true,
      role: true,
      name: true
    },
    with: {
      cartProducts: {
        where: gt(cartProducts.quantity, 0),
        orderBy: [desc(cartProducts.createdAt)],
        with: {
          product: true
        }
      }
    }
  });
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user }) => {
      const dbUser = await GetDBUser(undefined, session.user.email ?? "");

      if (!dbUser) {
        throw new Error("Пользователь не найден");
      }

      if (dbUser.email === env.MAIN_ADMIN_EMAIL && dbUser.role !== "ADMIN") {
        await db.update(users).set({ role: "ADMIN" }).where(eq(users.email, env.MAIN_ADMIN_EMAIL));
        dbUser.role = "ADMIN";
      }

      return {
        ...session,
        user: dbUser
      };
    },
  },
  adapter: DrizzleAdapter(db, createTable) as Adapter,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = (await db.select({
          id: users.id,
          password: users.passwordHash,
          role: users.role,
        }).from(users).where(eq(users.email, credentials?.email ?? "")))[0];

        if (!user) {
          return null
        }

        const passwordMatch = await bcrypt.compare(credentials?.password, user.password)

        if (!passwordMatch) {
          return null
        }

        const dbUser = await GetDBUser(user.id);
        return dbUser ?? null;
      },
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: env.NEXTAUTH_SECRET,
  debug: env.NODE_ENV === "development",
};

export const getServerAuthSession = () => getServerSession(authOptions);
