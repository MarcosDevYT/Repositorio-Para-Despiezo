import { getUserOrdens } from "@/actions/order-actions";
import { auth } from "@/auth";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { redirect } from "next/navigation";
import { ComprasCard } from "@/components/layout/ordenesLayout/ComprasCard";

export default async function ComprasPage() {
  const session = await auth();

  if (!session?.user) redirect("/login");

  const ordenes = await getUserOrdens(session.user.id);

  return (
    <div className="h-full w-full flex-1 flex flex-col gap-6">
      <Card className="block">
        <CardHeader className="relative">
          <CardTitle className="text-2xl font-bold">Mis Compras</CardTitle>
          <CardDescription>
            Aquí puedes gestionar tus ordenes de productos y su detalle
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ordenes.map((orden) => (
          <ComprasCard key={orden.id} orden={orden} />
        ))}
      </div>
    </div>
  );
}
