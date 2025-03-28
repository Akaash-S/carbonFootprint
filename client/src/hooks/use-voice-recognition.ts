import { useState, useEffect, useCallback } from "react";
import { VoiceRecognitionResult } from "@/lib/types";

export function useVoiceRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState<VoiceRecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if browser supports speech recognition
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  // Configure recognition
  useEffect(() => {
    if (!recognition) {
      setError("Speech recognition is not supported in this browser");
      return;
    }

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      parseRecognitionResult(transcript);
    };

    recognition.onerror = (event) => {
      setError(`Recognition error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  }, [recognition]);

  // Parse the recognition result to extract activity data
  const parseRecognitionResult = useCallback((text: string) => {
    // Simplified parsing logic - in a real app this would be more robust
    const lowerText = text.toLowerCase();
    
    const transportKeywords = {
      car: ["drove", "driving", "car", "vehicle"],
      bus: ["bus", "took a bus"],
      train: ["train", "took a train", "railway"],
      plane: ["flew", "flight", "airplane", "plane"],
      bicycle: ["bike", "biking", "bicycle", "cycling", "cycled"],
      walking: ["walk", "walked", "walking", "on foot"]
    };
    
    const foodKeywords = ["ate", "eating", "food", "meal", "lunch", "dinner", "breakfast"];
    const homeKeywords = ["shower", "electricity", "light", "heating", "home"];
    
    let activity: any = {};
    
    // Check for transportation
    for (const [type, keywords] of Object.entries(transportKeywords)) {
      if (keywords.some(keyword => lowerText.includes(keyword))) {
        activity.type = "transport";
        activity.subtype = type;
        break;
      }
    }
    
    // Check for food
    if (!activity.type && foodKeywords.some(keyword => lowerText.includes(keyword))) {
      activity.type = "food";
    }
    
    // Check for home
    if (!activity.type && homeKeywords.some(keyword => lowerText.includes(keyword))) {
      activity.type = "home";
    }
    
    // If no type detected, default to transport
    if (!activity.type) {
      activity.type = "transport";
    }
    
    // Extract distance (if any)
    const distanceMatch = lowerText.match(/(\d+)\s*(km|kilometer|mile|mi|meters|m)/);
    if (distanceMatch) {
      activity.distance = parseInt(distanceMatch[1]);
    }
    
    // Extract passengers (if any)
    const passengerMatch = lowerText.match(/(\d+)\s*(passenger|person|people|colleague|friend|family)/);
    if (passengerMatch) {
      activity.passengers = parseInt(passengerMatch[1]);
    } else if (lowerText.includes("with one") || lowerText.includes("with a")) {
      activity.passengers = 1;
    }
    
    // Extract date (if any)
    if (lowerText.includes("today")) {
      activity.date = "today";
    } else if (lowerText.includes("yesterday")) {
      activity.date = "yesterday";
    }
    
    setResult({ text, activity });
  }, []);

  const startListening = useCallback(() => {
    if (!recognition) {
      setError("Speech recognition is not supported in this browser");
      return;
    }

    setError(null);
    setTranscript("");
    setResult(null);
    
    try {
      recognition.start();
      setIsListening(true);
    } catch (err) {
      setError("Failed to start speech recognition");
      console.error("Voice recognition error:", err);
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition, isListening]);

  return {
    isListening,
    transcript,
    result,
    error,
    startListening,
    stopListening
  };
}
