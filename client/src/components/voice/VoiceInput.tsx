import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, AlertCircle } from "lucide-react";
import { useVoiceRecognition } from "@/hooks/use-voice-recognition";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { calculateEmissions } from "@/lib/carbon-calculator";

export function VoiceInput() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    isListening,
    transcript,
    result,
    error,
    startListening,
    stopListening
  } = useVoiceRecognition();
  
  const [recognizedActivity, setRecognizedActivity] = useState<any>(null);
  
  useEffect(() => {
    if (result?.activity) {
      // Process the activity data
      const activity = result.activity;
      
      // Determine default values for missing fields
      const processedActivity = {
        type: activity.type || "transport",
        subtype: activity.subtype || (activity.type === "transport" ? "car" : ""),
        quantity: activity.distance || 0,
        unit: "km",
        passengers: activity.passengers || 1,
        date: new Date().toISOString(),
      };
      
      setRecognizedActivity(processedActivity);
    }
  }, [result]);
  
  const mutation = useMutation({
    mutationFn: async (activity: any) => {
      // Calculate emissions based on recognized data
      const emissions = calculateEmissions(
        activity.type,
        activity.subtype,
        activity.quantity,
        activity.passengers
      );
      
      // Create description based on activity type
      let description = "";
      if (activity.type === "transport") {
        description = `${activity.subtype} trip (${activity.quantity} km${activity.passengers > 1 ? `, ${activity.passengers} passengers` : ""})`;
      } else if (activity.type === "food") {
        description = `Meal (${activity.subtype || "mixed"})`;
      } else {
        description = `${activity.type} activity`;
      }
      
      // Submit activity data to API
      const activityData = {
        type: activity.type,
        subtype: activity.subtype,
        description,
        quantity: activity.quantity,
        unit: activity.unit,
        co2Emissions: emissions,
        date: activity.date,
        notes: result?.text || "",
        passengers: activity.passengers,
      };
      
      return apiRequest("POST", "/api/activities", activityData);
    },
    onSuccess: () => {
      toast({
        title: "Activity Logged",
        description: "Voice activity has been successfully recorded.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities/recent"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activities/weekly"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to log activity: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleConfirm = () => {
    if (recognizedActivity) {
      mutation.mutate(recognizedActivity);
    }
  };

  return (
    <Card>
      <CardContent className="p-5 text-center">
        <div className="mb-6 flex justify-center">
          <div className={`w-24 h-24 rounded-full ${isListening ? "bg-primary bg-opacity-10" : "bg-neutral-100"} flex items-center justify-center`}>
            <Mic className={`w-12 h-12 ${isListening ? "text-primary animate-pulse" : "text-neutral-400"}`} />
          </div>
        </div>
        
        <h3 className="font-heading text-xl font-medium mb-2">
          {isListening ? "Listening..." : "Voice Input"}
        </h3>
        
        {!transcript && !result ? (
          <>
            <p className="text-neutral-600 mb-6">
              {isListening 
                ? "Speak clearly and describe your activity" 
                : "Click the button below to start voice recognition"}
            </p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-left">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-sm text-neutral-500 mb-4">Try saying something like:</p>
            <div className="space-y-2 mb-6">
              <p className="text-sm bg-neutral-100 py-2 px-4 rounded-lg inline-block">"I drove 25 kilometers today"</p>
              <p className="text-sm bg-neutral-100 py-2 px-4 rounded-lg inline-block">"I had a vegetarian lunch"</p>
              <p className="text-sm bg-neutral-100 py-2 px-4 rounded-lg inline-block">"I took a 15-minute shower"</p>
            </div>
            
            {isListening ? (
              <Button 
                variant="destructive" 
                onClick={stopListening}
              >
                Stop Listening
              </Button>
            ) : (
              <Button onClick={startListening}>
                Start Listening
              </Button>
            )}
          </>
        ) : (
          <div className="text-left">
            <h3 className="font-heading font-semibold mb-4">Recognized Text</h3>
            <div className="bg-neutral-100 rounded-lg p-4 mb-4">
              <p className="italic text-neutral-700">"{transcript || result?.text}"</p>
            </div>
            
            {recognizedActivity ? (
              <div className="bg-info bg-opacity-10 p-4 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-info mt-0.5 mr-2" />
                  <div>
                    <p className="font-medium text-neutral-800 mb-1">I detected:</p>
                    <ul className="text-sm space-y-1">
                      <li>
                        <span className="font-medium">Activity:</span> {" "}
                        {recognizedActivity.type === "transport" 
                          ? `${recognizedActivity.subtype || "car"} trip${recognizedActivity.passengers > 1 ? " (carpooling)" : ""}`
                          : recognizedActivity.type}
                      </li>
                      {recognizedActivity.quantity > 0 && (
                        <li>
                          <span className="font-medium">Distance:</span> {recognizedActivity.quantity} kilometers
                        </li>
                      )}
                      {recognizedActivity.type === "transport" && recognizedActivity.passengers > 1 && (
                        <li>
                          <span className="font-medium">Passengers:</span> {recognizedActivity.passengers}
                        </li>
                      )}
                      <li>
                        <span className="font-medium">Date:</span> Today
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setRecognizedActivity(null);
                      stopListening();
                      startListening();
                    }}
                  >
                    Try Again
                  </Button>
                  <Button 
                    onClick={handleConfirm}
                    disabled={mutation.isPending}
                  >
                    {mutation.isPending ? "Saving..." : "Confirm & Log"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-amber-800">
                  I couldn't detect a specific activity. Please try again or use manual entry for more precision.
                </p>
                <div className="mt-4 flex justify-between">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      stopListening();
                      startListening();
                    }}
                  >
                    Try Again
                  </Button>
                  <Link href="/manual-entry">
                    <Button>Manual Entry</Button>
                  </Link>
                </div>
              </div>
            )}
            
            {mutation.isSuccess && (
              <div className="mt-4 bg-green-50 p-4 rounded-lg">
                <p className="text-green-800">
                  Activity logged successfully!
                </p>
                <div className="mt-4 flex justify-end">
                  <Link href="/">
                    <Button>Return to Dashboard</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
