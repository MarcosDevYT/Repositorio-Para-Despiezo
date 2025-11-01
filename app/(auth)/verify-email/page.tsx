import { MainContainer } from "@/components/layout/MainContainer";
import { VerificarEmailButton } from "@/components/LoginComponents/VerificarEmailButton";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function VerifyEmailPage({
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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Verificar email
          </CardTitle>
          <CardDescription className="text-center text-sm text-neutral-700">
            Verifica tu email para continuar.
          </CardDescription>
        </CardHeader>

        <CardContent className="my-4">
          <VerificarEmailButton token={token} />
        </CardContent>
      </Card>
    </MainContainer>
  );
}
