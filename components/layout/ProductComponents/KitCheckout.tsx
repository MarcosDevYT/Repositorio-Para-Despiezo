"use client";

import { buyKitProductsActions } from "@/actions/buy-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Loader2,
  MoreVertical,
  Pencil,
  PlusIcon,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { FormCheckout } from "./FormCheckout";
import { Address, Prisma } from "@prisma/client";
import { EditableBusinessField } from "../vendedor/EditableBusinessField";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deletedUserAddress } from "@/actions/user-actions";

type PrismaKit = Prisma.KitGetPayload<{
  include: {
    products: {
      include: { product: true };
    };
  };
}>;

export const KitCheckout = ({
  session,
  kit,
}: {
  session: Session;
  kit: PrismaKit;
}) => {
  const userAddresses = session.user.addresses;

  const [addresses, setAddress] = useState<Address[] | null>(userAddresses);
  const [dataAddress, setDataAddress] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [checkoutAddress, setCheckoutAddress] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState(session.user.phoneNumber);
  const [isAddressDeletePending, startAddressDeleteTransition] =
    useTransition();
  const [isPaymentPending, startPaymentTransition] = useTransition();

  const emptyAddress: Address = {
    id: "",
    userId: session.user.id,
    street: "",
    number: "",
    city: "",
    postalCode: "",
    country: "España",
    isDefault: false,
  };

  // 🟢 Inicia el pago del kit completo
  const handlePayment = () => {
    startPaymentTransition(async () => {
      try {
        const productIds = kit.products.map((p) => p.productId);

        const res = await buyKitProductsActions(
          productIds,
          kit.id,
          checkoutAddress!,
          phoneNumber!
        );

        if (res.error || !res.url) {
          toast.error(res.error);
          return;
        }

        window.location.href = res.url;
      } catch (error) {
        toast.error("Error iniciando el checkout");
      }
    });
  };

  const handleEditAddress = (address: Address) => {
    setDataAddress(address);
    setShowForm(true);
  };

  const handleDeleteAddress = (id: string) => {
    startAddressDeleteTransition(async () => {
      try {
        const res = await deletedUserAddress(id);
        if (res.error) {
          toast.error(res.error);
          return;
        }

        setAddress((prev) => prev?.filter((addr) => addr.id !== id) || null);
        if (checkoutAddress === id) setCheckoutAddress(null);

        toast.success("Dirección eliminada ✅");
      } catch {
        toast.error("Ocurrió un error al borrar la dirección");
      }
    });
  };

  return (
    <section className="flex flex-col items-start justify-center md:flex-row gap-6">
      {/* Informacion del envio */}
      <Card className="w-full md:w-8/12">
        {showForm ? (
          <>
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Rellena tu Información
              </CardTitle>
              <CardDescription>
                Completa tus datos de envío y contacto.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <FormCheckout
                isEditing={!!dataAddress}
                dataAddress={dataAddress || emptyAddress}
                setAddresses={setAddress}
                setDataAddress={setDataAddress}
                setShowForm={setShowForm}
              />
            </CardContent>
          </>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Elige tu dirección
              </CardTitle>
              <CardDescription>
                Selecciona o agrega una dirección para el envío.
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              {/* Teléfono */}
              <div className="bg-white rounded-xl border border-border p-3 flex flex-col">
                <EditableBusinessField
                  label="Número de teléfono"
                  setValue={setPhoneNumber}
                  value={phoneNumber}
                  type="text"
                  fieldName="phoneNumber"
                />
              </div>

              <RadioGroup
                value={checkoutAddress}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
              >
                {addresses &&
                  addresses.map((address) => (
                    <div key={address.id} className="relative">
                      <div className="absolute top-3 right-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="size-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="bottom" align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleEditAddress(address)}
                            >
                              <Pencil />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={isAddressDeletePending}
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-red-500"
                            >
                              <Trash2 />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div
                        className="bg-white rounded-xl border border-border p-3 flex flex-col h-44 cursor-pointer"
                        onClick={() => setCheckoutAddress(address.id)}
                      >
                        <div className="flex flex-col justify-between h-full">
                          <h2 className="text-xl font-semibold mb-2">
                            Información de envío
                          </h2>
                          <div className="space-y-1 text-sm">
                            <p>
                              {address.city}, {address.street} {address.number}
                            </p>
                            <p>Teléfono: {phoneNumber}</p>
                            <p>Código Postal: {address.postalCode}</p>
                          </div>
                          <div className="absolute bottom-2 right-3">
                            <RadioGroupItem
                              value={address.id}
                              id={address.id}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                <div
                  onClick={() => setShowForm(true)}
                  className="h-44 bg-accent/50 hover:bg-accent cursor-pointer transition-colors rounded-xl border border-border p-3 flex flex-col justify-center items-center gap-2 text-gray-600"
                >
                  <p className="text-lg">Añadir dirección</p>
                  <PlusIcon className="size-6" />
                </div>
              </RadioGroup>
            </CardContent>
          </>
        )}
      </Card>

      {/* Información del Kit */}
      <Card className="w-full md:w-4/12">
        <CardHeader>
          <div className="w-full h-72 relative">
            <Image
              src={kit.images?.[0] || "/placeholder.png"}
              alt={kit.name}
              fill
              className="object-contain rounded-md"
            />
          </div>
        </CardHeader>
        <CardContent>
          <h1 className="text-2xl font-bold">{kit.name}</h1>
          <p className="text-sm text-muted-foreground">{kit.description}</p>

          <div className="text-3xl font-bold text-primary my-3">
            €{kit.price}
          </div>

          <Button
            onClick={handlePayment}
            disabled={
              isPaymentPending ||
              !checkoutAddress ||
              !phoneNumber ||
              kit.products.length === 0
            }
            className="w-full bg-blue-500 text-white hover:bg-blue-600 rounded-full my-4"
          >
            {isPaymentPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <ShoppingCart className="size-5 mr-2" />
                Comprar kit completo
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};
