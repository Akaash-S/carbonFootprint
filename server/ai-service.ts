import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI with API key
const API_KEY = process.env.GOOGLE_AI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface AIResponse {
  success: boolean;
  data?: string;
  error?: string;
}

/**
 * Generate personalized eco-tips based on user's recent activities
 * @param activities Array of recent user activities
 * @returns Personalized eco-tips as a string
 */
export async function generateEcoTips(activities: any[]): Promise<AIResponse> {
  try {
    if (!API_KEY) {
      return { 
        success: false, 
        error: 'AI API key not configured. Please set the GOOGLE_AI_API_KEY environment variable.' 
      };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Prepare the activities data for the prompt
    const activitiesText = activities && activities.length > 0 
      ? activities.map(a => 
          `- ${a.description || a.type} (${a.value} ${a.unit}): ${a.emissionValue || 'unknown'} kg CO2`
        ).join('\n')
      : 'No activities recorded yet';

    const prompt = `As a sustainability expert, provide 5 personalized eco-tips based on these recent carbon-producing activities:
      
${activitiesText}

Consider the user's lifestyle patterns from these activities. Format each tip with a number, a bold title, and a brief explanation. Include practical, achievable suggestions that would have the most impact in reducing their carbon footprint. Focus on small changes they can make immediately.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      data: text
    };
  } catch (error) {
    console.error('Error generating eco-tips:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate eco-tips'
    };
  }
}

/**
 * Analyze carbon footprint trends and suggest improvements
 * @param weeklyData User's weekly carbon data
 * @returns Analysis and suggestions
 */
export async function analyzeFootprintTrends(weeklyData: any[]): Promise<AIResponse> {
  try {
    if (!API_KEY) {
      return { 
        success: false, 
        error: 'AI API key not configured. Please set the GOOGLE_AI_API_KEY environment variable.' 
      };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Prepare the weekly data for the prompt
    const weeklyDataText = weeklyData && weeklyData.length > 0 
      ? weeklyData.map(d => `- ${d.day || d.date}: ${d.value} kg CO2`).join('\n')
      : 'No weekly data available';

    const prompt = `As a carbon footprint analyst, review this weekly carbon emission data and provide insights:
      
${weeklyDataText}

Analyze trends, identify the highest emission days and potential reasons, and suggest 3-4 specific strategies to reduce the carbon footprint. Include a percentage improvement target that feels achievable based on the data. Format your response with clear sections for Trend Analysis, Patterns Identified, and Recommendations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      data: text
    };
  } catch (error) {
    console.error('Error analyzing footprint trends:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze footprint trends'
    };
  }
}

/**
 * Generate a customized sustainability challenge for the user
 * @param userData User profile and recent activities
 * @returns Custom challenge description
 */
export async function generateCustomChallenge(userData: any): Promise<AIResponse> {
  try {
    if (!API_KEY) {
      return { 
        success: false, 
        error: 'AI API key not configured. Please set the GOOGLE_AI_API_KEY environment variable.' 
      };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Extract user profile and activities
    const { profile, activities } = userData;
    const profileText = profile 
      ? `User Profile: ${profile.firstName}, Eco Rank: ${profile.ecoRank || 'Beginner'}, Points: ${profile.points || 0}`
      : 'New user with no established profile';
    
    const activitiesText = activities && activities.length > 0 
      ? activities.map(a => 
          `- ${a.description || a.type} (${a.value} ${a.unit}): ${a.emissionValue || 'unknown'} kg CO2`
        ).join('\n')
      : 'No activities recorded yet';

    const prompt = `As a sustainability coach, create a personalized 7-day challenge for this user:
      
${profileText}

Recent activities:
${activitiesText}

Design a specific, measurable, achievable challenge that will help them reduce their carbon footprint. The challenge should be tailored to their activity patterns. Include a title, description, daily tasks for each of the 7 days, expected carbon savings, and how to track progress. Make it engaging and slightly challenging but realistic.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      data: text
    };
  } catch (error) {
    console.error('Error generating custom challenge:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate custom challenge'
    };
  }
}

/**
 * Calculate the potential environmental impact of an activity
 * @param activity The carbon-producing activity details
 * @returns Analysis of environmental impact and alternatives
 */
export async function analyzeEnvironmentalImpact(activity: any): Promise<AIResponse> {
  try {
    if (!API_KEY) {
      return { 
        success: false, 
        error: 'AI API key not configured. Please set the GOOGLE_AI_API_KEY environment variable.' 
      };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Format the activity for the prompt
    const activityText = `Activity: ${activity.description || activity.type} (${activity.subType || 'general'})
Amount: ${activity.value} ${activity.unit}
Estimated Emissions: ${activity.emissionValue || 'unknown'} kg CO2`;

    const prompt = `As an environmental scientist, analyze the environmental impact of this activity:
      
${activityText}

Provide a detailed breakdown of the direct and indirect environmental impacts, including CO2 emissions, resource consumption, and other effects. Then suggest 3 specific, realistic alternatives that would reduce this impact, quantifying the potential savings where possible. Include a comparative analysis showing how much better these alternatives are. Format your response with clear sections and use scientific data to support your analysis.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      data: text
    };
  } catch (error) {
    console.error('Error analyzing environmental impact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze environmental impact'
    };
  }
}