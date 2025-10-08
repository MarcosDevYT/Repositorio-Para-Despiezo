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
    : `${process.env.NEXT_PUBLIC_URL}`;

export const verifySeller = (session: Session): boolean => {
  if (!session?.user) return false;

  const hasLinkingStripeAccount = session.user.stripeConnectedLinked === true;

  const hasValidEmailVerification = session.user.emailVerified !== null;

  const hasValidPhoneNumber =
    typeof session.user.phoneNumber === "string" &&
    session.user.phoneNumber.trim() !== "";

  const hasValidLocation =
    typeof session.user.location === "string" &&
    session.user.location.trim() !== "";

  const hasValidBusinessName =
    typeof session.user.businessName === "string" &&
    session.user.businessName.trim() !== "";

  return (
    hasLinkingStripeAccount &&
    hasValidEmailVerification &&
    hasValidPhoneNumber &&
    hasValidLocation &&
    hasValidBusinessName
  );
};

export const hasAnyFilter = (filters: FilterCheck): boolean => {
  return Object.values(filters).some((value) => {
    // Para strings: no vacíos, para números: no null/undefined
    if (typeof value === "string") return value.trim() !== "";
    if (typeof value === "number") return !isNaN(value);
    return false;
  });
};

export function buildTsQueryFromQueries(queries: string[] = []) {
  // devuelve { tsQuery, plain } donde tsQuery está en formato válido para to_tsquery
  const plain = queries
    .map((q) => q.trim())
    .filter(Boolean)
    .join(" ");

  const tsParts = queries
    .map((q) => {
      // Normalizar y limpiar cada palabra. Usa Unicode property escapes.
      const words = q
        .trim()
        .split(/\s+/)
        .map((w) => w.normalize("NFKD").replace(/[^\p{L}\p{N}]+/gu, "")) // deja letras y números
        .filter(Boolean);

      if (words.length === 0) return "";
      // Usamos prefijo :* para que haga match por prefijo y & para "AND" entre palabras
      return words.map((w) => `${w}:*`).join(" & ");
    })
    .filter(Boolean);

  const tsQuery = tsParts.join(" | "); // OR entre queries
  return { tsQuery, plain };
}
