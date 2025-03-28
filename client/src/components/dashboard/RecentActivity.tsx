import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  Home, 
  AlertCircle, 
  ShoppingCart, 
  Car, 
  Utensils, 
  Trash 
} from "lucide-react";

export function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activities/recent"],
  });

  // Map activity types to icons
  const getActivityIcon = (type: string, subtype: string) => {
    switch (type) {
      case 'transport':
        return <Car className="w-5 h-5 text-neutral-500" />;
      case 'food':
        return <Utensils className="w-5 h-5 text-neutral-500" />;
      case 'home':
        return <Home className="w-5 h-5 text-neutral-500" />;
      case 'shopping':
        return <ShoppingCart className="w-5 h-5 text-neutral-500" />;
      case 'waste':
        return <Trash className="w-5 h-5 text-neutral-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-neutral-500" />;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + 
        `, ${date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    }
  };

  return (
    <Card className="mt-8">
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-heading font-semibold">Recent Activity</h3>
          <Button variant="link" className="text-sm text-primary">
            View all
          </Button>
        </div>
        
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-neutral-100">
                <div className="flex items-center">
                  <div className="bg-neutral-100 p-2 rounded-lg mr-3">
                    <div className="w-5 h-5 bg-neutral-300 rounded"></div>
                  </div>
                  <div>
                    <div className="h-4 bg-neutral-200 rounded w-40 mb-1"></div>
                    <div className="h-3 bg-neutral-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-neutral-200 rounded w-20 mb-1"></div>
                  <div className="h-3 bg-neutral-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {activities?.map((activity) => (
              <div key={activity.id} className="flex justify-between items-center py-2 border-b border-neutral-100">
                <div className="flex items-center">
                  <div className="bg-neutral-100 p-2 rounded-lg mr-3">
                    {getActivityIcon(activity.type, activity.subtype)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{activity.description}</p>
                    <p className="text-xs text-neutral-500">{formatDate(activity.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono font-medium">{Number(activity.co2Emissions).toFixed(1)} kg CO₂</p>
                  <p className="text-xs text-neutral-500">+15 points</p>
                </div>
              </div>
            ))}
            
            {(!activities || activities.length === 0) && (
              <div className="text-center py-6">
                <p className="text-neutral-500">No activities yet</p>
                <p className="text-sm text-neutral-600 mt-2">Start tracking your carbon footprint</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
