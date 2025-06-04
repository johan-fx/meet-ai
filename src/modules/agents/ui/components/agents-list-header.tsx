"use client";

import { Button } from "@/components/ui/button";
import { ViewProps } from "@/types/view";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { NewAgentDialog } from "./new-agent-dialog";

const AgentsListHeader = ({ dictionary }: ViewProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <>
      <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h5 className="text-xl font-bold">{dictionary.agents.list.title}</h5>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusIcon />
            {dictionary.agents.list.newAgent}
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

export { AgentsListHeader };
