import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { userContactSchema } from "@/lib/zodSchemas/userContactSchema";
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
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from "react";
import { createUserAddress } from "@/actions/user-actions";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Address } from "@/lib/generated/prisma/client";

export const FormCheckout = ({
  isEditing,
  dataAddress,
  setAddresses,
  setDataAddress,
  setShowForm,
}: {
  isEditing?: boolean;
  dataAddress: Address;
  setAddresses: Dispatch<SetStateAction<Address[] | null>>;
  setDataAddress: Dispatch<
    SetStateAction<{
      number: string;
      id: string;
      userId: string;
      street: string;
      city: string;
      postalCode: string;
      country: string;
      isDefault: boolean;
    } | null>
  >;
  setShowForm: Dispatch<SetStateAction<boolean>>;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Valores por defecto del formulario
  const form = useForm<z.infer<typeof userContactSchema>>({
    resolver: zodResolver(userContactSchema),
    defaultValues: {
      city: dataAddress.city || "",
      postalCode: dataAddress.country || "",
      street: dataAddress.street || "",
      number: dataAddress.number || "",
      country: "España",
    },
  });

  /**
   * Handle para setear la informacion de contacto
   */
  const handleSetUserContact = async (
    data: z.infer<typeof userContactSchema>
  ) => {
    startTransition(async () => {
      try {
        const res = await createUserAddress(
          data,
          isEditing ? dataAddress.id : undefined,
          isEditing
        );

        if (res.error) {
          setError(res.error);
          toast.error(res.error);
          return;
        }

        if (!isEditing && res.address) {
          // agregar nueva dirección al estado
          setAddresses((prev) => [...(prev || []), res.address]);
        }

        setShowForm(false);
        setDataAddress(null);
        toast.success("Información guardada correctamente ✅");
      } catch (error) {
        console.log(error);
      }
    });
  };

  useEffect(() => {
    if (dataAddress) {
      form.reset({
        city: dataAddress.city,
        postalCode: dataAddress.postalCode,
        street: dataAddress.street,
        number: dataAddress.number,
        country: dataAddress.country || "España",
      });
    }
  }, [dataAddress]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSetUserContact)}
        className="space-y-6"
      >
        <div className="flex flex-col w-full items-start md:flex-row gap-6 md:gap-16">
          {/* Codigo Postal */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Pais</FormLabel>
                <FormControl>
                  <Input placeholder="Pais" {...field} type="text" disabled />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col w-full items-start md:flex-row gap-6 md:gap-16">
          {/* Ciudad */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="flex items-center justify-between">
                  Ciudad
                </FormLabel>
                <FormControl>
                  <Input placeholder="Ciudad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Codigo Postal */}
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Codigo Postal</FormLabel>
                <FormControl>
                  <Input placeholder="Codigo Postal" {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col w-full items-start md:flex-row gap-6 md:gap-16">
          {/* Nombre de la calle */}
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nombre de la calle</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nombre de la calle"
                    {...field}
                    type="text"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nombre de la calle */}
          <FormField
            control={form.control}
            name="number"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Numero de la calle</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Numero de la calle"
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

        <Button
          className="w-max px-4 text-base"
          type="submit"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar Información"
          )}
        </Button>
      </form>
    </Form>
  );
};
