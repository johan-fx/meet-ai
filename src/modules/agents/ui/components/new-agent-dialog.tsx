import { ResponsiveDialog } from "@/components/responsive-dialog";
import { ViewProps } from "@/types/view";
import { AgentsForm } from "./agents-form";

interface NewAgentDialogProps extends ViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewAgentDialog = ({
  dictionary,
  open,
  onOpenChange,
}: NewAgentDialogProps) => {
  return (
    <ResponsiveDialog
      title={dictionary.agents.list.newAgent}
      description={dictionary.agents.list.newAgentDescription}
      open={open}
      onOpenChange={onOpenChange}
    >
      <AgentsForm
        dictionary={dictionary}
        onCancel={() => onOpenChange(false)}
        onSuccess={() => onOpenChange(false)}
      />
    </ResponsiveDialog>
  );
};

export { NewAgentDialog };
