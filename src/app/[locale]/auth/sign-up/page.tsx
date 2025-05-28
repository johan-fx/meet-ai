import type { SupportedLocale } from "@/lib/dictionary";
import { getDictionary } from "@/lib/dictionary";
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as SupportedLocale);

  return <SignUpView dictionary={dictionary} />;
};

export default Page;
