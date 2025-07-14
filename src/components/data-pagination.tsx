import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface DataPaginationProps {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

const DataPagination = ({
	page,
	totalPages,
	onPageChange,
}: DataPaginationProps) => {
	const t = useTranslations("global.pagination");
	return (
		<div className="flex items-center justify-between">
			<div className="text-sm text-muted-foreground">
				{t("pageOf", {
					page: page.toString(),
					totalPages: totalPages.toString(),
				})}
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
						{t("previous")}
					</Button>
				)}

				{/* Page number buttons - only show if there are multiple pages */}
				{totalPages > 1 &&
					Array.from({ length: totalPages }).map((_, index) => (
						<Button
							key={`page-${index + 1}`}
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
						{t("next")}
						<ChevronRight />
					</Button>
				)}
			</div>
		</div>
	);
};

export { DataPagination };
