import { MainContainer } from "@/components/layout/MainContainer";
import { FormResetPassword } from "@/components/LoginComponents/FormResetPassword";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const token = (await searchParams).token;

  if (!token) {
    return <div>Token no válido</div>;
  }

  return (
    <MainContainer className="flex items-center justify-center py-16 min-h-[calc(90vh)]">
      <Card className="w-full max-w-md shadow-lg border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Restablecer contraseña
          </CardTitle>
          <p className="text-sm text-gray-500 mt-2">
            Ingresá tu nueva contraseña y confirma para restablecer tu
            contraseña.
          </p>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          <FormResetPassword token={token} />
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link
            href="/login"
            className="text-sm text-gray-500 underline hover:text-gray-700"
          >
            Volver a iniciar sesión
          </Link>
        </CardFooter>
      </Card>
    </MainContainer>
  );
}
