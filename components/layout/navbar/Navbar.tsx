import { SearchForm } from "@/components/SearchForm";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "@/components/UserDropdown";
import Link from "next/link";
import { Package, Search } from "lucide-react";
import { auth } from "@/auth";

/**
 * @description Componente de la barra de navegacion
 * @returns Componente de la barra de navegacion
 */
export const Navbar = async () => {
  const session = await auth();

  const isLoggedIn = !!session?.user;

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-black/10 bg-slate-50">
      <nav className="border-b border-black/10 px-4 h-20">
        <div className="container mx-auto flex items-center justify-between h-full w-full">
          {/* Logo */}
          <Link href="/">
            <h1 className="text-2xl font-bold text-blue-500">
              Despiezo Market
            </h1>
          </Link>

          {/* Buscador */}
          <div className="hidden md:block w-full max-w-3xl">
            <SearchForm />
          </div>

          {/* User Dropdown */}
          <div className="flex items-center gap-4">
            {isLoggedIn && (
              <Button
                asChild
                className="bg-blue-500 hover:bg-blue-600 rounded-full px-6 hidden md:flex items-center gap-2"
              >
                <Link href="/sell">
                  <Package />
                  Vender
                </Link>
              </Button>
            )}

            <UserDropdown />

            <Button
              size="icon"
              variant="ghost"
              className="rounded-full hover:bg-blue-500/10 hover:text-blue-500 md:hidden"
            >
              <Search className="size-5" />
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};
