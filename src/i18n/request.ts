import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import enMessages from "../../messages/en.json";
import viMessages from "../../messages/vi.json";

import {
  defaultLocale,
  isAppLocale,
  localeCookieName,
} from "./config";

const messagesByLocale = {
  vi: viMessages,
  en: enMessages,
} as const;

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const storedLocale = cookieStore.get(localeCookieName)?.value;
  const locale = isAppLocale(storedLocale) ? storedLocale : defaultLocale;

  return {
    locale,
    messages: messagesByLocale[locale],
  };
});
