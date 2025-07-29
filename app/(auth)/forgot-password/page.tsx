import { FormEmailSend } from "@/components/LoginComponents/FormEmailSend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <main className="container mx-auto flex flex-col items-center justify-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-4 text-center">
            Restablecer contraseña
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <FormEmailSend />
        </CardContent>
      </Card>
    </main>
  );
}
