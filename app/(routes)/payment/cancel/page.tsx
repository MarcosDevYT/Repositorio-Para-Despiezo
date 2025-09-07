import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { House, XCircle } from "lucide-react";
import Link from "next/link";

export default function CancelPage() {
  return (
    <Card className="w-full max-w-md text-center shadow-lg">
      <CardHeader className="flex flex-col items-center gap-4 pt-8">
        <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold">Compra Cancelada</h3>
        <p className="text-gray-600 dark:text-gray-400">
          No se pudo completar tu compra. Puedes intentarlo nuevamente.
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
