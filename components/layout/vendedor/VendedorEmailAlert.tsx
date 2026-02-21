"use client";

import { verifyEmailAction } from "@/actions/auth-actions";
import { AlertTriangle, Mail, Loader2 } from "lucide-react";
import { Session } from "next-auth";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Props {
  session: Session;
}

export const VendedorEmailAlert = ({ session }: Props) => {
  const [isPending, startTransition] = useTransition();

  const handleSendVerification = () => {
    startTransition(async () => {
      const res = await verifyEmailAction(session.user.email);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Correo de verificación enviado", {
          description: "Revisa tu bandeja de entrada para verificar tu email.",
        });
      }
    });
  };

  return (
    <div className="rounded-xl border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50 p-4 md:p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="bg-orange-100 rounded-full p-2 flex-shrink-0">
            <AlertTriangle className="size-5 text-orange-600" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-orange-900 text-sm md:text-base">
              Verifica tu email para seguir publicando
            </p>
            <p className="text-orange-700/80 text-xs md:text-sm mt-0.5">
              Has publicado tu primer producto. Para publicar más, verifica tu correo:
              <span className="font-medium ml-1">{session.user.email}</span>
            </p>
          </div>
        </div>

        <Button
          onClick={handleSendVerification}
          disabled={isPending}
          className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white shadow-sm w-full sm:w-auto"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin mr-1.5" />
              Enviando...
            </>
          ) : (
            <>
              <Mail className="size-4 mr-1.5" />
              Verificar ahora
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
