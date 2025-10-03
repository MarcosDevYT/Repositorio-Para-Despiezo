"use client";

import Image from "next/image";
import { useState } from "react";
import { Camera, ScanLine, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const OCRVision = () => {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (file: File) => {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleScan = async () => {
    if (!imageFile) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const oem = data.text.split("\n")[0];

      router.push(`/productos?oem=${encodeURIComponent(oem)}`);
    } catch (err) {
      console.error(err);
      toast.error("Error al escanear la imagen");
    }

    setLoading(false);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <Card className="w-full max-w-[310px] md:max-w-lg group hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-500/5 to-blue-500/10 border border-blue-500/20 gap-2">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
          <ScanLine className="h-8 w-8 text-blue-500" />
        </div>
        <CardTitle className="text-xl">Escaneo con OCR</CardTitle>
        <CardDescription>
          Escanea el numero OEM para buscar partes del fabricante original.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 flex flex-col w-full items-center justify-center">
        {/* Si no hay imagen, mostramos drop-zone y cámara */}
        {!imagePreview && (
          <>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="w-full h-40 border-2 border-dashed border-blue-500/50 rounded-lg p-8 px-4 text-center text-blue-500 hover:bg-blue-500/20 transition-colors cursor-pointer relative"
            >
              Arrastra y suelta tu imagen o haz click
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] && handleFileChange(e.target.files[0])
                }
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>

            <label className="mt-2 w-full">
              <span className="flex gap-1.5 items-center justify-center h-10 w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors rounded-full cursor-pointer">
                <Camera className="size-5" />
                Tomar foto
              </span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) =>
                  e.target.files?.[0] && handleFileChange(e.target.files[0])
                }
                className="hidden"
              />
            </label>
          </>
        )}

        {/* Preview de la imagen */}
        {imagePreview && (
          <div className="relative h-52 w-64">
            <Image
              src={imagePreview}
              alt="preview"
              objectFit="cover"
              fill
              className="rounded"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Botón escanear */}
        {imagePreview && (
          <Button
            onClick={handleScan}
            className="w-full bg-blue-500 text-white hover:bg-blue-600 transition-colors rounded-full"
            disabled={loading}
          >
            {loading ? "Escaneando..." : "Escanear Imagen"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
