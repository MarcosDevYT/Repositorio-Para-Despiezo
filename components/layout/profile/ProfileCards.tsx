import { Card, CardContent } from "@/components/ui/card";
import { Package, ShoppingBag, Star } from "lucide-react";

/**
 * @description Array de cards con las estadisticas del usuario
 * @important Datos ficticios para el ejemplo, se deben reemplazar con los datos reales del usuario
 */
const cards = [
  {
    title: "Anuncios activos",
    description: "12",
    icon: <Package className="text-blue-500 size-20" />,
  },
  {
    title: "Ventas realizadas",
    description: "12",
    icon: <ShoppingBag className="text-green-500 size-20" />,
  },
  {
    title: "Valoración media",
    description: "4.8",
    icon: <Star className="text-yellow-500 size-20" />,
  },
];

/**
 * @description Componente que renderiza las cards con las estadisticas del usuario
 * @returns Componente de cards con las estadisticas del usuario
 */
export const ProfileCards = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="flex flex-col items-center justify-center gap-2">
            {card.icon}

            <p className="text-2xl font-bold">{card.description}</p>

            <p className="text-lg text-muted-foreground">{card.title}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
};
