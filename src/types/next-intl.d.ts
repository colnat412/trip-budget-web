import type { locales } from "@/i18n/config";
import messages from "../../messages/vi.json";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof locales)[number];
    Messages: typeof messages;
  }
}
