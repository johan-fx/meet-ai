import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingsForm } from "./meetings-form";

interface NewMeetingDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const NewMeetingDialog = ({ open, onOpenChange }: NewMeetingDialogProps) => {
	const t = useTranslations("meetings.list");
	const router = useRouter();

	return (
		<ResponsiveDialog
			title={t("newMeeting")}
			description={t("newMeetingDescription")}
			open={open}
			onOpenChange={onOpenChange}
		>
			<MeetingsForm
				onCancel={() => onOpenChange(false)}
				onSuccess={(id) => {
					if (id) {
						router.push(`/meetings/${id}`);
					}
					onOpenChange(false);
				}}
			/>
		</ResponsiveDialog>
	);
};

export { NewMeetingDialog };
