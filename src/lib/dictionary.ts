import "server-only";

import type { Dictionary } from "@/types/dictionary";
import languine from "../../languine.json";

// Extract all supported locales from languine config
const locales: string[] = [languine.locale.source, ...languine.locale.targets];
export type SupportedLocale = (typeof locales)[number];

// Dynamically generate dictionaries object based on available locales
const dictionaries: Record<string, () => Promise<Dictionary>> = locales.reduce(
  (acc, locale) => {
    acc[locale] = () =>
      import(`../locales/${locale}.json`).then(
        (module) => module.default as Dictionary
      );
    return acc;
  },
  {} as Record<string, () => Promise<Dictionary>>
);

export const getDictionary = async (
  locale: SupportedLocale
): Promise<Dictionary> => {
  try {
    // Check if the locale exists in our dictionaries
    if (!(locale in dictionaries)) {
      throw new Error(`Unsupported locale: ${locale}`);
    }
    return await dictionaries[locale]();
  } catch (error) {
    console.error(`Failed to load dictionary for locale: ${locale}`, error);
    // Fallback to source locale (usually English) if the requested locale fails
    const sourceLocale = languine.locale.source;
    if (locale !== sourceLocale && sourceLocale in dictionaries) {
      return await dictionaries[sourceLocale]();
    }
    throw new Error(`Failed to load dictionary for locale: ${locale}`);
  }
};
