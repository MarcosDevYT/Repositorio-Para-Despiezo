"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export const SubmitButton = ({ title }: { title: string }) => {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled>
          <Loader2 className="size-4 animate-spin" />
          Porfavor espera
        </Button>
      ) : (
        <Button type="submit">{title}</Button>
      )}
    </>
  );
};
