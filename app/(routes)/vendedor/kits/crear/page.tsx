import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserAvaibleProductsAction } from "@/actions/sell-actions";
import { createKit } from "@/actions/kit-actions";
import { SellKitForm } from "@/components/layout/vendedor/SellKitForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { House, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CreateKitPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const products = await getUserAvaibleProductsAction();

  if (!Array.isArray(products)) {
    return (
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardHeader className="flex flex-col items-center gap-4 pt-8">
          <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold">Hubo un error</h3>
          <p className="text-gray-600 dark:text-gray-400">
            No se pudo renderizar los productos, intentalo de nuevo mas tarde.
          </p>
        </CardHeader>

        <CardFooter className="flex items-center justify-center my-4">
          <Button className="rounded-full text-lg" asChild>
            <Link href={"/"}>
              <House className="size-5" />
              Volver al inicio
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Crear Producto</CardTitle>
        <CardDescription>Crea un nuevo producto para vender</CardDescription>
      </CardHeader>

      <CardContent>
        <SellKitForm products={products} action={createKit} mode="create" />
      </CardContent>
    </Card>
  );
}
