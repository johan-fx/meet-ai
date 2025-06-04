import { Button } from "@/components/ui/button";
import { ViewProps } from "@/types/view";
import Image from "next/image";
import { useState } from "react";
import { NewAgentDialog } from "../new-agent-dialog";

const EmptyState = ({ dictionary }: ViewProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex flex-col gap-y-6 max-w-md mx-auto text-center">
          <Image
            src="/images/agents-empty-state.png"
            alt="Empty state"
            width={240}
            height={240}
            className="mx-auto"
          />
          <div className="flex flex-col gap-y-4">
            <h6 className="text-lg font-medium">
              {dictionary.agents.list.emptyState.title}
            </h6>
            <p className="text-sm whitespace-normal">
              {dictionary.agents.list.emptyState.description}
            </p>
          </div>

          <Button
            size="lg"
            className="mx-auto"
            onClick={() => setIsDialogOpen(true)}
          >
            {dictionary.agents.list.emptyState.ctaLabel}
          </Button>
        </div>
      </div>
      <NewAgentDialog
        dictionary={dictionary}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </>
  );
};

export { EmptyState };
