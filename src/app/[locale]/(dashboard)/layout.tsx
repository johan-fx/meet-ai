import { SidebarProvider } from "@/components/ui/sidebar";
import type { SupportedLocale } from "@/lib/dictionary";
import { getDictionary } from "@/lib/dictionary";
import DashboardNavbar from "@/modules/dashboard/ui/components/dashboard-navbar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const Layout = async ({ children, params }: Props) => {
  const { locale } = await params;

  const dictionary = await getDictionary(locale as SupportedLocale);

  return (
    <SidebarProvider>
      <DashboardSidebar dictionary={dictionary} />
      <main className="flex flex-col h-screen w-screen bg-muted">
        <DashboardNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default Layout;
