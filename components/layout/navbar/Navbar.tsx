import { SearchProducts } from "@/components/searchComponents/SearchProducts";
import { UserDropdown } from "@/components/UserDropdown";
import { Package, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import Link from "next/link";
import { SearchIndex } from "@/components/searchComponents/SearchIndex";
import Image from "next/image";

/**
 * @description Componente de la barra de navegacion
 * @returns Componente de la barra de navegacion
 */
export const Navbar = async () => {
  const session = await auth();

  const isLoggedIn = !!session?.user;

  return (
    <header className="sticky left-0 right-0 top-0 z-50  ">
      <nav className="border-b border-black/10 px-4 h-20 bg-slate-50">
        <div className="container mx-auto flex items-center gap-6 justify-between h-full w-full">
          {/* Logo */}
          <Link href="/">
            <Image
              src={"/despiezo-logo.png"}
              alt="Logo de Despiezo"
              width={200}
              height={50}
            />
          </Link>

          {/* Buscador */}
          <div className="hidden md:block w-full max-w-3xl">
            {/* <SearchProducts /> */}
            <SearchIndex userId={session?.user.id} />
          </div>

          {/* User Dropdown */}
          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <Button
                asChild
                className="bg-blue-500 hover:bg-blue-600 rounded-full px-6 hidden md:flex items-center gap-2"
              >
                <Link href="/vendedor">
                  <Package />
                  Vender
                </Link>
              </Button>
            )}

            {isLoggedIn && !session.user.pro && (
              <Button
                asChild
                className="bg-blue-500 hover:bg-blue-600 rounded-full px-6 hidden md:flex items-center gap-2"
              >
                <Link href="/payment/subscriptions">
                  <Zap />
                  Actualizar a Pro
                </Link>
              </Button>
            )}

            <UserDropdown />
          </div>
        </div>
      </nav>
    </header>
  );
};
