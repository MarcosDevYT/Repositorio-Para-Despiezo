"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export const SubmitButton = ({
  title,
  full,
}: {
  title: string;
  full?: boolean;
}) => {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button disabled className={full ? "w-full" : ""}>
          <Loader2 className="size-4 animate-spin" />
          Porfavor espera
        </Button>
      ) : (
        <Button type="submit" className={full ? "w-full" : ""}>
          {title}
        </Button>
      )}
    </>
  );
};
