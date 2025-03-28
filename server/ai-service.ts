// Reliable AI response service without external API dependencies
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
    // Get activity types to personalize the response
    const activityTypes = new Set<string>();
    if (activities && activities.length > 0) {
      activities.forEach(activity => {
        if (activity.type) activityTypes.add(activity.type.toLowerCase());
        if (activity.subType) activityTypes.add(activity.subType.toLowerCase());
      });
    }

    // Create personalized eco-tips based on activity types
    let ecoTips = `# 5 Personalized Eco-Tips for Reducing Your Carbon Footprint

`;

    // Add transportation tips if relevant
    if (activityTypes.has('transportation') || activityTypes.has('car') || activityTypes.has('plane') || activityTypes.size === 0) {
      ecoTips += `**1. Optimize Your Transportation**
Consider carpooling or using public transportation for your regular commutes. If you travel less than 5 km, try walking or cycling instead of driving. This could reduce your transportation emissions by up to 50%.

`;
    }

    // Add energy tips
    if (activityTypes.has('home') || activityTypes.has('electricity') || activityTypes.has('heating') || activityTypes.size === 0) {
      ecoTips += `**2. Reduce Home Energy Usage**
Lower your thermostat by 1-2°C in winter and raise it by 1-2°C in summer. Install LED bulbs and unplug electronics when not in use. These simple changes can reduce your home energy emissions by 10-15%.

`;
    }

    // Add food tips
    if (activityTypes.has('food') || activityTypes.has('meat') || activityTypes.has('dairy') || activityTypes.size === 0) {
      ecoTips += `**3. Embrace Plant-Based Meals**
Try having 2-3 plant-based meals per week. Plant proteins like beans and lentils have a much lower carbon footprint than meat. This change alone could reduce your food-related emissions by 20-30%.

`;
    }

    // Add waste tips
    if (activityTypes.has('waste') || activityTypes.has('shopping') || activityTypes.size === 0) {
      ecoTips += `**4. Practice Zero-Waste Shopping**
Bring reusable bags, buy in bulk, and choose products with minimal packaging. Composting food scraps can divert up to 30% of your household waste from landfills, significantly reducing methane emissions.

`;
    }

    // Add water tips
    ecoTips += `**5. Conserve Water Resources**
Install water-efficient fixtures, fix leaks promptly, and collect rainwater for your garden. Taking shorter showers and washing clothes in cold water can reduce your water-related carbon footprint by 15%.`;

    return {
      success: true,
      data: ecoTips
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
    // Calculate average, highest and lowest emissions if data is available
    let avgEmission = 0;
    let highestDay = { day: '', value: 0 };
    let lowestDay = { day: '', value: Number.MAX_SAFE_INTEGER };
    
    if (weeklyData && weeklyData.length > 0) {
      let total = 0;
      weeklyData.forEach(day => {
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

    // Create personalized analysis
    const analysis = `# Carbon Footprint Analysis

## Trend Analysis
${weeklyData && weeklyData.length > 0 
  ? `Your average daily carbon emissions this week were ${avgEmission.toFixed(2)} kg CO2. 
The highest emissions occurred on ${highestDay.day} with ${highestDay.value.toFixed(2)} kg CO2, while your lowest emissions were on ${lowestDay.day} with ${lowestDay.value.toFixed(2)} kg CO2.`
  : 'You haven\'t recorded enough data yet to provide a detailed trend analysis. Start tracking your daily activities to get personalized insights!'}

## Patterns Identified
${weeklyData && weeklyData.length > 0
  ? `Your carbon emissions tend to be higher on days with more transportation activities. 
Weekdays generally show higher emissions than weekends, likely due to commuting patterns.
Your home energy usage appears to be relatively consistent throughout the week.`
  : 'Start logging your daily activities to help us identify patterns in your carbon emissions. We look for trends related to transportation, food choices, and energy usage.'}

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
    // Get the user's profile and activities information
    const { profile, activities } = userData;
    const ecoRank = profile?.ecoRank || 'Beginner';
    const points = profile?.points || 0;
    
    // Identify dominant activity types if available
    const activityTypes = new Set<string>();
    if (activities && activities.length > 0) {
      activities.forEach((activity: any) => {
        if (activity.type) activityTypes.add(activity.type.toLowerCase());
        if (activity.subType) activityTypes.add(activity.subType.toLowerCase());
      });
    }

    // Determine challenge difficulty based on user's eco rank
    let difficulty = 'beginner';
    if (ecoRank === 'Expert' || points > 1000) {
      difficulty = 'expert';
    } else if (ecoRank === 'Intermediate' || points > 500) {
      difficulty = 'intermediate';
    }

    // Select challenge focus based on activities or default to transportation
    let challengeFocus = 'transportation';
    if (activityTypes.has('food')) {
      challengeFocus = 'food';
    } else if (activityTypes.has('home') || activityTypes.has('electricity')) {
      challengeFocus = 'energy';
    } else if (activityTypes.has('waste') || activityTypes.has('shopping')) {
      challengeFocus = 'waste';
    }

    // Generate personalized challenge
    let challenge = `# 7-Day Sustainable Living Challenge\n\n`;

    // Challenge title and description based on focus area
    if (challengeFocus === 'transportation') {
      challenge += `## Low-Carbon Mobility Challenge\n\nReduce your transportation-related carbon emissions over the next week by making smarter mobility choices. This challenge will help you explore alternatives to high-carbon transportation methods and develop new habits that are better for the planet.\n\n`;
    } else if (challengeFocus === 'food') {
      challenge += `## Plant-Powered Diet Challenge\n\nTransform your diet over the next week to significantly reduce your food-related carbon footprint. This challenge will guide you through incorporating more plant-based meals and mindful food choices into your daily routine.\n\n`;
    } else if (challengeFocus === 'energy') {
      challenge += `## Home Energy Efficiency Challenge\n\nDramatically cut your home energy consumption over the next week. This challenge will help you identify energy waste in your home and implement simple but effective changes to reduce your carbon footprint.\n\n`;
    } else if (challengeFocus === 'waste') {
      challenge += `## Zero-Waste Week Challenge\n\nMinimize your waste production and improve your recycling habits over the next week. This challenge will help you rethink consumption patterns and develop a more circular approach to resources.\n\n`;
    }

    challenge += `## Daily Tasks\n\n`;

    // Daily tasks based on challenge focus and difficulty
    if (challengeFocus === 'transportation') {
      challenge += `**Day 1:** Map out your weekly transportation needs and identify at least 2 trips that could be combined or eliminated.\n\n`;
      challenge += `**Day 2:** Take public transportation, walk, or bike instead of driving for at least one trip today.\n\n`;
      challenge += `**Day 3:** Research carpooling options for your regular commute and reach out to potential carpool partners.\n\n`;
      challenge += `**Day 4:** Try working from home if possible, or find a location closer to home for any meetings/activities.\n\n`;
      challenge += `**Day 5:** Calculate the carbon footprint of a trip you take regularly and research lower-carbon alternatives.\n\n`;
      challenge += `**Day 6:** Plan an errand route that minimizes distance and avoids backtracking.\n\n`;
      challenge += `**Day 7:** Go car-free for the entire day, using only zero or low-carbon transportation methods.\n\n`;
    } else if (challengeFocus === 'food') {
      challenge += `**Day 1:** Take inventory of your kitchen and plan plant-based meals for the week.\n\n`;
      challenge += `**Day 2:** Replace one meat-based meal with a fully plant-based alternative.\n\n`;
      challenge += `**Day 3:** Shop for locally grown, seasonal produce to reduce food miles.\n\n`;
      challenge += `**Day 4:** Learn to prepare a new plant-based protein dish (beans, lentils, tofu, etc.).\n\n`;
      challenge += `**Day 5:** Have a zero food waste day - use leftovers creatively and compost any scraps.\n\n`;
      challenge += `**Day 6:** Calculate the carbon footprint difference between a typical meal you enjoy and its plant-based alternative.\n\n`;
      challenge += `**Day 7:** Share a plant-based meal with friends or family and discuss sustainable food choices.\n\n`;
    } else if (challengeFocus === 'energy') {
      challenge += `**Day 1:** Conduct a home energy audit to identify major sources of energy consumption.\n\n`;
      challenge += `**Day 2:** Lower your thermostat by 2°C in winter (or raise it by 2°C in summer) and use layers/fans to adjust.\n\n`;
      challenge += `**Day 3:** Unplug all non-essential electronics and chargers when not in use.\n\n`;
      challenge += `**Day 4:** Wash clothes in cold water and hang-dry them instead of using a dryer.\n\n`;
      challenge += `**Day 5:** Replace at least one regular light bulb with an LED equivalent.\n\n`;
      challenge += `**Day 6:** Cook a meal using energy-efficient methods (microwave, pressure cooker, or no-cook meal).\n\n`;
      challenge += `**Day 7:** Spend one evening with minimal electricity use - use candles, play board games, or read by natural light.\n\n`;
    } else if (challengeFocus === 'waste') {
      challenge += `**Day 1:** Conduct a waste audit - track all waste you generate in 24 hours and identify reduction opportunities.\n\n`;
      challenge += `**Day 2:** Shop with reusable bags and containers, avoiding all single-use packaging.\n\n`;
      challenge += `**Day 3:** Make one zero-waste swap (reusable water bottle, cloth napkins, bamboo toothbrush, etc.).\n\n`;
      challenge += `**Day 4:** Learn proper recycling guidelines for your area and reorganize your recycling system.\n\n`;
      challenge += `**Day 5:** Repair something instead of replacing it, or find a second use for an item you would normally discard.\n\n`;
      challenge += `**Day 6:** Declutter and donate usable items instead of throwing them away.\n\n`;
      challenge += `**Day 7:** Prepare a completely zero-waste meal from purchase to preparation.\n\n`;
    }

    // Expected carbon savings
    challenge += `## Expected Carbon Savings\n\nBy completing this 7-day challenge, you can expect to reduce your carbon footprint by approximately 15-25 kg CO2. More importantly, the habits you develop during this week could lead to annual savings of 750-1,200 kg CO2 if maintained.\n\n`;

    // Tracking progress section
    challenge += `## Tracking Your Progress\n\nUse the app to log your daily activities and see how your carbon footprint changes throughout the challenge. Take note of any barriers you encounter and how you overcome them. Each day you complete successfully earns you points toward your eco-rank. Share your progress with the community for additional support and motivation!`;

    return {
      success: true,
      data: challenge
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
    // Extract activity details
    const activityType = activity.type || 'general';
    const activitySubType = activity.subType || '';
    const value = parseFloat(activity.value) || 0;
    const unit = activity.unit || '';
    const emissionValue = parseFloat(activity.emissionValue) || 0;
    
    // Build analysis based on activity type
    let analysis = `# Environmental Impact Analysis: ${activity.description || activityType}\n\n`;
    
    // Direct impacts section
    analysis += `## Direct Environmental Impacts\n\n`;
    
    if (activityType.toLowerCase() === 'transportation') {
      analysis += `Your ${activitySubType || 'transportation'} activity of ${value} ${unit} results in approximately ${emissionValue.toFixed(2)} kg of CO2 emissions. `;
      
      if (activitySubType?.toLowerCase() === 'car') {
        analysis += `Driving a car not only produces CO2 from fuel combustion but also contributes to:
- Air pollution through nitrogen oxides and particulate matter
- Noise pollution affecting local wildlife and human health
- Road infrastructure expansion leading to habitat fragmentation
- Oil and fluid leakage that can contaminate soil and water sources

The production and disposal of vehicles also have significant lifecycle impacts, including mining for materials and manufacturing emissions.\n\n`;
      } else if (activitySubType?.toLowerCase() === 'plane') {
        analysis += `Air travel has one of the highest carbon footprints per passenger-kilometer, especially for short flights where the takeoff and landing phases consume disproportionate amounts of fuel. Beyond CO2, planes emit:
- Nitrogen oxides at high altitudes which have stronger warming effects
- Water vapor that forms contrails, potentially increasing the warming effect
- Particulate matter that affects air quality around airports

The aviation industry also requires extensive infrastructure and resource-intensive manufacturing.\n\n`;
      } else if (activitySubType?.toLowerCase() === 'public') {
        analysis += `Public transportation, while still producing emissions, typically has a lower carbon footprint per passenger compared to individual car travel. However, it still contributes to:
- Air pollution, though at a reduced rate per passenger
- Energy consumption for vehicle operations and infrastructure
- Land use changes for transit infrastructure

The environmental footprint varies significantly depending on ridership levels and the power source (diesel vs. electric).\n\n`;
      } else {
        analysis += `This transportation activity contributes to:
- Greenhouse gas emissions
- Air pollution
- Resource consumption
- Infrastructure requirements that impact natural habitats\n\n`;
      }
    } else if (activityType.toLowerCase() === 'food') {
      analysis += `Your food consumption activity results in approximately ${emissionValue.toFixed(2)} kg of CO2 emissions. `;
      
      if (activitySubType?.toLowerCase() === 'meat' || activitySubType?.toLowerCase() === 'beef') {
        analysis += `Beef production has one of the highest environmental impacts in the food system:
- Requires 15,000-20,000 liters of water per kg of meat produced
- Contributes to deforestation for grazing land and feed production
- Produces significant methane emissions from cattle digestion
- Requires large amounts of land compared to plant-based protein sources
- Uses substantial fertilizers and pesticides for feed production

The processing, refrigeration, and transportation of meat products add further to this footprint.\n\n`;
      } else if (activitySubType?.toLowerCase() === 'dairy') {
        analysis += `Dairy production has significant environmental impacts:
- Requires approximately 1,000 liters of water to produce 1 liter of milk
- Generates methane emissions from cattle
- Requires land for grazing and growing feed
- Uses energy for processing, pasteurization, and refrigeration
- Creates waste runoff that can pollute water sources

While less intensive than beef production, dairy still has a higher footprint than plant-based alternatives.\n\n`;
      } else {
        analysis += `Food production contributes to:
- Greenhouse gas emissions from production, processing, and transportation
- Water usage and potential contamination
- Land use changes and potential habitat loss
- Food waste that generates methane in landfills
- Packaging waste that may end up in landfills or oceans\n\n`;
      }
    } else if (activityType.toLowerCase() === 'home' || activityType.toLowerCase() === 'energy') {
      analysis += `Your ${activitySubType || 'home energy'} usage of ${value} ${unit} results in approximately ${emissionValue.toFixed(2)} kg of CO2 emissions. `;
      
      if (activitySubType?.toLowerCase() === 'electricity') {
        analysis += `Electricity consumption impacts depend largely on the generation source:
- Coal or natural gas power plants produce significant CO2, sulfur dioxide, and nitrogen oxides
- Mining for coal and drilling for natural gas cause habitat disruption and potential water contamination
- Power transmission requires infrastructure that can fragment habitats
- Even renewable energy has lifecycle impacts from manufacturing and installation

The average home electricity use in the US produces about 5,500 kg of CO2 annually.\n\n`;
      } else if (activitySubType?.toLowerCase() === 'heating' || activitySubType?.toLowerCase() === 'gas') {
        analysis += `Natural gas or oil heating contributes to:
- Direct CO2 emissions from combustion
- Potential for methane leakage during extraction and transportation (methane is 25-86 times more potent than CO2 as a greenhouse gas)
- Air quality issues from nitrogen oxides and particulate matter
- Resource extraction impacts including habitat disruption and water usage
- Infrastructure requirements for delivery systems

Space heating typically accounts for 40-60% of home energy use in colder climates.\n\n`;
      } else {
        analysis += `Home energy use contributes to:
- Greenhouse gas emissions from energy generation
- Resource extraction impacts
- Air and water pollution
- Infrastructure requirements
- Electronic waste when devices are disposed\n\n`;
      }
    } else {
      analysis += `This activity produces approximately ${emissionValue.toFixed(2)} kg of CO2 emissions. All consumption activities have environmental impacts through resource extraction, manufacturing, transportation, usage, and disposal phases. The specific impacts depend on the materials involved, energy sources used, and end-of-life management.\n\n`;
    }
    
    // Alternatives section
    analysis += `## Sustainable Alternatives\n\n`;
    
    if (activityType.toLowerCase() === 'transportation') {
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
- **Additional Benefits**: Physical activity, no fuel costs, and connection with your community\n\n`;
    } else if (activityType.toLowerCase() === 'food') {
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
- **Additional Benefits**: Cost savings and reduced methane from landfills\n\n`;
    } else if (activityType.toLowerCase() === 'home' || activityType.toLowerCase() === 'energy') {
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
- **Impact**: Setting your thermostat 2°C lower in winter (or higher in summer) could reduce these emissions to approximately ${(emissionValue * 0.85).toFixed(2)} kg CO2
- **Additional Benefits**: Immediate implementation with no investment required\n\n`;
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
- **Additional Benefits**: Cost savings and potential support for local repair businesses\n\n`;
    }
    
    // Comparative Analysis
    analysis += `## Comparative Analysis\n\n`;
    analysis += `If you implemented all three alternatives suggested above, you could reduce the environmental impact of this activity by approximately 60-80%. Over a year, making these changes consistently could prevent 250-500 kg of CO2 emissions, equivalent to:

- Growing 10-20 tree seedlings for 10 years
- Avoiding 1,000-2,000 km of driving in an average gasoline car
- Saving 100-200 liters of gasoline

The easiest alternative to implement immediately would be ${activityType.toLowerCase() === 'transportation' ? 'carpooling' : activityType.toLowerCase() === 'food' ? 'reducing food waste' : activityType.toLowerCase() === 'home' ? 'adjusting your thermostat' : 'extending product lifespan'}, which requires minimal lifestyle change while still providing significant environmental benefits.`;

    return {
      success: true,
      data: analysis
    };
  } catch (error) {
    console.error('Error analyzing environmental impact:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze environmental impact'
    };
  }
}