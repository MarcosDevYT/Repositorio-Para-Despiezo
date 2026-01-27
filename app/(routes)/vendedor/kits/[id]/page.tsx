import { auth } from "@/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getUserAvaibleProductsAction } from "@/actions/sell-actions";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { House, XCircle } from "lucide-react";
import Link from "next/link";
import SellEditKitClient from "@/components/layout/vendedor/SellEditKitClient";

export default async function EditKitPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  if (!session.user.pro) redirect("/vendedor");

  // 🔹 Obtenemos el kit a editar
  const kit = await prisma.kit.findUnique({
    where: { id: id },
    include: { products: { include: { product: true } } },
  });

  // 🔹 Validación: kit existe y pertenece al usuario
  if (!kit || kit.vendorId !== session.user.id) {
    return (
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="flex flex-col items-center gap-4 pt-8">
          <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold">Kit no encontrado</h3>
          <p className="text-gray-600 dark:text-gray-400">
            No se encontró el kit o no tienes permiso para editarlo.
          </p>
        </CardHeader>

        <CardFooter className="flex items-center justify-center my-4">
          <Button className="rounded-full text-lg" asChild>
            <Link href={"/"}>
              <House className="size-5" />
              Volver al inicio
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // 🔹 Obtenemos los productos del usuario
  const products = await getUserAvaibleProductsAction();

  if (!Array.isArray(products)) {
    return (
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="flex flex-col items-center gap-4 pt-8">
          <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold">Error al cargar productos</h3>
          <p className="text-gray-600 dark:text-gray-400">
            No se pudieron cargar tus productos, inténtalo más tarde.
          </p>
        </CardHeader>

        <CardFooter className="flex items-center justify-center my-4">
          <Button className="rounded-full text-lg" asChild>
            <Link href={"/"}>
              <House className="size-5" />
              Volver al inicio
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // 🔹 Pasamos productos normales de tipo Product[]

  return (
    <SellEditKitClient
      kit={kit}
      products={products}
      initialValues={{
        name: kit.name,
        description: kit.description ?? "",
        discount: kit.discount ?? 0,
        productIds: kit.products.map((p) => p.product.id),
      }}
    />
  );
}
