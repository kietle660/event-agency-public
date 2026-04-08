import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin-auth";
import { createManualCustomer } from "@/lib/customer-store";
import { createRequestUrl } from "@/lib/request-url";

export async function POST(req: Request) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.redirect(createRequestUrl(req, "/admin/login"));
  }

  const formData = await req.formData();

  await createManualCustomer({
    name: String(formData.get("name") || "").trim(),
    company: String(formData.get("company") || "").trim(),
    phone: String(formData.get("phone") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    note: String(formData.get("note") || "").trim(),
  });

  return NextResponse.redirect(createRequestUrl(req, "/admin/customers?created=1"));
}
