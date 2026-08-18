import { NextResponse } from "next/server";

import { isAppLocale, localeCookieName } from "@/i18n/config";

interface LocaleRequestBody {
  locale?: string;
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => ({}))) as LocaleRequestBody;

  if (!isAppLocale(body.locale)) {
    return NextResponse.json(
      { message: "Unsupported locale" },
      { status: 400 },
    );
  }

  const response = NextResponse.json({ locale: body.locale });
  response.cookies.set(localeCookieName, body.locale, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
