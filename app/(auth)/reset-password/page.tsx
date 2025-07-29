import { FormResetPassword } from "@/components/LoginComponents/FormResetPassword";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <main className="container mx-auto flex flex-col items-center justify-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-4 text-center">
            Restablecer contraseña
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <FormResetPassword token={token} />
        </CardContent>
      </Card>
    </main>
  );
}
