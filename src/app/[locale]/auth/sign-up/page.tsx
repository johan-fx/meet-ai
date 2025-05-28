import { auth } from "@/lib/auth";
import type { SupportedLocale } from "@/lib/dictionary";
import { getDictionary } from "@/lib/dictionary";
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect(`/${locale}`);
  }

  const dictionary = await getDictionary(locale as SupportedLocale);

  return <SignUpView dictionary={dictionary} />;
};

export default Page;
