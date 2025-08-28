import { Card, CardContent } from "@/components/ui/card";
import { Package, ShoppingBag, Star } from "lucide-react";
import { Session } from "next-auth";

/**
 * @description Componente que renderiza las cards con las estadisticas del usuario
 * @returns Componente de cards con las estadisticas del usuario
 */
export const ProfileCards = ({ session }: { session: Session }) => {
  const cards = [
    {
      title: "Anuncios activos",
      description: session.user.products.length,
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
