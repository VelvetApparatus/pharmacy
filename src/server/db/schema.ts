import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createId } from '@paralleldrive/cuid2';
import { type AdapterAccount } from "next-auth/adapters";
import { z } from "zod";

export const createTable = pgTableCreator((name) => `pharmacy_${name}`);

export const categoryEnum = pgEnum("category", ["VIRUS", "NOSE", "THROAT", "COLD", "HIGH_BLOOD_PRESSURE", "LOW_BLOOD_PRESSURE", "ALLERGY", "HEARTBURN"])
export const categoryEnumSchema = z.enum(categoryEnum.enumValues, {
  required_error: "Категория обязательна",
  invalid_type_error: "Категория должна быть строкой",
});
export type Category = z.infer<typeof categoryEnumSchema>;

export const products = createTable("product", {
  id: text('id').$defaultFn(() => createId()).unique().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  price: integer("price").notNull(),
  image: text("image").notNull(),
  manufacturer: text("manufacturer").notNull(),
  manufacturerCountry: text("manufacturerCountry").notNull(),
  category: categoryEnum("category").notNull(),
  activeSubstance: text("activeSubstance").notNull(),
})

export const cartProducts = createTable("cartProduct", {
  id: text('id').$defaultFn(() => createId()).unique().primaryKey(),
  quantity: integer("quantity").notNull(),
  productId: text("productId").notNull().references(() => products.id, {
    onDelete: "cascade"
  }),
  userId: text("userId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
})

export const cartProductsRelations = relations(cartProducts, ({ one }) => ({
  product: one(products, { fields: [cartProducts.productId], references: [products.id] }),
  user: one(users, { fields: [cartProducts.userId], references: [users.id] }),
}))

export const orderStatusEnum = pgEnum("order_status", ["PROCESSING", "DELIVERY", "DELIVERED", "ACCEPTED"]);
export const orderStatusEnumSchema = z.enum(orderStatusEnum.enumValues)
export type OrderStatus = z.infer<typeof orderStatusEnumSchema>;

export const orders = createTable("order", {
  id: text('id').$defaultFn(() => createId()).unique().primaryKey(),
  address: varchar("address", { length: 128 }).notNull(),
  date: timestamp("date", { mode: "date" }).notNull(),
  comment: text("comment"),

  userId: text("userId"),

  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  status: orderStatusEnum("status").notNull().default("PROCESSING"),
})

export const orderRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  products: many(orderProducts),
}))

export const orderProducts = createTable("orderProduct", {
  id: text('id').$defaultFn(() => createId()).unique().primaryKey(),
  quantity: integer("quantity").notNull(),
  productId: text("productId").references(() => products.id, {
    onDelete: "set null"
  }),
  orderId: text("orderId").notNull(),
})

export const orderProductsRelations = relations(orderProducts, ({ one }) => ({
  product: one(products, { fields: [orderProducts.productId], references: [products.id] }),
  order: one(orders, { fields: [orderProducts.orderId], references: [orders.id] }),
}))

export const discounts = createTable("discount", {
  id: text('id').$defaultFn(() => createId()).unique().primaryKey(),
  name: varchar("name", { length: 128 }).notNull(),
  image: text("image").notNull(),
  href: varchar("href", { length: 256 }).notNull(),
})

export const feedbackStatus = pgEnum("feedback_status", ["OPEN", "CLOSED"]);
export const feedbackStatusSchema = z.enum(feedbackStatus.enumValues)
export type FeedbackStatus = z.infer<typeof feedbackStatusSchema>;

export const feedback = createTable("feedback", {
  id: text('id').$defaultFn(() => createId()).unique().primaryKey(),
  email: varchar("email", { length: 128 }).notNull(),
  status: feedbackStatus("status").notNull().default("OPEN"),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
})

export const userRoleEnum = pgEnum("user_role", ["USER", "ADMIN"]);
const userRoleEnumSchema = z.enum(userRoleEnum.enumValues)
export type UserRole = z.infer<typeof userRoleEnumSchema>;

export const users = createTable("user", {
  id: text('id').$defaultFn(() => createId()).unique().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  role: userRoleEnum("role").default("USER").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  cartProducts: many(cartProducts),
  orders: many(orders),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);
