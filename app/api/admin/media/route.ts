import { NextResponse } from "next/server";

import { deleteMedia, saveMedia } from "@/lib/admin-media";
import { createRequestUrl } from "@/lib/request-url";

export async function POST(req: Request) {
  const formData = await req.formData();
  const intent = String(formData.get("intent") || "upload");
  const wantsJson =
    new URL(req.url).searchParams.get("mode") === "json" ||
    req.headers.get("accept")?.includes("application/json");

  if (intent === "delete") {
    await deleteMedia(String(formData.get("fileName") || ""));
    if (wantsJson) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.redirect(createRequestUrl(req, "/admin/media"));
  }

  const file = formData.get("file");
  if (!(file instanceof File) || !file.size) {
    if (wantsJson) {
      return NextResponse.json({ error: "missing_file" }, { status: 400 });
    }

    return NextResponse.redirect(createRequestUrl(req, "/admin/media?error=1"));
  }

  const uploaded = await saveMedia(file);

  if (wantsJson) {
    return NextResponse.json(uploaded);
  }

  return NextResponse.redirect(createRequestUrl(req, "/admin/media?uploaded=1"));
}
