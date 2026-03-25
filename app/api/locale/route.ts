import { NextResponse } from "next/server";

import { SITE_LOCALE_COOKIE } from "@/lib/site-locale";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const locale = url.searchParams.get("locale") === "en" ? "en" : "vi";
  const redirect = url.searchParams.get("redirect") || "/";

  const response = NextResponse.redirect(new URL(redirect, req.url));
  response.cookies.set(SITE_LOCALE_COOKIE, locale, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  return response;
}
