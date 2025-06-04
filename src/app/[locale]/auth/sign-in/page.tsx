import { auth } from "@/lib/auth";
import { type SupportedLocale, getDictionary } from "@/lib/dictionary";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { PageProps } from "@/types/page";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect(`/${locale}`);
  }

  const dictionary = await getDictionary(locale as SupportedLocale);

  return <SignInView dictionary={dictionary} />;
};

export default Page;
