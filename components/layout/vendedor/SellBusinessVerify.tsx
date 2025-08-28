"use client";

import { z } from "zod";
import { editBusinessDataSchema } from "@/lib/zodSchemas/userSchema";
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
import { LocationAutocomplete } from "@/components/LocationSearchInput";
import { toast } from "sonner";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import EmailVerificationStatus from "@/components/LoginComponents/EnviarVerificacionButton";

interface Props {
  session: Session;
}

export const SellBusinessVerify = ({ session }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Valores por defecto del formulario
  const form = useForm<z.infer<typeof editBusinessDataSchema>>({
    resolver: zodResolver(editBusinessDataSchema),
    defaultValues: {
      phoneNumber: session.user?.phoneNumber ?? "",
      location: session.user?.location ?? "",
      businessName: session.user?.businessName ?? "",
      description: session.user?.description ?? "",
    },
  });

  // Función para manejar el submit del formulario
  const onSubmit = async (data: z.infer<typeof editBusinessDataSchema>) => {
    // 🚨 Comparar con los valores originales
    const hasChanges =
      data.phoneNumber !== (session.user?.phoneNumber ?? "") ||
      data.location !== (session.user?.location ?? "") ||
      data.businessName !== (session.user?.businessName ?? "") ||
      data.description !== (session.user?.description ?? "");

    const isPhoneNumberChange =
      data.phoneNumber !== (session.user?.phoneNumber ?? "") &&
      (data.phoneNumber === "" || data.phoneNumber === undefined);

    if (!hasChanges) {
      toast.info("No hay cambios para guardar");
      return;
    }

    startTransition(async () => {
      try {
        setError(null);

        const result = await editProfileAction(data, isPhoneNumberChange, true);

        if (result?.error) {
          setError(result.error);
        } else {
          toast.success(result.success);
        }

        router.push("/vendedor");
      } catch (error) {
        console.log(error);
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido";

        setError(`Error: ${errorMessage}`);
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <h1 className="text-2xl font-bold">
          Verifica tu información de vendedor
        </h1>
        <p className="text-muted-foreground">
          Para poder vender productos, necesitas completar y verificar tus
          datos.
        </p>
      </CardHeader>
      <CardContent>
        {/* Verificación del email */}
        <div className="mb-6">
          <h2 className="text-lg font-bold">Verifica tu email</h2>
          <p className="text-muted-foreground">
            Para poder vender productos, necesitas verificar tu email
          </p>
          <p className="my-2">
            {session.user.email} <EmailVerificationStatus session={session} />
          </p>
        </div>

        {/* Formulario de verificación de datos de vendedor */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col w-full items-start md:flex-row gap-6 md:gap-16">
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

            {/* Ubicación */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Ubicación</FormLabel>
                  <FormControl>
                    <LocationAutocomplete
                      {...field}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descripción */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="flex flex-col w-full items-start">
                    Descripción
                    <span className="text-xs text-muted-foreground">
                      Opcional si quieres tener una descripción para tu negocio
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción de la empresa"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <FormMessage className="text-red-500">{error}</FormMessage>
            )}

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
      </CardContent>
    </Card>
  );
};
