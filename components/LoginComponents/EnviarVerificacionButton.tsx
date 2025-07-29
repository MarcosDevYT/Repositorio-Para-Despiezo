"use client";

import {
  getEmailVerificationStatus,
  verifyEmailAction,
} from "@/actions/auth-actions";
import { Check } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

export default function EmailVerificationStatus({ email }: { email: string }) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchStatus = async () => {
      const result = await getEmailVerificationStatus();
      setIsVerified(result);
    };

    fetchStatus();
  }, [email]);

  const handleSendVerification = async () => {
    startTransition(async () => {
      const res = await verifyEmailAction(email);
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
    <p className="text-green-600 flex items-center gap-2">
      Email verificado <Check className="size-4" />
    </p>
  ) : (
    <button
      onClick={handleSendVerification}
      disabled={isPending}
      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
    >
      {isPending ? "Enviando..." : "Verificar correo"}
    </button>
  );
}
