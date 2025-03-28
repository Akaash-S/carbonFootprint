import React from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { WeeklySummary } from "@/components/dashboard/WeeklySummary";
import { ImpactCategories } from "@/components/dashboard/ImpactCategories";
import { ActiveChallenges } from "@/components/dashboard/ActiveChallenges";
import { PersonalizedTips } from "@/components/dashboard/PersonalizedTips";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export default function Dashboard() {
  return (
    <div>
      <DashboardHeader />
      <QuickActions />
      <WeeklySummary />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ImpactCategories />
        <ActiveChallenges />
        <PersonalizedTips />
      </div>
      
      <RecentActivity />
    </div>
  );
}
