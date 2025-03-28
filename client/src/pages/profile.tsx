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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { ProgressCircle } from "@/components/ui/progress-circle";
import {
  Award,
  Calendar,
  CheckCircle,
  ChevronRight,
  Shield,
  ThumbsUp,
  Trophy,
  User,
} from "lucide-react";

export default function Profile() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/user"],
  });

  const { data: activities } = useQuery({
    queryKey: ["/api/activities/recent"],
  });
  
  const { data: userChallenges } = useQuery({
    queryKey: ["/api/user-challenges"],
  });

  // Calculate total CO2 saved (example calculation)
  const totalCO2Saved = activities?.reduce(
    (total, activity) => total + Number(activity.co2Emissions), 
    0
  ) || 0;

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-semibold mb-1">Your Profile</h2>
        <p className="text-neutral-600">
          View your achievements and carbon reduction impact
        </p>
      </div>

      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6 pb-4">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-3xl">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-1">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-neutral-600">@{user?.username}</p>
              <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                <Badge variant="secondary" className="flex gap-1 items-center">
                  <User className="w-3 h-3" />
                  <span>{user?.ecoRank}</span>
                </Badge>
                <Badge variant="outline" className="flex gap-1 items-center">
                  <Trophy className="w-3 h-3" />
                  <span>{user?.points} Points</span>
                </Badge>
                <Badge variant="outline" className="flex gap-1 items-center">
                  <Calendar className="w-3 h-3" />
                  <span>Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}</span>
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <Button variant="outline">Edit Profile</Button>
              <Button variant="link" className="text-sm">Share Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Impact Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <ProgressCircle
              value={76}
              size="md"
              className="mx-auto mb-3"
              labelText={<span className="font-mono text-lg font-bold">-76%</span>}
            />
            <h3 className="font-medium">Carbon Reduction</h3>
            <p className="text-sm text-neutral-600">vs. average</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-4xl font-mono font-bold mb-3 text-primary">
              {totalCO2Saved.toFixed(1)}
            </div>
            <h3 className="font-medium">kg CO₂ Saved</h3>
            <p className="text-sm text-neutral-600">all time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-4xl font-mono font-bold mb-3 text-amber-500">
              {user?.points || 0}
            </div>
            <h3 className="font-medium">Total Points</h3>
            <p className="text-sm text-neutral-600">earned</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-4xl font-mono font-bold mb-3">
              {userChallenges?.filter(c => c.isCompleted).length || 0}
            </div>
            <h3 className="font-medium">Challenges</h3>
            <p className="text-sm text-neutral-600">completed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="achievements">
        <TabsList className="mb-6">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="history">Activity History</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
        </TabsList>

        {/* Achievements Tab */}
        <TabsContent value="achievements">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Eco Status</CardTitle>
                <CardDescription>
                  Your current ranking and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-6">
                  <div className="bg-success text-white p-4 rounded-full mr-4">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-medium">{user?.ecoRank}</h4>
                    <p className="text-neutral-600">Top 15% in your region</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Progress to next level</span>
                      <span>80%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-success h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                    <div className="mt-1 text-sm text-neutral-600">
                      Reduce 20 more kg CO₂ to reach "Climate Champion" status
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">All Eco Statuses</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">1</Badge>
                          <span>Beginner</span>
                        </div>
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">2</Badge>
                          <span>Eco Conscious</span>
                        </div>
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">3</Badge>
                          <span>Eco Hero</span>
                        </div>
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">4</Badge>
                          <span>Climate Champion</span>
                        </div>
                        <span className="text-sm text-neutral-600">In progress (80%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">5</Badge>
                          <span>Carbon Neutralist</span>
                        </div>
                        <span className="text-sm text-neutral-600">Locked</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badges Earned</CardTitle>
                <CardDescription>
                  Special achievements and milestones
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-4 border rounded-lg">
                    <Award className="w-10 h-10 text-amber-500 mb-2" />
                    <h4 className="font-medium text-center">First Month</h4>
                    <p className="text-xs text-neutral-600 text-center">Tracked for 30 days</p>
                  </div>
                  <div className="flex flex-col items-center p-4 border rounded-lg">
                    <Shield className="w-10 h-10 text-green-500 mb-2" />
                    <h4 className="font-medium text-center">Challenge Master</h4>
                    <p className="text-xs text-neutral-600 text-center">Completed 5 challenges</p>
                  </div>
                  <div className="flex flex-col items-center p-4 border rounded-lg">
                    <ThumbsUp className="w-10 h-10 text-blue-500 mb-2" />
                    <h4 className="font-medium text-center">Carbon Saver</h4>
                    <p className="text-xs text-neutral-600 text-center">Saved 100kg CO₂</p>
                  </div>
                  <div className="flex flex-col items-center p-4 border rounded-lg bg-neutral-50">
                    <Trophy className="w-10 h-10 text-neutral-300 mb-2" />
                    <h4 className="font-medium text-center text-neutral-400">Eco Influencer</h4>
                    <p className="text-xs text-neutral-400 text-center">Invite 3 friends</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Badges</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* Activity History Tab */}
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>
                Your tracked carbon activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities?.map((activity) => (
                  <div key={activity.id} className="flex justify-between items-center py-3 border-b">
                    <div className="flex items-center">
                      <div className="bg-neutral-100 p-2 rounded-lg mr-3">
                        {activity.type === 'transport' ? (
                          <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-xs text-neutral-500">
                          {new Date(activity.date).toLocaleDateString()} at {new Date(activity.date).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-medium">{Number(activity.co2Emissions).toFixed(1)} kg CO₂</p>
                      <p className="text-xs text-neutral-500">+15 points</p>
                    </div>
                  </div>
                ))}
                
                {(!activities || activities.length === 0) && (
                  <div className="py-10 text-center">
                    <p className="text-neutral-500">No activities recorded yet</p>
                    <Button className="mt-4">Log Your First Activity</Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">View Full History</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Impact Tab */}
        <TabsContent value="impact">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Environmental Impact</CardTitle>
                <CardDescription>
                  The difference you've made
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex flex-col items-center text-center p-6 bg-neutral-50 rounded-lg">
                    <div className="text-4xl font-mono font-bold text-success mb-2">
                      {(totalCO2Saved / 25).toFixed(1)}
                    </div>
                    <p className="text-sm">Equivalent to planting this many trees</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Carbon emissions prevented:</span>
                      <span className="font-mono font-medium">{totalCO2Saved.toFixed(1)} kg CO₂</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Equivalent to car travel:</span>
                      <span className="font-mono font-medium">{(totalCO2Saved / 0.192).toFixed(1)} km</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Energy saved:</span>
                      <span className="font-mono font-medium">{(totalCO2Saved * 3).toFixed(1)} kWh</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Share Your Impact</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Completed Challenges</CardTitle>
                <CardDescription>
                  Challenges you've successfully finished
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userChallenges?.filter(c => c.isCompleted).length > 0 ? (
                  <div className="space-y-3">
                    {userChallenges?.filter(c => c.isCompleted)
                      .map((challenge) => (
                        <div key={challenge.id} className="flex justify-between items-center border-b py-2">
                          <div className="flex items-center">
                            <CheckCircle className="w-5 h-5 text-success mr-3" />
                            <div>
                              <p className="font-medium">{challenge.challenge.title}</p>
                              <p className="text-xs text-neutral-500">
                                Completed on {challenge.completedAt ? new Date(challenge.completedAt).toLocaleDateString() : 'Unknown'}
                              </p>
                            </div>
                          </div>
                          <Badge>+{challenge.challenge.points} pts</Badge>
                        </div>
                      ))}
                    
                    <Button variant="outline" className="w-full flex justify-between items-center">
                      <span>View All Completed Challenges</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <p className="text-neutral-500">No challenges completed yet</p>
                    <Button className="mt-4">Join a Challenge</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
