import { setRequestLocale } from "next-intl/server";
import { HomeView } from "@/modules/home/ui/views/home-view";
import type { PageProps } from "@/types/page";

const Page = async ({ params }: PageProps) => {
	const { locale } = await params;

	// Enable static rendering
	setRequestLocale(locale);

	return <HomeView />;
};

export default Page;
