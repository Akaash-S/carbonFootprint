import React from "react";
import { useQuery } from "@tanstack/react-query";

export function DashboardHeader() {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/user"],
  });

  if (isLoading) {
    return (
      <div className="mb-6 animate-pulse">
        <div className="h-8 bg-neutral-200 rounded w-1/3 mb-1"></div>
        <div className="h-5 bg-neutral-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="font-heading text-2xl font-semibold mb-1">
        Hello, <span>{user?.firstName || "User"}</span>!
      </h2>
      <p className="text-neutral-600">
        You've reduced your carbon footprint by <span className="font-medium text-success">12%</span> this month. Keep it up!
      </p>
    </div>
  );
}
