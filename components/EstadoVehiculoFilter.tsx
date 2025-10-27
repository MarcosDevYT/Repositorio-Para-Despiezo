import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Checkbox } from "./ui/checkbox";
import { conditions } from "@/data";

export function EstadoVehiculoFilter({
  counts,
}: {
  counts: Record<string, number>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentEstados = searchParams.getAll("estado");

  const onEstadoChange = (estado: string, checked: boolean) => {
    const params = new URLSearchParams(window.location.search);
    let estados = params.getAll("estado");

    if (checked) {
      if (!estados.includes(estado)) estados.push(estado);
    } else {
      estados = estados.filter((e) => e !== estado);
    }

    params.delete("estado");
    estados.forEach((e) => params.append("estado", e));

    router.push(`/productos?${params.toString()}`);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Estado del Vehículo</Label>

      <div className="space-y-3">
        {conditions.map((condition) => (
          <div key={condition.value} className="flex items-start space-x-2">
            <Checkbox
              id={condition.value}
              checked={currentEstados.includes(condition.value)}
              onCheckedChange={(checked) =>
                onEstadoChange(condition.value, !!checked)
              }
              disabled={counts[condition.value] === 0}
            />
            <div className="flex flex-col">
              <Label
                htmlFor={condition.value}
                className={`font-medium ${
                  counts[condition.value] === 0 ? "text-gray-400" : ""
                }`}
              >
                {condition.label} ({counts[condition.value] || 0})
              </Label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
