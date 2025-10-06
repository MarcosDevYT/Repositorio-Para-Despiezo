"use client";

import React, { useTransition } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button } from "./ui/button";
import { toast } from "sonner";
import { handleCancelStripeSubscription } from "@/actions/buy-actions";
import { Loader2 } from "lucide-react";

export const SubscriptionButtonCancel = ({
  subscriptionId,
}: {
  subscriptionId: string;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleCancelSubscription = () => {
    startTransition(async () => {
      try {
        const res = await handleCancelStripeSubscription(subscriptionId);

        if (res.success) {
          toast.success(res.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Error al cancelar la subscripcion");
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className="w-full" asChild>
        <Button className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Cancelar subscripcion"
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Estas seguro de realizar esta acción?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Al dar click en Cancelar subscripción, perderas el acceso a tu plan
            actual.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="w-max"
              onClick={handleCancelSubscription}
              disabled={isPending}
            >
              Cancelar subscripción
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
