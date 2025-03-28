import { 
  users, activities, products, challenges, userChallenges,
  User, InsertUser, Activity, InsertActivity, Product, InsertProduct,
  Challenge, InsertChallenge, UserChallenge, InsertUserChallenge
} from '@shared/schema';
import { IStorage } from './storage';
import bcrypt from 'bcryptjs';
import { eq, desc, and, gte, sql as drizzleSql } from 'drizzle-orm';
import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';
import connectPg from 'connect-pg-simple';
import session from 'express-session';

// Create a database pool
export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Configure PostgreSQL session store
const PostgresStore = connectPg(session);

// Create Drizzle instance
const db = drizzle(pool, { schema });

export class DbStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    // Initialize the PostgreSQL session store
    this.sessionStore = new PostgresStore({
      pool,
      createTableIfMissing: true
    });
  }
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(userInput: InsertUser): Promise<User> {
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(userInput.password, 10);
    
    const [user] = await db.insert(users).values({
      ...userInput,
      password: hashedPassword
    }).returning();
    
    return user;
  }

  async updateUserPoints(userId: number, points: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const [updatedUser] = await db.update(users)
      .set({ points: (user.points || 0) + points })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }

  async updateUserEcoRank(userId: number, rank: string): Promise<User | undefined> {
    const [updatedUser] = await db.update(users)
      .set({ ecoRank: rank })
      .where(eq(users.id, userId))
      .returning();
    
    return updatedUser;
  }

  // Activity operations
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const [newActivity] = await db.insert(activities).values(activity).returning();
    return newActivity;
  }

  async getActivitiesByUserId(userId: number): Promise<Activity[]> {
    const result = await db.select().from(activities)
      .where(eq(activities.userId, userId));
    return result;
  }

  async getRecentActivitiesByUserId(userId: number, limit: number): Promise<Activity[]> {
    const result = await db.select().from(activities)
      .where(eq(activities.userId, userId))
      .orderBy(desc(activities.date))
      .limit(limit);
    return result;
  }

  async getWeeklyActivitiesByUserId(userId: number): Promise<Activity[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const result = await db.select().from(activities)
      .where(and(
        eq(activities.userId, userId),
        gte(activities.date, oneWeekAgo)
      ));
    return result;
  }

  // Product operations
  async getProductByBarcode(barcode: string): Promise<Product | undefined> {
    const result = await db.select().from(products)
      .where(eq(products.barcode, barcode));
    return result[0];
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async getRecentScannedProducts(userId: number, limit: number): Promise<Product[]> {
    // Get both user's products and general products (where userId is null)
    const result = await db.select().from(products)
      .where(
        drizzleSql`${products.userId} = ${userId} OR ${products.userId} IS NULL`
      )
      .orderBy(desc(products.createdAt))
      .limit(limit);
    return result;
  }

  // Challenge operations
  async getChallenges(): Promise<Challenge[]> {
    return await db.select().from(challenges);
  }

  async getChallenge(id: number): Promise<Challenge | undefined> {
    const result = await db.select().from(challenges)
      .where(eq(challenges.id, id));
    return result[0];
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const [newChallenge] = await db.insert(challenges).values(challenge).returning();
    return newChallenge;
  }

  // UserChallenge operations
  async getUserChallenges(userId: number): Promise<(UserChallenge & { challenge: Challenge })[]> {
    // This is a bit more complex with joins
    const result = await db.query.userChallenges.findMany({
      where: eq(userChallenges.userId, userId),
      with: {
        challenge: true
      }
    });

    return result.map(r => ({
      ...r,
      challenge: r.challenge
    }));
  }

  async updateUserChallengeProgress(id: number, progress: number): Promise<UserChallenge | undefined> {
    const userChallenge = await db.select().from(userChallenges)
      .where(eq(userChallenges.id, id))
      .then(res => res[0]);
    
    if (!userChallenge) return undefined;
    
    // Get the challenge to determine if it's completed
    const challenge = await this.getChallenge(userChallenge.challengeId);
    if (!challenge) return undefined;
    
    const isCompleted = progress >= Number(challenge.targetValue || 0);
    const completedAt = isCompleted ? new Date() : userChallenge.completedAt;
    
    const [updatedUserChallenge] = await db.update(userChallenges)
      .set({ 
        progress: progress.toString(), // Convert to string as the schema expects
        isCompleted,
        completedAt
      })
      .where(eq(userChallenges.id, id))
      .returning();
    
    return updatedUserChallenge;
  }

  async createUserChallenge(userChallenge: InsertUserChallenge): Promise<UserChallenge> {
    const [newUserChallenge] = await db.insert(userChallenges).values(userChallenge).returning();
    return newUserChallenge;
  }

  // Authentication methods
  async validateUser(username: string, password: string): Promise<User | null> {
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
}