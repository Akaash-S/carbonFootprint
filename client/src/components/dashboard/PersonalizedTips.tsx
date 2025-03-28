import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

// Sample tips data
const tips = [
  {
    id: 1,
    title: "Switch to LED Bulbs",
    description: "Could reduce your home energy footprint by up to 15%",
    icon: <Zap className="w-5 h-5 text-success" />,
  },
  {
    id: 2,
    title: "Carpool to Work",
    description: "Your commute is your biggest emission source",
    icon: <Zap className="w-5 h-5 text-success" />,
  },
  {
    id: 3,
    title: "Local Seasonal Produce",
    description: "Buying seasonal reduces CO₂ from food transport",
    icon: <Zap className="w-5 h-5 text-success" />,
  },
];

export function PersonalizedTips() {
  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="font-heading font-semibold mb-4">Personalized Tips</h3>
        
        <div className="space-y-4">
          {tips.map((tip) => (
            <div key={tip.id} className="flex items-start">
              <div className="bg-success bg-opacity-10 p-2 rounded-lg mr-3">
                {tip.icon}
              </div>
              <div>
                <h4 className="font-medium text-sm">{tip.title}</h4>
                <p className="text-sm text-neutral-600">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Button variant="link" className="w-full mt-4 text-sm text-primary">
          Get your full prevention plan
        </Button>
      </CardContent>
    </Card>
  );
}
