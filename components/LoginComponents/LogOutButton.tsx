import { signOut } from "@/auth";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";

/**
 * Botón de logout que utiliza el hook signOut de NextAuth configurado en auth.ts
 * @returns Componente de logout
 */

export async function LogOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button type="submit">
        <LogOut className="size-4 mr-2" />
        Cerrar sesión
      </Button>
    </form>
  );
}
