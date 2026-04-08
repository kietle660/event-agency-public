import { NextResponse } from "next/server";

import { loginAdmin } from "@/lib/admin-auth";

export async function POST(req: Request) {
  const formData = await req.formData();
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "");

  const ok = await loginAdmin(username, password);

  if (!ok) {
    return NextResponse.redirect(new URL("/admin/login?error=1", req.url));
  }

  return NextResponse.redirect(new URL("/admin", req.url));
}
