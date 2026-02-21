"use client";

import { verifyEmailAction } from "@/actions/auth-actions";
import { Mail, AlertTriangle, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export const EmailVerificationBanner = () => {
  const { data: session } = useSession();
  const [dismissed, setDismissed] = useState(false);
  const [isPending, startTransition] = useTransition();

  // No mostrar si: no hay sesión, email ya verificado, no tiene productos, o fue descartado
  if (!session?.user) return null;
  if (session.user.emailVerified) return null;
  if (!session.user.products || session.user.products.length === 0) return null;
  if (dismissed) return null;

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
    <div className="sticky top-20 z-40 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="flex-shrink-0 bg-white/20 rounded-full p-1.5">
              <AlertTriangle className="size-4" />
            </div>
            <p className="text-sm font-medium truncate">
              <span className="hidden sm:inline">
                Verifica tu email para seguir publicando productos.
              </span>
              <span className="sm:hidden">
                Verifica tu email para publicar más.
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleSendVerification}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 bg-white text-orange-600 hover:bg-orange-50 font-semibold text-sm px-4 py-1.5 rounded-full transition-colors shadow-sm cursor-pointer disabled:opacity-70"
            >
              <Mail className="size-3.5" />
              {isPending ? "Enviando..." : "Verificar ahora"}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Cerrar"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
