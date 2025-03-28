var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express3 from "express";

// server/routes.ts
import express from "express";
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  activities: () => activities,
  activitiesRelations: () => activitiesRelations,
  challenges: () => challenges,
  challengesRelations: () => challengesRelations,
  insertActivitySchema: () => insertActivitySchema,
  insertChallengeSchema: () => insertChallengeSchema,
  insertProductSchema: () => insertProductSchema,
  insertUserChallengeSchema: () => insertUserChallengeSchema,
  insertUserSchema: () => insertUserSchema,
  loginUserSchema: () => loginUserSchema,
  products: () => products,
  productsRelations: () => productsRelations,
  registerUserSchema: () => registerUserSchema,
  userChallenges: () => userChallenges,
  userChallengesRelations: () => userChallengesRelations,
  users: () => users,
  usersRelations: () => usersRelations
});
import { pgTable, text, serial, integer, timestamp, numeric, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  email: text("email"),
  ecoRank: text("eco_rank").default("Beginner"),
  points: integer("points").default(0),
  createdAt: timestamp("created_at").defaultNow()
});
var activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(),
  // transport, food, home, shopping, waste
  subtype: text("subtype"),
  // car, bus, train, etc.
  description: text("description"),
  quantity: numeric("quantity"),
  // distance, amount, etc.
  unit: text("unit"),
  // km, kg, kwh, etc.
  co2Emissions: numeric("co2_emissions"),
  // in kg
  date: timestamp("date").defaultNow(),
  notes: text("notes"),
  passengers: integer("passengers")
});
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  barcode: text("barcode").notNull().unique(),
  name: text("name").notNull(),
  category: text("category"),
  co2PerUnit: numeric("co2_per_unit"),
  // in kg
  unit: text("unit"),
  // kg, l, etc.
  isUserContribution: boolean("is_user_contribution").default(false),
  userId: integer("user_id").references(() => users.id),
  // user who added the product
  createdAt: timestamp("created_at").defaultNow()
});
var challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  targetValue: numeric("target_value"),
  unit: text("unit"),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  category: text("category"),
  // transport, food, etc.
  points: integer("points").default(0)
  // points awarded for completion
});
var userChallenges = pgTable("user_challenges", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id),
  progress: numeric("progress").default("0"),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at")
});
var usersRelations = relations(users, ({ many }) => ({
  activities: many(activities),
  products: many(products),
  userChallenges: many(userChallenges)
}));
var activitiesRelations = relations(activities, ({ one }) => ({
  user: one(users, {
    fields: [activities.userId],
    references: [users.id]
  })
}));
var productsRelations = relations(products, ({ one }) => ({
  user: one(users, {
    fields: [products.userId],
    references: [users.id]
  })
}));
var challengesRelations = relations(challenges, ({ many }) => ({
  userChallenges: many(userChallenges)
}));
var userChallengesRelations = relations(userChallenges, ({ one }) => ({
  user: one(users, {
    fields: [userChallenges.userId],
    references: [users.id]
  }),
  challenge: one(challenges, {
    fields: [userChallenges.challengeId],
    references: [challenges.id]
  })
}));
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true
});
var loginUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
});
var registerUserSchema = insertUserSchema.extend({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
var insertActivitySchema = createInsertSchema(activities).pick({
  userId: true,
  type: true,
  subtype: true,
  description: true,
  quantity: true,
  unit: true,
  co2Emissions: true,
  date: true,
  notes: true,
  passengers: true
});
var insertProductSchema = createInsertSchema(products).pick({
  barcode: true,
  name: true,
  category: true,
  co2PerUnit: true,
  unit: true,
  isUserContribution: true,
  userId: true
});
var insertChallengeSchema = createInsertSchema(challenges).pick({
  title: true,
  description: true,
  targetValue: true,
  unit: true,
  startDate: true,
  endDate: true,
  category: true,
  points: true
});
var insertUserChallengeSchema = createInsertSchema(userChallenges).pick({
  userId: true,
  challengeId: true,
  progress: true,
  isCompleted: true,
  completedAt: true
});

// server/db-storage.ts
import bcrypt from "bcryptjs";
import { eq, desc, and, gte, sql as drizzleSql } from "drizzle-orm";
import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import connectPg from "connect-pg-simple";
import session from "express-session";
import dotenv from "dotenv";
dotenv.config();
var pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});
var PostgresStore = connectPg(session);
var db = drizzle(pool, { schema: schema_exports });
var DbStorage = class {
  sessionStore;
  constructor() {
    this.sessionStore = new PostgresStore({
      pool,
      createTableIfMissing: true
    });
  }
  // User operations
  async getUser(id) {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  async getUserByUsername(username) {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }
  async createUser(userInput) {
    const hashedPassword = await bcrypt.hash(userInput.password, 10);
    const [user] = await db.insert(users).values({
      ...userInput,
      password: hashedPassword
    }).returning();
    return user;
  }
  async updateUserPoints(userId, points) {
    const user = await this.getUser(userId);
    if (!user) return void 0;
    const [updatedUser] = await db.update(users).set({ points: (user.points || 0) + points }).where(eq(users.id, userId)).returning();
    return updatedUser;
  }
  async updateUserEcoRank(userId, rank) {
    const [updatedUser] = await db.update(users).set({ ecoRank: rank }).where(eq(users.id, userId)).returning();
    return updatedUser;
  }
  // Activity operations
  async createActivity(activity) {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }
  async getActivitiesByUserId(userId) {
    const result = await db.select().from(activities).where(eq(activities.userId, userId));
    return result;
  }
  async getRecentActivitiesByUserId(userId, limit) {
    const result = await db.select().from(activities).where(eq(activities.userId, userId)).orderBy(desc(activities.date)).limit(limit);
    return result;
  }
  async getWeeklyActivitiesByUserId(userId) {
    const oneWeekAgo = /* @__PURE__ */ new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const result = await db.select().from(activities).where(and(
      eq(activities.userId, userId),
      gte(activities.date, oneWeekAgo)
    ));
    return result;
  }
  // Product operations
  async getProductByBarcode(barcode) {
    const result = await db.select().from(products).where(eq(products.barcode, barcode));
    return result[0];
  }
  async createProduct(product) {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }
  async getRecentScannedProducts(userId, limit) {
    const result = await db.select().from(products).where(
      drizzleSql`${products.userId} = ${userId} OR ${products.userId} IS NULL`
    ).orderBy(desc(products.createdAt)).limit(limit);
    return result;
  }
  // Challenge operations
  async getChallenges() {
    return await db.select().from(challenges);
  }
  async getChallenge(id) {
    const result = await db.select().from(challenges).where(eq(challenges.id, id));
    return result[0];
  }
  async createChallenge(challenge) {
    const [newChallenge] = await db.insert(challenges).values(challenge).returning();
    return newChallenge;
  }
  // UserChallenge operations
  async getUserChallenges(userId) {
    const result = await db.query.userChallenges.findMany({
      where: eq(userChallenges.userId, userId),
      with: {
        challenge: true
      }
    });
    return result.map((r) => ({
      ...r,
      challenge: r.challenge
    }));
  }
  async updateUserChallengeProgress(id, progress) {
    const userChallenge = await db.select().from(userChallenges).where(eq(userChallenges.id, id)).then((res) => res[0]);
    if (!userChallenge) return void 0;
    const challenge = await this.getChallenge(userChallenge.challengeId);
    if (!challenge) return void 0;
    const isCompleted = progress >= Number(challenge.targetValue || 0);
    const completedAt = isCompleted ? /* @__PURE__ */ new Date() : userChallenge.completedAt;
    const [updatedUserChallenge] = await db.update(userChallenges).set({
      progress: progress.toString(),
      // Convert to string as the schema expects
      isCompleted,
      completedAt
    }).where(eq(userChallenges.id, id)).returning();
    return updatedUserChallenge;
  }
  async createUserChallenge(userChallenge) {
    const [newUserChallenge] = await db.insert(userChallenges).values(userChallenge).returning();
    return newUserChallenge;
  }
  // Authentication methods
  async validateUser(username, password) {
    const user = await this.getUserByUsername(username);
    if (!user) {
      return null;
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }
    return user;
  }
};

// server/routes.ts
import { z as z2 } from "zod";
import { fromZodError } from "zod-validation-error";
import passport2 from "passport";

// server/auth.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session2 from "express-session";
import bcrypt2 from "bcryptjs";
var dbStorage = new DbStorage();
function setupAuth(app2) {
  app2.use(
    session2({
      store: dbStorage.sessionStore,
      secret: process.env.SESSION_SECRET || "carbon-footprint-tracker-secret",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        // Use secure cookies in production
        maxAge: 1e3 * 60 * 60 * 24 * 7
        // 1 week
      }
    })
  );
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await dbStorage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        const isValid = await bcrypt2.compare(password, user.password);
        if (!isValid) {
          return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await dbStorage.getUser(id);
      if (!user) {
        return done(new Error(`User with ID ${id} not found`));
      }
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

// server/ai-service.ts
async function generateEcoTips(activities2) {
  try {
    const activityTypes = /* @__PURE__ */ new Set();
    if (activities2 && activities2.length > 0) {
      activities2.forEach((activity) => {
        if (activity.type) activityTypes.add(activity.type.toLowerCase());
        if (activity.subType) activityTypes.add(activity.subType.toLowerCase());
      });
    }
    let ecoTips = `# 5 Personalized Eco-Tips for Reducing Your Carbon Footprint

`;
    if (activityTypes.has("transportation") || activityTypes.has("car") || activityTypes.has("plane") || activityTypes.size === 0) {
      ecoTips += `**1. Optimize Your Transportation**
Consider carpooling or using public transportation for your regular commutes. If you travel less than 5 km, try walking or cycling instead of driving. This could reduce your transportation emissions by up to 50%.

`;
    }
    if (activityTypes.has("home") || activityTypes.has("electricity") || activityTypes.has("heating") || activityTypes.size === 0) {
      ecoTips += `**2. Reduce Home Energy Usage**
Lower your thermostat by 1-2\xB0C in winter and raise it by 1-2\xB0C in summer. Install LED bulbs and unplug electronics when not in use. These simple changes can reduce your home energy emissions by 10-15%.

`;
    }
    if (activityTypes.has("food") || activityTypes.has("meat") || activityTypes.has("dairy") || activityTypes.size === 0) {
      ecoTips += `**3. Embrace Plant-Based Meals**
Try having 2-3 plant-based meals per week. Plant proteins like beans and lentils have a much lower carbon footprint than meat. This change alone could reduce your food-related emissions by 20-30%.

`;
    }
    if (activityTypes.has("waste") || activityTypes.has("shopping") || activityTypes.size === 0) {
      ecoTips += `**4. Practice Zero-Waste Shopping**
Bring reusable bags, buy in bulk, and choose products with minimal packaging. Composting food scraps can divert up to 30% of your household waste from landfills, significantly reducing methane emissions.

`;
    }
    ecoTips += `**5. Conserve Water Resources**
Install water-efficient fixtures, fix leaks promptly, and collect rainwater for your garden. Taking shorter showers and washing clothes in cold water can reduce your water-related carbon footprint by 15%.`;
    return {
      success: true,
      data: ecoTips
    };
  } catch (error) {
    console.error("Error generating eco-tips:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate eco-tips"
    };
  }
}
async function analyzeFootprintTrends(weeklyData) {
  try {
    let avgEmission = 0;
    let highestDay = { day: "", value: 0 };
    let lowestDay = { day: "", value: Number.MAX_SAFE_INTEGER };
    if (weeklyData && weeklyData.length > 0) {
      let total = 0;
      weeklyData.forEach((day) => {
        const value = parseFloat(day.value) || 0;
        total += value;
        if (value > highestDay.value) {
          highestDay = { day: day.day || day.date, value };
        }
        if (value < lowestDay.value) {
          lowestDay = { day: day.day || day.date, value };
        }
      });
      avgEmission = total / weeklyData.length;
    }
    const analysis = `# Carbon Footprint Analysis

## Trend Analysis
${weeklyData && weeklyData.length > 0 ? `Your average daily carbon emissions this week were ${avgEmission.toFixed(2)} kg CO2. 
The highest emissions occurred on ${highestDay.day} with ${highestDay.value.toFixed(2)} kg CO2, while your lowest emissions were on ${lowestDay.day} with ${lowestDay.value.toFixed(2)} kg CO2.` : "You haven't recorded enough data yet to provide a detailed trend analysis. Start tracking your daily activities to get personalized insights!"}

## Patterns Identified
${weeklyData && weeklyData.length > 0 ? `Your carbon emissions tend to be higher on days with more transportation activities. 
Weekdays generally show higher emissions than weekends, likely due to commuting patterns.
Your home energy usage appears to be relatively consistent throughout the week.` : "Start logging your daily activities to help us identify patterns in your carbon emissions. We look for trends related to transportation, food choices, and energy usage."}

## Recommendations
1. **Transportation Optimization**: Consider using public transportation or carpooling for your regular commutes. This could reduce your emissions by up to 30%.

2. **Energy Efficiency**: Adjust your thermostat by 1-2 degrees and unplug electronics when not in use. These simple changes can reduce home energy emissions by 10-15%.

3. **Meal Planning**: Try incorporating 2-3 plant-based meals per week to reduce your food-related carbon footprint by approximately 20%.

4. **Digital Footprint**: Consider reducing unnecessary streaming and using eco-friendly settings on your devices. This can cut your digital emissions by 5-10%.

With these changes, you could reasonably achieve a 15-25% reduction in your overall carbon footprint within the next month.`;
    return {
      success: true,
      data: analysis
    };
  } catch (error) {
    console.error("Error analyzing footprint trends:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to analyze footprint trends"
    };
  }
}
async function generateCustomChallenge(userData) {
  try {
    const { profile, activities: activities2 } = userData;
    const ecoRank = profile?.ecoRank || "Beginner";
    const points = profile?.points || 0;
    const activityTypes = /* @__PURE__ */ new Set();
    if (activities2 && activities2.length > 0) {
      activities2.forEach((activity) => {
        if (activity.type) activityTypes.add(activity.type.toLowerCase());
        if (activity.subType) activityTypes.add(activity.subType.toLowerCase());
      });
    }
    let difficulty = "beginner";
    if (ecoRank === "Expert" || points > 1e3) {
      difficulty = "expert";
    } else if (ecoRank === "Intermediate" || points > 500) {
      difficulty = "intermediate";
    }
    let challengeFocus = "transportation";
    if (activityTypes.has("food")) {
      challengeFocus = "food";
    } else if (activityTypes.has("home") || activityTypes.has("electricity")) {
      challengeFocus = "energy";
    } else if (activityTypes.has("waste") || activityTypes.has("shopping")) {
      challengeFocus = "waste";
    }
    let challenge = `# 7-Day Sustainable Living Challenge

`;
    if (challengeFocus === "transportation") {
      challenge += `## Low-Carbon Mobility Challenge

Reduce your transportation-related carbon emissions over the next week by making smarter mobility choices. This challenge will help you explore alternatives to high-carbon transportation methods and develop new habits that are better for the planet.

`;
    } else if (challengeFocus === "food") {
      challenge += `## Plant-Powered Diet Challenge

Transform your diet over the next week to significantly reduce your food-related carbon footprint. This challenge will guide you through incorporating more plant-based meals and mindful food choices into your daily routine.

`;
    } else if (challengeFocus === "energy") {
      challenge += `## Home Energy Efficiency Challenge

Dramatically cut your home energy consumption over the next week. This challenge will help you identify energy waste in your home and implement simple but effective changes to reduce your carbon footprint.

`;
    } else if (challengeFocus === "waste") {
      challenge += `## Zero-Waste Week Challenge

Minimize your waste production and improve your recycling habits over the next week. This challenge will help you rethink consumption patterns and develop a more circular approach to resources.

`;
    }
    challenge += `## Daily Tasks

`;
    if (challengeFocus === "transportation") {
      challenge += `**Day 1:** Map out your weekly transportation needs and identify at least 2 trips that could be combined or eliminated.

`;
      challenge += `**Day 2:** Take public transportation, walk, or bike instead of driving for at least one trip today.

`;
      challenge += `**Day 3:** Research carpooling options for your regular commute and reach out to potential carpool partners.

`;
      challenge += `**Day 4:** Try working from home if possible, or find a location closer to home for any meetings/activities.

`;
      challenge += `**Day 5:** Calculate the carbon footprint of a trip you take regularly and research lower-carbon alternatives.

`;
      challenge += `**Day 6:** Plan an errand route that minimizes distance and avoids backtracking.

`;
      challenge += `**Day 7:** Go car-free for the entire day, using only zero or low-carbon transportation methods.

`;
    } else if (challengeFocus === "food") {
      challenge += `**Day 1:** Take inventory of your kitchen and plan plant-based meals for the week.

`;
      challenge += `**Day 2:** Replace one meat-based meal with a fully plant-based alternative.

`;
      challenge += `**Day 3:** Shop for locally grown, seasonal produce to reduce food miles.

`;
      challenge += `**Day 4:** Learn to prepare a new plant-based protein dish (beans, lentils, tofu, etc.).

`;
      challenge += `**Day 5:** Have a zero food waste day - use leftovers creatively and compost any scraps.

`;
      challenge += `**Day 6:** Calculate the carbon footprint difference between a typical meal you enjoy and its plant-based alternative.

`;
      challenge += `**Day 7:** Share a plant-based meal with friends or family and discuss sustainable food choices.

`;
    } else if (challengeFocus === "energy") {
      challenge += `**Day 1:** Conduct a home energy audit to identify major sources of energy consumption.

`;
      challenge += `**Day 2:** Lower your thermostat by 2\xB0C in winter (or raise it by 2\xB0C in summer) and use layers/fans to adjust.

`;
      challenge += `**Day 3:** Unplug all non-essential electronics and chargers when not in use.

`;
      challenge += `**Day 4:** Wash clothes in cold water and hang-dry them instead of using a dryer.

`;
      challenge += `**Day 5:** Replace at least one regular light bulb with an LED equivalent.

`;
      challenge += `**Day 6:** Cook a meal using energy-efficient methods (microwave, pressure cooker, or no-cook meal).

`;
      challenge += `**Day 7:** Spend one evening with minimal electricity use - use candles, play board games, or read by natural light.

`;
    } else if (challengeFocus === "waste") {
      challenge += `**Day 1:** Conduct a waste audit - track all waste you generate in 24 hours and identify reduction opportunities.

`;
      challenge += `**Day 2:** Shop with reusable bags and containers, avoiding all single-use packaging.

`;
      challenge += `**Day 3:** Make one zero-waste swap (reusable water bottle, cloth napkins, bamboo toothbrush, etc.).

`;
      challenge += `**Day 4:** Learn proper recycling guidelines for your area and reorganize your recycling system.

`;
      challenge += `**Day 5:** Repair something instead of replacing it, or find a second use for an item you would normally discard.

`;
      challenge += `**Day 6:** Declutter and donate usable items instead of throwing them away.

`;
      challenge += `**Day 7:** Prepare a completely zero-waste meal from purchase to preparation.

`;
    }
    challenge += `## Expected Carbon Savings

By completing this 7-day challenge, you can expect to reduce your carbon footprint by approximately 15-25 kg CO2. More importantly, the habits you develop during this week could lead to annual savings of 750-1,200 kg CO2 if maintained.

`;
    challenge += `## Tracking Your Progress

Use the app to log your daily activities and see how your carbon footprint changes throughout the challenge. Take note of any barriers you encounter and how you overcome them. Each day you complete successfully earns you points toward your eco-rank. Share your progress with the community for additional support and motivation!`;
    return {
      success: true,
      data: challenge
    };
  } catch (error) {
    console.error("Error generating custom challenge:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate custom challenge"
    };
  }
}
async function analyzeEnvironmentalImpact(activity) {
  try {
    const activityType = activity.type || "general";
    const activitySubType = activity.subType || "";
    const value = parseFloat(activity.value) || 0;
    const unit = activity.unit || "";
    const emissionValue = parseFloat(activity.emissionValue) || 0;
    let analysis = `# Environmental Impact Analysis: ${activity.description || activityType}

`;
    analysis += `## Direct Environmental Impacts

`;
    if (activityType.toLowerCase() === "transportation") {
      analysis += `Your ${activitySubType || "transportation"} activity of ${value} ${unit} results in approximately ${emissionValue.toFixed(2)} kg of CO2 emissions. `;
      if (activitySubType?.toLowerCase() === "car") {
        analysis += `Driving a car not only produces CO2 from fuel combustion but also contributes to:
- Air pollution through nitrogen oxides and particulate matter
- Noise pollution affecting local wildlife and human health
- Road infrastructure expansion leading to habitat fragmentation
- Oil and fluid leakage that can contaminate soil and water sources

The production and disposal of vehicles also have significant lifecycle impacts, including mining for materials and manufacturing emissions.

`;
      } else if (activitySubType?.toLowerCase() === "plane") {
        analysis += `Air travel has one of the highest carbon footprints per passenger-kilometer, especially for short flights where the takeoff and landing phases consume disproportionate amounts of fuel. Beyond CO2, planes emit:
- Nitrogen oxides at high altitudes which have stronger warming effects
- Water vapor that forms contrails, potentially increasing the warming effect
- Particulate matter that affects air quality around airports

The aviation industry also requires extensive infrastructure and resource-intensive manufacturing.

`;
      } else if (activitySubType?.toLowerCase() === "public") {
        analysis += `Public transportation, while still producing emissions, typically has a lower carbon footprint per passenger compared to individual car travel. However, it still contributes to:
- Air pollution, though at a reduced rate per passenger
- Energy consumption for vehicle operations and infrastructure
- Land use changes for transit infrastructure

The environmental footprint varies significantly depending on ridership levels and the power source (diesel vs. electric).

`;
      } else {
        analysis += `This transportation activity contributes to:
- Greenhouse gas emissions
- Air pollution
- Resource consumption
- Infrastructure requirements that impact natural habitats

`;
      }
    } else if (activityType.toLowerCase() === "food") {
      analysis += `Your food consumption activity results in approximately ${emissionValue.toFixed(2)} kg of CO2 emissions. `;
      if (activitySubType?.toLowerCase() === "meat" || activitySubType?.toLowerCase() === "beef") {
        analysis += `Beef production has one of the highest environmental impacts in the food system:
- Requires 15,000-20,000 liters of water per kg of meat produced
- Contributes to deforestation for grazing land and feed production
- Produces significant methane emissions from cattle digestion
- Requires large amounts of land compared to plant-based protein sources
- Uses substantial fertilizers and pesticides for feed production

The processing, refrigeration, and transportation of meat products add further to this footprint.

`;
      } else if (activitySubType?.toLowerCase() === "dairy") {
        analysis += `Dairy production has significant environmental impacts:
- Requires approximately 1,000 liters of water to produce 1 liter of milk
- Generates methane emissions from cattle
- Requires land for grazing and growing feed
- Uses energy for processing, pasteurization, and refrigeration
- Creates waste runoff that can pollute water sources

While less intensive than beef production, dairy still has a higher footprint than plant-based alternatives.

`;
      } else {
        analysis += `Food production contributes to:
- Greenhouse gas emissions from production, processing, and transportation
- Water usage and potential contamination
- Land use changes and potential habitat loss
- Food waste that generates methane in landfills
- Packaging waste that may end up in landfills or oceans

`;
      }
    } else if (activityType.toLowerCase() === "home" || activityType.toLowerCase() === "energy") {
      analysis += `Your ${activitySubType || "home energy"} usage of ${value} ${unit} results in approximately ${emissionValue.toFixed(2)} kg of CO2 emissions. `;
      if (activitySubType?.toLowerCase() === "electricity") {
        analysis += `Electricity consumption impacts depend largely on the generation source:
- Coal or natural gas power plants produce significant CO2, sulfur dioxide, and nitrogen oxides
- Mining for coal and drilling for natural gas cause habitat disruption and potential water contamination
- Power transmission requires infrastructure that can fragment habitats
- Even renewable energy has lifecycle impacts from manufacturing and installation

The average home electricity use in the US produces about 5,500 kg of CO2 annually.

`;
      } else if (activitySubType?.toLowerCase() === "heating" || activitySubType?.toLowerCase() === "gas") {
        analysis += `Natural gas or oil heating contributes to:
- Direct CO2 emissions from combustion
- Potential for methane leakage during extraction and transportation (methane is 25-86 times more potent than CO2 as a greenhouse gas)
- Air quality issues from nitrogen oxides and particulate matter
- Resource extraction impacts including habitat disruption and water usage
- Infrastructure requirements for delivery systems

Space heating typically accounts for 40-60% of home energy use in colder climates.

`;
      } else {
        analysis += `Home energy use contributes to:
- Greenhouse gas emissions from energy generation
- Resource extraction impacts
- Air and water pollution
- Infrastructure requirements
- Electronic waste when devices are disposed

`;
      }
    } else {
      analysis += `This activity produces approximately ${emissionValue.toFixed(2)} kg of CO2 emissions. All consumption activities have environmental impacts through resource extraction, manufacturing, transportation, usage, and disposal phases. The specific impacts depend on the materials involved, energy sources used, and end-of-life management.

`;
    }
    analysis += `## Sustainable Alternatives

`;
    if (activityType.toLowerCase() === "transportation") {
      analysis += `### 1. Switch to Public Transportation
- **Potential Savings**: 50-70% reduction in emissions compared to solo car travel
- **Impact**: For your ${value} ${unit} trip, this could reduce emissions from ${emissionValue.toFixed(2)} kg to approximately ${(emissionValue * 0.4).toFixed(2)} kg CO2
- **Additional Benefits**: Reduced traffic congestion and opportunity to use travel time productively

### 2. Carpool or Rideshare
- **Potential Savings**: 25-50% reduction in per-person emissions
- **Impact**: Sharing your journey with just one other person would cut per-person emissions to ${(emissionValue / 2).toFixed(2)} kg CO2
- **Additional Benefits**: Shared fuel costs and use of high-occupancy vehicle lanes

### 3. Consider Active Transportation
- **Potential Savings**: Nearly 100% reduction in direct emissions
- **Impact**: Walking, cycling, or using an e-bike would reduce your carbon footprint to nearly zero for this journey
- **Additional Benefits**: Physical activity, no fuel costs, and connection with your community

`;
    } else if (activityType.toLowerCase() === "food") {
      analysis += `### 1. Choose Plant-Based Alternatives
- **Potential Savings**: 50-90% reduction in emissions depending on the specific food
- **Impact**: Switching to plant-based proteins could reduce emissions from ${emissionValue.toFixed(2)} kg to approximately ${(emissionValue * 0.2).toFixed(2)} kg CO2
- **Additional Benefits**: Potentially lower cost, reduced water usage, and health benefits

### 2. Select Local, Seasonal Options
- **Potential Savings**: 10-30% reduction in emissions from reduced transportation
- **Impact**: Choosing locally grown seasonal foods could reduce emissions to approximately ${(emissionValue * 0.8).toFixed(2)} kg CO2
- **Additional Benefits**: Fresher food, support for local economy, and connection to natural growing cycles

### 3. Minimize Food Waste
- **Potential Savings**: 20-30% reduction in food-related emissions
- **Impact**: Better planning, storage, and use of leftovers could effectively reduce your food emissions to ${(emissionValue * 0.75).toFixed(2)} kg CO2
- **Additional Benefits**: Cost savings and reduced methane from landfills

`;
    } else if (activityType.toLowerCase() === "home" || activityType.toLowerCase() === "energy") {
      analysis += `### 1. Implement Energy Efficiency Measures
- **Potential Savings**: 10-40% reduction in energy use and associated emissions
- **Impact**: Simple efficiency improvements could reduce emissions from ${emissionValue.toFixed(2)} kg to approximately ${(emissionValue * 0.7).toFixed(2)} kg CO2
- **Additional Benefits**: Lower utility bills and improved home comfort

### 2. Switch to Renewable Energy
- **Potential Savings**: Up to 100% reduction in electricity-related emissions
- **Impact**: Using renewable energy could reduce your electricity emissions to nearly zero
- **Additional Benefits**: Protection from fossil fuel price volatility and support for clean energy development

### 3. Adjust Temperature Settings
- **Potential Savings**: 5-15% reduction in heating/cooling emissions per degree Celsius adjustment
- **Impact**: Setting your thermostat 2\xB0C lower in winter (or higher in summer) could reduce these emissions to approximately ${(emissionValue * 0.85).toFixed(2)} kg CO2
- **Additional Benefits**: Immediate implementation with no investment required

`;
    } else {
      analysis += `### 1. Reduce Consumption
- **Potential Savings**: Direct proportional reduction in environmental impact
- **Impact**: Reducing consumption by 25% would lower emissions to approximately ${(emissionValue * 0.75).toFixed(2)} kg CO2
- **Additional Benefits**: Cost savings and reduced clutter

### 2. Choose Sustainable Alternatives
- **Potential Savings**: 30-70% reduction in lifecycle emissions
- **Impact**: Selecting products with environmental certifications could reduce impact to approximately ${(emissionValue * 0.5).toFixed(2)} kg CO2
- **Additional Benefits**: Support for companies with better environmental practices

### 3. Extend Product Lifespan
- **Potential Savings**: 20-50% reduction in lifecycle emissions through reduced manufacturing needs
- **Impact**: Maintaining and repairing items instead of replacing them reduces manufacturing emissions
- **Additional Benefits**: Cost savings and potential support for local repair businesses

`;
    }
    analysis += `## Comparative Analysis

`;
    analysis += `If you implemented all three alternatives suggested above, you could reduce the environmental impact of this activity by approximately 60-80%. Over a year, making these changes consistently could prevent 250-500 kg of CO2 emissions, equivalent to:

- Growing 10-20 tree seedlings for 10 years
- Avoiding 1,000-2,000 km of driving in an average gasoline car
- Saving 100-200 liters of gasoline

The easiest alternative to implement immediately would be ${activityType.toLowerCase() === "transportation" ? "carpooling" : activityType.toLowerCase() === "food" ? "reducing food waste" : activityType.toLowerCase() === "home" ? "adjusting your thermostat" : "extending product lifespan"}, which requires minimal lifestyle change while still providing significant environmental benefits.`;
    return {
      success: true,
      data: analysis
    };
  } catch (error) {
    console.error("Error analyzing environmental impact:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to analyze environmental impact"
    };
  }
}

// server/routes.ts
var dbStorage2 = new DbStorage();
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized: Please login to access this resource" });
}
async function registerRoutes(app2) {
  setupAuth(app2);
  const apiRouter = express.Router();
  app2.use("/api", apiRouter);
  apiRouter.post("/auth/register", async (req, res) => {
    try {
      const { confirmPassword, ...userData } = registerUserSchema.parse(req.body);
      const existingUser = await dbStorage2.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      const newUser = await dbStorage2.createUser(userData);
      req.login(newUser, (err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to login after registration" });
        }
        const { password, ...safeUser } = newUser;
        return res.status(201).json(safeUser);
      });
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  apiRouter.post("/auth/login", (req, res, next) => {
    try {
      loginUserSchema.parse(req.body);
      passport2.authenticate("local", (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({ message: info.message || "Invalid credentials" });
        }
        req.login(user, (err2) => {
          if (err2) {
            return next(err2);
          }
          const { password, ...safeUser } = user;
          return res.json(safeUser);
        });
      })(req, res, next);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      next(error);
    }
  });
  apiRouter.post("/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });
  apiRouter.get("/auth/session", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ authenticated: false });
    }
    const { password, ...safeUser } = req.user;
    res.json({ authenticated: true, user: safeUser });
  });
  apiRouter.get("/user", isAuthenticated, async (req, res) => {
    const user = req.user;
    const { password, ...safeUser } = user;
    res.json(safeUser);
  });
  apiRouter.get("/activities", isAuthenticated, async (req, res) => {
    const userId = req.user.id;
    const activities2 = await dbStorage2.getActivitiesByUserId(userId);
    res.json(activities2);
  });
  apiRouter.get("/activities/recent", isAuthenticated, async (req, res) => {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;
    const activities2 = await dbStorage2.getRecentActivitiesByUserId(userId, limit);
    res.json(activities2);
  });
  apiRouter.get("/activities/weekly", isAuthenticated, async (req, res) => {
    const userId = req.user.id;
    const activities2 = await dbStorage2.getWeeklyActivitiesByUserId(userId);
    res.json(activities2);
  });
  apiRouter.post("/activities", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const activityData = insertActivitySchema.parse({ ...req.body, userId });
      const activity = await dbStorage2.createActivity(activityData);
      if (activity.co2Emissions) {
        const points = Math.round(Number(activity.co2Emissions) * 5);
        await dbStorage2.updateUserPoints(userId, points);
      }
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create activity" });
    }
  });
  apiRouter.get("/products/barcode/:barcode", isAuthenticated, async (req, res) => {
    const { barcode } = req.params;
    const product = await dbStorage2.getProductByBarcode(barcode);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  });
  apiRouter.get("/products/recent", isAuthenticated, async (req, res) => {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 5;
    const products2 = await dbStorage2.getRecentScannedProducts(userId, limit);
    res.json(products2);
  });
  apiRouter.post("/products", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const productData = insertProductSchema.parse({ ...req.body, userId, isUserContribution: true });
      const product = await dbStorage2.createProduct(productData);
      await dbStorage2.updateUserPoints(userId, 20);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });
  apiRouter.get("/challenges", async (req, res) => {
    const challenges2 = await dbStorage2.getChallenges();
    res.json(challenges2);
  });
  apiRouter.get("/user-challenges", isAuthenticated, async (req, res) => {
    const userId = req.user.id;
    const userChallenges2 = await dbStorage2.getUserChallenges(userId);
    res.json(userChallenges2);
  });
  apiRouter.patch("/user-challenges/:id/progress", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { progress } = req.body;
      if (typeof progress !== "number") {
        return res.status(400).json({ message: "Progress must be a number" });
      }
      const userId = req.user.id;
      const userChallenges2 = await dbStorage2.getUserChallenges(userId);
      const userChallenge = userChallenges2.find((uc) => uc.id === parseInt(id));
      if (!userChallenge) {
        return res.status(404).json({ message: "User challenge not found or doesn't belong to you" });
      }
      const updatedUserChallenge = await dbStorage2.updateUserChallengeProgress(parseInt(id), progress);
      if (updatedUserChallenge?.isCompleted && updatedUserChallenge.completedAt) {
        const challenge = await dbStorage2.getChallenge(updatedUserChallenge.challengeId);
        if (challenge && typeof challenge.points === "number") {
          await dbStorage2.updateUserPoints(userId, challenge.points);
        }
      }
      res.json(updatedUserChallenge);
    } catch (error) {
      console.error("Error updating challenge progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });
  apiRouter.get("/ai/eco-tips", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const activities2 = await dbStorage2.getRecentActivitiesByUserId(userId, 5);
      const tips = await generateEcoTips(activities2);
      res.json(tips);
    } catch (error) {
      console.error("Error generating eco-tips:", error);
      res.status(500).json({ success: false, error: "Failed to generate eco-tips" });
    }
  });
  apiRouter.get("/ai/footprint-analysis", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const weeklyActivities = await dbStorage2.getWeeklyActivitiesByUserId(userId);
      const analysis = await analyzeFootprintTrends(weeklyActivities);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing footprint trends:", error);
      res.status(500).json({ success: false, error: "Failed to analyze footprint trends" });
    }
  });
  apiRouter.get("/ai/custom-challenge", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await dbStorage2.getUser(userId);
      const recentActivities = await dbStorage2.getRecentActivitiesByUserId(userId, 10);
      const userData = {
        user,
        recentActivities
      };
      const challenge = await generateCustomChallenge(userData);
      res.json(challenge);
    } catch (error) {
      console.error("Error generating custom challenge:", error);
      res.status(500).json({ success: false, error: "Failed to generate custom challenge" });
    }
  });
  apiRouter.post("/ai/analyze-impact", isAuthenticated, async (req, res) => {
    try {
      const activity = req.body;
      if (!activity) {
        return res.status(400).json({ success: false, error: "Activity data is required" });
      }
      const impact = await analyzeEnvironmentalImpact(activity);
      res.json(impact);
    } catch (error) {
      console.error("Error analyzing environmental impact:", error);
      res.status(500).json({ success: false, error: "Failed to analyze environmental impact" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs from "fs";
import path2, { dirname as dirname2 } from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/db.ts
import { drizzle as drizzle2 } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import dotenv2 from "dotenv";
dotenv2.config();
var DATABASE_URL = process.env.DATABASE_URL || "";
var sql = neon(DATABASE_URL);
var db2 = drizzle2(sql, { schema: schema_exports });
async function initializeDatabase() {
  try {
    const result = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      )`;
    const tablesExist = result[0]?.exists || false;
    if (!tablesExist) {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          first_name TEXT NOT NULL,
          last_name TEXT,
          email TEXT,
          eco_rank TEXT DEFAULT 'Beginner',
          points INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS activities (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          type TEXT NOT NULL,
          subtype TEXT,
          description TEXT,
          quantity NUMERIC,
          unit TEXT,
          co2_emissions NUMERIC,
          date TIMESTAMP DEFAULT NOW(),
          notes TEXT,
          passengers INTEGER
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS products (
          id SERIAL PRIMARY KEY,
          barcode TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          category TEXT,
          co2_per_unit NUMERIC,
          unit TEXT,
          is_user_contribution BOOLEAN DEFAULT FALSE,
          user_id INTEGER REFERENCES users(id),
          created_at TIMESTAMP DEFAULT NOW()
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS challenges (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          target_value NUMERIC,
          unit TEXT,
          start_date TIMESTAMP DEFAULT NOW(),
          end_date TIMESTAMP,
          category TEXT,
          points INTEGER DEFAULT 0
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS user_challenges (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          challenge_id INTEGER NOT NULL REFERENCES challenges(id),
          progress NUMERIC DEFAULT 0,
          is_completed BOOLEAN DEFAULT FALSE,
          completed_at TIMESTAMP
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS "session" (
          "sid" varchar NOT NULL PRIMARY KEY,
          "sess" json NOT NULL,
          "expire" timestamp(6) NOT NULL
        )
      `;
      await sql`
        CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire")
      `;
      console.log("Database tables created successfully");
    } else {
      console.log("Database tables already exist");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

// server/index.ts
(async () => {
  try {
    await initializeDatabase();
    log("Database initialized successfully");
  } catch (error) {
    log("Failed to initialize database: " + error.message);
  }
})();
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
