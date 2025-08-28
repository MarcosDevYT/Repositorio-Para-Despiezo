"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { ProfileNavLinks } from "@/data";

/**
 * @description Componente de links para el perfil del usuario
 * @returns Componente de links
 */
export const ProfileLinks = () => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col items-center justify-center gap-1">
      {/* Mapping de los links de navegacion */}
      {ProfileNavLinks.map((query) => (
        <Button
          key={query.label}
          asChild
          variant="ghost"
          className={cn(
            "flex items-center justify-start gap-2 w-full py-2 px-4 text-sm text-muted-foreground hover:bg-muted",
            pathname === query.href &&
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
          )}
        >
          <Link href={query.href}>
            {query.icon} {query.label}
          </Link>
        </Button>
      ))}
    </nav>
  );
};
