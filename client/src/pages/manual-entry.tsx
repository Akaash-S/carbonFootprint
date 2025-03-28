import React, { useState } from "react";
import { ManualEntryForm } from "@/components/activity/ManualEntryForm";
import { ActivityPreview } from "@/components/activity/ActivityPreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { ActivityPreviewData } from "@/lib/types";

export default function ManualEntryPage() {
  const [previewData, setPreviewData] = useState<ActivityPreviewData | null>(null);
  const [activityType, setActivityType] = useState<string | undefined>();
  const [activitySubtype, setActivitySubtype] = useState<string | undefined>();
  
  const handlePreview = (data: ActivityPreviewData) => {
    setPreviewData(data);
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" className="mr-3 p-0 h-auto">
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h2 className="font-heading text-2xl font-semibold">Log Your Activity</h2>
      </div>
      
      <ManualEntryForm 
        onPreview={(data) => {
          handlePreview(data);
          // Extract activity type and subtype from the form
          if (data.formData) {
            setActivityType(data.formData.type);
            setActivitySubtype(data.formData.subtype);
          }
        }} 
      />
      
      <ActivityPreview 
        data={previewData} 
        type={activityType} 
        subtype={activitySubtype} 
      />
    </div>
  );
}
