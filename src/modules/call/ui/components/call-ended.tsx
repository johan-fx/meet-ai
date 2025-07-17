import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface Props {
	meetingName: string;
}

export const CallEnded = ({ meetingName }: Props) => {
	const t = useTranslations("call.ended");

	return (
		<div className="flex flex-col h-full items-center justify-center bg-primary">
			<div className="flex flex-1 items-center justify-center py-4 px-8">
				<div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-6 shadow-sm">
					<div className="flex flex-col gap-y-2 text-center">
						<h6 className="text-lg font-semibold">
							{t("title", { meetingName })}
						</h6>
						<p className="text-sm">{t("description")}</p>
					</div>
					<Button asChild>
						<Link href="/meetings">{t("backToMeetings")}</Link>
					</Button>
				</div>
			</div>
		</div>
	);
};
