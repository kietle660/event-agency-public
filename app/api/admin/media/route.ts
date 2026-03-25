import { NextResponse } from "next/server";

import { deleteMedia, saveMedia } from "@/lib/admin-media";

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

    return NextResponse.redirect(new URL("/admin/media", req.url));
  }

  const file = formData.get("file");
  if (!(file instanceof File) || !file.size) {
    if (wantsJson) {
      return NextResponse.json({ error: "missing_file" }, { status: 400 });
    }

    return NextResponse.redirect(new URL("/admin/media?error=1", req.url));
  }

  const uploaded = await saveMedia(file);

  if (wantsJson) {
    return NextResponse.json(uploaded);
  }

  return NextResponse.redirect(new URL("/admin/media?uploaded=1", req.url));
}
