import { setRequestLocale } from "next-intl/server";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import type { PageProps } from "@/types/page";

const Page = async ({ params }: PageProps) => {
	const { locale } = await params;

	// Enable static rendering
	setRequestLocale(locale);

	return <SignInView />;
};

export default Page;
