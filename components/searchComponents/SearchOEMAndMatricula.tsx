import { Skeleton } from "../ui/skeleton";
import { Suspense } from "react";
import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

import Form from "next/form";

export const SearchOEMAndMatricula = () => {
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
        action={"/products"}
        scroll={false}
        className="max-w-2xl w-full bg-white p-2 rounded-lg"
      >
        <div className="flex space-x-2 items-center w-full">
          <Input
            name="matriculaoem"
            autoComplete="off"
            placeholder="Ej: matrícula '1234ABC' o referencia OEM"
            className="flex-1 h-10 text-sm"
          />
          <Button type="submit" className="px-8">
            <Search className="size-5" />
            <span className="hidden md:flex">Buscar</span>
          </Button>
        </div>
      </Form>
    </Suspense>
  );
};
