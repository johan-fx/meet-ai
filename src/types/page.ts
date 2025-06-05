import type { SearchParams } from "nuqs";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}

export type { PageProps };
