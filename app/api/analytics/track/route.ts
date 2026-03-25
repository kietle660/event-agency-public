import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { trackPageview } from "@/lib/analytics-store";

const VISITOR_COOKIE = "tt_visitor_id";

export async function POST() {
  const cookieStore = await cookies();
  let visitorId = cookieStore.get(VISITOR_COOKIE)?.value;

  if (!visitorId) {
    visitorId = crypto.randomUUID();
  }

  await trackPageview(visitorId);

  const response = NextResponse.json({ ok: true });

  if (!cookieStore.get(VISITOR_COOKIE)?.value) {
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}
