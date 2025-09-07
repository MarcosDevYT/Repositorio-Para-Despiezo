"use client";

import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LocationAutocomplete } from "@/components/LocationSearchInput";
import { toast } from "sonner";
import { EditableField, editProfileFieldAction } from "@/actions/user-actions";
import { Pencil, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface EditableFieldProps {
  label: string;
  value: string | null;
  type?: "text" | "number" | "textarea" | "location" | "select";
  fieldName: EditableField;
  options?: string[]; // solo para select
}

export const EditableBusinessField = ({
  label,
  value,
  type = "text",
  fieldName,
  options = [],
}: EditableFieldProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value ?? "");
  const [isPending, startTransition] = useTransition();

  // Para select mantenemos un estado separado (y original) para comparar
  const [selected, setSelected] = useState(value ?? "");
  const [originalValue, setOriginalValue] = useState(value ?? "");

  useEffect(() => {
    setInputValue(value ?? "");
    setSelected(value ?? "");
    setOriginalValue(value ?? "");
  }, [value]);

  const handleSaveInput = async () => {
    if (
      (fieldName !== "description" && inputValue.trim() === "") ||
      inputValue === null
    ) {
      toast.error(`${label} no puede estar vacío`);
      return;
    }

    if (inputValue === (value ?? "")) {
      setIsEditing(false);
      return;
    }

    startTransition(async () => {
      try {
        const result = await editProfileFieldAction(fieldName, inputValue);
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("Campo actualizado correctamente");
          setOriginalValue(inputValue);
          setIsEditing(false);
        }
      } catch (err) {
        toast.error("Error al guardar los cambios");
        console.error(err);
      }
    });
  };

  const handleSaveSelect = async () => {
    // Allow empty selection (category optional)
    if (selected === originalValue) {
      // nothing to do
      return;
    }

    startTransition(async () => {
      try {
        // If you store categories as array in DB, you may want to send [selected] instead.
        // Here we send the string and your action should handle it.
        const result = await editProfileFieldAction(fieldName, selected);
        if (result?.error) {
          toast.error(result.error);
        } else {
          toast.success("Categoría actualizada correctamente");
          setOriginalValue(selected);
          setIsEditing(false);
        }
      } catch (err) {
        toast.error("Error al guardar la categoría");
        console.error(err);
      }
    });
  };

  return (
    <div className="flex flex-col w-full">
      <label className="text-sm font-medium text-gray-600 mb-1">{label}</label>

      {type === "select" ? (
        // Select UI: se muestra siempre; boton guardar aparece solo si cambió
        <div className="flex items-center gap-2">
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
              <SelectValue placeholder={`Selecciona ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Mostrar botón guardar SOLO si cambió el valor */}
          {selected !== (originalValue ?? "") && (
            <Button
              onClick={handleSaveSelect}
              disabled={isPending}
              className="flex items-center gap-2 px-3 py-2"
            >
              <Save className="w-4 h-4" /> Guardar
            </Button>
          )}
        </div>
      ) : isEditing ? (
        // Editable inputs (text/textarea/location)
        <>
          {type === "textarea" ? (
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleSaveInput}
              disabled={isPending}
              className="rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder={`Agrega una descripción para tu negocio`}
            />
          ) : type === "location" ? (
            <LocationAutocomplete
              value={inputValue}
              onChange={setInputValue}
              className="rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          ) : (
            <Input
              type={type}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleSaveInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveInput();
              }}
              disabled={isPending}
              className="rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder={`Sin ${label.toLowerCase()}`}
            />
          )}
        </>
      ) : (
        // Read-only display (click to edit)
        <div
          className="flex items-center w-fit gap-2 cursor-pointer transition"
          onClick={() => setIsEditing(true)}
        >
          <span
            className={`text-gray-800 ${!value ? "italic text-gray-400" : ""}`}
          >
            {type === "textarea"
              ? value && value.trim() !== ""
                ? value
                : "Agrega una descripción para tu negocio"
              : (value ?? `Sin ${label.toLowerCase()}`)}
          </span>
          <Pencil className="min-w-4 size-4 text-gray-400" />
        </div>
      )}
    </div>
  );
};
