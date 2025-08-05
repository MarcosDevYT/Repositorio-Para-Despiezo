import { signIn } from "@/auth";
import { Button } from "../ui/button";

/**
 * Formulario de login con Google que utiliza el hook signIn de NextAuth configurado en auth.ts
 * @returns Componente de login con Google
 */

export async function GoogleLogin() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", {
          redirectTo: "/",
        });
      }}
    >
      <Button variant="outline" size="loginSize" type="submit">
        <img src="google-icon.svg" className="size-8" alt="Google" />
        Iniciar sesión con Google
      </Button>
    </form>
  );
}
