import { useTranslations } from "next-intl";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import type { MeetingGetOne } from "../../types";
import { MeetingsForm } from "./meetings-form";

interface EditMeetingDialogProps {
	open: boolean;
	initialValues: MeetingGetOne;
	onOpenChange: (open: boolean) => void;
}

const EditMeetingDialog = ({
	open,
	initialValues,
	onOpenChange,
}: EditMeetingDialogProps) => {
	const t = useTranslations("meetings.list");

	return (
		<ResponsiveDialog
			title={t("editMeeting")}
			description={t("editMeetingDescription")}
			open={open}
			onOpenChange={onOpenChange}
		>
			<MeetingsForm
				initialValues={initialValues}
				onCancel={() => onOpenChange(false)}
				onSuccess={() => onOpenChange(false)}
			/>
		</ResponsiveDialog>
	);
};

export { EditMeetingDialog };
