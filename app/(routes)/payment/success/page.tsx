import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, House, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <Card className="w-full max-w-md text-center shadow-lg">
      <CardHeader className="flex flex-col items-center gap-4 pt-8">
        <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold">Compra Exitosa!</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Gracias por tu compra. Tu pago se ha procesado correctamente.
        </p>
      </CardHeader>

      <CardFooter className="flex flex-wrap items-center justify-center gap-4 my-4">
        <Button className="rounded-full text-lg" asChild>
          <Link href={"/"}>
            <House className="size-5" />
            Volver al inicio
          </Link>
        </Button>

        <Button className="rounded-full text-lg" asChild>
          <Link href={"/perfil/compras"}>
            <ShoppingBag className="size-5" />
            Ver mis compras
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
