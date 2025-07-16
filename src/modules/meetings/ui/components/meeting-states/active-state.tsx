import { VideoIcon } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";

interface Props {
	meetingId: string;
}

export const ActiveState = ({ meetingId }: Props) => {
	const t = useTranslations("meetings.detail");

	return (
		<div className="flex flex-col">
			<EmptyState
				title={t("active.title")}
				description={t("active.description")}
				image="/images/active.svg"
			/>
			<div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
				<Button className="w-full lg:w-auto" asChild>
					<Link href={`/call/${meetingId}`}>
						<VideoIcon />
						{t("active.joinMeeting")}
					</Link>
				</Button>
			</div>
		</div>
	);
};
