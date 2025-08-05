import { SellForm } from "@/components/layout/sell/SellForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SellCreatePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Crear Producto</CardTitle>
        <CardDescription>Crea un nuevo producto para vender</CardDescription>
      </CardHeader>

      <CardContent>
        <SellForm />
      </CardContent>
    </Card>
  );
}
