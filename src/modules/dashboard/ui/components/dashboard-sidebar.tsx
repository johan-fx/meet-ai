"use client";

import Logo from "@/components/ui/logo";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
	useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

export function DashboardSidebar(props: React.ComponentProps<typeof Sidebar>) {
	const { state } = useSidebar();

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<div className="flex items-center gap-2">
					<div
						className={cn(
							"flex aspect-square items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground transition-all duration-300",
							state === "collapsed" ? "size-8" : "size-10",
						)}
					>
						<Logo
							className={cn(
								"transition-all duration-300",
								state === "collapsed" ? "size-4" : "size-6",
							)}
						/>
					</div>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-semibold">Meet.AI</span>
						<span className="truncate text-xs">v1.0.0</span>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<NavMain />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
