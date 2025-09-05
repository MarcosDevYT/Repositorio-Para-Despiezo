import { clsx, type ClassValue } from "clsx";
import { Session } from "next-auth";
import { twMerge } from "tailwind-merge";

interface FilterCheck {
  subcategoria?: string;
  categoria?: string;
  query?: string;
  oem?: string;
  marca?: string;
  estado?: string;
  año?: string;
  tipoDeVehiculo?: string;
  priceMax?: number;
  priceMin?: number;
}

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

// Funcion para verificar al vendedor
export const verifySeller = (session: Session): boolean => {
  if (!session) return false;

  if (!session.user) return false;

  const hasValidEmailVerification =
    typeof session.user.phoneNumber === "string" &&
    session.user.phoneNumber.trim() !== "";

  const hasValidPhoneNumber =
    typeof session.user.phoneNumber === "string" &&
    session.user.phoneNumber.trim() !== "";

  const hasValidLocation =
    typeof session.user.location === "string" &&
    session.user.location.trim() !== "";

  const hasValidBusinessName =
    typeof session.user.businessName === "string" &&
    session.user.businessName.trim() !== "";

  const isUserFullyVerified =
    hasValidEmailVerification &&
    hasValidPhoneNumber &&
    hasValidLocation &&
    hasValidBusinessName;

  return isUserFullyVerified;
};

export const hasAnyFilter = (filters: FilterCheck): boolean => {
  return Object.values(filters).some((value) => {
    // Para strings: no vacíos, para números: no null/undefined
    if (typeof value === "string") return value.trim() !== "";
    if (typeof value === "number") return !isNaN(value);
    return false;
  });
};
