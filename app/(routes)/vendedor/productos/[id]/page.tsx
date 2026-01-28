import {
  getProductByIdAction,
  updateProductAction,
} from "@/actions/sell-actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sellSchema } from "@/lib/zodSchemas/sellSchema";
import { z } from "zod";
import { verifySeller } from "@/lib/utils";
import { SellForm } from "@/components/layout/vendedor/SellForm";

export default async function EditPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  // Verificamos que el usuario este logeado
  const session = await auth();

  if (!session?.user) redirect("/login");

  // Verificamos que el usuario tenga los datos
  const isVerify = verifySeller(session);

  if (!isVerify) {
    redirect("/vendedor/negocio");
  }

  const product = await getProductByIdAction(id);

  if (!product || "error" in product || product.vendorId !== session?.user.id) {
    return redirect("/");
  }

  const updateWithId = async (data: z.infer<typeof sellSchema>) => {
    "use server";
    return updateProductAction(id, data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Editar Producto</CardTitle>
      </CardHeader>
      <CardContent>
        <SellForm
          initialValues={product as Partial<z.infer<typeof sellSchema>>}
          action={updateWithId}
        />
      </CardContent>
    </Card>
  );
}
