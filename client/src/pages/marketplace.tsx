import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { Globe, TreeDeciduous, Leaf, Wind, Droplets, ThumbsUp } from "lucide-react";

export default function Marketplace() {
  const { data: user } = useQuery({
    queryKey: ["/api/user"],
  });

  const [offsetAmount, setOffsetAmount] = React.useState([50]);

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-semibold mb-1">Carbon Offset Marketplace</h2>
        <p className="text-neutral-600">
          Support projects that reduce carbon emissions and help the planet
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Your Carbon Footprint</CardTitle>
            <CardDescription>
              Offset some or all of your emissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Amount to offset:</span>
                <span className="font-mono">{offsetAmount[0]} kg CO₂</span>
              </div>
              <Slider 
                value={offsetAmount} 
                onValueChange={setOffsetAmount} 
                max={100} 
                step={1} 
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Partial Offset</span>
                <span>Full Monthly Footprint</span>
              </div>
            </div>
            
            <div className="p-4 border border-neutral-200 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-2">
                <span>Cost of offset:</span>
                <span className="font-mono font-medium">${(offsetAmount[0] * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span>Using points:</span>
                <span className="font-mono font-medium">-${(Math.min(user?.points || 0, offsetAmount[0]) * 0.02).toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between items-center font-medium">
                <span>Total:</span>
                <span className="font-mono">${Math.max(0, (offsetAmount[0] * 0.08) - (Math.min(user?.points || 0, offsetAmount[0]) * 0.02)).toFixed(2)}</span>
              </div>
            </div>
            
            <div className="text-sm text-neutral-600 mb-4">
              <p>Your points balance: <span className="font-medium">{user?.points || 0} points</span></p>
              <p className="mt-1">Points value: <span className="font-medium">${((user?.points || 0) * 0.02).toFixed(2)}</span></p>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Purchase Offset</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Offset History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border border-neutral-200 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">April 2023</span>
                  <span className="font-mono">30 kg CO₂</span>
                </div>
                <div className="text-sm text-neutral-600">Rainforest Protection</div>
                <div className="text-xs text-neutral-500 mt-1">Completed on Apr 15, 2023</div>
              </div>
              <div className="p-3 border border-neutral-200 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="font-medium">March 2023</span>
                  <span className="font-mono">45 kg CO₂</span>
                </div>
                <div className="text-sm text-neutral-600">Renewable Energy</div>
                <div className="text-xs text-neutral-500 mt-1">Completed on Mar 12, 2023</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View All History</Button>
          </CardFooter>
        </Card>
      </div>

      <div>
        <h3 className="text-xl font-heading font-semibold mb-4">Featured Projects</h3>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Projects</TabsTrigger>
            <TabsTrigger value="forest">Forest Protection</TabsTrigger>
            <TabsTrigger value="renewable">Renewable Energy</TabsTrigger>
            <TabsTrigger value="community">Community Projects</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="aspect-video bg-neutral-100 flex items-center justify-center relative overflow-hidden rounded-t-lg">
                <TreeDeciduous className="w-12 h-12 text-neutral-400" />
                <Badge className="absolute top-2 right-2">Popular</Badge>
              </div>
              <CardHeader>
                <CardTitle>Amazon Rainforest Protection</CardTitle>
                <CardDescription>Brazil</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 mb-4">
                  Protect vital rainforest areas from deforestation, preserving biodiversity 
                  and maintaining one of Earth's largest carbon sinks.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Price per kg CO₂:</span>
                    <span className="font-mono font-medium">$0.08</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Verification:</span>
                    <span className="text-sm text-success">Gold Standard</span>
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="w-4 h-4 text-success mr-1" />
                    <span className="text-sm">956 people supported this project</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Support This Project</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <div className="aspect-video bg-neutral-100 flex items-center justify-center relative overflow-hidden rounded-t-lg">
                <Wind className="w-12 h-12 text-neutral-400" />
              </div>
              <CardHeader>
                <CardTitle>Wind Farm Development</CardTitle>
                <CardDescription>Northern Europe</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 mb-4">
                  Fund new wind turbines that replace fossil fuel energy with clean, 
                  renewable power in coastal regions of Northern Europe.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Price per kg CO₂:</span>
                    <span className="font-mono font-medium">$0.09</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Verification:</span>
                    <span className="text-sm text-success">Verified Carbon Standard</span>
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="w-4 h-4 text-success mr-1" />
                    <span className="text-sm">742 people supported this project</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Support This Project</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <div className="aspect-video bg-neutral-100 flex items-center justify-center relative overflow-hidden rounded-t-lg">
                <Leaf className="w-12 h-12 text-neutral-400" />
              </div>
              <CardHeader>
                <CardTitle>Community Reforestation</CardTitle>
                <CardDescription>Kenya</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 mb-4">
                  Support local communities in planting and maintaining native trees, 
                  providing sustainable livelihoods and restoring ecosystems.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Price per kg CO₂:</span>
                    <span className="font-mono font-medium">$0.07</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Verification:</span>
                    <span className="text-sm text-success">Plan Vivo</span>
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="w-4 h-4 text-success mr-1" />
                    <span className="text-sm">623 people supported this project</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Support This Project</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="forest">
            {/* Forest protection specific projects */}
          </TabsContent>
          
          <TabsContent value="renewable">
            {/* Renewable energy specific projects */}
          </TabsContent>
          
          <TabsContent value="community">
            {/* Community specific projects */}
          </TabsContent>
        </Tabs>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Global Impact Map</CardTitle>
            <CardDescription>
              See where your contributions are making a difference
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-neutral-100 rounded-lg flex items-center justify-center">
              <Globe className="w-12 h-12 text-neutral-400" />
              <span className="ml-2 text-neutral-500">Interactive map would appear here</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
