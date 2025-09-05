"use client";

import { Button } from "@/components/ui/button";

type ProductPaginationProps = {
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export const ProductPagination = ({
  total,
  currentPage,
  pageSize,
  onPageChange,
}: ProductPaginationProps) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-start flex-wrap mt-auto">
      <Button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-r-none shadow-none"
        variant="outline"
      >
        Anterior
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          onClick={() => onPageChange(page)}
          className="rounded-none shadow-none"
          variant={page === currentPage ? "default" : "outline"}
        >
          {page}
        </Button>
      ))}

      <Button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-l-none shadow-none"
        variant="outline"
      >
        Siguiente
      </Button>
    </div>
  );
};
