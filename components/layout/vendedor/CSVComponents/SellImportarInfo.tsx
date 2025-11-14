import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileSpreadsheet, Info } from "lucide-react";

export const SellImportarInfo = () => {
  return (
    <>
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Esta funcionalidad te permite importar varios productos
          simultáneamente. Asegúrate de seguir el formato especificado para
          evitar errores.
        </AlertDescription>
      </Alert>

      {/* Formato del archivo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Formato del Archivo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            El archivo CSV/Excel debe contener las siguientes columnas en este
            orden exacto:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Columna
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Tipo
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Descripción
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Ejemplo
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    name
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Texto</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Nombre del producto (máx. 255 caracteres)
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Filtro de aceite
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    description
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Texto</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Descripción detallada (máx. 1000 caracteres)
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Filtro de aceite original para Toyota
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    oemNumber
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Texto</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Número OEM del fabricante
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    123ABC456
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    price
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Número</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Precio en euros (sin símbolo)
                  </td>
                  <td className="border border-gray-300 px-4 py-2">45.99</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    brand
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Texto</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Marca del vehículo
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Toyota</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    model
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Texto</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Modelo del vehículo
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Corolla</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    year
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Texto</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Año del vehículo
                  </td>
                  <td className="border border-gray-300 px-4 py-2">2015</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    tipoDeVehiculo
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Texto</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Tipo: coche, moto o furgoneta
                  </td>
                  <td className="border border-gray-300 px-4 py-2">coche</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    condition
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Texto</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Ver valores permitidos abajo
                  </td>
                  <td className="border border-gray-300 px-4 py-2">nuevo</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    typeOfPiece
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Texto</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Tipo de pieza
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Motor</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    weight
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Número</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Peso en kilogramos
                  </td>
                  <td className="border border-gray-300 px-4 py-2">2.5</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    length
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Número</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Largo en centímetros
                  </td>
                  <td className="border border-gray-300 px-4 py-2">30</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    width
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Número</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Ancho en centímetros
                  </td>
                  <td className="border border-gray-300 px-4 py-2">15</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    height
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Número</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Alto en centímetros
                  </td>
                  <td className="border border-gray-300 px-4 py-2">10</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    location
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Texto</td>
                  <td className="border border-gray-300 px-4 py-2">
                    Ubicación del producto
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Madrid, España
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    offer
                  </td>
                  <td className="border border-gray-300 px-4 py-2">Booleano</td>
                  <td className="border border-gray-300 px-4 py-2">
                    true o false (si tiene oferta)
                  </td>
                  <td className="border border-gray-300 px-4 py-2">false</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">
                    offerPrice
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Número (opcional)
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    Precio de oferta (solo si offer es true)
                  </td>
                  <td className="border border-gray-300 px-4 py-2">39.99</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Valores permitidos para condition */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Valores Permitidos para &quot;condition&quot;
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">nuevo</code> -
              Nunca usado
            </li>
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">como-nuevo</code>{" "}
              - Perfectas condiciones
            </li>
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">buen-estado</code>{" "}
              - Usado pero bien conservado
            </li>
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">
                condiciones-aceptables
              </code>{" "}
              - Con signos de desgaste
            </li>
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">
                lo-ha-dado-todo
              </code>{" "}
              - Puede necesitar reparación
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Valores permitidos para tipoDeVehiculo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Valores Permitidos para &quot;tipoDeVehiculo&quot;
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">coche</code>
            </li>
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">moto</code>
            </li>
            <li>
              <code className="bg-gray-100 px-2 py-1 rounded">furgoneta</code>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Notas importantes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Notas Importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Imágenes:</strong> Las imágenes NO se pueden importar
              mediante CSV. Deberás añadirlas manualmente después de importar
              los productos.
            </AlertDescription>
          </Alert>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Categorías y Subcategorías:</strong> Estas NO se pueden
              importar mediante CSV. Deberás asignarlas manualmente después de
              la importación.
            </AlertDescription>
          </Alert>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Estado del producto:</strong> Todos los productos
              importados se crearán con estado &quot;publicado&quot; por
              defecto.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Ejemplo de archivo */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Ejemplo de Archivo CSV
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Aquí tienes un ejemplo de cómo debe verse tu archivo CSV:
          </p>

          <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
            <pre className="text-xs font-mono whitespace-pre">
              <code className="text-blue-600">
                name,description,oemNumber,price,brand,model,year,tipoDeVehiculo,condition,typeOfPiece,weight,length,width,height,location,offer,offerPrice
              </code>
              {"\n"}
              <code className="text-gray-700">
                Filtro de aceite,Filtro de aceite original compatible con Toyota
                Corolla,123ABC456,45.99,Toyota,Corolla,2015,coche,nuevo,Motor,2.5,30,15,10,Madrid
                España,false,
              </code>
              {"\n"}
              <code className="text-gray-700">
                Pastillas de freno delanteras,Pastillas de freno delanteras de
                alta
                calidad,456DEF789,89.99,Honda,Civic,2018,coche,como-nuevo,Frenos,3.2,25,20,8,Barcelona
                España,true,79.99
              </code>
              {"\n"}
              <code className="text-gray-700">
                Amortiguador trasero derecho,Amortiguador trasero derecho en
                buen
                estado,789GHI012,120.50,Ford,Focus,2016,coche,buen-estado,Suspensión,5.0,50,12,12,Valencia
                España,false,
              </code>
            </pre>
          </div>

          <Button variant="outline" className="gap-2" asChild>
            <a
              href="/plantilla-productos.csv"
              download="plantilla-productos.csv"
            >
              <Download className="h-4 w-4" />
              Descargar plantilla CSV
            </a>
          </Button>
        </CardContent>
      </Card>
    </>
  );
};
