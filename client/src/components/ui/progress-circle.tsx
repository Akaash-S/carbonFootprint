import React from "react";
import { cn } from "@/lib/utils";

export interface ProgressCircleProps
  extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  thickness?: number;
  showLabel?: boolean;
  labelText?: string;
  color?: string;
  trailColor?: string;
}

export function ProgressCircle({
  value,
  max = 100,
  size = "md",
  thickness = 8,
  showLabel = true,
  labelText,
  color,
  trailColor = "hsl(var(--muted))",
  className,
  ...props
}: ProgressCircleProps) {
  const percentage = (value / max) * 100;
  const cleanPercentage = Math.min(100, Math.max(0, percentage));
  
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (cleanPercentage / 100) * circumference;

  const sizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        sizes[size],
        className
      )}
      {...props}
    >
      <svg
        className="w-full h-full transform -rotate-90"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={trailColor}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={color || "hsl(var(--primary))"}
          strokeWidth={thickness}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {labelText ? (
            <span className="text-center">{labelText}</span>
          ) : (
            <>
              <span className="font-mono text-lg font-bold">{Math.round(cleanPercentage)}%</span>
              {percentage < 0 && (
                <span className="text-xs text-muted-foreground">vs. avg</span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
