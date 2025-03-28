import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "@/lib/types";

// Sample category data
const categories = [
  { name: "Transport", color: "bg-error", emissions: 18.5 },
  { name: "Food", color: "bg-warning", emissions: 12.7 },
  { name: "Home Energy", color: "bg-info", emissions: 9.3 },
  { name: "Shopping", color: "bg-secondary", emissions: 2.7 },
];

export function ImpactCategories() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activities/weekly"],
  });

  // Group activities by category for real data
  const categoryData = React.useMemo(() => {
    if (!activities || activities.length === 0) {
      return categories;
    }

    const categoryMap: Record<string, number> = {};
    
    activities.forEach((activity) => {
      const type = activity.type;
      const emissions = Number(activity.co2Emissions) || 0;
      
      if (categoryMap[type]) {
        categoryMap[type] += emissions;
      } else {
        categoryMap[type] = emissions;
      }
    });
    
    // Map to display format with colors
    const colorMap: Record<string, string> = {
      transport: "bg-error",
      food: "bg-warning",
      home: "bg-info",
      shopping: "bg-secondary",
      waste: "bg-primary",
    };
    
    const displayNames: Record<string, string> = {
      transport: "Transport",
      food: "Food",
      home: "Home Energy",
      shopping: "Shopping",
      waste: "Waste",
    };
    
    return Object.entries(categoryMap).map(([type, emissions]) => ({
      name: displayNames[type] || type.charAt(0).toUpperCase() + type.slice(1),
      color: colorMap[type] || "bg-neutral-500",
      emissions: parseFloat(emissions.toFixed(1)),
    })).sort((a, b) => b.emissions - a.emissions);
  }, [activities]);

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="font-heading font-semibold mb-4">Impact Categories</h3>
        
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-neutral-300 mr-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-24"></div>
                </div>
                <div className="h-4 bg-neutral-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {categoryData.map((category, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${category.color} mr-2`}></div>
                  <span>{category.name}</span>
                </div>
                <span className="font-mono text-sm">{category.emissions} kg</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
