import { useTranslations } from "next-intl";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import type { AgentGetOne } from "../../types";
import { AgentsForm } from "./agents-form";

interface EditAgentDialogProps {
	open: boolean;
	initialValues: AgentGetOne;
	onOpenChange: (open: boolean) => void;
}

const EditAgentDialog = ({
	open,
	initialValues,
	onOpenChange,
}: EditAgentDialogProps) => {
	const t = useTranslations("agents.list");
	return (
		<ResponsiveDialog
			title={t("editAgent")}
			description={t("editAgentDescription")}
			open={open}
			onOpenChange={onOpenChange}
		>
			<AgentsForm
				initialValues={initialValues}
				onCancel={() => onOpenChange(false)}
				onSuccess={() => onOpenChange(false)}
			/>
		</ResponsiveDialog>
	);
};

export { EditAgentDialog };
