import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Shield, Trophy, Users, Calendar, Clock, CheckCircle } from "lucide-react";

export default function Challenges() {
  const { data: userChallenges, isLoading: loadingUserChallenges } = useQuery({
    queryKey: ["/api/user-challenges"],
  });

  const { data: challenges, isLoading: loadingChallenges } = useQuery({
    queryKey: ["/api/challenges"],
  });

  // Find challenges the user hasn't joined yet
  const availableChallenges = challenges?.filter(
    (challenge) => !userChallenges?.some(
      (userChallenge) => userChallenge.challengeId === challenge.id
    )
  ) || [];

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-heading text-2xl font-semibold mb-1">Challenges</h2>
        <p className="text-neutral-600">
          Join challenges to reduce your carbon footprint and earn points
        </p>
      </div>

      {/* Active Challenges */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-heading font-semibold">Your Active Challenges</h3>
          <Badge className="bg-success">Points Available: 280</Badge>
        </div>

        {loadingUserChallenges ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-neutral-200 rounded w-full mb-4"></div>
                  <div className="h-2 bg-neutral-200 rounded-full w-full"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : userChallenges && userChallenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userChallenges.map((userChallenge) => (
              <Card key={userChallenge.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{userChallenge.challenge.title}</CardTitle>
                    <Badge variant={userChallenge.isCompleted ? "default" : "outline"}>
                      {userChallenge.isCompleted ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Completed
                        </span>
                      ) : (
                        `${userChallenge.progress}/${userChallenge.challenge.targetValue} ${userChallenge.challenge.unit}`
                      )}
                    </Badge>
                  </div>
                  <CardDescription>{userChallenge.challenge.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress 
                    value={(Number(userChallenge.progress) / Number(userChallenge.challenge.targetValue)) * 100} 
                    className="h-2 mb-4"
                  />
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>{userChallenge.challenge.points} points</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-neutral-500" />
                      <span>
                        {new Date(userChallenge.challenge.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button disabled={userChallenge.isCompleted} variant={userChallenge.isCompleted ? "outline" : "default"}>
                    {userChallenge.isCompleted ? "Completed!" : "Update Progress"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <Shield className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600">You haven't joined any challenges yet.</p>
              <p className="text-sm text-neutral-500 mt-1 mb-4">
                Join challenges below to start earning points!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Available Challenges */}
      <div>
        <h3 className="text-xl font-heading font-semibold mb-4">Available Challenges</h3>

        {loadingChallenges ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-neutral-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-neutral-200 rounded w-full mb-4"></div>
                </CardContent>
                <CardFooter>
                  <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : availableChallenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableChallenges.map((challenge) => (
              <Card key={challenge.id}>
                <CardHeader>
                  <CardTitle>{challenge.title}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span>{challenge.points} points</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-neutral-500" />
                      <span>{challenge.targetValue} {challenge.unit}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-neutral-500" />
                      <span>126 participants</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-neutral-500" />
                      <span>
                        Ends {new Date(challenge.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Join Challenge</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-neutral-600">No more challenges available right now.</p>
              <p className="text-sm text-neutral-500 mt-1">
                Check back soon for new challenges!
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Challenge Leaderboard */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Challenge Leaderboard</CardTitle>
            <CardDescription>
              See who's leading in the current challenges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-3 bg-amber-50 rounded-lg">
                <div className="font-bold text-amber-700 mr-4">1</div>
                <div className="flex-1">
                  <div className="font-medium">Sarah J.</div>
                  <div className="text-sm text-neutral-600">780 points</div>
                </div>
                <Badge className="bg-amber-500">Gold</Badge>
              </div>
              <div className="flex items-center p-3 bg-neutral-100 rounded-lg">
                <div className="font-bold text-neutral-700 mr-4">2</div>
                <div className="flex-1">
                  <div className="font-medium">Michael T.</div>
                  <div className="text-sm text-neutral-600">645 points</div>
                </div>
                <Badge className="bg-neutral-400">Silver</Badge>
              </div>
              <div className="flex items-center p-3 bg-amber-50 bg-opacity-30 rounded-lg">
                <div className="font-bold text-amber-800 mr-4">3</div>
                <div className="flex-1">
                  <div className="font-medium">Alex K.</div>
                  <div className="text-sm text-neutral-600">580 points</div>
                </div>
                <Badge className="bg-amber-700">Bronze</Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">View Full Leaderboard</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
