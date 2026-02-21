"use client";

import { verifyEmailAction } from "@/actions/auth-actions";
import { Mail, ShieldAlert, CheckCircle2, Loader2 } from "lucide-react";
import { Session } from "next-auth";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

interface Props {
  session: Session;
}

export const EmailVerifyBlockCard = ({ session }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleSendVerification = () => {
    startTransition(async () => {
      const res = await verifyEmailAction(session.user.email);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Correo de verificación enviado", {
          description: "Revisa tu bandeja de entrada y haz clic en el enlace para verificar.",
        });
      }
    });
  };

  return (
    <Card className="w-full overflow-hidden">
      {/* Top gradient bar */}
      <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500" />

      <CardHeader className="text-center pb-2 pt-8">
        <div className="mx-auto bg-orange-100 rounded-full p-4 mb-4">
          <ShieldAlert className="size-10 text-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          Verifica tu email para seguir publicando
        </h2>
        <p className="text-gray-500 mt-2 max-w-md mx-auto">
          ¡Genial! Ya publicaste tu primera pieza. Para continuar publicando más productos,
          necesitas verificar tu dirección de correo electrónico.
        </p>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-6 pb-8">
        {/* Email display */}
        <div className="bg-gray-50 rounded-xl px-6 py-4 flex items-center gap-3 w-full max-w-sm">
          <Mail className="size-5 text-gray-400 flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-medium">Tu correo electrónico</p>
            <p className="text-sm font-semibold text-gray-900 truncate">{session.user.email}</p>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleSendVerification}
          disabled={isPending}
          size="lg"
          className="w-full max-w-sm h-12 text-base bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25"
        >
          {isPending ? (
            <>
              <Loader2 className="size-5 animate-spin mr-2" />
              Enviando correo...
            </>
          ) : (
            <>
              <Mail className="size-5 mr-2" />
              Enviar correo de verificación
            </>
          )}
        </Button>

        {/* Steps */}
        <div className="w-full max-w-sm space-y-3 mt-2">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pasos para verificar</p>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-full p-1 mt-0.5 flex-shrink-0">
              <span className="flex items-center justify-center size-5 text-xs font-bold text-blue-600">1</span>
            </div>
            <p className="text-sm text-gray-600">Haz clic en "Enviar correo de verificación"</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 rounded-full p-1 mt-0.5 flex-shrink-0">
              <span className="flex items-center justify-center size-5 text-xs font-bold text-blue-600">2</span>
            </div>
            <p className="text-sm text-gray-600">Revisa tu bandeja de entrada (y spam)</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-green-100 rounded-full p-1 mt-0.5 flex-shrink-0">
              <CheckCircle2 className="size-5 text-green-600 p-0.5" />
            </div>
            <p className="text-sm text-gray-600">Haz clic en el enlace y ¡listo! Podrás publicar sin límites</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
