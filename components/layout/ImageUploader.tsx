"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  X,
  GripVertical,
  Star,
  Loader2,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/upload-thing";
import { toast } from "sonner";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

// Individual sortable image item
function SortableImageItem({
  url,
  index,
  onDelete,
}: {
  url: string;
  index: number;
  onDelete: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-xl overflow-hidden border-2 transition-all ${
        isDragging
          ? "border-primary shadow-xl scale-105 z-50 opacity-80"
          : index === 0
          ? "border-amber-400 shadow-md"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {/* Image */}
      <div className="aspect-square relative bg-gray-50">
        <Image
          src={url}
          alt={`Imagen ${index + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 33vw, 120px"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      </div>

      {/* Primary badge */}
      {index === 0 && (
        <div className="absolute top-1.5 left-1.5 bg-amber-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
          <Star className="size-2.5 fill-current" />
          Principal
        </div>
      )}

      {/* Drag handle */}
      <button
        type="button"
        className="absolute top-1.5 right-8 bg-white/90 backdrop-blur-sm rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shadow-sm"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-3.5 text-gray-600" />
      </button>

      {/* Delete button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(index);
        }}
        className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md p-1 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
      >
        <X className="size-3.5" />
      </button>

      {/* Position indicator */}
      <div className="absolute bottom-1.5 right-1.5 bg-black/60 text-white text-[10px] font-bold rounded-md px-1.5 py-0.5 min-w-[20px] text-center">
        {index + 1}
      </div>
    </div>
  );
}

export const ImageUploader = ({
  images: rawImages,
  onChange,
  maxImages = 10,
}: ImageUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);

  // Deduplicate to prevent dnd-kit issues with duplicate IDs
  const images = Array.from(new Set(rawImages));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = images.indexOf(active.id as string);
        const newIndex = images.indexOf(over.id as string);
        const newImages = arrayMove(images, oldIndex, newIndex);
        onChange(newImages);
      }
    },
    [images, onChange]
  );

  const handleDelete = useCallback(
    (index: number) => {
      const updated = images.filter((_, i) => i !== index);
      onChange(updated);
    },
    [images, onChange]
  );

  const canAddMore = images.length < maxImages;

  return (
    <div className="space-y-4">
      {/* Header info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Camera className="size-4" />
          <span>
            {images.length} de {maxImages} imágenes
          </span>
        </div>
        {images.length > 1 && (
          <p className="text-xs text-muted-foreground italic">
            Arrastra para reordenar · La primera será la portada
          </p>
        )}
      </div>

      {images.length === 0 ? (
        /* Empty state — full upload area */
        <div className="relative">
          <UploadDropzone
            endpoint="productImageUploader"
            config={{ mode: "auto" }}
            content={{
              label: "Arrastra tus fotos o haz clic aquí",
              allowedContent: `Hasta ${maxImages} imágenes · Máx 4MB cada una · Se suben automáticamente`,
            }}
            appearance={{
              container:
                "border-2 border-dashed border-gray-300 hover:border-primary/50 rounded-xl bg-gray-50/50 hover:bg-primary/5 transition-all cursor-pointer py-10 ut-uploading:border-primary/40",
              label: "text-gray-600 font-medium text-base hover:text-primary",
              button:
                "bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2.5 rounded-lg ut-uploading:bg-primary/70 ut-ready:bg-primary",
              allowedContent: "text-xs text-gray-400 mt-2",
              uploadIcon: "text-gray-400 size-10",
            }}
            onUploadBegin={() => setIsUploading(true)}
            onClientUploadComplete={(res) => {
              setIsUploading(false);
              if (res) {
                const urls = res.map((r) => r.url);
                onChange([...images, ...urls]);
                toast.success(
                  `${urls.length} imagen${urls.length > 1 ? "es" : ""} subida${
                    urls.length > 1 ? "s" : ""
                  }`
                );
              }
            }}
            onUploadError={() => {
              setIsUploading(false);
              toast.error("Error al subir las imágenes");
            }}
          />
        </div>
      ) : (
        /* Images grid with sortable items */
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={images} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {images.map((url, index) => (
                <SortableImageItem
                  key={url}
                  url={url}
                  index={index}
                  onDelete={handleDelete}
                />
              ))}

              {/* Add more button */}
              {canAddMore && (
                <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-primary/50 hover:bg-primary/5 transition-all overflow-hidden">
                  <UploadDropzone
                    endpoint="productImageUploader"
                    config={{ mode: "auto" }}
                    content={{
                      label: isUploading ? "Subiendo..." : "Añadir",
                      allowedContent: "",
                    }}
                    appearance={{
                      container:
                        "border-0 bg-transparent p-0 h-full min-h-0 cursor-pointer flex flex-col items-center justify-center gap-1 ut-uploading:opacity-70",
                      button: "hidden",
                      allowedContent: "hidden",
                      label: "text-[11px] text-gray-400 font-medium mt-0.5",
                      uploadIcon: "size-6 text-gray-400",
                    }}
                    className="h-full min-h-0 !p-0"
                    onUploadBegin={() => setIsUploading(true)}
                    onClientUploadComplete={(res) => {
                      setIsUploading(false);
                      if (res) {
                        const urls = res.map((r) => r.url);
                        const newImages = [...images, ...urls].slice(
                          0,
                          maxImages
                        );
                        onChange(newImages);
                        toast.success(
                          `${urls.length} imagen${
                            urls.length > 1 ? "es" : ""
                          } subida${urls.length > 1 ? "s" : ""}`
                        );
                      }
                    }}
                    onUploadError={() => {
                      setIsUploading(false);
                      toast.error("Error al subir la imagen");
                    }}
                  />
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Uploading indicator */}
      {isUploading && images.length === 0 && (
        <div className="flex items-center justify-center gap-2 text-sm text-primary py-2">
          <Loader2 className="size-4 animate-spin" />
          Subiendo imágenes...
        </div>
      )}
    </div>
  );
};
