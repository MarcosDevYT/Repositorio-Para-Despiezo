import {
  Car,
  Wrench,
  Zap,
  Filter,
  Disc3,
  Fuel,
  Settings,
  Gauge,
  LucideListFilter,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * @description Array de categorias
 * @type {Array<{name: string, icon: React.ElementType}>}
 */
const categories = [
  { name: "Todas las categorias", icon: LucideListFilter },
  { name: "Motor", icon: Car },
  { name: "Frenos", icon: Disc3 },
  { name: "Suspensión", icon: Settings },
  { name: "Eléctrico", icon: Zap },
  { name: "Filtros", icon: Filter },
  { name: "Combustible", icon: Fuel },
  { name: "Instrumentos", icon: Gauge },
  { name: "Herramientas", icon: Wrench },
];

/**
 * @description Componente para mostrar las categorias en la barra de navegacion
 * @returns Retorna un componente con todas las categorias
 */
export const NavCategories = () => {
  return (
    <div className="flex items-center justify-center space-x-6 py-3 overflow-x-auto">
      {categories.map((category) => {
        const IconComponent = category.icon;
        return (
          <Button
            key={category.name}
            variant="ghost"
            className="flex items-center space-x-2 text-sm font-medium hover:bg-blue-500/10 rounded-full px-4z hover:text-blue-500 whitespace-nowrap"
          >
            <IconComponent className="h-4 w-4" />
            <span>{category.name}</span>
          </Button>
        );
      })}
    </div>
  );
};
