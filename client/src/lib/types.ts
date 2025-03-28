// Define activity data structure used throughout the application
export interface ActivityData {
  type: string;              // Main category: 'transportation', 'food', 'home', etc.
  subType?: string;          // Subcategory: 'car', 'plane', 'meat', 'electricity', etc.
  value: number;             // Numerical value of the activity
  unit: string;              // Unit of measurement: 'km', 'kg', 'kWh', etc.
  date: string;              // ISO date string
  description?: string;      // User description
  emissionValue?: number;    // Calculated CO2 equivalent in kg
  userId?: number;           // Associated user ID
  id?: number;               // Activity ID in the database
}

// Define product data structure used for barcode scanning
export interface ProductData {
  id?: number;
  barcode: string;
  name: string;
  category?: string;
  brand?: string;
  carbonFootprint?: number;  // CO2 equivalent in kg
  sustainabilityScore?: number; // 0-100 score
  alternativeSuggestions?: string[]; // More sustainable alternatives
  imageUrl?: string;
  userId?: number;
  createdAt?: string;
}

// Define challenge data structure
export interface ChallengeData {
  id?: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  durationDays: number;
  carbonSavingPotential?: number; // Potential carbon savings in kg
  imageUrl?: string;
  createdAt?: string;
}

// Define user challenge progress data
export interface UserChallengeData {
  id?: number;
  userId: number;
  challengeId: number;
  startDate: string;
  endDate?: string;
  progress: number; // 0-100 percentage
  isCompleted: boolean;
  carbonSaved?: number;
  notes?: string;
  createdAt?: string;
  challenge?: ChallengeData;
}

// Define AI insight response data
export interface AIInsightData {
  success: boolean;
  data?: string;
  error?: string;
  timestamp?: string;
}