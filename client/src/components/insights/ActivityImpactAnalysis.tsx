import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { analyzeActivityImpact } from '@/lib/ai-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, BarChart } from 'lucide-react';
import { ActivityData } from '@/lib/types';

interface ActivityImpactAnalysisProps {
  activity?: ActivityData;
}

export function ActivityImpactAnalysis({ activity }: ActivityImpactAnalysisProps) {
  const [analysisVisible, setAnalysisVisible] = useState(false);

  const { 
    mutate: analyzeImpact, 
    data: analysisData, 
    isPending: isAnalyzing,
    isError,
    error
  } = useMutation({
    mutationFn: (activityData: any) => analyzeActivityImpact(activityData),
  });

  const handleAnalyze = () => {
    if (!activity) return;
    
    setAnalysisVisible(true);
    analyzeImpact(activity);
  };

  // Don't render anything if there's no activity
  if (!activity) {
    return null;
  }

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart className="mr-2 h-5 w-5" />
          Environmental Impact Analysis
        </CardTitle>
        <CardDescription>Get detailed insights about this activity's environmental impact</CardDescription>
      </CardHeader>
      
      <CardContent>
        {!analysisVisible ? (
          <div className="py-6 text-center">
            <p className="text-muted-foreground mb-4">
              Learn about the environmental impact of this activity and discover more sustainable alternatives.
            </p>
            <Button onClick={handleAnalyze}>
              Analyze Impact
            </Button>
          </div>
        ) : isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Analyzing environmental impact...</p>
          </div>
        ) : isError ? (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to analyze environmental impact. Please try again.
              <Button variant="outline" size="sm" className="mt-2" onClick={handleAnalyze}>
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        ) : !analysisData?.success ? (
          <Alert className="mb-4">
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              {analysisData?.error || 'Could not generate impact analysis for this activity.'}
              <Button variant="outline" size="sm" className="mt-2" onClick={handleAnalyze}>
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: analysisData.data?.replace(/\n/g, '<br />') || '' }} />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end">
        {analysisVisible && analysisData?.success && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setAnalysisVisible(false)}
          >
            Hide Analysis
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}