import type { User } from "better-auth";
import {
	BadgeCheck,
	Bell,
	ChevronsUpDown,
	CreditCard,
	LogOut,
	Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { forwardRef } from "react";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useLocalizedHref } from "@/hooks/use-localized-href";
import { authClient } from "@/lib/auth-client";

const UserAvatar = ({ user }: { user: User }) => {
	return user?.image ? (
		<Avatar className="h-8 w-8">
			<AvatarImage src={user?.image} alt={user?.name} />
			<AvatarFallback>{user?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
		</Avatar>
	) : (
		<GeneratedAvatar seed={user?.name} variant="initials" className="h-8 w-8" />
	);
};

const UserMenuButton = forwardRef<HTMLButtonElement, { user: User }>(
	({ user, ...props }, ref) => {
		return (
			<SidebarMenuButton
				{...props}
				ref={ref}
				size="lg"
				className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
			>
				<UserAvatar user={user} />
				<div className="grid flex-1 text-left text-sm leading-tight">
					<span className="truncate font-semibold">{user?.name}</span>
					<span className="truncate text-xs">{user?.email}</span>
				</div>
				<ChevronsUpDown className="ml-auto size-4" />
			</SidebarMenuButton>
		);
	},
);

UserMenuButton.displayName = "UserMenuButton";

export function NavUser() {
	const { data: session, isPending } = authClient.useSession();
	const { isMobile } = useSidebar();
	const router = useRouter();
	const { getLocalizedHref } = useLocalizedHref();
	const t = useTranslations("dashboard.navUser");

	if (isPending || !session?.user) {
		return <Skeleton className="h-10 w-full rounded-lg" />;
	}

	const { user } = session;

	const handleSignOut = () => {
		authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push(getLocalizedHref("/auth/sign-in"));
				},
			},
		});
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				{isMobile ? (
					<Drawer>
						<DrawerTrigger asChild>
							<UserMenuButton user={user} />
						</DrawerTrigger>
						<DrawerContent>
							<DrawerHeader>
								<DrawerTitle>{user?.name}</DrawerTitle>
								<DrawerDescription>{user?.email}</DrawerDescription>
							</DrawerHeader>
							<div className="flex flex-col gap-2">
								<Separator />
								<Button
									variant="ghost"
									className="justify-start"
									onClick={() => router.push("/upgrade")}
								>
									<Sparkles />
									{t("managePlan")}
								</Button>
								<Button
									variant="ghost"
									className="justify-start"
									onClick={() => authClient.customer.portal()}
								>
									<CreditCard />
									{t("billing")}
								</Button>
							</div>
							<DrawerFooter>
								<Button variant="outline" onClick={handleSignOut}>
									{t("logOut")}
								</Button>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>
				) : (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<UserMenuButton user={user} />
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
							side="right"
							align="end"
							sideOffset={4}
						>
							<DropdownMenuLabel className="p-0 font-normal">
								<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
									<UserAvatar user={user} />
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">{user?.name}</span>
										<span className="truncate text-xs">{user?.email}</span>
									</div>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem onClick={() => router.push("/upgrade")}>
									<Sparkles />
									{t("managePlan")}
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => authClient.customer.portal()}>
									<CreditCard />
									{t("billing")}
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleSignOut}>
								<LogOut />
								{t("logOut")}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
