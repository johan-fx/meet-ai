import { BanIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

interface Props {
	meetingId: string;
	isCancelling: boolean;
	onCancelMeeting: () => void;
}

export const UpcomingState = ({
	meetingId,
	onCancelMeeting,
	isCancelling,
}: Props) => {
	const t = useTranslations("meetings.detail");

	return (
		<div className="flex flex-col">
			<EmptyState
				title={t("upcoming.title")}
				description={t("upcoming.description")}
				image="/images/upcoming.svg"
			/>
			<div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
				<Button
					variant="secondary"
					className="w-full lg:w-auto"
					onClick={onCancelMeeting}
					disabled={isCancelling}
				>
					<BanIcon />
					{t("upcoming.cancelMeeting")}
				</Button>
				<Button className="w-full lg:w-auto" asChild disabled={isCancelling}>
					<Link href={`/call/${meetingId}`}>
						<VideoIcon />
						{t("upcoming.startMeeting")}
					</Link>
				</Button>
			</div>
		</div>
	);
};
