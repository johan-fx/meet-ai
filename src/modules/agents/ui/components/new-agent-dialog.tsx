import { useTranslations } from "next-intl";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentsForm } from "./agents-form";

interface NewAgentDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const NewAgentDialog = ({ open, onOpenChange }: NewAgentDialogProps) => {
	const t = useTranslations("agents.list");
	return (
		<ResponsiveDialog
			title={t("newAgent")}
			description={t("newAgentDescription")}
			open={open}
			onOpenChange={onOpenChange}
		>
			<AgentsForm
				onCancel={() => onOpenChange(false)}
				onSuccess={() => onOpenChange(false)}
			/>
		</ResponsiveDialog>
	);
};

export { NewAgentDialog };
