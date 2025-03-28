import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import express, { Express } from 'express';
import session from 'express-session';
import connectPg from 'connect-pg-simple';
import bcrypt from 'bcryptjs';
import { User as UserType } from '@shared/schema';
import { DbStorage, pool } from './db-storage';

// Create a database storage instance
const dbStorage = new DbStorage();

// Define Express User interface to include our User type
declare global {
  namespace Express {
    // We need to define the User interface without extending directly
    interface User {
      id: number;
      username: string;
      password: string;
      firstName: string;
      lastName: string | null;
      email: string | null;
      ecoRank: string | null;
      points: number | null;
      createdAt: Date | null;
    }
  }
}

export function setupAuth(app: Express) {
  // Configure session middleware with the session store from our storage
  app.use(
    session({
      store: dbStorage.sessionStore,
      secret: process.env.SESSION_SECRET || 'carbon-footprint-tracker-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
      }
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Configure Local Strategy for authentication
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        // Find user by username
        const user = await dbStorage.getUserByUsername(username);
        
        if (!user) {
          return done(null, false, { message: 'Incorrect username' });
        }
        
        // Verify password
        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
          return done(null, false, { message: 'Incorrect password' });
        }
        
        // Authentication successful
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    })
  );

  // Serialize user (store user ID in session)
  passport.serializeUser((user: Express.User, done) => {
    done(null, user.id);
  });

  // Deserialize user (retrieve user from database using ID from session)
  passport.deserializeUser(async (id: number, done) => {
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