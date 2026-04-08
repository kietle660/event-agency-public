import { NextResponse } from "next/server";

import { logoutAdmin } from "@/lib/admin-auth";
import { createRequestUrl } from "@/lib/request-url";

export async function POST(req: Request) {
  await logoutAdmin();
  return NextResponse.redirect(createRequestUrl(req, "/admin/login"));
}
