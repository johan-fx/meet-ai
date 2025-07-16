import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/empty-state";

export const ProcessingState = () => {
	const t = useTranslations("meetings.detail");

	return (
		<div className="flex flex-col">
			<EmptyState
				title={t("processing.title")}
				description={t("processing.description")}
				image="/images/processing.svg"
			/>
		</div>
	);
};
