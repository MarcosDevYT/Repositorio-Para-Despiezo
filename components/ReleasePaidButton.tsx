"use client";

import { Orden } from "@prisma/client";
import { Button } from "./ui/button";
import { useTransition } from "react";
import { toast } from "sonner";
import { releasePaymentAction } from "@/actions/buy-actions";

export const ReleasePaidButton = ({ orden }: { orden: Orden }) => {
  const [isPending, startTransition] = useTransition();

  const handleTransfer = () => {
    startTransition(async () => {
      try {
        const result = await releasePaymentAction(orden.productId, "delivery");

        if (!result) {
          toast.error("No se encontró la orden o no se pudo transferir.");
          return;
        }

        toast.success(`Pago liberado para la orden ${result.id}`);
      } catch (error) {
        toast.error("Ocurrió un error intentando la transferencia.");
        console.error(error);
      }
    });
  };

  return (
    <Button disabled={isPending} onClick={handleTransfer}>
      {isPending ? "Liberando..." : "Liberar Pago"}
    </Button>
  );
};
