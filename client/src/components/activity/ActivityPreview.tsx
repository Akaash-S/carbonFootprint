import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getPersonalizedTip } from "@/lib/carbon-calculator";
import { ActivityPreviewData } from "@/lib/types";

interface ActivityPreviewProps {
  data: ActivityPreviewData | null;
  type?: string;
  subtype?: string;
}

export function ActivityPreview({ data, type, subtype }: ActivityPreviewProps) {
  // Generate a personalized tip if we have enough info
  const tip = useMemo(() => {
    if (data?.emissions && type && subtype) {
      return getPersonalizedTip(type, subtype, data.emissions);
    }
    return undefined;
  }, [data, type, subtype]);

  return (
    <Card>
      <CardContent className="p-5">
        <h3 className="font-heading font-semibold mb-4">Activity Preview</h3>
        
        {data ? (
          <>
            <div className="bg-neutral-100 rounded-lg p-4 flex justify-between mb-4">
              <div>
                <p className="font-medium">{data.description}</p>
                <p className="text-sm text-neutral-600">{data.date}</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-medium">{data.emissions.toFixed(1)} kg CO₂</p>
                <p className="text-xs text-neutral-500">Estimated</p>
              </div>
            </div>
            
            {data.tip || tip ? (
              <div className="bg-success bg-opacity-10 text-success p-3 rounded-lg text-sm">
                <p><strong>Tip:</strong> {data.tip || tip}</p>
              </div>
            ) : null}
          </>
        ) : (
          <div className="text-center py-6 text-neutral-500">
            <p>Fill out the form to see a preview of your activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
