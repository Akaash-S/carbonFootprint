import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { DbStorage } from "./db-storage";
import { 
  insertActivitySchema, insertProductSchema, loginUserSchema, registerUserSchema 
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import passport from "passport";
import { setupAuth } from "./auth";
import { 
  generateEcoTips, 
  analyzeFootprintTrends, 
  generateCustomChallenge, 
  analyzeEnvironmentalImpact 
} from "./ai-service";

// Create database storage instance
const dbStorage = new DbStorage();

// Middleware to check if user is authenticated
function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized: Please login to access this resource" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
  // API Routes
  const apiRouter = express.Router();
  app.use("/api", apiRouter);

  // Authentication Routes
  apiRouter.post("/auth/register", async (req, res) => {
    try {
      // Validate request body against registerUserSchema
      const { confirmPassword, ...userData } = registerUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await dbStorage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Create user
      const newUser = await dbStorage.createUser(userData);
      
      // Login the user after registration
      req.login(newUser, (err) => {
        if (err) {
          return res.status(500).json({ message: "Failed to login after registration" });
        }
        
        // Return user without password
        const { password, ...safeUser } = newUser;
        return res.status(201).json(safeUser);
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });
  
  apiRouter.post("/auth/login", (req, res, next) => {
    try {
      // Validate request body
      loginUserSchema.parse(req.body);
      
      passport.authenticate("local", (err: any, user: any, info: any) => {
        if (err) {
          return next(err);
        }
        
        if (!user) {
          return res.status(401).json({ message: info.message || "Invalid credentials" });
        }
        
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
          
          // Return user without password
          const { password, ...safeUser } = user;
          return res.json(safeUser);
        });
      })(req, res, next);
    } catch (error) {
      if (error instanceof z.ZodError) {
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
  
  // Current User Route
  apiRouter.get("/auth/session", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ authenticated: false });
    }
    const { password, ...safeUser } = req.user as any;
    res.json({ authenticated: true, user: safeUser });
  });

  // User Routes
  apiRouter.get("/user", isAuthenticated, async (req, res) => {
    // Get the authenticated user from the session
    const user = req.user as any;
    
    // Don't send password
    const { password, ...safeUser } = user;
    res.json(safeUser);
  });

  // Activity Routes
  apiRouter.get("/activities", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).id;
    const activities = await dbStorage.getActivitiesByUserId(userId);
    res.json(activities);
  });

  apiRouter.get("/activities/recent", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).id;
    const limit = parseInt(req.query.limit as string) || 5;
    const activities = await dbStorage.getRecentActivitiesByUserId(userId, limit);
    res.json(activities);
  });

  apiRouter.get("/activities/weekly", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).id;
    const activities = await dbStorage.getWeeklyActivitiesByUserId(userId);
    res.json(activities);
  });

  apiRouter.post("/activities", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const activityData = insertActivitySchema.parse({ ...req.body, userId });
      
      const activity = await dbStorage.createActivity(activityData);
      
      // Update user points based on activity
      if (activity.co2Emissions) {
        // Award points for logging activities (simplified for demo)
        const points = Math.round(Number(activity.co2Emissions) * 5);
        await dbStorage.updateUserPoints(userId, points);
      }
      
      res.status(201).json(activity);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create activity" });
    }
  });

  // Product Routes
  apiRouter.get("/products/barcode/:barcode", isAuthenticated, async (req, res) => {
    const { barcode } = req.params;
    const product = await dbStorage.getProductByBarcode(barcode);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    res.json(product);
  });

  apiRouter.get("/products/recent", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).id;
    const limit = parseInt(req.query.limit as string) || 5;
    const products = await dbStorage.getRecentScannedProducts(userId, limit);
    res.json(products);
  });

  apiRouter.post("/products", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const productData = insertProductSchema.parse({ ...req.body, userId, isUserContribution: true });
      
      const product = await dbStorage.createProduct(productData);
      
      // Award points for adding a new product to the database
      await dbStorage.updateUserPoints(userId, 20);
      
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Challenge Routes
  apiRouter.get("/challenges", async (req, res) => {
    // Publicly available - no authentication required
    const challenges = await dbStorage.getChallenges();
    res.json(challenges);
  });

  apiRouter.get("/user-challenges", isAuthenticated, async (req, res) => {
    const userId = (req.user as any).id;
    const userChallenges = await dbStorage.getUserChallenges(userId);
    res.json(userChallenges);
  });

  apiRouter.patch("/user-challenges/:id/progress", isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { progress } = req.body;
      
      if (typeof progress !== "number") {
        return res.status(400).json({ message: "Progress must be a number" });
      }
      
      // First verify that the challenge belongs to the user
      const userId = (req.user as any).id;
      const userChallenges = await dbStorage.getUserChallenges(userId);
      const userChallenge = userChallenges.find(uc => uc.id === parseInt(id));
      
      if (!userChallenge) {
        return res.status(404).json({ message: "User challenge not found or doesn't belong to you" });
      }
      
      const updatedUserChallenge = await dbStorage.updateUserChallengeProgress(parseInt(id), progress);
      
      // If challenge completed, award points
      if (updatedUserChallenge?.isCompleted && updatedUserChallenge.completedAt) {
        const challenge = await dbStorage.getChallenge(updatedUserChallenge.challengeId);
        if (challenge && typeof challenge.points === 'number') {
          await dbStorage.updateUserPoints(userId, challenge.points);
        }
      }
      
      res.json(updatedUserChallenge);
    } catch (error) {
      console.error("Error updating challenge progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // AI-powered Routes
  apiRouter.get("/ai/eco-tips", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const activities = await dbStorage.getRecentActivitiesByUserId(userId, 5);
      const tips = await generateEcoTips(activities);
      res.json(tips);
    } catch (error) {
      console.error("Error generating eco-tips:", error);
      res.status(500).json({ success: false, error: "Failed to generate eco-tips" });
    }
  });

  apiRouter.get("/ai/footprint-analysis", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const weeklyActivities = await dbStorage.getWeeklyActivitiesByUserId(userId);
      const analysis = await analyzeFootprintTrends(weeklyActivities);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing footprint trends:", error);
      res.status(500).json({ success: false, error: "Failed to analyze footprint trends" });
    }
  });

  apiRouter.get("/ai/custom-challenge", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const user = await dbStorage.getUser(userId);
      const recentActivities = await dbStorage.getRecentActivitiesByUserId(userId, 10);
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

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
