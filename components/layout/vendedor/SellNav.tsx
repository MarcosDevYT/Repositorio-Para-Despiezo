"use client";

import { Button } from "@/components/ui/button";
import { Building2, Package, Plus, ShoppingCart } from "lucide-react";
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
        <Button
          variant={pathname === "/vendedor/negocio" ? "default" : "ghost"}
          asChild
        >
          <Link href="/vendedor/negocio">
            <Building2 />
            Negocio
          </Link>
        </Button>
        <Button
          variant={pathname === "/vendedor" ? "default" : "ghost"}
          asChild
        >
          <Link href="/vendedor">
            <Package />
            Productos
          </Link>
        </Button>

        <Button
          variant={pathname === "/vendedor/ventas" ? "default" : "ghost"}
          asChild
        >
          <Link href="/vendedor/ventas">
            <ShoppingCart />
            Ventas
          </Link>
        </Button>
      </div>

      <Button asChild className="rounded-full">
        <Link href="/vendedor/crear">
          <Plus className="size-4 text-white" />
          Crear Producto
        </Link>
      </Button>
    </nav>
  );
};
