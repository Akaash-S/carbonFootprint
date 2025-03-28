import React from "react";
import { VoiceInput } from "@/components/voice/VoiceInput";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function VoiceInputPage() {
  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" className="mr-3 p-0 h-auto">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h2 className="font-heading text-2xl font-semibold">Voice Input</h2>
      </div>
      
      <VoiceInput />
    </div>
  );
}
