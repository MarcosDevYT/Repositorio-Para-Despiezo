"use client";

import { Loader2, Mail } from "lucide-react";
import { Button } from "./ui/button";

import React, { useTransition } from "react";
import { toast } from "sonner";
import { Prisma } from "@prisma/client";
import { startChatAction } from "@/actions/chat-actions";
import { useRouter } from "next/navigation";

type PrismaOrden = Prisma.OrdenGetPayload<{
  include: { product: true; buyer: true };
}>;

export const ChatCompradorButton = ({ orden }: { orden: PrismaOrden }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Funcion para llamar al action asi crear un chat con el vendedor
  const handleInitChat = () => {
    startTransition(async () => {
      const res = await startChatAction(orden.product.id);
      if (!res?.success) {
        toast.error(res?.error);
        return;
      }
      router.push(res.url!);
    });
  };

  return (
    <Button
      disabled={isPending}
      onClick={handleInitChat}
      variant="outline"
      className="flex items-center justify-center gap-2"
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <>
          <Mail className="w-4 h-4" />
          Contactar comprador
        </>
      )}
    </Button>
  );
};
