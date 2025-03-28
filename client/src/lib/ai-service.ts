import { apiRequest } from './queryClient';
import { ActivityData } from './types';
import { AIInsightData } from './types';

/**
 * Fetches personalized eco-tips based on user's recent activities
 * @returns Promise with eco-tips as a string
 */
export async function getEcoTips(): Promise<AIInsightData> {
  try {
    const response = await apiRequest('GET', '/api/ai/eco-tips');
    return await response.json();
  } catch (error) {
    console.error('Error fetching eco-tips:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch eco-tips'
    };
  }
}

/**
 * Fetches carbon footprint trend analysis based on weekly data
 * @returns Promise with analysis as a string
 */
export async function getFootprintAnalysis(): Promise<AIInsightData> {
  try {
    const response = await apiRequest('GET', '/api/ai/footprint-analysis');
    return await response.json();
  } catch (error) {
    console.error('Error fetching footprint analysis:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch footprint analysis'
    };
  }
}

/**
 * Fetches a personalized sustainability challenge
 * @returns Promise with challenge details as a string
 */
export async function getCustomChallenge(): Promise<AIInsightData> {
  try {
    const response = await apiRequest('GET', '/api/ai/custom-challenge');
    return await response.json();
  } catch (error) {
    console.error('Error fetching custom challenge:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch custom challenge'
    };
  }
}

/**
 * Analyzes the environmental impact of an activity
 * @param activity The carbon-producing activity details
 * @returns Promise with impact analysis as a string
 */
export async function analyzeActivityImpact(activity: ActivityData): Promise<AIInsightData> {
  try {
    const response = await apiRequest('POST', '/api/ai/analyze-impact', activity);
    return await response.json();
  } catch (error) {
    console.error('Error analyzing activity impact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze activity impact'
    };
  }
}