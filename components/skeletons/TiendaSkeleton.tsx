import React from "react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export const TiendaSkeleton = () => {
  return (
    <div className="h-full flex flex-col space-y-8">
      <Card className="border border-border rounded-2xl shadow-sm flex flex-col md:flex-row bg-white p-6 gap-6">
        {/* Columna izquierda */}
        <div className="flex flex-col items-center justify-center gap-4 min-w-72">
          {/* Avatar */}
          <Skeleton className="w-28 h-28 rounded-full" />

          {/* Nombre del negocio */}
          <div className="flex flex-col items-center gap-2 text-center w-full">
            <Skeleton className="h-6 w-40 rounded-md" /> {/* BusinessName */}
            <Skeleton className="h-4 w-32 rounded-md" /> {/* Nombre usuario */}
          </div>

          {/* Badges (mobile) */}
          <div className="flex md:hidden flex-wrap justify-center gap-2 mt-2 w-full">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>

        {/* Columna derecha */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          {/* Badges (desktop) */}
          <div className="hidden md:flex flex-wrap gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-40 rounded-md" />{" "}
            {/* Título "Sobre..." */}
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </div>

          {/* Datos de contacto */}
          <div className="space-y-3">
            <Skeleton className="h-4 w-48 rounded-md" />
            <Skeleton className="h-4 w-56 rounded-md" />
            <Skeleton className="h-4 w-40 rounded-md" />
            <Skeleton className="h-4 w-44 rounded-md" />
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-border">
          <Skeleton className="h-6 w-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
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
      </div>
    </div>
  );
};
