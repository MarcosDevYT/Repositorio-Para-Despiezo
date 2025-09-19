"use client";

import { buyProductActions } from "@/actions/buy-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProductType } from "@/types/ProductTypes";
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
import { Address } from "@prisma/client";
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

export const ProductCheckout = ({
  session,
  product,
}: {
  session: Session;
  product: ProductType;
}) => {
  const userAddresses = session.user.addresses;

  const [addresses, setAddress] = useState<Address[] | null>(userAddresses);
  const [dataAddress, setDataAddress] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [checkoutAddress, setCheckoutAddress] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState(session.user.phoneNumber);

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

  console.log(addresses);

  const [isAddressDeletePending, startAddressDeleteTransition] =
    useTransition();

  const [isPaymentPending, startPaymentTransition] = useTransition();
  // Funcion para iniciar la compra por stripe
  const handlePayment = () => {
    startPaymentTransition(async () => {
      try {
        const res = await buyProductActions(
          product.id,
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
          console.log(res.error);
          toast.error(res.error);
          return;
        }

        // Filtrar la dirección eliminada
        setAddress((prev) => prev?.filter((addr) => addr.id !== id) || null);

        // Si la dirección eliminada era la seleccionada
        if (checkoutAddress === id) setCheckoutAddress(null);

        toast.success("Dirección eliminada ✅");
      } catch (error) {
        toast.error("Ocurrió un error al borrar la dirección");
      }
    });
  };

  const hasOffer = product.offer && product.offerPrice;

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
                Rellena tu información de contacto para poder enviar el producto
                y contactarnos en caso de un problema.{" "}
                <strong>
                  Porfavor revisa que los datos proporcionados sean los
                  correctos
                </strong>
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
                Elige tu información de contacto para poder enviar el producto y
                contactarnos en caso de un problema.{" "}
                <strong>
                  Porfavor revisa que los datos proporcionados sean los
                  correctos
                </strong>
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              {/* Teléfono */}
              <div className="bg-white rounded-xl border border-border p-3 flex flex-col">
                <EditableBusinessField
                  label="Numero de teléfono"
                  setValue={setPhoneNumber}
                  value={session.user.phoneNumber}
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
                            <Button variant={"ghost"} size={"icon"}>
                              <MoreVertical className="size-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="bottom" align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() => handleEditAddress(address)}
                              className="cursor-pointer"
                            >
                              <Pencil />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              disabled={isAddressDeletePending}
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-red-500 hover:text-red-500 focus:text-red-500 cursor-pointer"
                            >
                              <Trash2 className="text-red-500" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div
                        className="bg-white rounded-xl border border-border p-3 flex flex-col"
                        onClick={() => setCheckoutAddress(address.id)}
                      >
                        <div>
                          <h2 className="text-xl font-semibold mb-2">
                            Información de envio
                          </h2>

                          <div className="text-base font-semibold">
                            Pais: {address?.country}
                          </div>

                          <p className="text-sm">
                            Dirrección: {address?.city}, {address?.street}{" "}
                            {address?.number}
                          </p>
                          <p className="text-sm">Telefono: {phoneNumber}</p>
                          <p className="text-sm">
                            Codigo Postal: {address?.postalCode}
                          </p>
                        </div>

                        <div className="flex w-full items-end justify-end">
                          <RadioGroupItem value={address.id} id={address.id} />
                        </div>
                      </div>
                    </div>
                  ))}

                <div
                  onClick={() => setShowForm(true)}
                  className="bg-accent/50 hover:bg-accent cursor-pointer transition-colors rounded-xl border border-border p-3 flex flex-col justify-center items-center gap-2 text-gray-600"
                >
                  <p className="text-lg">Añade otra dirección</p>
                  <PlusIcon className="size-6" />
                </div>
              </RadioGroup>
            </CardContent>
          </>
        )}
      </Card>

      {/* Informacion del producto */}
      <Card className="w-full md:w-4/12">
        <CardHeader>
          <div className="w-full h-72 relative">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              objectFit="contain"
            />
          </div>
        </CardHeader>

        {/* Contenido del formulario */}
        <CardContent className="space-y-1">
          <h1 className="text-2xl font-bold">{product.name}</h1>

          {hasOffer ? (
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-green-600">
                Precio: €{product.offerPrice}
              </span>
              <span className="line-through text-muted-foreground">
                €{product.price}
              </span>
            </div>
          ) : (
            <span className="text-3xl font-bold text-primary">
              Precio: €{product.price}
            </span>
          )}

          <Button
            onClick={handlePayment}
            disabled={
              isPaymentPending ||
              checkoutAddress === null ||
              phoneNumber === null
            }
            className={`w-full bg-blue-500 text-white hover:bg-blue-600 rounded-full my-4`}
          >
            {isPaymentPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <ShoppingCart className="size-5" />
                Comprar ahora
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </section>
  );
};
