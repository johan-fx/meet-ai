import { useTranslations } from "next-intl";
import { useState } from "react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";

interface Props {
	title: string;
	description: string;
}

export const useConfirm = ({ title, description }: Props) => {
	const t = useTranslations("global.form");

	const [promise, setPromise] = useState<{
		resolve: (value: boolean) => void;
	} | null>(null);

	const confirm = () => {
		return new Promise((resolve) => {
			setPromise({ resolve });
		});
	};

	const handleClose = () => {
		setPromise(null);
	};

	const handleConfirm = () => {
		promise?.resolve(true);
		handleClose();
	};

	const handleCancel = () => {
		promise?.resolve(false);
		handleClose();
	};

	const ConfirmDialog = () => (
		<ResponsiveDialog
			open={!!promise}
			onOpenChange={handleClose}
			title={title}
			description={description}
		>
			<div className="flex flex-col-reverse pt-4 w-full gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
				<Button
					variant="outline"
					onClick={handleCancel}
					className="w-full lg:w-auto"
				>
					{t("cancel")}
				</Button>
				<Button onClick={handleConfirm} className="w-full lg:w-auto">
					{t("confirm")}
				</Button>
			</div>
		</ResponsiveDialog>
	);

	return [ConfirmDialog, confirm] as const;
};
