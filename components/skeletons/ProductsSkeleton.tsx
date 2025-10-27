import React from "react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const ProductsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 place-content-center place-items-center gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          className="space-y-4 bg-white p-4 shadow-sm w-full max-w-72 h-[410px]"
        >
          <Skeleton className="h-60 md:h-64 w-full rounded-lg" />

          <div className="space-y-2">
            <div className="flex flex-row justify-between">
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>

            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-4 w-full rounded-lg" />
            <Skeleton className="h-4 w-full rounded-lg" />

            <div className="flex flex-row justify-between">
              <Skeleton className="h-8 w-16 rounded-lg" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
