import { FormLogin } from "@/components/LoginComponents/FormLogin";
import { GoogleLogin } from "@/components/LoginComponents/GoogleLogin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

/**
 * Página de login
 * @returns Componente de login con Google y formulario de login
 */

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ verified: string }>;
}) {
  const isVerified = (await searchParams).verified === "true";

  return (
    <main className="container mx-auto flex flex-col items-center justify-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-4 text-center">
            Inicia sesión
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <FormLogin isVerified={isVerified} />
          <GoogleLogin />

          <p className="text-sm text-center mt-6">
            No tienes una cuenta?{" "}
            <Link href="/register" className="underline">
              Registrate
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
