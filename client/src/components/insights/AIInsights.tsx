import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getEcoTips, getFootprintAnalysis, getCustomChallenge } from '@/lib/ai-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Lightbulb, Activity, Award, AlertTriangle } from 'lucide-react';

export function AIInsights() {
  const [activeTab, setActiveTab] = useState('eco-tips');

  const {
    data: ecoTipsData,
    isLoading: ecoTipsLoading,
    error: ecoTipsError,
    refetch: refetchEcoTips,
  } = useQuery({
    queryKey: ['/api/ai/eco-tips'],
    enabled: activeTab === 'eco-tips',
  });

  const {
    data: analysisData,
    isLoading: analysisLoading,
    error: analysisError,
    refetch: refetchAnalysis,
  } = useQuery({
    queryKey: ['/api/ai/footprint-analysis'],
    enabled: activeTab === 'analysis',
  });

  const {
    data: challengeData,
    isLoading: challengeLoading,
    error: challengeError,
    refetch: refetchChallenge,
  } = useQuery({
    queryKey: ['/api/ai/custom-challenge'],
    enabled: activeTab === 'challenge',
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'eco-tips' && !ecoTipsData) {
      refetchEcoTips();
    } else if (value === 'analysis' && !analysisData) {
      refetchAnalysis();
    } else if (value === 'challenge' && !challengeData) {
      refetchChallenge();
    }
  };

  const renderContent = (data: any, isLoading: boolean, error: any, refetch: () => void, emptyMessage: string) => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Generating insights with AI...</p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load AI insights. Please try again.
            <Button variant="outline" size="sm" className="mt-2" onClick={refetch}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    if (!data || !data.success) {
      const errorMessage = data?.error || 'No data available';
      return (
        <Alert className="mb-4">
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            {data && !data.success ? errorMessage : emptyMessage}
            <Button variant="outline" size="sm" className="mt-2" onClick={refetch}>
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      );
    }

    // Special formatting for tips which might come as a list
    if (activeTab === 'eco-tips' && data.data) {
      return (
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: data.data.replace(/\n/g, '<br />') }} />
        </div>
      );
    }

    return (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <div dangerouslySetInnerHTML={{ __html: data.data.replace(/\n/g, '<br />') }} />
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI-Powered Insights</CardTitle>
        <CardDescription>Personalized insights and recommendations powered by AI</CardDescription>
      </CardHeader>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="eco-tips" className="flex items-center">
              <Lightbulb className="mr-2 h-4 w-4" />
              Eco Tips
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center">
              <Activity className="mr-2 h-4 w-4" />
              Analysis
            </TabsTrigger>
            <TabsTrigger value="challenge" className="flex items-center">
              <Award className="mr-2 h-4 w-4" />
              Challenge
            </TabsTrigger>
          </TabsList>
        </div>
        
        <CardContent className="mt-4">
          <TabsContent value="eco-tips" className="mt-0">
            {renderContent(
              ecoTipsData, 
              ecoTipsLoading, 
              ecoTipsError, 
              refetchEcoTips, 
              "Track more activities to get personalized eco-tips."
            )}
          </TabsContent>
          
          <TabsContent value="analysis" className="mt-0">
            {renderContent(
              analysisData, 
              analysisLoading, 
              analysisError, 
              refetchAnalysis, 
              "Record a week's worth of activities to see trend analysis."
            )}
          </TabsContent>
          
          <TabsContent value="challenge" className="mt-0">
            {renderContent(
              challengeData, 
              challengeLoading, 
              challengeError, 
              refetchChallenge, 
              "Get a personalized sustainability challenge based on your habits."
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
      
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">Powered by Google Gemini AI</p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => {
            if (activeTab === 'eco-tips') refetchEcoTips();
            if (activeTab === 'analysis') refetchAnalysis();
            if (activeTab === 'challenge') refetchChallenge();
          }}
        >
          Refresh Insights
        </Button>
      </CardFooter>
    </Card>
  );
}