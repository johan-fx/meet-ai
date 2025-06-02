import {
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { Dictionary } from "@/types/dictionary";

interface DashboardCommandProps {
  dictionary?: Dictionary;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const DashboardCommand = ({ open, setOpen }: DashboardCommandProps) => {
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandItem>Test</CommandItem>
      </CommandList>
    </CommandDialog>
  );
};
