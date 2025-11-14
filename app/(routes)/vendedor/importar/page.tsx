import { auth } from "@/auth";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SellImportarInfo } from "@/components/layout/vendedor/CSVComponents/SellImportarInfo";
import { CSVImportManager } from "@/components/layout/vendedor/CSVComponents/CSVImportManager";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Zap } from "lucide-react";

export default async function ImportarProductosPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Verificar si el usuario es Pro
  const isPro = session.user.pro;

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">
            Importar Productos desde CSV/Excel
          </CardTitle>
          <p className="text-muted-foreground">
            Carga múltiples productos a la vez usando un archivo CSV o Excel
          </p>
        </CardHeader>
      </Card>

      {!isPro ? (
        <>
          {/* Mensaje para usuarios no Pro */}
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Función exclusiva para usuarios Pro</strong>
              <p className="mt-2">
                La importación masiva de productos está disponible solo para
                usuarios con suscripción Pro. Actualiza tu cuenta para acceder a
                esta funcionalidad.
              </p>
            </AlertDescription>
          </Alert>

          <Card className="p-8 text-center">
            <Zap className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">
              Actualiza a Pro para importar productos
            </h3>
            <p className="text-muted-foreground mb-6">
              Con la suscripción Pro podrás:
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-primary" />
                Importar productos masivamente desde CSV/Excel
              </li>
              <li className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-primary" />
                Publicar productos ilimitados
              </li>
              <li className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-primary" />
                Destacar productos en la plataforma
              </li>
              <li className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-primary" />
                Análisis y estadísticas avanzadas
              </li>
            </ul>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link href="/vendedor">Volver a Mis Productos</Link>
              </Button>
              <Button asChild>
                <Link href="/payment/subscriptions">
                  <Zap className="h-4 w-4" />
                  Actualizar a Pro
                </Link>
              </Button>
            </div>
          </Card>
        </>
      ) : (
        <>
          {/* Contenido para usuarios Pro */}
          <SellImportarInfo />

          {/* Botón para volver y gestor de importación */}
          <div className="flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/vendedor">Volver a Mis Productos</Link>
            </Button>

            <CSVImportManager />
          </div>
        </>
      )}
    </div>
  );
}
