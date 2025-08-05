import {
  Car,
  Disc3,
  Settings,
  Zap,
  Filter,
  Fuel,
  Gauge,
  Wrench,
  Cog,
  Cpu,
  Thermometer,
  Wind,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    name: "Motor",
    icon: Car,
    count: "2,450 productos",
    color: "bg-blue-50 text-blue-600",
  },
  {
    name: "Frenos",
    icon: Disc3,
    count: "1,230 productos",
    color: "bg-red-50 text-red-600",
  },
  {
    name: "Suspensión",
    icon: Settings,
    count: "890 productos",
    color: "bg-purple-50 text-purple-600",
  },
  {
    name: "Sistema Eléctrico",
    icon: Zap,
    count: "1,560 productos",
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    name: "Filtros",
    icon: Filter,
    count: "780 productos",
    color: "bg-green-50 text-green-600",
  },
  {
    name: "Combustible",
    icon: Fuel,
    count: "560 productos",
    color: "bg-orange-50 text-orange-600",
  },
  {
    name: "Instrumentos",
    icon: Gauge,
    count: "340 productos",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    name: "Herramientas",
    icon: Wrench,
    count: "920 productos",
    color: "bg-gray-50 text-gray-600",
  },
  {
    name: "Transmisión",
    icon: Cog,
    count: "650 productos",
    color: "bg-pink-50 text-pink-600",
  },
  {
    name: "Electrónica",
    icon: Cpu,
    count: "445 productos",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    name: "Refrigeración",
    icon: Thermometer,
    count: "320 productos",
    color: "bg-teal-50 text-teal-600",
  },
  {
    name: "Climatización",
    icon: Wind,
    count: "280 productos",
    color: "bg-emerald-50 text-emerald-600",
  },
];

export const ProductCategories = () => {
  return (
    <section className="py-8 bg-accent/30">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Explora por Categorías</h2>
        <p className="text-muted-foreground">
          Encuentra exactamente lo que necesitas para tu vehículo
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card
              key={category.name}
              className="group cursor-pointer hover:shadow-hover transition-all duration-300 hover:scale-105 bg-background border border-border"
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${category.color} group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {category.count}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
