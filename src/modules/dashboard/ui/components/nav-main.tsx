"use client";

import { BotIcon, VideoIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useLocalizedHref } from "@/hooks/use-localized-href";
import type { Dictionary } from "@/types/dictionary";
import Link from "next/link";

export function NavMain({ dictionary }: { dictionary: Dictionary }) {
  const locales = dictionary.dashboard.navMain;
  const { getLocalizedHref } = useLocalizedHref();
  const pathname = "/en/meetings"; // usePathname();

  const navItems = [
    {
      title: locales.meetings,
      icon: VideoIcon,
      href: getLocalizedHref("/meetings"),
    },
    {
      title: locales.agents,
      icon: BotIcon,
      href: getLocalizedHref("/agents"),
    },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{locales.title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={pathname === item.href}
                asChild
              >
                <Link href={item.href}>
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
