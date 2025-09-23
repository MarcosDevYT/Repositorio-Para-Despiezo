"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/upload-thing";
import { toast } from "sonner";
import extractOEMNumber from "@/actions/extractOEMNumber";
import Image from "next/image";
import { ScanLine } from "lucide-react";

export const OCRgpt = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [oemResult, setOemResult] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleProcessImage = () => {
    if (!imageUrl) {
      toast.error("Primero sube una imagen");
      return;
    }

    startTransition(async () => {
      try {
        const result = await extractOEMNumber(imageUrl);

        if (result) {
          setOemResult(result);
          toast.success("Número OEM detectado correctamente");
        } else {
          toast.error("No se pudo extraer el número OEM");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error al procesar la imagen");
      }
    });
  };

  return (
    <div className="group hover:shadow-lg flex flex-col items-center gap-4 p-6 border rounded-2xl shadow-md w-full max-w-lg mx-auto transition-all">
      <div className="text-center pb-4">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
          <ScanLine className="h-8 w-8 text-blue-500" />
        </div>
        <h2 className="text-xl font-semibold">OCR Escáner con ChatGPT</h2>
        <p className="text-sm text-gray-500">
          Escanea el numero OEM para buscar partes del fabricante original.
        </p>
      </div>

      {!imageUrl ? (
        <UploadDropzone
          endpoint="singleImageUploader"
          className="dropzone-uploadthing w-full min-w-full bg-blue-500/10 hover:bg-blue-500/15 cursor-pointer"
          content={{
            label: "Arrastra una imagen aquí o haz click",
            button: "Subir imagen",
          }}
          onClientUploadComplete={(res) => {
            setImageUrl(res[0].url);
            toast.success("Imagen subida correctamente");
          }}
          onUploadError={(error: Error) => {
            toast.error(`Error al subir la imagen: ${error.message}`);
          }}
        />
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Image
            src={imageUrl}
            alt="Imagen subida"
            width={200}
            height={200}
            className="rounded-lg object-contain border"
          />
          <div className="flex gap-4">
            <Button onClick={handleProcessImage} disabled={isPending}>
              {isPending ? "Procesando..." : "Extraer OEM"}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setImageUrl(null);
                setOemResult(null);
              }}
            >
              Eliminar
            </Button>
          </div>
        </div>
      )}

      {oemResult && (
        <div className="w-full p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mt-4">
          <p className="text-sm font-medium">Número OEM:</p>
          <pre className="text-green-600 font-mono text-sm mt-2">
            {oemResult}
          </pre>
        </div>
      )}
    </div>
  );
};
