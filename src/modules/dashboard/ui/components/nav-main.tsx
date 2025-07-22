"use client";

import { BotIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useLocalizedHref } from "@/hooks/use-localized-href";

export function NavMain() {
	const t = useTranslations("dashboard.navMain");
	const { getLocalizedHref } = useLocalizedHref();
	const pathname = usePathname();
	// Get sidebar controls from the context
	const { isMobile, setOpenMobile, setOpen } = useSidebar();

	const navItems = [
		{
			title: t("meetings"),
			icon: VideoIcon,
			href: getLocalizedHref("/meetings"),
		},
		{
			title: t("agents"),
			icon: BotIcon,
			href: getLocalizedHref("/agents"),
		},
	];

	// Handler to collapse sidebar when navigation items are clicked
	const handleNavItemClick = () => {
		if (isMobile) {
			// On mobile, close the sidebar completely
			setOpenMobile(false);
		}
	};

	return (
		<SidebarGroup>
			<SidebarGroupLabel>{t("title")}</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu>
					{navItems.map((item) => (
						<SidebarMenuItem key={item.href}>
							<SidebarMenuButton
								tooltip={item.title}
								isActive={pathname === item.href}
								asChild
							>
								<Link href={item.href} onClick={handleNavItemClick}>
									<item.icon />
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
