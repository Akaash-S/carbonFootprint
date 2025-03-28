import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Globe, Users, MessageCircle, ThumbsUp, Award, Share2 } from "lucide-react";

export default function Community() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-semibold mb-1">Community</h2>
        <p className="text-neutral-600">
          Connect with others and share your sustainability journey
        </p>
      </div>

      <Tabs defaultValue="feed">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        {/* Community Feed Tab */}
        <TabsContent value="feed">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Post Creation */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarFallback>AK</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Input 
                        placeholder="Share your sustainability achievements..." 
                        className="mb-3"
                      />
                      <div className="flex justify-between">
                        <Button variant="outline" size="sm">Add Photo</Button>
                        <Button size="sm">Post</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feed Posts */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">Jane Doe</CardTitle>
                      <CardDescription>2 hours ago</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Just completed my first week of biking to work instead of driving! 
                    Saved approximately 12kg of CO₂ emissions and feeling great about it! 💚🚲
                  </p>
                  <div className="rounded-lg overflow-hidden bg-neutral-100 h-48 flex items-center justify-center">
                    <span className="text-neutral-400">Image of bicycle</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="ghost" size="sm" className="flex gap-1 items-center">
                    <ThumbsUp className="w-4 h-4" />
                    <span>42 Likes</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex gap-1 items-center">
                    <MessageCircle className="w-4 h-4" />
                    <span>12 Comments</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex gap-1 items-center">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>MT</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">Michael Thompson</CardTitle>
                      <CardDescription>Yesterday</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>
                    Just installed solar panels on my roof! Excited to see how this affects my carbon footprint 
                    in the coming months. Has anyone else done this and seen significant reductions?
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="ghost" size="sm" className="flex gap-1 items-center">
                    <ThumbsUp className="w-4 h-4" />
                    <span>28 Likes</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex gap-1 items-center">
                    <MessageCircle className="w-4 h-4" />
                    <span>8 Comments</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="flex gap-1 items-center">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarFallback className="text-xl">AK</AvatarFallback>
                  </Avatar>
                  <h3 className="font-medium text-lg">Alex Kim</h3>
                  <p className="text-neutral-600 text-sm">Eco Hero</p>
                  <div className="mt-4 space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Carbon Saved:</span>
                      <span className="font-medium">158 kg CO₂</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Points:</span>
                      <span className="font-medium">580</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Challenges:</span>
                      <span className="font-medium">2 active</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Edit Profile</Button>
                </CardFooter>
              </Card>

              {/* Popular Groups */}
              <Card>
                <CardHeader>
                  <CardTitle>Popular Groups</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback><Users className="w-4 h-4" /></AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">Zero Waste Living</p>
                      <p className="text-xs text-neutral-600">1,248 members</p>
                    </div>
                    <Button size="sm">Join</Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback><Users className="w-4 h-4" /></AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">Plant-Based Diet</p>
                      <p className="text-xs text-neutral-600">842 members</p>
                    </div>
                    <Button size="sm" variant="outline">Joined</Button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback><Users className="w-4 h-4" /></AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">Sustainable Transport</p>
                      <p className="text-xs text-neutral-600">576 members</p>
                    </div>
                    <Button size="sm">Join</Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="w-full">View All Groups</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Zero Waste Living</CardTitle>
                    <CardDescription>Tips and experiences for reducing waste</CardDescription>
                  </div>
                  <Badge>1,248 members</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 mb-4">
                  Share your journey to zero waste, get advice on reducing plastic, 
                  and learn to compost effectively.
                </p>
                <div className="flex -space-x-4">
                  {[...Array(5)].map((_, i) => (
                    <Avatar key={i} className="border-2 border-white">
                      <AvatarFallback>{String.fromCharCode(65 + i)}</AvatarFallback>
                    </Avatar>
                  ))}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 border-2 border-white text-xs font-medium">
                    +1.2k
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Join Group</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Plant-Based Diet</CardTitle>
                    <CardDescription>Explore plant-based eating</CardDescription>
                  </div>
                  <Badge variant="outline">Joined</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 mb-4">
                  Share recipes, nutrition tips, and success stories about 
                  reducing meat consumption and embracing plant foods.
                </p>
                <div className="flex -space-x-4">
                  {[...Array(5)].map((_, i) => (
                    <Avatar key={i} className="border-2 border-white">
                      <AvatarFallback>{String.fromCharCode(70 + i)}</AvatarFallback>
                    </Avatar>
                  ))}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 border-2 border-white text-xs font-medium">
                    +837
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Leave Group</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Sustainable Transport</CardTitle>
                    <CardDescription>Alternatives to cars and planes</CardDescription>
                  </div>
                  <Badge>576 members</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-neutral-600 mb-4">
                  Discuss biking, public transport, electric vehicles, and 
                  carpooling to reduce transportation emissions.
                </p>
                <div className="flex -space-x-4">
                  {[...Array(5)].map((_, i) => (
                    <Avatar key={i} className="border-2 border-white">
                      <AvatarFallback>{String.fromCharCode(75 + i)}</AvatarFallback>
                    </Avatar>
                  ))}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 border-2 border-white text-xs font-medium">
                    +571
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Join Group</Button>
              </CardFooter>
            </Card>
          </div>

          <div className="mt-6">
            <Button>Create New Group</Button>
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Community Leaderboard</CardTitle>
                  <CardDescription>Top carbon reducers this month</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="cursor-pointer">Weekly</Badge>
                  <Badge className="cursor-pointer">Monthly</Badge>
                  <Badge variant="outline" className="cursor-pointer">All Time</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center p-3 bg-amber-50 rounded-lg">
                  <div className="font-bold text-amber-700 text-lg mr-4">1</div>
                  <Avatar className="mr-4">
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">Sarah J.</div>
                    <div className="text-sm text-neutral-600">Reduced 218 kg CO₂ this month</div>
                  </div>
                  <Award className="w-6 h-6 text-amber-500" />
                </div>
                
                <div className="flex items-center p-3 bg-neutral-100 rounded-lg">
                  <div className="font-bold text-neutral-700 text-lg mr-4">2</div>
                  <Avatar className="mr-4">
                    <AvatarFallback>MT</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">Michael T.</div>
                    <div className="text-sm text-neutral-600">Reduced 202 kg CO₂ this month</div>
                  </div>
                  <Award className="w-6 h-6 text-neutral-400" />
                </div>
                
                <div className="flex items-center p-3 bg-amber-50 bg-opacity-30 rounded-lg">
                  <div className="font-bold text-amber-800 text-lg mr-4">3</div>
                  <Avatar className="mr-4">
                    <AvatarFallback>AK</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">Alex K.</div>
                    <div className="text-sm text-neutral-600">Reduced 178 kg CO₂ this month</div>
                  </div>
                  <Award className="w-6 h-6 text-amber-700" />
                </div>
                
                {[4, 5, 6, 7, 8].map((position) => (
                  <div key={position} className="flex items-center p-3 hover:bg-neutral-50 rounded-lg">
                    <div className="font-medium text-neutral-600 text-lg mr-4">{position}</div>
                    <Avatar className="mr-4">
                      <AvatarFallback>{String.fromCharCode(65 + position)}{String.fromCharCode(75 + position)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">User {position}</div>
                      <div className="text-sm text-neutral-600">
                        Reduced {Math.floor(170 - (position * 12))} kg CO₂ this month
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <div className="w-full flex justify-between items-center">
                <div className="font-medium">Your position: #3</div>
                <Button variant="outline">Share Your Ranking</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
