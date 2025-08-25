import { Subcategory } from "@/types/CategoriesTypes";
import Link from "next/link";

interface SubcategoryMenuProps {
  category: any;
  isOpen: boolean;
  position: { top: number; left: number };
}

export const SubcategoryMenu = ({
  category,
  isOpen,
  position,
}: SubcategoryMenuProps) => {
  if (
    !isOpen ||
    !category.subcategories ||
    category.subcategories.lenght === 0
  ) {
    return null;
  }

  return (
    <div
      className="fixed z-100"
      style={{ top: position.top, left: position.left }}
    >
      {/* Invisible bridge to maintein hover */}
      <div className="h-3 w-60" />
      <div className="w-60 bg-slate-50 text-black rounded-md overflow-hidden border">
        <div>
          {category.subcategories.map((subcategory: Subcategory) => (
            <Link
              key={subcategory.id}
              href={`/category/${category.slug}/${subcategory.slug}`}
              className="w-full text-left p-4  hover:bg-blue-100 hover:text-blue-500 flex justify-between items-center underline font-medium"
            >
              <span>{subcategory.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
