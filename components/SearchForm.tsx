"use client";

import Form from "next/form";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "./ui/button";
import { Suspense } from "react";

export const SearchForm = ({ params }: { params: string }) => {
  const searchParams = useSearchParams();
  const queryParams = searchParams.get("query") || "";

  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Form
        action={`/${params}/`}
        scroll={false}
        className="flex items-center w-full relative"
      >
        <input
          name="query"
          defaultValue={queryParams}
          placeholder="Buscar partes de vehiculos..."
          className="text-sm w-full h-12 rounded-full border-2 border-slate-200 placeholder:text-slate-400 pr-12 px-4"
          autoComplete="off"
        />

        <Button
          type="submit"
          className="absolute right-1 h-10 w-14 rounded-full cursor-pointer bg-blue-500 hover:bg-blue-600"
        >
          <Search className="size-5 text-white" />
        </Button>
      </Form>
    </Suspense>
  );
};
