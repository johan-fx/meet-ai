import { type SupportedLocale, getDictionary } from "@/lib/dictionary";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";

const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  const dictionary = await getDictionary(locale as SupportedLocale);

  return <SignInView dictionary={dictionary} />;
};

export default Page;
