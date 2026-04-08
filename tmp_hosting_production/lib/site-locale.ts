import { cookies } from "next/headers";

export type SiteLocale = "vi" | "en";

export const SITE_LOCALE_COOKIE = "site_locale";

export async function getCurrentLocale(): Promise<SiteLocale> {
  const store = await cookies();
  const value = store.get(SITE_LOCALE_COOKIE)?.value;
  return value === "en" ? "en" : "vi";
}

export function isEnglishLocale(locale: SiteLocale) {
  return locale === "en";
}
