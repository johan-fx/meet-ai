import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/empty-state";

export const CancelledState = () => {
	const t = useTranslations("meetings.detail");

	return (
		<div className="flex flex-col">
			<EmptyState
				title={t("cancelled.title")}
				description={t("cancelled.description")}
				image="/images/cancelled.svg"
			/>
		</div>
	);
};
