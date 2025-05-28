import "server-only";

import type { Dictionary } from "@/types/dictionary";

export type SupportedLocale = "en" | "es";

const dictionaries = {
  en: () =>
    import("../locales/en.json").then((module) => module.default as Dictionary),
  es: () =>
    import("../locales/es.json").then((module) => module.default as Dictionary),
};

export const getDictionary = async (
  locale: SupportedLocale
): Promise<Dictionary> => dictionaries[locale]();
