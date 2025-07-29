import { FormRegister } from "@/components/LoginComponents/FormRegister";
import { GoogleLogin } from "@/components/LoginComponents/GoogleLogin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

/**
 * Página de registro
 * @returns Componente de registro con Google y formulario de registro
 */

export default function RegisterPage() {
  return (
    <main className="container mx-auto flex flex-col items-center justify-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-4 text-center">
            Registrate
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <FormRegister />
          <GoogleLogin />

          <p className="text-sm text-center mt-6">
            Ya tienes una cuenta?{" "}
            <Link href="/login" className="underline">
              Iniciar sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
