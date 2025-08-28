"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export const ButtonBack = ({
  className,
  backTo,
}: {
  className: string;
  backTo?: string;
}) => {
  const router = useRouter();

  const handleBack = () => {
    if (backTo) {
      router.push(backTo);
    } else {
      router.back();
    }
  };

  return (
    <Button
      onClick={handleBack}
      className={`rounded-full bg-red-500 hover:bg-red-600 absolute ${className}`}
    >
      Cancelar
    </Button>
  );
};
