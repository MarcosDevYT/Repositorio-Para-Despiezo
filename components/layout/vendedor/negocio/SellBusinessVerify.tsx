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

import {
  createStripeAccountLinkAction,
  editProfileAction,
  getStripeDashboardLinkAction,
} from "@/actions/user-actions";

import { useState, useTransition } from "react";
import { Loader2, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LocationAutocomplete } from "@/components/LocationSearchInput";
import { toast } from "sonner";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import EmailVerificationStatus from "@/components/LoginComponents/EnviarVerificacionButton";
import { SubmitButton } from "@/components/SubmitButton";

interface Props {
  session: Session;
}

export const SellBusinessVerify = ({ session }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isConnected = session.user.stripeConnectedLinked;

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

  const emailVerified = !!session.user.emailVerified;

  return (
    <Card className="w-full">
      <CardHeader>
        <h1 className="text-2xl font-bold">
          Configuración de tu negocio
        </h1>
        <p className="text-muted-foreground">
          Completa tus datos de vendedor para mejorar tu perfil.
        </p>
      </CardHeader>
      <CardContent>
        {/* Verificación del email - PROMINENTE si no está verificado */}
        {!emailVerified && (
          <div className="mb-6 rounded-xl border-2 border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50 p-5">
            <h2 className="text-lg font-bold text-orange-900 flex items-center gap-2">
              <span className="bg-orange-200 rounded-full p-1">
                <Mail className="size-4 text-orange-700" />
              </span>
              Verifica tu email
            </h2>
            <p className="text-orange-800/80 text-sm mt-1 mb-3">
              Para poder seguir publicando productos necesitas verificar tu correo electrónico.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium text-gray-700">{session.user.email}</span>
              <EmailVerificationStatus session={session} />
            </div>
          </div>
        )}

        {emailVerified && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
            <h2 className="text-lg font-bold text-green-800 flex items-center gap-2">
              Email verificado
            </h2>
            <p className="text-sm text-green-700 mt-1">
              {session.user.email} <EmailVerificationStatus session={session} />
            </p>
          </div>
        )}

        {/* Vinculación con Stripe Connect - Informativo */}
        <div className="mb-6 rounded-xl border bg-card p-5">
          <h2 className="text-lg font-bold">Recibir pagos con Stripe</h2>
          <p className="text-sm text-muted-foreground mb-2">
            {isConnected
              ? "Tu cuenta de Stripe está conectada. Puedes recibir pagos."
              : "Vincula tu cuenta de Stripe cuando quieras empezar a recibir pagos de compradores. No es necesario para publicar productos."}
          </p>
          {session.user.stripeConnectedLinked === false && (
            <form action={createStripeAccountLinkAction}>
              <SubmitButton title="Vincular cuenta de Stripe" />
            </form>
          )}

          {session.user.stripeConnectedLinked === true && (
            <form action={getStripeDashboardLinkAction}>
              <SubmitButton title="Ver Panel de Control" />
            </form>
          )}
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
                      (recomendado)
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
