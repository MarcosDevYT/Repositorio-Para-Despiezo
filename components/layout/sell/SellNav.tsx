"use client";

import { Button } from "@/components/ui/button";
import { Package, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * @description Componente de navegacion para la venta de productos
 * @returns Componente de navegacion para la venta de productos
 */
export const SellNav = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-card text-card-foreground flex items-center justify-between gap-6 rounded-xl border py-3 shadow-sm px-3">
      <div>
        <Button variant={pathname === "/sell" ? "default" : "ghost"} asChild>
          <Link href="/sell">
            <Package />
            Productos
          </Link>
        </Button>

        <Button
          variant={pathname === "/sell/sales" ? "default" : "ghost"}
          asChild
        >
          <Link href="/sell/sales">
            <ShoppingCart />
            Ventas
          </Link>
        </Button>
      </div>

      <Button asChild className="rounded-full">
        <Link href="/sell/create">
          <Plus className="size-4 text-white" />
          Crear Producto
        </Link>
      </Button>
    </nav>
  );
};
