import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

export function ActiveChallenges() {
  const { data: userChallenges, isLoading } = useQuery({
    queryKey: ["/api/user-challenges"],
  });

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="font-heading font-semibold mb-4">Active Challenges</h3>
        
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="border border-neutral-200 rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <div className="h-5 bg-neutral-200 rounded w-32"></div>
                  <div className="h-5 bg-neutral-200 rounded w-16"></div>
                </div>
                <div className="h-4 bg-neutral-200 rounded w-48 mb-2"></div>
                <div className="w-full bg-neutral-200 rounded-full h-2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {userChallenges?.map((userChallenge) => (
              <div key={userChallenge.id} className="border border-neutral-200 rounded-lg p-3">
                <div className="flex justify-between mb-1">
                  <h4 className="font-medium">{userChallenge.challenge.title}</h4>
                  <span className="text-xs bg-accent-light px-2 py-0.5 rounded text-neutral-800">
                    {userChallenge.progress}/{userChallenge.challenge.targetValue} {userChallenge.challenge.unit}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 mb-2">{userChallenge.challenge.description}</p>
                <Progress 
                  value={(Number(userChallenge.progress) / Number(userChallenge.challenge.targetValue)) * 100} 
                  className="h-2"
                />
              </div>
            ))}
            
            {(!userChallenges || userChallenges.length === 0) && (
              <div className="text-center py-4">
                <p className="text-neutral-500 mb-2">No active challenges</p>
                <p className="text-sm text-neutral-600 mb-4">Join challenges to earn points and reduce your carbon footprint</p>
              </div>
            )}
          </div>
        )}
        
        <Button variant="link" className="w-full mt-4 text-sm text-primary">
          View all challenges
        </Button>
      </CardContent>
    </Card>
  );
}
