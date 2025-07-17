import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { auth } from "@/lib/auth";

interface Props {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}

const ProtectedLayout = async ({ children, params }: Props) => {
	const { locale } = await params;

	// Enable static rendering for this locale
	setRequestLocale(locale);

	// Check authentication status using Better Auth
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	// Redirect to sign-in if user is not authenticated
	if (!session?.user) {
		redirect(`/${locale}/auth/sign-in`);
	}

	return (
		<main className="flex flex-col h-screen w-screen bg-muted">{children}</main>
	);
};

export default ProtectedLayout;
