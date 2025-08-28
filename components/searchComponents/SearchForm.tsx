import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import Form from "next/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export const SearchForm = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center w-full">
          <Skeleton className="w-full h-10 rounded-full" />
          <Skeleton className="w-full h-10 rounded-full bg-blue-500" />
        </div>
      }
    >
      <Form
        action={"/products"}
        scroll={false}
        className="flex flex-col items-center w-full relative space-y-2"
      >
        <Input
          name="oem"
          autoComplete="off"
          placeholder="Ej: 04465-42180"
          className="h-10 text-center rounded-full border-blue-500/50 focus:border-blue-500 outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button
          type="submit"
          className="w-full rounded-full bg-blue-500 text-white hover:bg-blue-600 "
        >
          Buscar por Número de Referencia
        </Button>
      </Form>
    </Suspense>
  );
};
