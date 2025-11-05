import { OrdenFull } from "@/types/ProductTypes";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction, useTransition } from "react";
import { markAsDelivered } from "@/actions/order-actions";
import { toast } from "sonner";

export const EntregadoButton = ({
  orden,
  delivered,
  setDelivered,
}: {
  orden: OrdenFull;
  delivered: boolean;
  setDelivered: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleDelivered = () => {
    startTransition(async () => {
      const res = await markAsDelivered(orden.id);
      if (res.success) {
        toast.success("Orden marcada como entregada");
        setDelivered(true);
      } else {
        toast.error("No se pudo actualizar la orden");
      }
    });
  };

  return (
    <Button
      onClick={handleDelivered}
      disabled={isPending || delivered}
      variant={delivered ? "secondary" : "default"}
    >
      {delivered ? "Entregado" : "Marcar como entregado"}
    </Button>
  );
};
