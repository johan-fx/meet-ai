import { setRequestLocale } from "next-intl/server";
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";
import type { PageProps } from "@/types/page";

const Page = async ({ params }: PageProps) => {
	const { locale } = await params;

	// Enable static rendering
	setRequestLocale(locale);

	return <SignUpView />;
};

export default Page;
