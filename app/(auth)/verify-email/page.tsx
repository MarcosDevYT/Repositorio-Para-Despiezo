import { MainContainer } from "@/components/layout/MainContainer";
import { VerificarEmailButton } from "@/components/LoginComponents/VerificarEmailButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
          <CardTitle className="text-2xl font-bold mb-4 text-center">
            Verificar email
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-center text-sm text-neutral-700">
            Verifica tu email para continuar.
          </p>

          <VerificarEmailButton token={token} />
        </CardContent>
      </Card>
    </MainContainer>
  );
}
