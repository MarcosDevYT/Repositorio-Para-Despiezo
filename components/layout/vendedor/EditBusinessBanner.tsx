"use client";

import { updateBusinessBanner } from "@/actions/user-actions";
import { UploadDropzone } from "@/lib/upload-thing";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Edit } from "lucide-react";
import Image from "next/image";

export const EditBusinessBanner = ({
  bannerUrl,
  businessName,
}: {
  bannerUrl: string | null;
  businessName?: string | null;
}) => {
  const [banner, setBanner] = useState<string[] | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState<
    string | null | undefined
  >(bannerUrl);
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleEdit = () => {
    setBanner(null);
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    startTransition(async () => {
      const res = await updateBusinessBanner(banner ?? []);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success(res.success);
        setBannerImageUrl(res.imageUrl);
      }
      setIsEditing(false);
    });
  };

  return (
    <div className="relative w-full h-60 overflow-hidden group">
      {bannerImageUrl ? (
        <>
          <Image
            fill
            src={bannerImageUrl}
            alt={`Banner de ${businessName ?? "la tienda"}`}
            className="object-cover"
          />

          {/* Capa visible solo en hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            <Button
              variant="secondary"
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar banner
            </Button>
          </div>
        </>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
          <p className="text-sm text-muted-foreground mb-2">
            No tienes un banner aún
          </p>
          <Button onClick={handleEdit}>Agregar banner</Button>
        </div>
      )}

      {isEditing && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-20">
          {banner ? (
            <div className="relative w-full h-full">
              <Image
                src={banner[0]}
                alt="Nuevo banner"
                fill
                className="object-cover"
              />

              <div className="absolute bottom-0 left-1/2 -translate-1/2 flex gap-4">
                <Button
                  variant="destructive"
                  onClick={() => setBanner(null)}
                  disabled={isPending}
                >
                  Eliminar
                </Button>
                <Button onClick={handleSave} disabled={isPending}>
                  Guardar
                </Button>
              </div>
            </div>
          ) : (
            <UploadDropzone
              endpoint="imageUploader"
              className="w-full"
              content={{
                label: "Arrastra una imagen o haz click",
                button: "Subir banner",
              }}
              onClientUploadComplete={(res) => {
                setBanner(res.map((r) => r.url));
              }}
              onUploadError={(error: Error) => {
                toast.error(`Error al subir la imagen: ${error.message}`);
              }}
            />
          )}
          <Button
            variant="outline"
            onClick={handleEdit}
            className="absolute top-4 right-4"
          >
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
};
