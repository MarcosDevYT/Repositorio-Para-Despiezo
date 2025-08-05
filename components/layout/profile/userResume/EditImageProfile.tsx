"use client";

import { updateImageProfile } from "@/actions/user-actions";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/upload-thing";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

export const EditImageProfile = ({ image }: { image: string | null }) => {
  const [imageProfile, setImageProfile] = useState<string[] | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleEditImage = () => {
    setImageProfile(null);

    setIsEditing(!isEditing);
  };

  const handleDeleteImage = () => {
    setImageProfile(null);
  };

  const handleSaveImage = async () => {
    startTransition(async () => {
      const response = await updateImageProfile(imageProfile ?? []);

      if (response?.error) {
        toast.error(response.error);
      } else {
        toast.success("Imagen actualizada correctamente");
      }

      setIsEditing(false);

      router.refresh();
    });
  };

  return (
    <div className="flex flex-col w-full md:flex-row items-center justify-center gap-16 mb-12">
      {isEditing ? (
        <div className="flex flex-col gap-4 w-full relative py-8">
          <div className="flex flex-col gap-4 items-center justify-center">
            {imageProfile ? (
              <>
                <img
                  src={imageProfile[0]}
                  alt="Imagen de perfil"
                  className="rounded-full size-40 object-cover"
                />

                <div className="flex gap-4">
                  <Button
                    onClick={handleDeleteImage}
                    disabled={isPending}
                    className="w-max bg-red-500 hover:bg-red-600"
                  >
                    Eliminar
                  </Button>

                  <Button
                    onClick={handleSaveImage}
                    disabled={isPending}
                    className="w-max"
                  >
                    Guardar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg text-center">
                  Arrastra y suelta una imagen o haz click para seleccionar una
                  imagen
                </p>

                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    setImageProfile(res.map((r) => r.url));
                  }}
                  onUploadError={(error: Error) => {
                    alert("Error uploading file");
                  }}
                />
              </>
            )}
          </div>

          <Button
            variant="destructive"
            className="absolute top-0 right-0 w-max"
            onClick={handleEditImage}
          >
            Cancelar
          </Button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={image ?? ""}
            alt="Imagen de perfil"
            className="rounded-full size-40 object-cover"
          />

          <Button
            onClick={handleEditImage}
            className="absolute bottom-0 right-0 rounded-full hover:bg-blue-600"
          >
            <Camera className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
