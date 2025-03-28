import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Sample data - would come from the API in a real implementation
const sampleData = [
  { day: "Mon", userEmissions: 5.2, averageEmissions: 7.8 },
  { day: "Tue", userEmissions: 8.7, averageEmissions: 8.2 },
  { day: "Wed", userEmissions: 6.3, averageEmissions: 8.5 },
  { day: "Thu", userEmissions: 4.5, averageEmissions: 9.1 },
  { day: "Fri", userEmissions: 7.1, averageEmissions: 8.7 },
  { day: "Sat", userEmissions: 5.8, averageEmissions: 9.3 },
  { day: "Sun", userEmissions: 5.6, averageEmissions: 10.2 },
];

type TimeRange = "week" | "month" | "year";

export function WeeklySummary() {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activities/weekly"],
  });

  // Group activities by day for the chart
  const chartData = React.useMemo(() => {
    if (!activities || activities.length === 0) {
      return sampleData;
    }

    // Process real data
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1); // Start from Monday
    
    const dailyEmissions = daysOfWeek.map((day, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      
      // Find activities for this day
      const dayActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate.toDateString() === date.toDateString();
      });
      
      // Sum emissions for the day
      const userEmissions = dayActivities.reduce(
        (sum, activity) => sum + Number(activity.co2Emissions), 
        0
      );
      
      return {
        day,
        userEmissions: parseFloat(userEmissions.toFixed(1)),
        // Using sample averages for now
        averageEmissions: sampleData[index].averageEmissions
      };
    });
    
    return dailyEmissions;
  }, [activities]);

  // Calculate summary statistics
  const totalEmissions = chartData.reduce((sum, day) => sum + day.userEmissions, 0);
  const avgEmissions = sampleData.reduce((sum, day) => sum + day.averageEmissions, 0);
  const emissionsChange = ((totalEmissions - avgEmissions) / avgEmissions * 100).toFixed(0);
  
  // Find biggest emission source
  const biggestSource = { name: "Transport", amount: 18.5 };

  return (
    <Card className="mb-8">
      <CardContent className="p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-heading font-semibold">Weekly Carbon Impact</h3>
          <div className="flex space-x-2">
            <Button 
              variant={timeRange === "week" ? "default" : "ghost"} 
              size="sm" 
              className="rounded-full text-sm h-8"
              onClick={() => setTimeRange("week")}
            >
              Week
            </Button>
            <Button 
              variant={timeRange === "month" ? "default" : "ghost"} 
              size="sm" 
              className="rounded-full text-sm h-8"
              onClick={() => setTimeRange("month")}
            >
              Month
            </Button>
            <Button 
              variant={timeRange === "year" ? "default" : "ghost"} 
              size="sm" 
              className="rounded-full text-sm h-8"
              onClick={() => setTimeRange("year")}
            >
              Year
            </Button>
          </div>
        </div>
        
        <div className="h-64">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="h-32 w-full bg-neutral-100 animate-pulse rounded-lg"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis 
                  label={{ value: 'kg CO₂', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }} 
                  width={40}
                />
                <Tooltip 
                  formatter={(value) => [`${value} kg`, undefined]}
                  labelFormatter={(label) => `${label}`}
                />
                <Legend align="center" verticalAlign="top" height={36} />
                <Bar 
                  name="Your Emissions" 
                  dataKey="userEmissions" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                />
                <Bar 
                  name="Average User" 
                  dataKey="averageEmissions" 
                  fill="hsl(var(--muted))" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-neutral-500 text-sm">Total Emissions</p>
            <p className="font-mono text-xl font-medium">{totalEmissions.toFixed(1)} kg</p>
            <p className={emissionsChange.startsWith('-') ? "text-success text-xs" : "text-error text-xs"}>
              {emissionsChange}% vs avg
            </p>
          </div>
          <div>
            <p className="text-neutral-500 text-sm">Biggest Source</p>
            <p className="font-medium">{biggestSource.name}</p>
            <p className="text-sm">{biggestSource.amount} kg CO₂</p>
          </div>
          <div>
            <p className="text-neutral-500 text-sm">Savings</p>
            <p className="font-mono text-xl font-medium">15.2 kg</p>
            <p className="text-success text-xs">120 points earned</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
