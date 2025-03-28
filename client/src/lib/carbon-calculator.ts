// Carbon calculator utility functions

// Calculate CO2 emissions for transportation
export function calculateTransportEmissions(
  type: string,
  distance: number,
  passengers: number = 1
): number {
  // CO2 emissions in kg per km
  const emissionsPerKm: Record<string, number> = {
    car: 0.192, // Average car (gasoline)
    bus: 0.105,
    train: 0.041,
    plane: 0.255,
    bicycle: 0,
    walking: 0,
  };

  // For vehicles that carry passengers, divide by the number of passengers
  let emissions = emissionsPerKm[type] * distance;
  
  if (type === 'car' || type === 'bus') {
    emissions = emissions / Math.max(1, passengers);
  }
  
  return parseFloat(emissions.toFixed(2));
}

// Calculate CO2 emissions for food
export function calculateFoodEmissions(
  type: string,
  quantity: number
): number {
  // CO2 emissions in kg per kg of food
  const emissionsPerKg: Record<string, number> = {
    beef: 60,
    pork: 7,
    chicken: 6,
    fish: 5,
    dairy: 3,
    vegetables: 0.5,
    fruits: 0.8,
    grains: 1.5,
  };
  
  return parseFloat((emissionsPerKg[type] * quantity).toFixed(2));
}

// Calculate CO2 emissions for home energy
export function calculateHomeEmissions(
  type: string,
  quantity: number
): number {
  // CO2 emissions in kg per unit
  const emissionsPerUnit: Record<string, number> = {
    electricity: 0.32, // kg per kWh (varies by region)
    naturalGas: 0.18, // kg per kWh
    heating: 0.27, // kg per kWh
    water: 0.001, // kg per liter
  };
  
  return parseFloat((emissionsPerUnit[type] * quantity).toFixed(2));
}

// Calculate CO2 emissions for waste
export function calculateWasteEmissions(
  type: string,
  quantity: number
): number {
  // CO2 emissions in kg per kg of waste
  const emissionsPerKg: Record<string, number> = {
    landfill: 0.52,
    recycled: 0.1,
    composted: 0.05,
  };
  
  return parseFloat((emissionsPerKg[type] * quantity).toFixed(2));
}

// Calculate CO2 emissions for shopping
export function calculateShoppingEmissions(
  type: string,
  quantity: number
): number {
  // CO2 emissions in kg per item (rough estimates)
  const emissionsPerItem: Record<string, number> = {
    clothing: 10,
    electronics: 50,
    furniture: 30,
    groceries: 2.7, // per trip average
  };
  
  return parseFloat((emissionsPerItem[type] * quantity).toFixed(2));
}

// Calculate emissions based on activity type
export function calculateEmissions(
  type: string,
  subtype: string,
  quantity: number,
  passengers?: number
): number {
  switch (type) {
    case 'transport':
      return calculateTransportEmissions(subtype, quantity, passengers);
    case 'food':
      return calculateFoodEmissions(subtype, quantity);
    case 'home':
      return calculateHomeEmissions(subtype, quantity);
    case 'waste':
      return calculateWasteEmissions(subtype, quantity);
    case 'shopping':
      return calculateShoppingEmissions(subtype, quantity);
    default:
      return 0;
  }
}

// Get personalized tips based on activity
export function getPersonalizedTip(
  type: string,
  subtype: string,
  emissions: number
): string {
  const tips: Record<string, string[]> = {
    transport: [
      "Consider carpooling to reduce per-person emissions.",
      "Public transportation can reduce your carbon footprint significantly.",
      "For short distances, consider walking or cycling.",
      "Regular car maintenance improves fuel efficiency.",
    ],
    food: [
      "Reducing meat consumption can lower your carbon footprint.",
      "Locally sourced food reduces transportation emissions.",
      "Consider plant-based alternatives to reduce emissions.",
      "Meal planning helps reduce food waste.",
    ],
    home: [
      "Switch to LED bulbs to reduce energy consumption.",
      "Lower your thermostat by 1°C to save up to 10% on heating.",
      "Unplug devices when not in use to avoid phantom power consumption.",
      "Wash clothes in cold water to save energy.",
    ],
    shopping: [
      "Buy second-hand items to reduce manufacturing emissions.",
      "Choose products with less packaging to reduce waste.",
      "Bring reusable bags when shopping.",
      "Consider the longevity of products before purchasing.",
    ],
    waste: [
      "Composting food waste reduces landfill emissions.",
      "Proper recycling reduces the need for new raw materials.",
      "Reduce single-use plastics to minimize waste.",
      "Repair items instead of replacing them when possible.",
    ],
  };
  
  // Select a random tip for the activity type
  const typeTips = tips[type] || tips['transport'];
  return typeTips[Math.floor(Math.random() * typeTips.length)];
}
