import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin-auth";
import {
  type CustomerCrmStatus,
  upsertCustomerCrmStatus,
} from "@/lib/customer-crm-store";

const validStatuses: CustomerCrmStatus[] = [
  "moi",
  "dang_trao_doi",
  "da_gui_bao_gia",
  "chot",
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { status?: CustomerCrmStatus };
  const { id } = await params;

  if (!body.status || !validStatuses.includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const record = await upsertCustomerCrmStatus(id, body.status);
  return NextResponse.json({ ok: true, record });
}
