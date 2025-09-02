"use client";

import Form from "next/form";
import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { Suspense, useState } from "react";
import { Skeleton } from "../ui/skeleton";

export const SearchProducts = () => {
  const searchParams = useSearchParams();
  const queryParams = searchParams.get("query") || "";
  const [query, setQuery] = useState(queryParams);

  return (
    <Suspense
      fallback={
        <div className="flex items-center w-full">
          <Skeleton className="w-full h-12 rounded-full" />
          <Skeleton className="absolute right-1 h-10 w-14 rounded-full bg-blue-500" />
        </div>
      }
    >
      <Form
        action={"/productos"}
        scroll={false}
        className="flex items-center w-full relative"
      >
        <input
          name="query"
          defaultValue={queryParams}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar partes de vehiculos..."
          className="text-sm w-full h-12 rounded-full border-2 border-slate-200 placeholder:text-slate-400 pr-12 px-4"
          autoComplete="off"
        />

        <Button
          type="submit"
          disabled={!query.trim()}
          className="absolute right-1 size-10 min-w-10 rounded-full cursor-pointer bg-blue-500 hover:bg-blue-600"
        >
          <Search className="size-5 text-white" />
        </Button>
      </Form>
    </Suspense>
  );
};
