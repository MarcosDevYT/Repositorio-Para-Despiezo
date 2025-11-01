import { Prisma } from "@/lib/generated/prisma/client";
import { OrderRow } from "../ordenesLayout/OrderRow";
import { Card, CardHeader } from "@/components/ui/card";

// Ahora incluimos items con producto y kit
type PrismaOrden = Prisma.OrdenGetPayload<{
  include: {
    items: {
      include: {
        product: true;
        kit: true;
      };
    };
  };
}>;

export const SalesProducts = ({ orders }: { orders: PrismaOrden[] }) => {
  return (
    <div className="flex flex-col items-start justify-start space-y-4">
      <Card className="w-full">
        <CardHeader>
          <div className="text-center md:text-start w-full">
            <h1 className="text-3xl font-bold">Mis Ventas</h1>
            <p className="font-normal text-gray-600">
              Administra las ventas de tus productos, comunicate con tus
              clientes y genera la etiqueta de envio para tus productos vendidos
            </p>
          </div>
        </CardHeader>
      </Card>

      {orders.length === 0 ? (
        <Card className="w-full p-6 text-center">
          <h2 className="text-xl font-semibold">Aún no tienes ventas</h2>
          <p className="text-gray-600">
            Cuando alguien compre tus productos o kits, aparecerán aquí.
          </p>
        </Card>
      ) : (
        orders.map((orden) => <OrderRow key={orden.id} order={orden} />)
      )}
    </div>
  );
};
