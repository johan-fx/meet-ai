import { Button } from "@/components/ui/button";
import { Dictionary } from "@/types/dictionary";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataPaginationProps {
  page: number;
  totalPages: number;
  dictionary: Dictionary;
  onPageChange: (page: number) => void;
}

const DataPagination = ({
  page,
  totalPages,
  dictionary,
  onPageChange,
}: DataPaginationProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        {dictionary.global.pagination.pageOf
          .replace("{page}", page.toString())
          .replace("{totalPages}", totalPages.toString())}
      </div>
      <div className="flex items-center justify-center gap-x-1">
        {/* Previous button - only show if not on first page */}
        {page > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            className="flex items-center gap-1"
          >
            <ChevronLeft />
            {dictionary.global.pagination.previous}
          </Button>
        )}

        {/* Page number buttons - only show if there are multiple pages */}
        {totalPages > 1 &&
          Array.from({ length: totalPages }).map((_, index) => (
            <Button
              key={index}
              size="sm"
              variant={index + 1 === page ? "outline" : "ghost"}
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </Button>
          ))}

        {/* Next button - only show if not on last page */}
        {page < totalPages && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            className="flex items-center gap-1"
          >
            {dictionary.global.pagination.next}
            <ChevronRight />
          </Button>
        )}
      </div>
    </div>
  );
};

export { DataPagination };
