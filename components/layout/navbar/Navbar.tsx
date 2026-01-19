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
    <header className="sticky left-0 right-0 top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-border/50 shadow-sm">
      <nav className="px-4 h-20">
        <div className="container mx-auto flex items-center gap-4 lg:gap-8 justify-between h-full w-full">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
            <Image
              src={"/despiezo-logo.png"}
              alt="Logo de Despiezo"
              width={180}
              height={45}
              className="h-10 w-auto"
            />
          </Link>

          {/* Buscador */}
          <div className="hidden md:block w-full max-w-2xl lg:max-w-3xl">
            <SearchIndex userId={session?.user.id} />
          </div>

          {/* User Dropdown y acciones */}
          <div className="flex items-center gap-2 lg:gap-3">
            {isLoggedIn && (
              <Button
                asChild
                size="sm"
                className="bg-primary hover:bg-primary/90 rounded-full px-4 lg:px-6 hidden md:flex items-center gap-2 font-medium shadow-sm hover:shadow-md transition-all"
              >
                <Link href="/vendedor">
                  <Package className="h-4 w-4" />
                  <span className="hidden lg:inline">Vender</span>
                </Link>
              </Button>
            )}

            {isLoggedIn && !session.user.pro && (
              <Button
                asChild
                size="sm"
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-yellow-950 rounded-full px-4 lg:px-6 hidden md:flex items-center gap-2 font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <Link href="/payment/subscriptions">
                  <Zap className="h-4 w-4" />
                  <span className="hidden lg:inline">Ser PRO</span>
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
