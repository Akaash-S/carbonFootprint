import { 
  User, InsertUser, Activity, InsertActivity, Product, InsertProduct,
  Challenge, InsertChallenge, UserChallenge, InsertUserChallenge
} from "@shared/schema";
import session from 'express-session';

export interface IStorage {
  // Session store for authentication
  sessionStore: session.Store;
  
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: number, points: number): Promise<User | undefined>;
  updateUserEcoRank(userId: number, rank: string): Promise<User | undefined>;

  // Activity operations
  createActivity(activity: InsertActivity): Promise<Activity>;
  getActivitiesByUserId(userId: number): Promise<Activity[]>;
  getRecentActivitiesByUserId(userId: number, limit: number): Promise<Activity[]>;
  getWeeklyActivitiesByUserId(userId: number): Promise<Activity[]>;
  
  // Product operations
  getProductByBarcode(barcode: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  getRecentScannedProducts(userId: number, limit: number): Promise<Product[]>;

  // Challenge operations
  getChallenges(): Promise<Challenge[]>;
  getChallenge(id: number): Promise<Challenge | undefined>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  
  // UserChallenge operations
  getUserChallenges(userId: number): Promise<(UserChallenge & { challenge: Challenge })[]>;
  updateUserChallengeProgress(id: number, progress: number): Promise<UserChallenge | undefined>;
  createUserChallenge(userChallenge: InsertUserChallenge): Promise<UserChallenge>;
}

import createMemoryStore from 'memorystore';

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private activities: Map<number, Activity>;
  private products: Map<number, Product>;
  private challenges: Map<number, Challenge>;
  private userChallenges: Map<number, UserChallenge>;
  
  sessionStore: session.Store;
  
  private currentUserId: number;
  private currentActivityId: number;
  private currentProductId: number;
  private currentChallengeId: number;
  private currentUserChallengeId: number;

  constructor() {
    this.users = new Map();
    this.activities = new Map();
    this.products = new Map();
    this.challenges = new Map();
    this.userChallenges = new Map();
    
    // Initialize the session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    this.currentUserId = 1;
    this.currentActivityId = 1;
    this.currentProductId = 1;
    this.currentChallengeId = 1;
    this.currentUserChallengeId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Add sample user
    const user: User = {
      id: this.currentUserId++,
      username: "alexkim",
      password: "hashed_password",
      firstName: "Alex",
      lastName: "Kim",
      email: "alex@example.com",
      ecoRank: "Eco Hero",
      points: 580,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);

    // Add sample challenges
    const challenge1: Challenge = {
      id: this.currentChallengeId++,
      title: "Meatless Monday",
      description: "Skip meat every Monday this month",
      targetValue: "4",
      unit: "weeks",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      category: "food",
      points: 100,
    };
    
    const challenge2: Challenge = {
      id: this.currentChallengeId++,
      title: "Public Transport Hero",
      description: "Use public transport 5 days in a row",
      targetValue: "5",
      unit: "days",
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      category: "transport",
      points: 80,
    };
    
    this.challenges.set(challenge1.id, challenge1);
    this.challenges.set(challenge2.id, challenge2);

    // Add sample user challenges
    const userChallenge1: UserChallenge = {
      id: this.currentUserChallengeId++,
      userId: user.id,
      challengeId: challenge1.id,
      progress: "3",
      isCompleted: false,
      completedAt: null,
    };
    
    const userChallenge2: UserChallenge = {
      id: this.currentUserChallengeId++,
      userId: user.id,
      challengeId: challenge2.id,
      progress: "2",
      isCompleted: false,
      completedAt: null,
    };
    
    this.userChallenges.set(userChallenge1.id, userChallenge1);
    this.userChallenges.set(userChallenge2.id, userChallenge2);

    // Add sample products
    const product1: Product = {
      id: this.currentProductId++,
      barcode: "8901234567890",
      name: "Organic Oat Milk",
      category: "dairy alternatives",
      co2PerUnit: "0.8",
      unit: "liter",
      isUserContribution: false,
      userId: null,
      createdAt: new Date(),
    };
    
    const product2: Product = {
      id: this.currentProductId++,
      barcode: "7894561230123",
      name: "Whole Grain Bread",
      category: "bakery",
      co2PerUnit: "0.5",
      unit: "loaf",
      isUserContribution: false,
      userId: null,
      createdAt: new Date(),
    };
    
    this.products.set(product1.id, product1);
    this.products.set(product2.id, product2);

    // Add sample activities
    const activity1: Activity = {
      id: this.currentActivityId++,
      userId: user.id,
      type: "home",
      subtype: "electricity",
      description: "Home electricity consumption",
      quantity: "10",
      unit: "kwh",
      co2Emissions: "3.2",
      date: new Date(),
      notes: "",
      passengers: null,
    };
    
    const activity2: Activity = {
      id: this.currentActivityId++,
      userId: user.id,
      type: "transport",
      subtype: "car",
      description: "Car trip",
      quantity: "32",
      unit: "km",
      co2Emissions: "6.8",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
      notes: "",
      passengers: 1,
    };
    
    const activity3: Activity = {
      id: this.currentActivityId++,
      userId: user.id,
      type: "shopping",
      subtype: "groceries",
      description: "Grocery shopping",
      quantity: "1",
      unit: "trip",
      co2Emissions: "2.7",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
      notes: "",
      passengers: null,
    };
    
    this.activities.set(activity1.id, activity1);
    this.activities.set(activity2.id, activity2);
    this.activities.set(activity3.id, activity3);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = { 
      ...user, 
      id, 
      ecoRank: "Beginner", 
      points: 0, 
      createdAt: new Date(),
      lastName: user.lastName || null,
      email: user.email || null
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUserPoints(userId: number, points: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const currentPoints = user.points || 0;
    const updatedUser = { ...user, points: currentPoints + points };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateUserEcoRank(userId: number, rank: string): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ecoRank: rank };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Activity operations
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = this.currentActivityId++;
    const newActivity: Activity = { 
      ...activity, 
      id,
      date: activity.date || new Date(),
      subtype: activity.subtype || null,
      description: activity.description || null,
      quantity: activity.quantity || null,
      unit: activity.unit || null,
      co2Emissions: activity.co2Emissions || null,
      notes: activity.notes || null,
      passengers: activity.passengers || null
    };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  async getActivitiesByUserId(userId: number): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(
      (activity) => activity.userId === userId,
    );
  }

  async getRecentActivitiesByUserId(userId: number, limit: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter((activity) => activity.userId === userId)
      .sort((a, b) => {
        const dateA = a.date || new Date(0);
        const dateB = b.date || new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);
  }

  async getWeeklyActivitiesByUserId(userId: number): Promise<Activity[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return Array.from(this.activities.values()).filter(
      (activity) => activity.userId === userId && (activity.date ? activity.date >= oneWeekAgo : false),
    );
  }

  // Product operations
  async getProductByBarcode(barcode: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.barcode === barcode,
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const newProduct: Product = { 
      ...product, 
      id, 
      createdAt: new Date(),
      userId: product.userId || null,
      unit: product.unit || null,
      category: product.category || null,
      co2PerUnit: product.co2PerUnit || null,
      isUserContribution: product.isUserContribution || null
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async getRecentScannedProducts(userId: number, limit: number): Promise<Product[]> {
    return Array.from(this.products.values())
      .filter((product) => product.userId === userId || product.userId === null)
      .sort((a, b) => {
        const dateA = a.createdAt || new Date(0);
        const dateB = b.createdAt || new Date(0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);
  }

  // Challenge operations
  async getChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values());
  }

  async getChallenge(id: number): Promise<Challenge | undefined> {
    return this.challenges.get(id);
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const id = this.currentChallengeId++;
    const newChallenge: Challenge = { 
      ...challenge, 
      id,
      points: challenge.points || null,
      description: challenge.description || null,
      unit: challenge.unit || null,
      category: challenge.category || null,
      targetValue: challenge.targetValue || null,
      startDate: challenge.startDate || null,
      endDate: challenge.endDate || null
    };
    this.challenges.set(id, newChallenge);
    return newChallenge;
  }

  // UserChallenge operations
  async getUserChallenges(userId: number): Promise<(UserChallenge & { challenge: Challenge })[]> {
    const userChallenges = Array.from(this.userChallenges.values()).filter(
      (userChallenge) => userChallenge.userId === userId,
    );
    
    return userChallenges.map((userChallenge) => {
      const challenge = this.challenges.get(userChallenge.challengeId);
      return {
        ...userChallenge,
        challenge: challenge!,
      };
    });
  }

  async updateUserChallengeProgress(id: number, progress: number): Promise<UserChallenge | undefined> {
    const userChallenge = this.userChallenges.get(id);
    if (!userChallenge) return undefined;
    
    const challenge = this.challenges.get(userChallenge.challengeId);
    if (!challenge) return undefined;
    
    const targetValue = challenge.targetValue ? parseFloat(challenge.targetValue) : 0;
    const isCompleted = progress >= targetValue;
    
    const updatedUserChallenge: UserChallenge = { 
      ...userChallenge, 
      progress: progress.toString(),
      isCompleted: isCompleted,
      completedAt: isCompleted ? new Date() : userChallenge.completedAt,
    };
    
    this.userChallenges.set(id, updatedUserChallenge);
    return updatedUserChallenge;
  }

  async createUserChallenge(userChallenge: InsertUserChallenge): Promise<UserChallenge> {
    const id = this.currentUserChallengeId++;
    const newUserChallenge: UserChallenge = { 
      ...userChallenge, 
      id,
      progress: userChallenge.progress || null,
      isCompleted: userChallenge.isCompleted || null,
      completedAt: userChallenge.completedAt || null
    };
    this.userChallenges.set(id, newUserChallenge);
    return newUserChallenge;
  }
}

export const storage = new MemStorage();
