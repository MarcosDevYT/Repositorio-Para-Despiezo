import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { auth } from "@/auth";
import { Monitor, User } from "lucide-react";
import { LogOutButton } from "./LoginComponents/LogOutButton";
import Link from "next/link";
import { Button } from "./ui/button";
import { Fragment } from "react";
import { adminEmails } from "@/lib/constants/conts";
import { DropdownLinks } from "@/lib/constants/data";

/**
 * @description Dropdown con las opciones de navegabilidad o logout del usuario
 * @returns Componente de dropdown para el usuario
 */
export const UserDropdown = async () => {
  const session = await auth();

  if (!session?.user) {
    return (
      <Button asChild className="rounded-full">
        <Link href="/login">Iniciar sesión</Link>
      </Button>
    );
  }

  const { user } = session ?? {};
  const { name, email, image } = user ?? {};

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer border-2 border-neutral-300 rounded-full">
        <Avatar className="size-10">
          <AvatarImage className="object-cover" src={image ?? ""} />
          <AvatarFallback>
            {name?.charAt(0).toUpperCase() ?? <User className="size-5" />}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="flex flex-col gap-1">
          {name ?? "User Name"}
          <span className="text-xs text-neutral-500">
            {email ?? "User Email"}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Panel de administrador del usuario */}
        {adminEmails.includes(session.user.email!) && (
          <>
            <DropdownMenuLabel className="flex flex-col gap-1">
              Admin
            </DropdownMenuLabel>
            <DropdownMenuItem className="p-0">
              <Link
                className="p-1.5 px-2 h-9 w-full flex items-center justify-start gap-2 text-neutral-900"
                href={"/admin"}
              >
                <Monitor />
                Panel de administrador
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Link para el perfil del usuario */}

        {DropdownLinks.map((option) => (
          <Fragment key={option.title}>
            {option.links.map((links) => (
              <DropdownMenuItem key={links.label} className="p-0">
                <Link
                  className="p-1.5 px-2 h-9 w-full flex items-center justify-start gap-2 text-neutral-900"
                  href={links.href}
                >
                  {links.icon}
                  {links.label}
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </Fragment>
        ))}

        <DropdownMenuItem className="p-0">
          <LogOutButton />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
