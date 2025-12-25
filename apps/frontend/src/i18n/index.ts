import { deDE, enUS } from "@clerk/localizations";
import { createI18n } from "vue-i18n";

const localeModules = import.meta.glob<{
  default: Record<string, unknown>;
}>("./locales/**/*.json", { eager: true });

export type SupportedLocale = "en" | "de";

/**
 * Map app locales to Clerk localizations
 */
const CLERK_LOCALES = {
  en: enUS,
  de: deDE,
} as const;

/**
 * Returns the Clerk localization object for the given locale
 */
export function getClerkLocalization(locale: SupportedLocale) {
  return CLERK_LOCALES[locale] || enUS;
}

const STORAGE_KEY = "user-locale";
const SUPPORTED_LOCALES: SupportedLocale[] = ["en", "de"];
const DEFAULT_LOCALE: SupportedLocale = "en";

/**
 * Processes glob imports and organizes them by locale and namespace
 */
function loadLocaleMessages() {
  const messages: Record<string, Record<string, Record<string, unknown>>> = {};

  for (const path in localeModules) {
    const matched = path.match(/\.\/locales\/([^/]+)\/(.+)\.json$/);
    if (matched) {
      const locale = matched[1];
      const namespace = matched[2];

      if (locale && namespace) {
        if (!messages[locale]) {
          messages[locale] = {};
        }

        const module = localeModules[path];
        if (module?.default) {
          messages[locale][namespace] = module.default;
        }
      }
    }
  }

  return messages;
}

/**
 * Detects the preferred locale from localStorage or browser settings
 */
export function getInitialLocale(): SupportedLocale {
  const savedLocale = localStorage.getItem(STORAGE_KEY);
  if (
    savedLocale
    && SUPPORTED_LOCALES.includes(savedLocale as SupportedLocale)
  ) {
    return savedLocale as SupportedLocale;
  }

  const browserLang = navigator.language.split("-")[0];
  if (SUPPORTED_LOCALES.includes(browserLang as SupportedLocale)) {
    return browserLang as SupportedLocale;
  }

  return DEFAULT_LOCALE;
}

/**
 * Saves locale preference to localStorage
 */
export function setLocale(locale: SupportedLocale): void {
  localStorage.setItem(STORAGE_KEY, locale);
}

/**
 * Returns the list of supported locales for UI display
 */
export function getSupportedLocales(): { code: SupportedLocale; name: string }[] {
  return [
    { code: "en", name: "English" },
    { code: "de", name: "Deutsch" },
  ];
}

export default createI18n<false>({
  locale: getInitialLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  legacy: false,
  messages: loadLocaleMessages(),
});
