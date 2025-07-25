import { ChevronsUpDownIcon, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
	CommandResponsiveDialog,
} from "./ui/command";

interface Props {
	options: Array<{
		id: string;
		value: string;
		children: React.ReactNode;
	}>;
	onSelect: (value: string) => void;
	onSearch?: (value: string) => void;
	value: string;
	placeholder?: string;
	isSearchable?: boolean;
	className?: string;
	loading?: boolean;
}

export const CommandSelect = ({
	options,
	onSelect,
	onSearch,
	value,
	className,
	placeholder,
	loading,
}: Props) => {
	const t = useTranslations("global.form");
	const [open, setOpen] = useState(false);
	const selectedOption = options.find((option) => option.value === value);

	const handleOpenChange = (open: boolean) => {
		setOpen(open);
		onSearch?.("");
	};

	return (
		<>
			<Button
				type="button"
				variant="outline"
				className={cn(
					"h-9 justify-between font-normal px-2",
					!selectedOption && "text-muted-foreground",
					className,
				)}
				onClick={() => setOpen(!open)}
				disabled={loading}
			>
				<div>
					{loading
						? t("loading")
						: (selectedOption?.children ?? placeholder ?? t("select"))}
				</div>
				{loading ? (
					<Loader2 className="size-4 animate-spin" />
				) : (
					<ChevronsUpDownIcon />
				)}
			</Button>
			<CommandResponsiveDialog
				shouldFilter={!onSearch}
				open={open}
				onOpenChange={handleOpenChange}
			>
				<CommandInput placeholder={t("search")} onValueChange={onSearch} />
				<CommandList>
					<CommandEmpty>{t("selectNoSearchResults")}</CommandEmpty>
					{options.map((option) => (
						<CommandItem
							key={option.id}
							value={option.value}
							onSelect={() => {
								onSelect(option.value);
								setOpen(false);
							}}
						>
							{option.children}
						</CommandItem>
					))}
				</CommandList>
			</CommandResponsiveDialog>
		</>
	);
};
