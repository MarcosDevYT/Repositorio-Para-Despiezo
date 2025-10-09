"use client";

import { Loader2, Mail } from "lucide-react";
import { Button } from "./ui/button";

import React, { useTransition } from "react";
import { toast } from "sonner";
import { startChatWithClient } from "@/actions/chat-actions";
import { useRouter } from "next/navigation";
import { PrismaOrden } from "@/types/ProductTypes";

export const ChatCompradorButton = ({ orden }: { orden: PrismaOrden }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleInitChat = () => {
    startTransition(async () => {
      const res = await startChatWithClient(orden);
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
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          <Mail className="w-4 h-4" />
          Contactar con el comprador
        </>
      )}
    </Button>
  );
};
