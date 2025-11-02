"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getVendorAnalytics } from "@/actions/action-cache";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";
import { VendorAnalytics } from "@prisma/client";
import { Session } from "next-auth";
import { Zap } from "lucide-react";
import { AnalyticsGrid } from "@/components/AnalyticsUI/AnalyTicsGrid";
import { ProBadge } from "@/components/AnalyticsUI/ProBadge";

interface VendorAnalyticsProps {
  vendorId: string;
  session: Session;
  pro: boolean;
}

export const SellVendorAnalytics = ({
  vendorId,
  session,
  pro,
}: VendorAnalyticsProps) => {
  const [analytics, setAnalytics] = useState<VendorAnalytics | null>(null);
  const [isPending, startTransition] = useTransition();
  const [mode, setMode] = useState<"basic" | "pro">(pro ? "pro" : "basic");

  const user = session.user!;

  useEffect(() => {
    startTransition(async () => {
      const data = await getVendorAnalytics(vendorId);
      setAnalytics(data);
    });
  }, [vendorId]);

  if (isPending || !analytics) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-1/3 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full" />
      </Card>
    );
  }

  const chartDataSales = [
    { name: "Vendidos", value: analytics.vendidos, fill: "#10b981" },
    { name: "No Vendidos", value: analytics.noVendidos, fill: "#ef4444" },
    { name: "Despachos", value: analytics.totalDispatches, fill: "#3b82f6" },
  ];

  const chartDataProducts = [
    { name: "Vendidos", value: analytics.vendidos },
    { name: "No Vendidos", value: analytics.noVendidos },
  ];

  const now = new Date();

  const topProducts =
    user?.products
      ?.filter((p: any) => {
        if (!p.featuredAt || !p.featuredUntil) return false;
        const featuredFrom = new Date(p.featuredAt);
        const featuredTo = new Date(p.featuredUntil);
        return now >= featuredFrom && now <= featuredTo;
      })
      .sort(
        (a: any, b: any) =>
          Number.parseFloat(b.price) - Number.parseFloat(a.price)
      )
      .slice(0, 5) || [];

  const handleModeToggle = () => {
    if (!pro) {
      toast.error("Acceso limitado", {
        description:
          "Necesitas actualizar a Plan Pro para acceder a esta vista",
        action: {
          label: "Ver Plan Pro",
          onClick: () => (window.location.href = "/pricing"),
        },
      });
      return;
    }
    setMode(mode === "basic" ? "pro" : "basic");
  };

  return (
    <div className="space-y-6">
      {/* Header con Badge y Toggle */}
      <Card className="border border-border bg-card">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              Panel de Analíticas
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "basic"
                ? "Visualización básica de tu desempeño"
                : "Dashboard Pro con análisis detallado"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ProBadge isPro={pro} />
            <Button
              onClick={handleModeToggle}
              variant={mode === "pro" ? "default" : "outline"}
              size="sm"
              className="gap-2"
            >
              <Zap className="w-4 h-4" />
              {mode === "basic" ? "Modo Pro" : "Modo Básico"}
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {/* Modo Básico: 3 KPIs principales */}
          {mode === "basic" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border border-border bg-card p-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Ganancias Totales
                </p>
                <p className="text-3xl font-bold text-foreground mt-3">
                  {formatCurrency(analytics.totalEarnings, "EUR")}
                </p>
                <div className="mt-4 h-1 bg-linear-to-r from-green-400 to-green-600 rounded-full" />
              </Card>

              <Card className="border border-border bg-card p-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Productos Publicados
                </p>
                <p className="text-3xl font-bold text-foreground mt-3">
                  {analytics.publicados}/{analytics.totalProducts}
                </p>
                <div className="mt-4 h-1 bg-linear-to-r from-blue-400 to-blue-600 rounded-full" />
              </Card>

              <Card className="border border-border bg-card p-6">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                  Despachos Totales
                </p>
                <p className="text-3xl font-bold text-foreground mt-3">
                  {analytics.totalDispatches}
                </p>
                <div className="mt-4 h-1 bg-linear-to-r from-purple-400 to-purple-600 rounded-full" />
              </Card>
            </div>
          )}

          {/* Modo Pro: Dashboard completo */}
          {mode === "pro" && (
            <div className="space-y-6">
              {/* Grid de KPIs */}
              <AnalyticsGrid analytics={analytics} isPro={pro} />

              {/* Gráficos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico de barras: Ventas y Despachos */}
                <Card className="border border-border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    Resumen de Ventas
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={chartDataSales}
                      margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="currentColor"
                      />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                        {chartDataSales.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                {/* Gráfico de pastel: Distribución */}
                <Card className="border border-border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    Distribución de Productos
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartDataProducts}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        <Cell fill="#10b981" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* Productos destacados */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    Productos Destacados
                  </h3>
                  <div className="space-y-2">
                    {topProducts.length > 0 ? (
                      topProducts.map((product: any, idx: number) => (
                        <div
                          key={product.id}
                          className="flex items-center justify-between p-2 bg-muted/30 rounded-md hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div className="text-xs font-bold text-muted-foreground">
                              #{idx + 1}
                            </div>
                            <span className="text-sm text-foreground truncate">
                              {product.name}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-green-600 shrink-0">
                            {formatCurrency(
                              Number.parseFloat(product.price),
                              "EUR"
                            )}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        Sin productos publicados
                      </p>
                    )}
                  </div>
                </Card>

                {/* Estadísticas rápidas */}
                <Card className="border border-border bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    Estadísticas Rápidas
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Estado Vendedor
                      </span>
                      <span
                        className={`text-sm font-semibold px-2 py-1 rounded-full ${
                          analytics.isActiveSeller
                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
                        }`}
                      >
                        {analytics.isActiveSeller ? "Activo" : "Inactivo"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Envíos Rápidos
                      </span>
                      <span
                        className={`text-sm font-semibold px-2 py-1 rounded-full ${
                          analytics.isFastShipper
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400"
                        }`}
                      >
                        {analytics.isFastShipper ? "Sí" : "No"}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2">
                        Última actualización
                      </p>
                      <p className="text-sm font-mono">
                        {new Date(analytics.updatedAt).toLocaleDateString(
                          "es-AR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Nota PRO */}
              {pro && (
                <Card className="border border-purple-200 dark:border-purple-900/50 bg-purple-50 dark:bg-purple-900/10 p-4">
                  <p className="text-xs text-purple-700 dark:text-purple-400 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>
                      Estás utilizando el Plan Pro. Acceso a análisis avanzados,
                      gráficos en tiempo real y reportes personalizados.
                    </span>
                  </p>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
