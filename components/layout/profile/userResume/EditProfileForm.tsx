"use client";

import { z } from "zod";
import { editProfileSchema } from "@/lib/zodSchemas/userSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { editProfileAction } from "@/actions/user-actions";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { UserEditProps } from "@/types/profileTypes";
import { LocationAutocomplete } from "@/components/LocationSearchInput";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

/**
 * Formulario de login
 * @returns Formulario de login con email y contraseña
 */

export const EditProfileForm = ({ user }: { user: UserEditProps }) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Valores por defecto del formulario
  const form = useForm<z.infer<typeof editProfileSchema>>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: user?.name ?? "",
      phoneNumber: user?.phoneNumber ?? "",
      location: user?.location ?? "",
      businessName: user?.businessName ?? "",
    },
  });

  // Función para manejar el submit del formulario
  const onSubmit = async (data: z.infer<typeof editProfileSchema>) => {
    startTransition(async () => {
      try {
        // Limpiamos el error
        setError(null);

        // Llamamos a la acción de login
        const result = await editProfileAction(data);

        if (result?.error) {
          setError(result.error);
        } else {
          toast.success(result.success);
        }

        router.refresh();
      } catch (error) {
        console.log(error);
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";

        setError(`Error: ${errorMessage}`);
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col w-full md:flex-row gap-6 md:gap-16">
          {/* Nombre */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre" {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Teléfono */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="flex items-center justify-between">
                  Teléfono
                </FormLabel>
                <FormControl>
                  <Input placeholder="Teléfono" {...field} type="number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col w-full md:flex-row gap-6 md:gap-16">
          {/* Ubicación */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Ubicación</FormLabel>
                <FormControl>
                  <LocationAutocomplete
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nombre de la empresa */}
          <FormField
            control={form.control}
            name="businessName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nombre de la empresa</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nombre de la empresa"
                    {...field}
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {error && <FormMessage className="text-red-500">{error}</FormMessage>}

        <Button size="loginSize" type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar cambios"
          )}
        </Button>
      </form>
    </Form>
  );
};
