import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NewAgentDialog } from "../new-agent-dialog";

const EmptyState = () => {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const t = useTranslations("agents.list");
	return (
		<>
			<div className="flex flex-col items-center justify-center py-12">
				<div className="flex flex-col gap-y-6 max-w-md mx-auto text-center">
					<Image
						src="/images/agents-empty-state.png"
						alt="Illustration: no agents available"
						width={240}
						height={240}
						className="mx-auto"
					/>
					<div className="flex flex-col gap-y-4">
						<h6 className="text-lg font-medium">{t("emptyState.title")}</h6>
						<p className="text-sm whitespace-normal">
							{t("emptyState.description")}
						</p>
					</div>

					<Button
						size="lg"
						className="mx-auto"
						onClick={() => setIsDialogOpen(true)}
					>
						{t("emptyState.ctaLabel")}
					</Button>
				</div>
			</div>
			<NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
		</>
	);
};

export { EmptyState };
