import { LucideIcon } from "lucide-react";

export interface Subcategory {
  id: string | number;
  slug: string;
  name: string;
}

export interface Category {
  id: number | string;
  name: string;
  slug: string;
  isLocalIcon?: boolean;
  icon?: LucideIcon | any;
  subcategories?: Category[];
}
