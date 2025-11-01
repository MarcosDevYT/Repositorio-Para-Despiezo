import { MainContainer } from "@/components/layout/MainContainer";
import { FormGoogleLogin } from "@/components/LoginComponents/FormGoogleLogin";
import { FormLogin } from "@/components/LoginComponents/FormLogin";
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
    <MainContainer className="flex items-center justify-center py-16 min-h-[calc(90vh)]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-4 text-center">
            Inicia sesión
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <FormLogin isVerified={isVerified} />
          <FormGoogleLogin />

          <p className="text-sm text-center mt-6">
            No tienes una cuenta?{" "}
            <Link href="/register" className="underline">
              Registrate
            </Link>
          </p>
        </CardContent>
      </Card>
    </MainContainer>
  );
}
