import {
	CommandInput,
	CommandItem,
	CommandList,
	CommandResponsiveDialog,
} from "@/components/ui/command";

interface DashboardCommandProps {
	open: boolean;
	setOpen: (open: boolean) => void;
}

export const DashboardCommand = ({ open, setOpen }: DashboardCommandProps) => {
	return (
		<CommandResponsiveDialog open={open} onOpenChange={setOpen}>
			<CommandInput placeholder="Type a command or search..." />
			<CommandList>
				<CommandItem>Test</CommandItem>
			</CommandList>
		</CommandResponsiveDialog>
	);
};
