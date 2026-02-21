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
import { redirect } from "next/navigation";
import { EmailVerifyBlockCard } from "@/components/layout/vendedor/EmailVerifyBlockCard";

export default async function SellCreatePage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const productCount = session.user.products?.length ?? 0;
  const emailVerified = !!session.user.emailVerified;

  // Si ya tiene 1+ productos y NO ha verificado email → mostrar bloqueo con CTA
  if (productCount >= 1 && !emailVerified) {
    return <EmailVerifyBlockCard session={session} />;
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
