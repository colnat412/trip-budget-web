import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import {
  defaultLocale,
  isAppLocale,
  localeCookieName,
} from "./config";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const storedLocale = cookieStore.get(localeCookieName)?.value;
  const locale = isAppLocale(storedLocale) ? storedLocale : defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
