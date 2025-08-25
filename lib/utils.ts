import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getConditionColor = (condition: string) => {
  switch (condition) {
    case "nuevo":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "verificado":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "usado":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "defectuoso":
      return "bg-red-500/10 text-red-500 border-red-500/20";
  }
};

export const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : `${process.env.NEXT_PUBLIC_BASE_URL}`;
