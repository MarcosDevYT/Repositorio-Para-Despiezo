"use client";

import { formatCurrency, formatMinutes } from "@/lib/utils";
import type { VendorAnalytics } from "@prisma/client";
import {
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  Clock,
  EuroIcon,
} from "lucide-react";
import { KPICard } from "./KPICard";

interface AnalyticsGridProps {
  analytics: VendorAnalytics;
  isPro: boolean;
}

export const AnalyticsGrid = ({ analytics, isPro }: AnalyticsGridProps) => {
  const renderTrendIcon = (value: number, high: number, low: number) => {
    if (value > high) return <TrendingUp className="w-5 h-5 text-green-500" />;
    if (value < low) return <TrendingDown className="w-5 h-5 text-red-500" />;
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* KPI Principal: Ganancias */}
      <KPICard
        label="Ganancias Totales"
        value={formatCurrency(analytics.totalEarnings, "EUR")}
        icon={<EuroIcon className="w-5 h-5" />}
        trend={analytics.totalEarnings > 0 ? "up" : "neutral"}
      />

      {/* Productos */}
      <KPICard
        label="Productos Publicados"
        value={`${analytics.publicados} / ${analytics.totalProducts}`}
        icon={<Package className="w-5 h-5" />}
      />

      {/* Vendidos */}
      <KPICard
        label="Productos Vendidos"
        value={analytics.vendidos}
        icon={renderTrendIcon(analytics.vendidos, 5, 0)}
        trend={analytics.vendidos > 0 ? "up" : "neutral"}
        isLocked={!isPro && analytics.vendidos > 10}
      />

      {/* Respuesta */}
      <KPICard
        label="Tiempo Respuesta Prom."
        value={
          analytics.avgResponseMin
            ? formatMinutes(analytics.avgResponseMin)
            : "—"
        }
        icon={<Clock className="w-5 h-5" />}
        isLocked={!isPro}
      />

      {/* Despachos */}
      <KPICard
        label="Total Despachos"
        value={analytics.totalDispatches}
        icon={<Truck className="w-5 h-5" />}
        isLocked={!isPro}
      />

      {/* Órdenes */}
      <KPICard
        label="Total Órdenes"
        value={analytics.totalOrders}
        trend={analytics.totalOrders > 0 ? "up" : "neutral"}
        isLocked={!isPro}
      />

      {/* Ganancias últimos 30 días */}
      <KPICard
        label="Ganancias (30 días)"
        value={formatCurrency(analytics.earningsLast30Days, "EUR")}
        icon={
          analytics.earningsLast30Days > 0 ? (
            <TrendingUp className="w-5 h-5 text-green-500" />
          ) : undefined
        }
        isLocked={!isPro}
      />

      {/* Promedio por orden */}
      <KPICard
        label="Prom. Ganancia/Orden"
        value={
          analytics.avgEarningsPerOrder
            ? formatCurrency(analytics.avgEarningsPerOrder, "EUR")
            : "—"
        }
        isLocked={!isPro}
      />
    </div>
  );
};
