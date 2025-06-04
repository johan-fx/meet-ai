import { auth } from "@/lib/auth";
import { HomeView } from "@/modules/home/ui/views/home-view";
import { PageProps } from "@/types/page";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/${locale}/auth/sign-in`);
  }

  return <HomeView />;
};

export default Page;
