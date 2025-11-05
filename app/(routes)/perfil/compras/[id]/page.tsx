import { getOrdenByID } from "@/actions/order-actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ComprasDetalleOrden } from "@/components/layout/ordenesLayout/ComprasDetalleOrden";

export default async function ComprasOrdenPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orden = await getOrdenByID(id);

  if (!orden) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold text-red-500">
          Orden no encontrada
        </h2>
        <Button asChild className="mt-4">
          <Link href="/comprador/ordenes">Volver a mis órdenes</Link>
        </Button>
      </div>
    );
  }

  return <ComprasDetalleOrden orden={orden} />;
}
