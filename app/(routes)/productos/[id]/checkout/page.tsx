import { getProductByIdAction } from "@/actions/sell-actions";
import { ProductCheckout } from "@/components/layout/ProductComponents/ProductCheckout";
import { ShoppingBag, X } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import Link from "next/link";
import React from "react";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) redirect("/login");

  const product = await getProductByIdAction(id);

  if (!product || "error" in product)
    return (
      <div className="h-[60.5vh] w-full flex flex-col items-center justify-center">
        <div className="p-5 rounded-full bg-muted-foreground flex items-center justify-center">
          <ShoppingBag className="text-gray-500 size-12 " />
        </div>
        <div className="my-4 space-y-1 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-semibold">Producto no encontrado</h2>
          <p className="">
            Vuelve al inicio para seguir explorando otros productos
          </p>

          <Button className="rounded-full" asChild>
            <Link href={"/"}>Volver al Inicio</Link>
          </Button>
        </div>
      </div>
    );

  return <ProductCheckout session={session} product={product} />;
}
