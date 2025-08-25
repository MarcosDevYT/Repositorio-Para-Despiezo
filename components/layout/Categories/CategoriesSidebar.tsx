import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { categories } from "@/data";
import { Category } from "@/types/CategoriesTypes";
import { ChevronLeftIcon, ListFilter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CategoriesSidebar = ({ open, onOpenChange }: SidebarProps) => {
  const router = useRouter();

  const [parentCategories, setParentCategories] = useState<Category[] | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // If we have parent categories, show those, otherwise show root categories
  const currentCategories = parentCategories ?? categories ?? [];

  const handleOpenChange = (open: boolean) => {
    setParentCategories(null);
    setSelectedCategory(null);
    onOpenChange(open);
  };

  const handleCategoryClick = (category: Category) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as Category[]);
      setSelectedCategory(category);
    } else {
      // This is a leaf category (no subcategories)
      if (parentCategories && selectedCategory) {
        router.push(`/category/${selectedCategory.slug}/${category.slug}`);
      } else {
        // This is a main category - navigate to /category
        if (category.slug === "todas-las-categorias") {
          router.push("/products");
        } else {
          router.push(`/category/${category.slug}`);
        }
      }

      handleOpenChange(false);
    }
  };

  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="left" className="p-0 bg-white">
        <SheetHeader>
          <SheetTitle className="flex gap-2 items-center">
            <ListFilter className="size-4" /> Categorias
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {parentCategories && (
            <button
              onClick={handleBackClick}
              className="cursor-pointer w-full text-left p-4 hover:bg-blue-500/10 hover:text-blue-500 flex items-center text-base font-medium"
            >
              <ChevronLeftIcon className="size-4 mr-2" />
              Volver
            </button>
          )}

          {parentCategories && selectedCategory && (
            <button
              onClick={() => router.push(`/category/${selectedCategory.slug}`)}
              className="cursor-pointer w-full text-left p-4 hover:bg-blue-500/10 hover:text-blue-500 flex justify-between items-center text-base font-medium"
            >
              {selectedCategory.name}
            </button>
          )}

          {currentCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className="cursor-pointer w-full text-left p-4 hover:bg-blue-500/10 hover:text-blue-500 flex justify-between items-center text-base font-medium"
            >
              <span className="flex gap-2 items-center">
                {category.icon && <category.icon className="size-4" />}
                {category.name}
              </span>
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronLeftIcon className="size-4 ml-2" />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
