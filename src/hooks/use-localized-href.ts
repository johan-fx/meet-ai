import { useParams } from "next/navigation";

/**
 * Custom hook to generate localized hrefs
 * Automatically prepends the current locale to any path
 */
export const useLocalizedHref = () => {
  const params = useParams();
  const locale = params.locale as string;

  /**
   * Generate a localized href by prepending the current locale
   * @param path - The path to localize (e.g., "/auth/sign-in")
   * @returns The localized path (e.g., "/en/auth/sign-in")
   */
  const getLocalizedHref = (path: string): string => {
    // Remove leading slash if present to avoid double slashes
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `/${locale}/${cleanPath}`;
  };

  return { getLocalizedHref, locale };
};
