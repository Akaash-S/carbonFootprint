import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { Calendar } from "@/components/ui/calendar";
import { AIInsights } from "@/components/insights/AIInsights";
import { ActivityImpactAnalysis } from "@/components/insights/ActivityImpactAnalysis";
import { Brain } from "lucide-react";

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

// Sample weekly data - would come from API in real implementation
const weeklyData = [
  { day: "Mon", value: 5.2 },
  { day: "Tue", value: 8.7 },
  { day: "Wed", value: 6.3 },
  { day: "Thu", value: 4.5 },
  { day: "Fri", value: 7.1 },
  { day: "Sat", value: 5.8 },
  { day: "Sun", value: 5.6 },
];

// Sample monthly data
const monthlyData = [
  { date: "Jan", value: 160 },
  { date: "Feb", value: 170 },
  { date: "Mar", value: 145 },
  { date: "Apr", value: 140 },
  { date: "May", value: 135 },
  { date: "Jun", value: 150 },
  { date: "Jul", value: 120 },
  { date: "Aug", value: 115 },
  { date: "Sep", value: 130 },
  { date: "Oct", value: 125 },
  { date: "Nov", value: 140 },
  { date: "Dec", value: 155 },
];

// Sample category data
const categoryData = [
  { name: "Transport", value: 40 },
  { name: "Food", value: 30 },
  { name: "Home", value: 20 },
  { name: "Shopping", value: 5 },
  { name: "Waste", value: 5 },
];

// Sample comparison data
const comparisonData = [
  { name: "You", value: 43.2 },
  { name: "Local Avg", value: 58.4 },
  { name: "National Avg", value: 62.7 },
  { name: "Global Avg", value: 70.2 },
];

export default function Insights() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("overview");

  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/activities/weekly"],
  });

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-semibold mb-1">Carbon Insights</h2>
        <p className="text-neutral-600">
          Analyze your carbon footprint and discover patterns to help reduce emissions
        </p>
      </div>

      <Tabs defaultValue="overview" className="mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center">
            <Brain className="mr-2 h-4 w-4" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Carbon Breakdown</CardTitle>
                <CardDescription>
                  Your emissions by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} kg`, undefined]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Emissions</CardTitle>
                <CardDescription>
                  Your carbon footprint for the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={weeklyData}
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="day" />
                      <YAxis 
                        width={40}
                        tickFormatter={(value) => `${value} kg`}
                      />
                      <Tooltip formatter={(value) => [`${value} kg`, undefined]} />
                      <Bar 
                        dataKey="value" 
                        fill="hsl(var(--primary))" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Carbon Comparison</CardTitle>
              <CardDescription>
                How your emissions compare to averages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={comparisonData}
                    layout="vertical"
                    margin={{ top: 5, right: 5, left: 60, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" unit=" kg" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip formatter={(value) => [`${value} kg CO₂`, undefined]} />
                    <Bar 
                      dataKey="value" 
                      fill="hsl(var(--primary))"
                      background={{ fill: 'hsl(var(--muted))' }}
                      radius={[0, 4, 4, 0]} 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>
                Your carbon footprint over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis 
                      width={40}
                      tickFormatter={(value) => `${value} kg`}
                    />
                    <Tooltip formatter={(value) => [`${value} kg`, undefined]} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      activeDot={{ r: 8 }} 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Improvement Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Monthly Reduction</span>
                    <span className="font-mono text-success">-12%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Yearly Progress</span>
                    <span className="font-mono text-success">-8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Best Reduction</span>
                    <span className="font-mono">Transport (-18%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Seasonal Patterns</CardTitle>
                <CardDescription>
                  How your footprint changes with seasons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-neutral-100 p-3 rounded-lg">
                    <div className="text-3xl mb-2">🌱</div>
                    <div className="font-medium">Spring</div>
                    <div className="text-sm text-neutral-600">52 kg/week</div>
                  </div>
                  <div className="bg-neutral-100 p-3 rounded-lg">
                    <div className="text-3xl mb-2">☀️</div>
                    <div className="font-medium">Summer</div>
                    <div className="text-sm text-neutral-600">48 kg/week</div>
                  </div>
                  <div className="bg-neutral-100 p-3 rounded-lg">
                    <div className="text-3xl mb-2">🍂</div>
                    <div className="font-medium">Fall</div>
                    <div className="text-sm text-neutral-600">50 kg/week</div>
                  </div>
                  <div className="bg-neutral-100 p-3 rounded-lg">
                    <div className="text-3xl mb-2">❄️</div>
                    <div className="font-medium">Winter</div>
                    <div className="text-sm text-neutral-600">62 kg/week</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Your Carbon Ranking</CardTitle>
                <CardDescription>
                  How you compare to others in your region
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-6 bg-neutral-200 rounded-full mb-8">
                  <div 
                    className="absolute h-6 bg-primary rounded-full" 
                    style={{ width: '35%' }}
                  ></div>
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 h-8 w-8 bg-white border-4 border-primary rounded-full -ml-4"
                    style={{ left: '35%' }}
                  ></div>
                  <div className="absolute top-full mt-2 text-sm" style={{ left: '15%' }}>Better</div>
                  <div className="absolute top-full mt-2 text-sm" style={{ left: '85%' }}>Worse</div>
                </div>
                <div className="text-center">
                  <p className="font-medium text-lg">You are doing better than 65% of users in your area</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Eco Status</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-success inline-block p-4 rounded-full text-white mb-4">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-1">Eco Hero</h3>
                <p className="text-neutral-600">Top 15% in your region</p>
                <div className="mt-4">
                  <div className="text-sm text-neutral-600">Path to next status:</div>
                  <div className="mt-2 font-medium">Climate Champion</div>
                  <div className="text-sm">Reduce by 10% more</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detailed Comparison</CardTitle>
              <CardDescription>
                Category by category comparison with averages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {categoryData.map((category, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{category.name}</span>
                      <span className="font-mono">{category.value} kg vs. 50 kg avg</span>
                    </div>
                    <div className="relative h-3 bg-neutral-200 rounded-full">
                      <div 
                        className="absolute h-3 bg-primary rounded-full" 
                        style={{ width: `${(category.value / 50) * 100}%` }}
                      ></div>
                      <div 
                        className="absolute h-6 w-0.5 bg-neutral-400 top-1/2 -translate-y-1/2"
                        style={{ left: '100%' }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Date Selection</CardTitle>
                <CardDescription>
                  View your emissions for a specific day
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Daily Breakdown</CardTitle>
                <CardDescription>
                  {date ? `Emissions for ${date.toLocaleDateString()}` : "Select a date to view details"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {date ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                      <div className="flex items-center">
                        <div className="bg-neutral-100 p-2 rounded-lg mr-3">
                          <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Home electricity consumption</p>
                          <p className="text-xs text-neutral-500">Morning, 9:30 AM</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-medium">3.2 kg CO₂</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                      <div className="flex items-center">
                        <div className="bg-neutral-100 p-2 rounded-lg mr-3">
                          <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Car trip (15km)</p>
                          <p className="text-xs text-neutral-500">Afternoon, 2:45 PM</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-medium">2.9 kg CO₂</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                      <div className="flex items-center">
                        <div className="bg-neutral-100 p-2 rounded-lg mr-3">
                          <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Lunch (vegetarian)</p>
                          <p className="text-xs text-neutral-500">Afternoon, 12:30 PM</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono font-medium">0.8 kg CO₂</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48">
                    <p className="text-neutral-500">Select a date to view detailed emissions</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Reduction Opportunities</CardTitle>
              <CardDescription>
                Where you can make the biggest impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-neutral-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Transportation (18.5 kg CO₂)</h4>
                      <ul className="mt-2 space-y-1 text-sm text-neutral-600">
                        <li>• Consider carpooling for your daily commute (saves 9.2 kg/week)</li>
                        <li>• Use public transportation once a week (saves 3.8 kg/week)</li>
                        <li>• Plan errands efficiently to reduce driving distance</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="p-4 border border-neutral-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Home Energy (9.3 kg CO₂)</h4>
                      <ul className="mt-2 space-y-1 text-sm text-neutral-600">
                        <li>• Switch to LED bulbs throughout your home (saves 0.9 kg/week)</li>
                        <li>• Reduce thermostat by 1°C (saves 1.2 kg/week)</li>
                        <li>• Unplug electronics when not in use</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai">
          <div className="grid grid-cols-1 gap-6">
            <AIInsights />
            
            {/* Display activity-specific insights for a selected activity if available */}
            {activeTab === 'ai' && date && (
              <ActivityImpactAnalysis 
                activity={{
                  type: 'transportation',
                  subType: 'car',
                  value: 15,
                  unit: 'km',
                  date: date.toISOString(),
                  description: 'Car trip',
                  emissionValue: 2.9
                }} 
              />
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
