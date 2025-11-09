import { Prisma } from "@prisma/client";
import { OrderRow } from "../ordenesLayout/OrderRow";
import { Card, CardHeader } from "@/components/ui/card";
import { groupOrdersByYearMonth } from "@/lib/utils";
import { monthNames } from "@/lib/constants/conts";

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
  const groupedOrders = groupOrdersByYearMonth(orders);

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
        <>
          <div className="flex flex-row gap-4 h-full w-full">
            <div className="flex p-0.5 min-h-full bg-primary rounded-2xl" />

            {Object.entries(groupedOrders)
              .sort(
                ([yearA], [yearB]) =>
                  Number.parseInt(yearB) - Number.parseInt(yearA)
              )
              .map(([year, months]) => (
                <div key={year} className="w-full">
                  {/* Year title at top */}
                  <div className="mb-8 relative">
                    <h2 className="text-3xl font-bold text-foreground">
                      {year}
                    </h2>

                    <div className="absolute flex size-6 rounded-full bg-white border-4 border-primary top-1.5 -left-[30px]" />
                  </div>

                  {Object.entries(months)
                    .sort(
                      ([monthA], [monthB]) =>
                        Number.parseInt(monthB) - Number.parseInt(monthA)
                    )
                    .map(([month, monthOrders]) => {
                      const monthIndex = Number.parseInt(month);
                      const monthName = monthNames[monthIndex];

                      return (
                        <div key={`${year}-${month}`} className="mb-10">
                          <h3 className="text-xl font-semibold text-foreground mb-4">
                            {monthName}
                          </h3>

                          <div className="space-y-3">
                            {monthOrders.map((order) => (
                              <OrderRow key={order.id} order={order} />
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};
