import { Skeleton } from "../ui/skeleton";
import { Suspense, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import Form from "next/form";

export const SearchOEMAndVehiculo = () => {
  const [query, setQuery] = useState("");

  return (
    <Suspense
      fallback={
        <div className="max-w-2xl w-full bg-white p-2 rounded-lg">
          <div className="flex space-x-2 items-center w-full">
            <Skeleton className="w-full h-10 rounded-full" />
            <Skeleton className="size-5 rounded-lg bg-blue-500" />
          </div>
        </div>
      }
    >
      <Form
        action={"/productos"}
        scroll={false}
        className="max-w-2xl w-full bg-white p-2 rounded-lg"
      >
        <div className="flex space-x-2 items-center w-full">
          {/* Input de búsqueda */}
          <Input
            name="oem"
            autoComplete="off"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Referencia OEM - Ej: 04465-42180"
            className="flex-1 h-10 text-sm text-gray-700"
          />

          <Button type="submit" disabled={!query.trim()} className="px-8">
            <Search className="size-5" />
            <span className="hidden md:flex">Buscar</span>
          </Button>
        </div>
      </Form>
    </Suspense>
  );
};
