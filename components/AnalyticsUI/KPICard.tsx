"use client";

import type React from "react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KPICardProps {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "neutral";
  icon?: React.ReactNode;
  className?: string;
  isLocked?: boolean;
}

export const KPICard = ({
  label,
  value,
  trend = "neutral",
  icon,
  className,
  isLocked = false,
}: KPICardProps) => {
  const trendColor = {
    up: "text-green-500",
    down: "text-red-500",
    neutral: "text-slate-500",
  };

  return (
    <Card
      className={cn(
        "p-4 bg-card border border-border relative",
        isLocked && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-lg backdrop-blur-[1px]">
          <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-1 rounded">
            PRO
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        </div>
        {icon && <div className="text-slate-400">{icon}</div>}
      </div>

      {trend !== "neutral" && (
        <div className={cn("text-xs font-medium mt-2", trendColor[trend])}>
          {trend === "up" ? "↑ Creciendo" : "↓ En descenso"}
        </div>
      )}
    </Card>
  );
};
