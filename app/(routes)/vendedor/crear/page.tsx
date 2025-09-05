import { createProductAction } from "@/actions/sell-actions";
import { auth } from "@/auth";
import { SellForm } from "@/components/layout/vendedor/SellForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verifySeller } from "@/lib/utils";
import { redirect } from "next/navigation";

export default async function SellCreatePage() {
  // Verificamos que el usuario este logeado
  const session = await auth();

  if (!session?.user) redirect("/login");

  const isVerify = verifySeller(session);

  if (!isVerify) {
    redirect("/vendedor/negocio");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Crear Producto</CardTitle>
        <CardDescription>Crea un nuevo producto para vender</CardDescription>
      </CardHeader>

      <CardContent>
        <SellForm action={createProductAction} />
      </CardContent>
    </Card>
  );
}
