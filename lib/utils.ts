import { Orden } from "@prisma/client";
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
  año?: string | string[];
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

export const getYearsFromRange = (yearRange: string) => {
  if (!yearRange) return [];
  
  // Clean the input
  const cleanRange = yearRange.replace(/\s+/g, "");
  const parts = cleanRange.split(",");
  let allYears: string[] = [];

  parts.forEach(part => {
    // Check for open ranges: "2020...", "2020-", "01.2020-..."
    if (part.includes("...") || part.endsWith("-")) {
      const yearsInPart = part.match(/\b(19|20)\d{2}\b/g);
      if (yearsInPart && yearsInPart.length > 0) {
        const startYear = parseInt(yearsInPart[0]);
        const currentYear = new Date().getFullYear();
        for (let i = startYear; i <= currentYear; i++) {
          const y = i.toString();
          if (!allYears.includes(y)) allYears.push(y);
        }
      }
    } else if (part.includes("-")) {
      // Closed range: "2015-2018" or "01.2015-12.2018"
      const yearsInPart = part.match(/\b(19|20)\d{2}\b/g);
      if (yearsInPart && yearsInPart.length >= 2) {
        const startYear = parseInt(yearsInPart[0]);
        const endYear = parseInt(yearsInPart[1]);
        const start = Math.min(startYear, endYear);
        const end = Math.max(startYear, endYear);
        for (let i = start; i <= end; i++) {
          const y = i.toString();
          if (!allYears.includes(y)) allYears.push(y);
        }
      }
    } else {
      // Single year
      const yearMatch = part.match(/\b(19|20)\d{2}\b/);
      if (yearMatch) {
        const y = yearMatch[0];
        if (!allYears.includes(y)) allYears.push(y);
      }
    }
  });

  return allYears;
};

export const hasAnyFilter = (filters: FilterCheck): boolean => {
  return Object.values(filters).some((value) => {
    // Para strings: no vacíos, para números: no null/undefined, para arrays: no vacíos
    if (typeof value === "string") return value.trim() !== "";
    if (Array.isArray(value)) return value.length > 0;
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

export function formatCurrency(amount: number, currency = "EUR") {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    // "EUR"
    currency,
  }).format(amount);
}

export function formatMinutes(minutes: number) {
  return `${minutes.toFixed(0)} min`;
}

export const groupOrdersByYearMonth = (orders: Orden[]) => {
  const grouped: Record<number, Record<number, Orden[]>> = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    const year = date.getFullYear();
    const month = date.getMonth();

    if (!grouped[year]) {
      grouped[year] = {};
    }
    if (!grouped[year][month]) {
      grouped[year][month] = [];
    }

    grouped[year][month].push(order);
  });

  return grouped;
};
