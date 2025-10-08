import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import React from "react";
import { getVendedorKits } from "@/actions/kit-actions";
import { SellKitCard } from "@/components/layout/vendedor/SellKitCard";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { House, XCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function KitsPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const kits = await getVendedorKits(session.user.id);

  if (!Array.isArray(kits)) {
    return (
      <Card className="w-full max-w-md text-center shadow-lg mx-auto mt-20">
        <CardHeader className="flex flex-col items-center gap-4 pt-8">
          <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold">Hubo un error</h3>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            No se pudieron cargar los kits, intentalo de nuevo más tarde.
          </CardDescription>
        </CardHeader>

        <CardFooter className="flex items-center justify-center my-4">
          <Button className="rounded-full" asChild>
            <Link href={"/"}>
              <House className="mr-2 w-5 h-5" />
              Volver al inicio
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {/* Header con botón de crear */}
      <Card>
        <CardHeader className="w-full flex flex-col md:flex-row relative">
          <div className="text-center md:text-start w-full">
            <h1 className="text-3xl font-bold">Mis Kits</h1>
            <p className="font-normal text-gray-600">
              Administra y edita tus kits de productos
            </p>
          </div>

          <Button
            variant="default"
            asChild
            className="rounded-full w-full md:absolute md:top-3 right-3 md:w-max"
          >
            <Link
              href="/vendedor/kits/crear"
              className="flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Crear Kit
            </Link>
          </Button>
        </CardHeader>
      </Card>

      {/* Lista de kits */}
      {kits.length > 0 ? (
        <div className="flex flex-col gap-4">
          {kits.map((kit) => (
            <SellKitCard kit={kit} key={kit.id} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-8">
          <CardHeader>
            <CardTitle>No hay kits creados</CardTitle>
            <CardDescription>
              Crea un kit para empezar a ofrecer combos de productos a tus
              clientes.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button variant="outline" asChild className="rounded-full">
              <Link href="/vendedor/kits/crear">
                <Plus className="mr-2 w-5 h-5" />
                Crear Kit
              </Link>
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
