import { pgTable, text, serial, integer, timestamp, numeric, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  email: text("email"),
  ecoRank: text("eco_rank").default("Beginner"),
  points: integer("points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // transport, food, home, shopping, waste
  subtype: text("subtype"), // car, bus, train, etc.
  description: text("description"),
  quantity: numeric("quantity"), // distance, amount, etc.
  unit: text("unit"), // km, kg, kwh, etc.
  co2Emissions: numeric("co2_emissions"), // in kg
  date: timestamp("date").defaultNow(),
  notes: text("notes"),
  passengers: integer("passengers"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  barcode: text("barcode").notNull().unique(),
  name: text("name").notNull(),
  category: text("category"),
  co2PerUnit: numeric("co2_per_unit"), // in kg
  unit: text("unit"), // kg, l, etc.
  isUserContribution: boolean("is_user_contribution").default(false),
  userId: integer("user_id").references(() => users.id), // user who added the product
  createdAt: timestamp("created_at").defaultNow(),
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  targetValue: numeric("target_value"),
  unit: text("unit"),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  category: text("category"), // transport, food, etc.
  points: integer("points").default(0), // points awarded for completion
});

export const userChallenges = pgTable("user_challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id),
  progress: numeric("progress").default("0"),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
});

// Define relations for Drizzle ORM
export const usersRelations = relations(users, ({ many }) => ({
  activities: many(activities),
  products: many(products),
  userChallenges: many(userChallenges),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id],
  }),
}));

export const productsRelations = relations(products, ({ one }) => ({
  user: one(users, {
    fields: [products.userId],
    references: [users.id],
  }),
}));

export const challengesRelations = relations(challenges, ({ many }) => ({
  userChallenges: many(userChallenges),
}));

export const userChallengesRelations = relations(userChallenges, ({ one }) => ({
  user: one(users, {
    fields: [userChallenges.userId],
    references: [users.id],
  }),
  challenge: one(challenges, {
    fields: [userChallenges.challengeId],
    references: [challenges.id],
  }),
}));

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
});

// Login Schema
export const loginUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Register Schema
export const registerUserSchema = insertUserSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  userId: true,
  type: true,
  subtype: true,
  description: true,
  quantity: true,
  unit: true,
  co2Emissions: true,
  date: true,
  notes: true,
  passengers: true,
});

export const insertProductSchema = createInsertSchema(products).pick({
  barcode: true,
  name: true,
  category: true,
  co2PerUnit: true,
  unit: true,
  isUserContribution: true,
  userId: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).pick({
  title: true,
  description: true,
  targetValue: true,
  unit: true,
  startDate: true,
  endDate: true,
  category: true,
  points: true,
});

export const insertUserChallengeSchema = createInsertSchema(userChallenges).pick({
  userId: true,
  challengeId: true,
  progress: true,
  isCompleted: true,
  completedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;

export type InsertUserChallenge = z.infer<typeof insertUserChallengeSchema>;
export type UserChallenge = typeof userChallenges.$inferSelect;
