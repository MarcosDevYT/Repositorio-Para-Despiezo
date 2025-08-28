"use client";

import { verifyEmailAction } from "@/actions/auth-actions";
import { Check } from "lucide-react";
import { Session } from "next-auth";
import { useTransition } from "react";
import { toast } from "sonner";

export default function EmailVerificationStatus({
  session,
}: {
  session: Session;
}) {
  const [isPending, startTransition] = useTransition();

  const isVerified = session.user.emailVerified || false;

  const handleSendVerification = async () => {
    startTransition(async () => {
      const res = await verifyEmailAction(session.user.email);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Correo de verificación enviado", {
          description: res?.success
            ? res.success
            : "Por favor, verifica tu email para continuar",
        });
      }
    });
  };

  if (isVerified === null) return;

  return isVerified ? (
    <span className="bg-green-500 text-white font-semibold text-sm p-0.5 px-2 md:px-3 rounded-full inline-flex items-center gap-2">
      Verificado <Check className="size-4" strokeWidth={2.5} />
    </span>
  ) : (
    <button
      onClick={handleSendVerification}
      disabled={isPending}
      className="bg-blue-600 hover:bg-blue-700 text-white text-sm p-0.5 px-3 rounded-full"
    >
      {isPending ? "Enviando..." : "Verificar correo"}
    </button>
  );
}
