import { Search, ScanLine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ToolsSection = () => {
  return (
    <section className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Herramientas de Búsqueda</h2>
        <p className="text-muted-foreground">
          Encuentra partes específicas con nuestras herramientas avanzadas
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* OEM Search Tool */}
        <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-500/5 to-blue-500/10 border border-blue-500/20">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <Search className="h-8 w-8 text-blue-500" />
            </div>
            <CardTitle className="text-xl">
              Búsqueda por Número de Referencia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Busca partes usando el número de parte original del fabricante
            </p>
            <div className="space-y-3">
              <Input
                placeholder="Ej: 04465-42180"
                className="text-center rounded-full border-blue-500/50 focus:border-blue-500 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button
                className="w-full rounded-full bg-blue-500 text-white hover:bg-blue-600 "
                size="lg"
              >
                Buscar por Número de Referencia
              </Button>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              <p>Ejemplos: 04465-42180, MR968274, 13780-65J00</p>
            </div>
          </CardContent>
        </Card>

        {/* OCR Scanner Tool */}
        <Card className="group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-500/5 to-blue-500/10 border border-blue-500/20">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <ScanLine className="h-8 w-8 text-blue-500" />
            </div>
            <CardTitle className="text-xl">Escaneo OCR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Escanea el código o número de la parte directamente con tu cámara
            </p>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-blue-500/50 rounded-lg p-8 text-center bg-accent/5 text-blue-500">
                <ScanLine className="h-12 w-12 mx-auto mb-2" />
                <p className="text-sm">Toca para abrir cámara</p>
              </div>
              <Button
                className="w-full bg-blue-500 text-white hover:bg-blue-600 rounded-full"
                size="lg"
              >
                Activar Escáner
              </Button>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              <p>Funciona con códigos de barras, QR y texto impreso</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
