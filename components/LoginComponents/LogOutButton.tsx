import { signOut } from "@/auth";
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
      <button
        type="submit"
        className="flex items-center gap-2 text-sm text-neutral-900 p-1.5 px-2 w-full cursor-pointer"
      >
        <LogOut className="size-4 text-neutral-900" />
        Cerrar sesión
      </button>
    </form>
  );
}
