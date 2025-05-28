// Import the English dictionary to infer the type structure
import enDictionary from "@/locales/en.json";

// Automatically infer the Dictionary type from the actual JSON structure
// This ensures the type is always in sync with the JSON file
export type Dictionary = typeof enDictionary;

// Helper type to get nested dictionary paths with dot notation
// This can be useful for creating type-safe dictionary key access
export type DictionaryKeys = {
  [K in keyof Dictionary]: Dictionary[K] extends Record<string, unknown>
    ? {
        [P in keyof Dictionary[K]]: Dictionary[K][P] extends Record<
          string,
          unknown
        >
          ? {
              [Q in keyof Dictionary[K][P]]: `${string & K}.${string &
                P}.${string & Q}`;
            }[keyof Dictionary[K][P]]
          : `${string & K}.${string & P}`;
      }[keyof Dictionary[K]]
    : K;
}[keyof Dictionary];

// Export the actual dictionary for runtime use
export { enDictionary };
