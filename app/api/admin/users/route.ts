import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/admin-auth";
import {
  createAdminUser,
  deleteAdminUser,
  type AdminRole,
  updateAdminUser,
} from "@/lib/admin-users";

export async function POST(req: Request) {
  const session = await getAdminSession();

  if (!session || session.role !== "admin") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  const formData = await req.formData();
  const intent = String(formData.get("intent") || "");

  try {
    if (intent === "create") {
      await createAdminUser({
        username: String(formData.get("username") || "").trim(),
        password: String(formData.get("password") || ""),
        role: String(formData.get("role") || "editor") as AdminRole,
      });
    }

    if (intent === "update") {
      await updateAdminUser({
        id: String(formData.get("id") || ""),
        role: String(formData.get("role") || "editor") as AdminRole,
        password: String(formData.get("password") || ""),
        currentUserId: session.id,
      });
    }

    if (intent === "delete") {
      await deleteAdminUser(String(formData.get("id") || ""), session.id);
    }

    return NextResponse.redirect(new URL("/admin/settings?section=accounts&saved=1", req.url));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Không thể xử lý tài khoản.";
    return NextResponse.redirect(
      new URL(`/admin/settings?section=accounts&error=${encodeURIComponent(message)}`, req.url)
    );
  }
}

