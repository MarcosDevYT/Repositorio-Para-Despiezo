import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import React, { Fragment } from "react";

export default function loading() {
  return (
    <div className="flex gap-4">
      <aside className="hidden lg:flex w-72">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <Fragment key={index}>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded-lg" />
                  <Skeleton className="h-4 w-full rounded-lg" />
                </div>

                <Separator />
              </Fragment>
            ))}
          </CardContent>
        </Card>
      </aside>

      <section className="flex flex-col gap-4 flex-1 min-h-screen">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 pb-4 w-full">
          <Skeleton className="w-36 h-4 rounded-full" />

          <Skeleton className="w-28 h-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="space-y-4 bg-white p-4 shadow-sm">
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
      </section>
    </div>
  );
}
