import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { UseDropdownPosition } from "@/hooks/use-dropdown-position";
import { SubcategoryMenu } from "./SubcategoryMenu";
import { Category } from "@/types/CategoriesTypes";
import Link from "next/link";

interface Props {
  category: Category;
  isActive?: boolean;
  isNavigationHovered?: boolean;
}

export const CategoryDropdown = ({
  category,
  isActive,
  isNavigationHovered,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { getDropdownPosition } = UseDropdownPosition(dropdownRef);

  const onMouseEnter = () => {
    if (category.subcategories) {
      setIsOpen(true);
    }
  };

  const onMouseLeave = () => setIsOpen(false);

  const dropdownPosition = getDropdownPosition();

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative">
        <Button
          variant="ghost"
          asChild
          className={cn(
            "h-11 flex items-center space-x-2 text-sm font-medium hover:bg-blue-500/10 hover:text-blue-500 rounded-full px-4  whitespace-nowrap",
            isActive && !isNavigationHovered && "bg-blue-500/10 text-blue-500",
            isOpen && "bg-blue-500/10 text-blue-500"
          )}
        >
          <Link
            href={
              category.slug === "todas-las-categorias"
                ? "/productos"
                : `/productos?categoria=${category.slug}`
            }
          >
            {category.icon && category.isLocalIcon ? (
              <category.icon />
            ) : (
              <category.icon className="size-4 text-foreground" />
            )}
            {category.name}
          </Link>
        </Button>

        {category.subcategories && category.subcategories.length > 0 && (
          <div
            className={cn(
              "opacity-0 absolute -bottom-3 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-l-transparent border-r-transparent border-b-white left-1/2 -translate-x-1/2",
              isOpen && "opacity-100"
            )}
          />
        )}
      </div>

      <SubcategoryMenu
        category={category}
        isOpen={isOpen}
        position={dropdownPosition}
      />
    </div>
  );
};
