import { Prisma } from "@prisma/client";
import { OrderRow } from "../ordenesLayout/OrderRow";

type PrismaOrden = Prisma.OrdenGetPayload<{
  include: {
    product: true;
  };
}>;

export const SalesProducts = ({ orders }: { orders: PrismaOrden[] }) => {
  return (
    <div className="flex flex-col items-start justify-start">
      {orders.map((orden) => (
        <OrderRow key={orden.id} order={orden} />
      ))}
    </div>
  );
};
