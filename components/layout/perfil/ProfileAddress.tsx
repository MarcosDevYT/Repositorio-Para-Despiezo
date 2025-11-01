"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MoreVertical, Pencil, PlusIcon, Trash2 } from "lucide-react";
import { Session } from "next-auth";
import { useState, useTransition } from "react";
import { toast } from "sonner";

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
import { FormCheckout } from "../ProductComponents/FormCheckout";
import { Address } from "@/lib/generated/prisma/client";

export const ProfileAddress = ({ session }: { session: Session }) => {
  const userAddresses = session.user.addresses;

  const [addresses, setAddress] = useState<Address[] | null>(userAddresses);
  const [dataAddress, setDataAddress] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);
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

  const [isAddressDeletePending, startAddressDeleteTransition] =
    useTransition();

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

        toast.success("Dirección eliminada ✅");
      } catch (error) {
        toast.error("Ocurrió un error al borrar la dirección");
      }
    });
  };

  return (
    <Card className="w-full">
      {showForm ? (
        <>
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Puedes agregar una dirección
            </CardTitle>
            <CardDescription>
              Rellena tu información de contacto para poder enviarte productos y
              contactarnos en caso de un problema.{" "}
              <strong>
                Porfavor revisa que los datos proporcionados sean los correctos
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
              Administra tus direcciones
            </CardTitle>
            <CardDescription>
              Aqui puedes administrar tu información de contacto para poder
              enviarte productos y contactarnos en caso de un problema.{" "}
              <strong>
                Porfavor revisa que los datos proporcionados sean los correctos
              </strong>
            </CardDescription>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Teléfono */}
            <div className="bg-white rounded-xl border border-border p-3 flex flex-col col-span-full">
              <EditableBusinessField
                label="Numero de teléfono"
                setValue={setPhoneNumber}
                value={session.user.phoneNumber}
                type="text"
                fieldName="phoneNumber"
              />
            </div>

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

                  <div className="bg-white rounded-xl border border-border p-3 flex flex-col h-44">
                    <div className="flex flex-col justify-between h-full">
                      <h2 className="text-xl font-semibold mb-2">
                        Información de envio
                      </h2>

                      <div className="space-y-1">
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
          </CardContent>
        </>
      )}
    </Card>
  );
};
