"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useTransition } from "react";
import { Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { reviewSchema } from "@/lib/zodSchemas/ReviewSchemas";
import { createReviewAction } from "@/actions/review-actions";
import type { OrdenFull } from "@/types/ProductTypes";

interface ReviewFormProps {
  orden: OrdenFull;
  onSuccess?: () => void;
}

export const ReviewForm = ({ orden, onSuccess }: ReviewFormProps) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comentario: "",
    },
  });

  const onSubmit = (data: z.infer<typeof reviewSchema>) => {
    startTransition(async () => {
      try {
        const result = await createReviewAction(orden, data);
        if (result.success) {
          toast.success(result.message);
          form.reset();
          // Llamar callback para actualizar el estado del componente padre
          onSuccess?.();
        }
      } catch (err: any) {
        toast.error(err.message || "Ocurrió un error al enviar la reseña");
      }
    });
  };

  const RatingStars = ({ field }: { field: any }) => (
    <FormItem>
      <FormLabel>Calificación del servicio</FormLabel>
      <FormControl>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => field.onChange(star)}
              className="focus:outline-none"
            >
              <Star
                className={cn(
                  "size-6 transition-colors",
                  star <= field.value
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-400"
                )}
              />
            </button>
          ))}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => <RatingStars field={field} />}
        />

        <FormField
          control={form.control}
          name="comentario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comentario (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Contanos tu experiencia con el producto y envío"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" /> Enviando...
            </>
          ) : (
            "Enviar reseña"
          )}
        </Button>
      </form>
    </Form>
  );
};
