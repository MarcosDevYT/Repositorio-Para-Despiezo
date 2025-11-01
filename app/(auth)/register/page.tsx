import { MainContainer } from "@/components/layout/MainContainer";
import { FormRegister } from "@/components/loginComponents/FormRegister";
import { GoogleLogin } from "@/components/loginComponents/GoogleLogin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

/**
 * Página de registro
 * @returns Componente de registro con Google y formulario de registro
 */

export default function RegisterPage() {
  return (
    <MainContainer className="flex items-center justify-center py-16 min-h-[calc(90vh)]">
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
    </MainContainer>
  );
}
